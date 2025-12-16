import z from "zod";

export const ShopOrderItem = z.object({
	id: z.uuid(),
	quantity: z.number(),
	unitPriceCents: z.number(),
	totalPriceCents: z.number(),
	effectiveQuantity: z.number(),
	orderId: z.uuid(),
	productId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
