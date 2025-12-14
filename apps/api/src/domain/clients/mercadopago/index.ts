import { inject, injectable } from "tsyringe";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import type { HttpClient } from "../http";
import type {
	MPCreatePaymentResponse,
	MPCreatePixPayment,
	MPCreatePreferenceInput,
	MPGetPaymentResponse,
} from "./types";

@injectable()
export class MercadoPagoClient {
	constructor(
		@inject(TOKENS.MercadoPagoHttpClient)
		private readonly httpClient: HttpClient,
	) {}

	async createPreference(input: MPCreatePreferenceInput) {
		const response = await this.httpClient.post("/checkout/preferences", input);

		return response.data;
	}

	async getPaymentById(id: number) {
		const response = await this.httpClient.get<MPGetPaymentResponse>(
			`/v1/payments/${id}`,
		);

		return response.data;
	}

	async createPayment(
		input: Omit<MPCreatePixPayment, "notification_url">,
	): Promise<MPCreatePaymentResponse> {
		const { x_idempotency_key, ...rest } = input;

		const inputWithNotification = {
			...rest,
			notification_url: env.MERCADO_PAGO_WEBHOOK_URL,
		};

		const response = await this.httpClient.post<MPCreatePaymentResponse>(
			"/v1/payments",
			inputWithNotification,
			{
				headers: {
					"X-Idempotency-Key": x_idempotency_key,
				},
			},
		);

		return response.data;
	}
}
