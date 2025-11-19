import { ORPCError } from "@orpc/client";
import type { Logger } from "nodemailer/lib/shared";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type {
	Cookies,
	DetectionChanges,
	HasherCrypto,
	JwtCrypto,
	Metadata,
	PlayerNameDetection,
	RecoveryKey,
} from "@/domain/modules";
import type {
	AccountRepository,
	PlayersRepository,
	SessionRepository,
} from "@/domain/repositories";
import type { AccountRegistrationRepository } from "@/domain/repositories/account/registration";
import type { WorldsRepository } from "@/domain/repositories/worlds";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import type { EmailQueue } from "@/jobs/queue/email";
import { getAccountType, getAccountTypeId } from "@/shared/utils/account/type";
import { parseWeaponProficiencies } from "@/shared/utils/game/proficiencies";
import type { PaginationInput } from "@/shared/utils/paginate";
import { getVocationId, type Vocation } from "@/shared/utils/player";
import { type Gender, getPlayerGenderId } from "@/shared/utils/player/gender";
import { getSampleName } from "@/shared/utils/player/sample";
import type { SessionService } from "../session";

@injectable()
export class AccountsService {
	constructor(
		@inject(TOKENS.Logger) private readonly logger: Logger,
		@inject(TOKENS.Cookies) private readonly cookies: Cookies,
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
		@inject(TOKENS.SessionRepository)
		private readonly sessionRepository: SessionRepository,
		@inject(TOKENS.HasherCrypto)
		private readonly hasherCrypto: HasherCrypto,
		@inject(TOKENS.JwtCrypto) private readonly jwtCrypto: JwtCrypto,
		@inject(TOKENS.SessionService)
		private readonly sessionService: SessionService,
		@inject(TOKENS.Metadata) private readonly metadata: Metadata,
		@inject(TOKENS.PlayersRepository)
		private readonly playersRepository: PlayersRepository,
		@inject(TOKENS.AccountRegistrationRepository)
		private readonly accountRegistrationRepository: AccountRegistrationRepository,
		@inject(TOKENS.RecoveryKey) private readonly recoveryKey: RecoveryKey,
		@inject(TOKENS.EmailQueue) private readonly emailQueue: EmailQueue,
		@inject(TOKENS.DetectionChanges)
		private readonly detection: DetectionChanges,
		@inject(TOKENS.WorldsRepository)
		private readonly worldsRepository: WorldsRepository,
		@inject(TOKENS.PlayerNameDetection)
		private readonly playerNameDetection: PlayerNameDetection,
	) {}

	@Catch()
	async login({ email, password }: { email: string; password: string }) {
		/**
		 * TODO - Implement check for banned accounts to prevent login,
		 * returning an appropriate error message.
		 */
		const account = await this.accountRepository.findByEmail(email);

		if (!account) {
			this.logger.warn(`Login failed for email: ${email} - account not found.`);
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const isPasswordValid = this.hasherCrypto.compare(
			password,
			account.password,
		);

		if (!isPasswordValid) {
			this.logger.warn(`Login failed for email: ${email} - invalid password.`);
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid credentials",
			});
		}

		const token = this.jwtCrypto.generate(
			{
				email: account.email,
			},
			{
				expiresIn: "7d",
				subject: String(account.id),
			},
		);
		const expiredAt = new Date();
		expiredAt.setDate(expiredAt.getDate() + 7);

		/**
		 * TODO - If the request is made multiples times quickly,
		 * this can create a same token multiple times, breaking the unique constraint.
		 * We should implement a better strategy to avoid this.
		 */
		const tokenAlreadyExists = await this.sessionRepository.findByToken(token);

		if (!tokenAlreadyExists) {
			await this.sessionRepository.create({
				accountId: account.id,
				token,
				expiresAt: expiredAt,
			});
		}

		this.cookies.set(env.SESSION_TOKEN_NAME, token, {
			expires: expiredAt,
			namePrefix: true,
		});

