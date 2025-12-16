import { ShopOrderStatus } from "generated/client";
import z from "zod";

export const ShopOrderStatusEnum = z.enum(ShopOrderStatus);

export const ShopOrder = z.object({
	id: z.uuid(),
	accountId: z.number(),
	paymentOptionId: z.string().nullable(),
	status: ShopOrderStatusEnum,
	createdAt: z.date(),
	updatedAt: z.date(),
});
