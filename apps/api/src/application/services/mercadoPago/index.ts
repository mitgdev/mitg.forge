import { ORPCError } from "@orpc/client";
import {
	ShopProvider,
	ShopProviderMethod,
	ShopTransactionStatus,
} from "generated/client";
import { inject, injectable } from "tsyringe";
import { Catch } from "@/application/decorators/Catch";
import type { MercadoPagoClient } from "@/domain/clients";
import type { ExecutionContext } from "@/domain/context";
import type {
	AccountRepository,
	ShopProvidersRepository,
	ShopServicesRepository,
	ShopTransactionsRepository,
} from "@/domain/repositories";
import { TOKENS } from "@/infra/di/tokens";
import type { ShopOrder } from "@/shared/schemas/ShopOrder";
import { centsToFloat } from "@/shared/utils/money";

@injectable()
export class MercadoPagoService {
	constructor(
		@inject(TOKENS.ShopServicesRepository)
		private readonly shopServicesRepository: ShopServicesRepository,
		@inject(TOKENS.ShopTransactionsRepository)
		private readonly shopTransactionsRepository: ShopTransactionsRepository,
		@inject(TOKENS.ExecutionContext)
		private readonly executionContext: ExecutionContext,
		@inject(TOKENS.AccountRepository)
		private readonly accountRepository: AccountRepository,
		@inject(TOKENS.MercadoPagoClient)
		private readonly mercadoPagoClient: MercadoPagoClient,
		@inject(TOKENS.ShopProvidersRepository)
		private readonly shopProvidersRepository: ShopProvidersRepository,
	) {}

	@Catch()
	async createPixPayment(
		serviceId: number,
		providerMethod: ShopProviderMethod,
	): Promise<ShopOrder> {
		const session = this.executionContext.session();

		const account = await this.accountRepository.findByEmail(session.email);

		if (!account) {
			throw new ORPCError("NOT_FOUND", {
				message: `Account with email '${session.email}' not found.`,
			});
		}

		const provider = await this.shopProvidersRepository.findByMethodAndProvider(
			providerMethod,
			"MERCADO_PAGO",
		);

		if (!provider || !provider.isActive) {
			throw new ORPCError("NOT_FOUND", {
				message: `Shop provider with method '${providerMethod}' not found. For provider 'MERCADO_PAGO'.`,
			});
		}

		const service = await this.shopServicesRepository.findById(serviceId);

		if (!service || !service.is_active) {
			throw new ORPCError("NOT_FOUND", {
				message: `Shop service with id '${serviceId}' not found.`,
			});
		}

		const totalCents = service.unit_price * service.quantity;
		const totalAmount = (totalCents / 100).toFixed(2);

		const transaction = await this.shopTransactionsRepository.createTransaction(
			{
				accountId: account.id,
				providerId: provider.id,
				serviceId: service.id,
				total: totalCents,
				units: 1,
			},
		);

		const pix = await this.mercadoPagoClient.createPayment({
			x_idempotency_key: `${transaction.id}`,
			external_reference: `${transaction.id}`,
			payment_method_id: "pix",
			installments: 1,
			payer: {
				email: account.email,
			},
			transaction_amount: Number(totalAmount),
			description: `Purchase of ${service.slug} in MiForge Store`,
		});

		if (
			!pix.point_of_interaction.transaction_data.qr_code ||
			!pix.point_of_interaction.transaction_data.qr_code_base64
		) {
			throw new ORPCError("PAYMENT_CREATION_FAILED", {
				message: `Failed to create PIX payment for transaction '${transaction.id}'.`,
			});
		}

		await this.shopTransactionsRepository.attachMethodTransactionId(
			transaction.id,
			pix.id.toString(),
		);

		return {
			id: transaction.id,
			price: centsToFloat(transaction.total),
			status: ShopTransactionStatus.PENDING,
			method: ShopProviderMethod.PIX,
			provider: ShopProvider.MERCADO_PAGO,
			interaction: {
				transaction: {
					qr_code: pix.point_of_interaction.transaction_data.qr_code,
					qr_code_base64:
						pix.point_of_interaction.transaction_data.qr_code_base64,
				},
			},
		};
	}
}
