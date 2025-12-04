import { ORPCError } from "@orpc/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { ExecutionContext } from "@/domain/context";
import type {
	DetectionChanges,
	EmailLinks,
	HasherCrypto,
	PlayerNameDetection,
} from "@/domain/modules";
import type {
	AccountConfirmationsRepository,
	AccountRegistrationRepository,
	AccountRepository,
	ConfigRepository,
	PlayersRepository,
	SessionRepository,
} from "@/domain/repositories";
import type { WorldsRepository } from "@/domain/repositories/worlds";
import { TOKENS } from "@/infra/di/tokens";
import type { EmailQueue } from "@/jobs/queue/email";
import { getAccountType, getAccountTypeId } from "@/shared/utils/account/type";
import { parseWeaponProficiencies } from "@/shared/utils/game/proficiencies";
import type { PaginationInput } from "@/shared/utils/paginate";
import { getVocationId, type Vocation } from "@/shared/utils/player";
import { type Gender, getPlayerGenderId } from "@/shared/utils/player/gender";
import { getSampleName } from "@/shared/utils/player/sample";
import type { AccountConfirmationsService } from "../accountConfirmations";
import type { AuditService } from "../audit";
import type { RecoveryKeyService } from "../recoveryKey";

@injectable()
export class AccountsService {
	constructor(
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
		@inject(TOKENS.SessionRepository)
		private readonly sessionRepository: SessionRepository,
		@inject(TOKENS.HasherCrypto)
		private readonly hasherCrypto: HasherCrypto,
		@inject(TOKENS.RecoveryKeyService)
		private readonly recoveryKeyService: RecoveryKeyService,
		@inject(TOKENS.ExecutionContext)
		private readonly executionContext: ExecutionContext,
		@inject(TOKENS.PlayersRepository)
		private readonly playersRepository: PlayersRepository,
		@inject(TOKENS.AccountRegistrationRepository)
		private readonly accountRegistrationRepository: AccountRegistrationRepository,
		@inject(TOKENS.EmailQueue) private readonly emailQueue: EmailQueue,
		@inject(TOKENS.DetectionChanges)
		private readonly detection: DetectionChanges,
		@inject(TOKENS.WorldsRepository)
		private readonly worldsRepository: WorldsRepository,
		@inject(TOKENS.PlayerNameDetection)
		private readonly playerNameDetection: PlayerNameDetection,
		@inject(TOKENS.ConfigRepository)
		private readonly configRepository: ConfigRepository,
		@inject(TOKENS.AccountConfirmationsRepository)
		private readonly accountConfirmationsRepository: AccountConfirmationsRepository,
		@inject(TOKENS.AccountConfirmationsService)
		private readonly accountConfirmationsService: AccountConfirmationsService,
		@inject(TOKENS.AuditService)
		private readonly auditService: AuditService,
		@inject(TOKENS.EmailLinks) private readonly emailLinks: EmailLinks,
	) {}

