import { inject, injectable } from "tsyringe";
import type { Prisma } from "@/domain/clients";
import { TOKENS } from "@/infra/di/tokens";
import { safeStringify } from "@/shared/utils/json";
import type { PaginationInput } from "@/shared/utils/paginate";

@injectable()
export class AuditRepository {
	constructor(@inject(TOKENS.Prisma) private readonly database: Prisma) {}

	async findAuditsByAccountId(accountId: number, opts?: PaginationInput) {
		const page = opts?.page ?? 1;
		const size = opts?.size ?? 20;

		const [audits, total] = await Promise.all([
			this.database.miforge_account_audit.findMany({
				where: {
					accountId: accountId,
				},
				orderBy: {
					created_at: "desc",
				},
				skip: (page - 1) * size,
				take: size,
			}),
			this.database.miforge_account_audit.count({
				where: {
					accountId: accountId,
				},
			}),
		]);

		return {
			audits,
			total,
		};
	}

	async createAudit(
		action: keyof typeof AuditAction,
		data?: {
			success?: boolean;
			metadata?: Record<string, unknown>;
			errorCode?: string;
			details?: string;
			accountId?: number;
			userAgent?: string;
			ip?: string;
			requestId?: string;
		},
	): Promise<void> {
		await this.database.miforge_account_audit.create({
			data: {
				accountId: data?.accountId ?? null,
				action: action,
				ip: data?.ip,
				requestId: data?.requestId,
				userAgent: data?.userAgent,
				metadata: data?.metadata ? safeStringify(data.metadata) : undefined,
				success: data?.success,
				errorCode: data?.errorCode,
				details: data?.details,
			},
		});
	}
}

export const AuditAction = {
	UPDATED_CONFIG: "UPDATED_CONFIG",
	DELETED_CHARACTER: "DELETED_CHARACTER",
	UNDELETE_CHARACTER: "UNDELETE_CHARACTER",
	UPDATED_CHARACTER: "UPDATED_CHARACTER",
	CREATED_CHARACTER: "CREATED_CHARACTER",
	CREATED_ACCOUNT: "CREATED_ACCOUNT",
	CHANGED_PASSWORD_WITH_OLD: "CHANGED_PASSWORD_WITH_OLD",
	RESET_PASSWORD_WITH_TOKEN: "RESET_PASSWORD_WITH_TOKEN",
	CHANGED_EMAIL_WITH_PASSWORD: "CHANGED_EMAIL_WITH_PASSWORD",
	CHANGED_EMAIL_WITH_CONFIRMATION: "CHANGED_EMAIL_WITH_CONFIRMATION",
	LOST_RESET_PASSWORD_WITH_TOKEN: "LOST_RESET_PASSWORD_WITH_TOKEN",
	CHANGED_PASSWORD_WITH_RECOVERY_KEY: "CHANGED_PASSWORD_WITH_RECOVERY_KEY",
	ENABLED_TWO_FACTOR: "ENABLED_TWO_FACTOR",
	DISABLED_TWO_FACTOR: "DISABLED_TWO_FACTOR",
} as const;
