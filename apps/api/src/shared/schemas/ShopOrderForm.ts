import z from "zod";
import { ShopOrderStatusEnum } from "./ShopOrder";
import { ShopOrderItem } from "./ShopOrderItem";
import { ShopPaymentOption } from "./ShopPaymentOption";
import { ShopProduct } from "./ShopProduct";

export const ShopOrderFormItem = z.object({
	id: z.uuid(),
	productId: z.uuid(),
	productSlug: z.string(),
	...ShopProduct.pick({
		title: true,
		description: true,
		category: true,
		maxUnits: true,
		minUnits: true,
		baseUnitQuantity: true,
	}).shape,
	...ShopOrderItem.pick({
		quantity: true,
		unitPriceCents: true,
		totalPriceCents: true,
		effectiveQuantity: true,
	}).shape,
});

export const ShopOrderFormAccount = z.object({
	email: z.email(),
});

export const ShopOrderFormPaymentOption = ShopPaymentOption;

export const ShopOrderFormPayment = z.object({
	providers: z.array(ShopOrderFormPaymentOption),
	selectedProvider: ShopOrderFormPaymentOption.nullable(),
});

export const ShopOrderFormTotalizer = z.object({
	id: z.enum(["ITEMS", "DISCOUNT", "TOTAL"]),
	label: z.string(),
	valueCents: z.number().int(),
});

export const ShopOrderFormTotals = z.object({
	totalizers: z.array(ShopOrderFormTotalizer),
});

export type ShopOrderFormTotalizer = z.infer<typeof ShopOrderFormTotalizer>;

export const ShopOrderForm = z.object({
	id: z.uuid(),
	status: ShopOrderStatusEnum,
	account: ShopOrderFormAccount,
	items: z.array(ShopOrderFormItem),
	payment: ShopOrderFormPayment,
	totals: ShopOrderFormTotals,
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type ShopOrderForm = z.infer<typeof ShopOrderForm>;