	@Catch()
	async verifyEmail(email: string, token: string) {
		/**
		 * TODO - When change email occurs, we need to send a confirmation email.
		 * But the actual template and subject need to be defined depending on the context.
		 * If it's a new account, we send a welcome email.
		 * If it's an email change, we send a email changed confirmation.
		 */
		const account = await this.accountRepository.findByEmail(email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const confirmation =
			await this.accountConfirmationsRepository.findByAccountAndType(
				account.id,
				"EMAIL_VERIFICATION",
			);

		await this.accountConfirmationsService.verifyConfirmation(
			confirmation,
			token,
		);

		await this.accountRepository.confirmEmail(email);

		this.emailQueue.add({
			kind: "EmailJob",
			to: account.email,
			props: {
				email: account.email,
			},
			subject: "Welcome to Miforge!",
			template: "AccountCreated",
		});
	}

	@Catch()
	async create(data: { name?: string; password: string; email: string }) {
		const config = await this.configRepository.findConfig();
		const existingAccount = await this.accountRepository.findByEmail(
			data.email,
		);

		if (existingAccount) {
			throw new ORPCError("CONFLICT", {
				message: "An account with this email already exists",
			});
		}

		const hashedPassword = this.hasherCrypto.hash(data.password);

		const newAccount = await this.accountRepository.create({
			name: data.name,
			password: hashedPassword,
			email: data.email,
		});

		this.auditService.createAudit("CREATED_ACCOUNT", {
			details: `Account created for email: ${data.email}`,
			accountId: newAccount.id,
		});

		/**
		 * When email confirmation is not required, we can return the new account directly.
		 * And the frontend can redirect the user to login or call route /login directly.
		 * If email confirmation is required, we need to send a confirmation email
		 * and wait for the user to confirm the email before allowing login.
		 */
		if (!config.account.emailConfirmationRequired) {
			this.emailQueue.add({
				kind: "EmailJob",
				to: newAccount.email,
				props: {
					email: newAccount.email,
				},
				subject: "Welcome to Miforge!",
				template: "AccountCreated",
			});

			return newAccount;
		}

		const { expiresAt, token, tokenHash } =
			await this.accountConfirmationsService.generateTokenAndHash(24 * 60);

		await this.accountConfirmationsRepository.create(newAccount.id, {
			channel: "CODE",
			expiresAt,
			tokenHash: tokenHash,
			type: "EMAIL_VERIFICATION",
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountConfirmationEmail",
			props: {
				token: token,
			},
			subject: "Confirm your email address",
			to: newAccount.email,
		});

		return newAccount;
	}

	@Catch()
	async details(email: string) {
		const account = await this.accountRepository.details(email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

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

		const session = this.executionContext.session();

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

		this.auditService.createAudit("CREATED_CHARACTER", {
			details: `Character ${newPlayer.name} created for account`,
		});

		return {
			name: newPlayer.name,
			vocation: vocation,
			gender: gender,
		};
	}

	@Catch()
	async storeHistory({ pagination }: { pagination: PaginationInput }) {
		const session = this.executionContext.session();

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
		let recoveryKeyHashed: string | null = null;

		if (!alreadyHasRegistration) {
			const { hashedRecoveryKey, rawRecoveryKey } =
				await this.recoveryKeyService.generate();

			recoveryKey = rawRecoveryKey;
			recoveryKeyHashed = hashedRecoveryKey;

			this.emailQueue.add({
				kind: "EmailJob",
				to: account.email,
				props: {
					code: rawRecoveryKey,
					user: account.name ?? "User",
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
				...(recoveryKeyHashed ? { recoveryKey: recoveryKeyHashed } : {}),
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
		const session = this.executionContext.session();

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

		this.auditService.createAudit("UPDATED_CHARACTER", {
			metadata: { name, data },
			details: `Character ${name} updated`,
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
		const session = this.executionContext.session();

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

	@Catch()
	async cancelCharacterDeletionByName(name: string) {
		const session = this.executionContext.session();

		const character = await this.accountRepository.findCharacterByName(
			name,
			session.id,
		);

		if (!character) {
			throw new ORPCError("NOT_FOUND", {
				message: "Character not found",
			});
		}

		/**
		 * Don't send deleteAt in this case to set deletion to 0 (no deletion)
		 * and cancel any scheduled deletion.
		 */
		await this.playersRepository.scheduleToDeleteByName(character.name);
	}

	@Catch()
	async scheduleCharacterDeletionByName(name: string, password: string) {
		const session = this.executionContext.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const isPasswordValid = this.hasherCrypto.compare(
			password,
			account.password,
		);

		if (!isPasswordValid) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid credentials",
			});
		}

		const character = await this.accountRepository.findCharacterByName(
			name,
			session.id,
		);

		if (!character) {
			throw new ORPCError("NOT_FOUND", {
				message: "Character not found",
			});
		}

		const alreadyScheduled = character.deletion > BigInt(0);

		if (alreadyScheduled) {
			throw new ORPCError("FORBIDDEN", {
				message: "Character deletion is already scheduled",
			});
		}

		const deletionDate = new Date();
		/**
		 * TODO: Make the deletion period configurable. In database with miforge_config
		 * or miforge_settings
		 */
		deletionDate.setDate(deletionDate.getDate() + 30);

		await this.playersRepository.scheduleToDeleteByName(
			character.name,
			deletionDate,
		);

		this.auditService.createAudit(
			deletionDate ? "DELETED_CHARACTER" : "UNDELETE_CHARACTER",
			{
				metadata: { name, deleteAt: deletionDate?.toISOString() || null },
				details: `Character ${name} scheduled for deletion at ${
					deletionDate ? deletionDate.toISOString() : "null"
				}`,
			},
		);

		return {
			scheduleDate: deletionDate,
		};
	}

	@Catch()
	async changePasswordWithOld({
		oldPassword,
		newPassword,
	}: {
		oldPassword: string;
		newPassword: string;
	}) {
		const config = await this.configRepository.findConfig();

		if (config.account.passwordResetConfirmationRequired) {
			throw new ORPCError("FORBIDDEN", {
				message:
					"Changing password with old password is disabled when password reset confirmation is required. Please use the password reset flow.",
			});
		}

		const session = this.executionContext.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const isOldPasswordValid = this.hasherCrypto.compare(
			oldPassword,
			account.password,
		);

		if (!isOldPasswordValid) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid credentials",
			});
		}

		const hashedNewPassword = this.hasherCrypto.hash(newPassword);

		await this.accountRepository.updatePassword(account.id, hashedNewPassword);

		await this.auditService.createAudit("CHANGED_PASSWORD_WITH_OLD", {
			details: "Password changed using old password for account",
			success: true,
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountChangePasswordWithOld",
			props: {},
			subject: "Your password has been changed",
			to: account.email,
		});
	}

	@Catch()
	async generatePasswordReset() {
		const config = await this.configRepository.findConfig();

		if (!config.account.passwordResetConfirmationRequired) {
			throw new ORPCError("FORBIDDEN", {
				message:
					"Password reset confirmation is disabled. Please use the change password with old password flow.",
			});
		}

		const session = this.executionContext.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const { expiresAt, token, tokenHash } =
			await this.accountConfirmationsService.generateTokenAndHash(24 * 60);

		/**
		 * This check already considers unexpired confirmations only.
		 */
		const alreadyHasResetActive =
			await this.accountConfirmationsRepository.findByAccountAndType(
				account.id,
				"PASSWORD_RESET",
			);

		if (alreadyHasResetActive) {
			throw new ORPCError("CONFLICT", {
				message:
					"A password reset is already active for this account. Please check your email or wait until it expires.",
			});
		}

		await this.accountConfirmationsRepository.create(account.id, {
			channel: "CODE",
			expiresAt,
			tokenHash: tokenHash,
			type: "PASSWORD_RESET",
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountChangePasswordCode",
			props: {
				token: token,
			},
			subject: "Password Reset Request",
			to: account.email,
		});
	}

	@Catch()
	async changePasswordWithToken({
		newPassword,
		token,
	}: {
		token: string;
		newPassword: string;
	}) {
		const config = await this.configRepository.findConfig();

		if (!config.account.passwordResetConfirmationRequired) {
			throw new ORPCError("FORBIDDEN", {
				message:
					"Password reset confirmation is disabled. Please use the change password with old password flow.",
			});
		}

		const session = this.executionContext.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const oldPassword = account.password;

		const isNewPasswordSameAsOld = this.hasherCrypto.compare(
			newPassword,
			oldPassword,
		);

		if (isNewPasswordSameAsOld) {
			throw new ORPCError("UNPROCESSABLE_CONTENT", {
				message: "New password must be different from old password",
			});
		}

		const confirmation =
			await this.accountConfirmationsRepository.findByAccountAndType(
				account.id,
				"PASSWORD_RESET",
			);

		await this.accountConfirmationsService.verifyConfirmation(
			confirmation,
			token,
		);

		const hashedNewPassword = this.hasherCrypto.hash(newPassword);

		await this.accountRepository.updatePassword(account.id, hashedNewPassword);

		await this.auditService.createAudit("RESET_PASSWORD_WITH_TOKEN", {
			details: "Password reset using confirmation token for account",
			success: true,
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountPasswordChanged",
			props: {},
			subject: "Your password has been changed",
			to: account.email,
		});
	}

	@Catch()
	async changeEmailWithPassword({
		newEmail,
		password,
	}: {
		newEmail: string;
		password: string;
	}) {
		const config = await this.configRepository.findConfig();

		if (config.account.emailChangeConfirmationRequired) {
			throw new ORPCError("FORBIDDEN", {
				message:
					"Changing email with password is disabled when email change confirmation is required. Please use the email change confirmation flow.",
			});
		}

		const session = this.executionContext.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		if (account.email === newEmail) {
			throw new ORPCError("UNPROCESSABLE_CONTENT", {
				message: "The new email address must be different from the current one",
			});
		}

		const oldEmail = account.email;

		const isPasswordValid = this.hasherCrypto.compare(
			password,
			account.password,
		);

		if (!isPasswordValid) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid credentials",
			});
		}

		const newEmailInUse = await this.accountRepository.findByEmail(newEmail);

		if (newEmailInUse) {
			throw new ORPCError("CONFLICT", {
				message: "The new email is already in use by another account",
			});
		}

		const characters =
			await this.playersRepository.allCharactersWithOnlineStatus(account.id);

		const anyCharacterOnline = characters.some((char) => char.online);

		if (anyCharacterOnline) {
			throw new ORPCError("FORBIDDEN", {
				message:
					"Cannot change email while one or more characters are online. Please log out all characters and try again.",
			});
		}

		await this.accountRepository.updateEmail(account.id, newEmail);

		await this.auditService.createAudit("CHANGED_EMAIL_WITH_PASSWORD", {
			details: `Email changed from ${oldEmail} to ${newEmail} using password`,
			success: true,
		});

		await this.sessionRepository.clearAllSessionByAccountId(account.id);

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountChangedEmail",
			props: {
				newEmail: newEmail,
			},
			subject: "Your email address has been changed",
			to: oldEmail,
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountNewEmail",
			props: {},
			subject: "New email address added to your account",
			to: newEmail,
		});
	}

	@Catch()
	async generateEmailChange(newEmail: string) {
		const config = await this.configRepository.findConfig();

		if (!config.account.emailChangeConfirmationRequired) {
			throw new ORPCError("FORBIDDEN", {
				message:
					"Email change confirmation is disabled. Please use the change email with password flow.",
			});
		}

		const session = this.executionContext.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		if (account.email === newEmail) {
			throw new ORPCError("UNPROCESSABLE_CONTENT", {
				message: "The new email address must be different from the current one",
			});
		}

		const newEmailInUse = await this.accountRepository.findByEmail(newEmail);

		if (newEmailInUse) {
			throw new ORPCError("CONFLICT", {
				message: "The new email is already in use by another account",
			});
		}

		const alreadyHasChangeActive =
			await this.accountConfirmationsRepository.findByAccountAndType(
				account.id,
				"EMAIL_CHANGE",
			);

		if (alreadyHasChangeActive) {
			throw new ORPCError("CONFLICT", {
				message:
					"An email change is already active for this account. Please check your email or wait until it expires.",
			});
		}

		const { expiresAt, token, tokenHash } =
			await this.accountConfirmationsService.generateTokenAndHash(24 * 60);

		await this.accountConfirmationsRepository.create(account.id, {
			channel: "LINK",
			expiresAt,
			tokenHash: tokenHash,
			value: newEmail,
			type: "EMAIL_CHANGE",
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountConfirmationNewEmail",
			props: {
				link: this.emailLinks.links.accountEmailChangePreview(token),
			},
			subject: "Confirm your new email address",
			to: account.email,
		});
	}

	@Catch()
	async previewEmailChange(token: string) {
		const session = this.executionContext.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const confirmation =
			await this.accountConfirmationsService.isValidByAccountAndType({
				accountId: account.id,
				rawToken: token,
				type: "EMAIL_CHANGE",
			});

		if (!confirmation) {
			throw new ORPCError("NOT_FOUND", {
				message: "Email change confirmation not found, or expired",
			});
		}

		if (!confirmation.value) {
			throw new ORPCError("UNPROCESSABLE_CONTENT", {
				message: "No new email associated with this confirmation",
			});
		}

		return {
			newEmail: confirmation.value,
			expiresAt: confirmation.expires_at,
		};
	}

	@Catch()
	async confirmEmailChange(rawToken: string) {
		const session = this.executionContext.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: "Account not found",
			});
		}

		const confirmation =
			await this.accountConfirmationsRepository.findByAccountAndType(
				account.id,
				"EMAIL_CHANGE",
			);

		if (!confirmation) {
			throw new ORPCError("NOT_FOUND", {
				message: "Email change confirmation not found, or expired",
			});
		}

		if (!confirmation.value) {
			throw new ORPCError("UNPROCESSABLE_CONTENT", {
				message: "No new email associated with this confirmation",
			});
		}

		await this.accountConfirmationsService.verifyConfirmation(
			confirmation,
			rawToken,
		);

		const newEmail = confirmation.value;
		const oldEmail = account.email;

		const emailInUse = await this.accountRepository.findByEmail(newEmail);

		if (emailInUse) {
			throw new ORPCError("CONFLICT", {
				message: "The new email is already in use by another account",
			});
		}

		const characters =
			await this.playersRepository.allCharactersWithOnlineStatus(account.id);

		const anyCharacterOnline = characters.some((char) => char.online);

		if (anyCharacterOnline) {
			throw new ORPCError("FORBIDDEN", {
				message:
					"Cannot change email while one or more characters are online. Please log out all characters and try again.",
			});
		}

		await this.accountRepository.updateEmail(account.id, newEmail);

		await this.auditService.createAudit("CHANGED_EMAIL_WITH_CONFIRMATION", {
			details: `Email changed from ${oldEmail} to ${newEmail} using confirmation link`,
			success: true,
		});

		await this.sessionRepository.clearAllSessionByAccountId(account.id);
		await this.accountRepository.resetConfirmEmail(newEmail);

		const { expiresAt, token, tokenHash } =
			await this.accountConfirmationsService.generateTokenAndHash(24 * 60);

		await this.accountConfirmationsRepository.create(account.id, {
			channel: "CODE",
			expiresAt,
			tokenHash: tokenHash,
			type: "EMAIL_VERIFICATION",
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountConfirmationEmail",
			props: {
				token: token,
			},
			subject: "Confirm your email address",
			to: newEmail,
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountChangedEmail",
			props: {
				newEmail: newEmail,
			},
			subject: "Your email address has been changed",
			to: oldEmail,
		});

		this.emailQueue.add({
			kind: "EmailJob",
			template: "AccountNewEmail",
			props: {},
			subject: "New email address added to your account",
			to: newEmail,
		});

		return {
			newEmail: newEmail,
		};
	}
}