		return {
			token: token,
		};
	}

	@Catch()
	async logout() {
		return this.sessionService.destroy();
	}

	@Catch()
	async details(email: string) {
		const account = await this.accountRepository.details(email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		/**
		 * TODO: Remove characters from this, to be in another route.
		 */
		return {
			...account,
			sessions: account.sessions,
			registration: account.registrations,
		};
	}

	@Catch()
	async hasPermission(permission?: Permission): Promise<boolean> {
		/**
		 * TODO: Maybe this error shouldn't be here, or the message should be different.
		 * Because this is a .service and can be used in other places than just route protection.
		 * For now, leaving as is.
		 */
		if (!permission) {
			throw new ORPCError("NOT_IMPLEMENTED", {
				message:
					"No permission defined for this route, this is likely a server misconfiguration. Please contact an administrator.",
			});
		}

		const session = this.metadata.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const accountType = account.type;
		const permissionType = getAccountTypeId(permission.type);

		if (accountType < permissionType) {
			const permissionTypeName = getAccountType(permissionType);
			const accountTypeName = getAccountType(accountType);

			throw new ORPCError("FORBIDDEN", {
				message: `You need to be at least a ${permissionTypeName} to access this resource. Your account type is ${accountTypeName}.`,
			});
		}

		return true;
	}

	@Catch()
	async characters(email: string) {
		const account = await this.accountRepository.findByEmail(email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const { characters, total } = await this.playersRepository.byAccountId(
			account.id,
		);

		const areOnline = await this.playersRepository.areOnline(
			characters.map((char) => char.id),
		);

		return {
			characters: characters.map((char) => {
				const isOnline = areOnline.includes(char.id);

				return {
					...char,
					online: isOnline,
				};
			}),
			total: total,
		};
	}

	@Catch()
	async createCharacter(
		email: string,
		{
			gender,
			name,
			vocation,
			worldId,
		}: {
			vocation: Vocation;
			name: string;
			gender: Gender;
			worldId: number;
		},
	) {
		/**
		 * TODO - Implement a logic to get actual config of miforge to
		 * set max limit of players per account.
		 */
		const MAX_PLAYERS_PER_ACCOUNT = 10; // Example limit, adjust as needed

		const account = await this.accountRepository.findByEmail(email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const nameValidation = await this.playerNameDetection.validate(name);

		if (!nameValidation.valid) {
			throw new ORPCError("UNPROCESSABLE_CONTENT", {
				message: `Invalid character name: ${nameValidation.reason}`,
			});
		}

		const validatedName = nameValidation.name;

		const nameIsTaken = await this.playersRepository.byName(validatedName);

		if (nameIsTaken) {
			throw new ORPCError("CONFLICT", {
				message: `Character name "${validatedName}" is already taken`,
			});
		}

		const totalCharacters = await this.playersRepository.totalByAccountId(
			account.id,
		);

		if (totalCharacters >= MAX_PLAYERS_PER_ACCOUNT) {
			throw new ORPCError("LIMIT_EXCEEDED", {
				message: "Maximum number of characters reached for this account",
			});
		}

		const world = await this.worldsRepository.findById(worldId);

		if (!world) {
			throw new ORPCError("NOT_FOUND", {
				message: "World not found",
			});
		}

		const vocationId = getVocationId(vocation);
		const sampleName = getSampleName(vocationId);

		const sampleCharacter = await this.playersRepository.byName(sampleName);

		if (!sampleCharacter) {
			throw new ORPCError("NOT_FOUND", {
				message: `Sample "${sampleName}" not found`,
			});
		}

		const sampleItems = await this.playersRepository.items(sampleCharacter.id);

		const {
			id: _,
			name: __,
			account_id: ___,
			ismain: ____,
			balance: _____,
			group_id: ______,
			sex: _______,
			...sampleCharacterData
		} = sampleCharacter;

		/**
		 * TODO - When multi-world is implemented, make sure to pass
		 * worldId to create character from sample.
		 */
		const newPlayer = await this.playersRepository.create(
			account.id,
			{
				...sampleCharacterData,
				ismain: totalCharacters === 0,
				name: validatedName,
				balance: BigInt(0),
				group_id: getAccountTypeId("PLAYER"),
				sex: getPlayerGenderId(gender),
			},
			sampleItems,
		);

		return {
			name: newPlayer.name,
			vocation: vocation,
			gender: gender,
		};
	}

	@Catch()
	async storeHistory({ pagination }: { pagination: PaginationInput }) {
		const session = this.metadata.session();

		return this.accountRepository.storeHistory(session.id, {
			pagination,
		});
	}

	@Catch()
	async upsertRegistration(
		email: string,
		input: {
			city: string;
			country: string;
			firstName: string;
			number: string;
			lastName: string;
			street: string;
			postal: string;
			state: string;
			additional: string | null;
		},
	) {
		const account = await this.accountRepository.findByEmail(email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const alreadyHasRegistration =
			await this.accountRegistrationRepository.findByAccountId(account.id);
		let recoveryKey: string | null = null;

		if (!alreadyHasRegistration) {
			recoveryKey = this.recoveryKey.generate();

			const alreadyExists =
				await this.accountRegistrationRepository.findByRecoveryKey(recoveryKey);

			if (alreadyExists) {
				// Extremely unlikely, but just in case, we generate a new one.
				recoveryKey = this.recoveryKey.generate();
			}

			/**
			 * TODO: Find a better way to handle subject and template naming conventions.
			 * Maybe whe can implement i18n here as well.
			 */
			this.emailQueue.add({
				kind: "EmailJob",
				to: account.email,
				props: {
					code: recoveryKey,
					user: account.name,
				},
				subject: "Your Account Recovery Key",
				template: "RecoveryKey",
			});
		}

		if (
			alreadyHasRegistration &&
			!this.detection.hasChanges(input, alreadyHasRegistration, {
				fields: [
					"city",
					"country",
					"firstName",
					"lastName",
					"number",
					"postal",
					"state",
					"street",
					"additional",
				],
			})
		) {
			throw new ORPCError("UNPROCESSABLE_CONTENT", {
				message: "No changes detected in registration data",
			});
		}

		const updatedRegistration =
			await this.accountRegistrationRepository.upsertByAccountId(account.id, {
				city: input.city,
				country: input.country,
				firstName: input.firstName,
				number: input.number,
				lastName: input.lastName,
				street: input.street,
				postal: input.postal,
				state: input.state,
				additional: input.additional,
				...(recoveryKey ? { recoveryKey: recoveryKey } : {}),
			});

		return {
			...updatedRegistration,
			recoveryKey,
		};
	}

	@Catch()
	async updateCharacterByName(
		name: string,
		data: {
			isHidden?: boolean;
			comment?: string;
		},
	) {
		const session = this.metadata.session();

		const character = await this.accountRepository.findCharacterByName(
			name,
			session.id,
		);

		// verify if player has deletion time in column deletion with is a unix timestamp
		const deletionTime = character?.deletion ?? BigInt(0);

		if (deletionTime > BigInt(0)) {
			throw new ORPCError("FORBIDDEN", {
				message: "Character is marked for deletion and cannot be edited",
			});
		}

		if (!character) {
			throw new ORPCError("NOT_FOUND", {
				message: "Character not found",
			});
		}

		const updatedCharacter = await this.playersRepository.editByName(name, {
			ishidden: data.isHidden,
			comment: data.comment,
		});

		const proficiencies = parseWeaponProficiencies(
			updatedCharacter.weapon_proficiencies,
		);

		return {
			...updatedCharacter,
			proficiencies: proficiencies,
		};
	}

	@Catch()
	async findCharacterByName(name: string) {
		const session = this.metadata.session();

		const character = await this.accountRepository.findCharacterByName(
			name,
			session.id,
		);

		if (!character) {
			throw new ORPCError("NOT_FOUND", {
				message: "Character not found",
			});
		}

		const proficiencies = parseWeaponProficiencies(
			character.weapon_proficiencies,
		);

		return {
			...character,
			proficiencies: proficiencies,
		};
	}
}
