import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { ExecutionContext } from "@/domain/context";
import type { AuditAction, AuditRepository } from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import type { PaginationInput } from "@/shared/utils/paginate";

@injectable()
export class AuditService {
	constructor(
		@inject(TOKENS.ExecutionContext)
		private readonly executionContext: ExecutionContext,
		@inject(TOKENS.AuditRepository)
		private readonly auditRepository: AuditRepository,
	) {}

	@Catch()
	async createAudit(
		action: keyof typeof AuditAction,
		data?: {
			success?: boolean;
			metadata?: Record<string, unknown>;
			errorCode?: string;
			details?: string;
			accountId?: number;
		},
	) {
		const session = this.executionContext.sessionOrNull();
		const requestId = this.executionContext.requestId();
		const ip = this.executionContext.ip();
		const agent = this.executionContext.userAgent();
		const accountId = data?.accountId ?? session?.id ?? null;

		await this.auditRepository.createAudit(action, {
			...data,
			requestId: requestId ?? undefined,
			ip: ip ?? undefined,
			userAgent: agent ?? undefined,
			accountId: accountId ?? undefined,
		});
	}

	@Catch()
	auditHistoryBySession({ pagination }: { pagination: PaginationInput }) {
		const session = this.executionContext.session();

		return this.auditRepository.findAuditsByAccountId(session.id, pagination);
	}
}
