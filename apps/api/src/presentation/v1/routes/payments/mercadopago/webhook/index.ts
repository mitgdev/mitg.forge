import crypto from "node:crypto";
import z from "zod";
import { TOKENS } from "@/infra/di/tokens";
import { env } from "@/infra/env";
import { publicProcedure } from "@/presentation/procedures/public";

export function validateMpSignatureFromRequest(
	xSignature: string | null,
	xRequestId: string | null,
	dataId: string | null,
): boolean {
	if (!xSignature || !xRequestId || !dataId) return false;
	if (!env.MERCADO_PAGO_WEBHOOK_SECRET) return false;

	const parts = xSignature.split(",");
	let ts: string | undefined;
	let hash: string | undefined;

	for (const part of parts) {
		const [rawKey, rawValue] = part.split("=");
		if (!rawKey || !rawValue) continue;

		const key = rawKey.trim();
		const value = rawValue.trim();

		if (key === "ts") ts = value;
		if (key === "v1") hash = value;
	}

	if (!ts || !hash) return false;

	const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

	const sha = crypto
		.createHmac("sha256", env.MERCADO_PAGO_WEBHOOK_SECRET)
		.update(manifest)
		.digest("hex");

	return crypto.timingSafeEqual(Buffer.from(sha), Buffer.from(hash));
}

const MPSchemaMerchantOrder = z.object({
	query: z.object({
		id: z.coerce.string(),
		topic: z.literal("merchant_order"),
	}),
	body: z.object({
		resource: z.url(),
		topic: z.literal("merchant_order"),
	}),
});

const MPSchemaOthers = z.object({
	query: z.object({
		"data.id": z.string(),
		type: z.enum([
			"payment",
			"stop_delivery_op_wh",
			"delivery_cancellation",
			"topic_claims_integration_wh",
			"topic_chargebacks_wh",
		]),
	}),
	body: z.object({
		action: z.string().optional(),
		api_version: z.string().optional(),
		application_id: z.string().optional(),
		id: z.coerce.string().optional(),
		live_mode: z.boolean().optional(),
		type: z.string().optional(),
		user_id: z.coerce.string().optional(),
		data: z
			.object({
				id: z.string().optional(),
			})
			.optional(),
	}),
});

const Schema = {
	input: z.union([MPSchemaMerchantOrder, MPSchemaOthers]),
	output: z.object({
		ok: z.boolean(),
	}),
};

export const mercadopagoWebhookRoute = publicProcedure
	.route({
		method: "POST",
		path: "/webhook",
		summary: "MercadoPago Webhook",
		inputStructure: "detailed",
		description:
			"Endpoint to receive notifications from MercadoPago about payment events.",
	})
	.input(Schema.input)
	.output(Schema.output)
	.handler(async ({ input, context }) => {
		const httpContext = context.di.resolve(TOKENS.HttpContext);
		console.log("input", input);

		const signatureHeader = httpContext.req.header("x-signature") as
			| string
			| null;

		const requestId = httpContext.req.header("x-request-id") as string | null;

		let paymentId: string | null = null;

		if ("data.id" in input.query) {
			paymentId = input.query["data.id"];
		} else if ("id" in input.query) {
			paymentId = input.query.id;
		}

		const isValid = validateMpSignatureFromRequest(
			signatureHeader,
			requestId,
			paymentId,
		);

		console.log("Received MercadoPago webhook:", isValid);

		return {
			ok: true,
		};
	});
