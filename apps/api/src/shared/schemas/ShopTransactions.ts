import { ShopTransactionStatus as ShopTransactionStatusEnum } from "generated/client";
import z from "zod";

export const ShopTransactionStatus = z.enum(ShopTransactionStatusEnum);

export const ShopTransaction = z.object({
	id: z.int(),
	status: ShopTransactionStatus,
	methodTransactionId: z.string().max(255).nullable(),
	units: z.number().int().nonnegative(),
	total: z.number().int().nonnegative(),
	providerId: z.int(),
	serviceId: z.int(),
	accountId: z.int(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
