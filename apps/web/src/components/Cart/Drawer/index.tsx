import { useNavigate } from "@tanstack/react-router";
import { useOrderForm } from "@/sdk/contexts/orderform";
import { formatter } from "@/sdk/hooks/useMoney";
import { useOrderFormItem } from "@/sdk/hooks/useOrderFormItem";
import { cn } from "@/sdk/utils/cn";
import { ButtonImage } from "@/ui/Buttons/ButtonImage";
import { DialogDescription } from "@/ui/Dialog";
import {
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/ui/Drawer";

const TOTALIZERS_LABEL: Record<"ITEMS" | "DISCOUNT" | "TOTAL", string> = {
	ITEMS: "Subtotal",
	DISCOUNT: "Desconto",
	TOTAL: "Total",
};

export function CartDrawer() {
	const navigate = useNavigate();
	const { cart, orderForm } = useOrderForm();
	const { removeItem, removeLoading } = useOrderFormItem();

	const classChains = cn(
		"absolute top-0y h-full w-[7px] bg-[url('/assets/borders/chain.webp')] bg-repeat-y",
	);

	const items = orderForm?.items || [];

	return (
		<Drawer open={cart.open} onOpenChange={cart.setOpen} direction="right">
			<DrawerContent className="bg-tibia-400">
				<div className={`${classChains} -left-1`} />
				<DialogDescription className="hidden">Teste</DialogDescription>
				<div className="m-2 flex h-full flex-col">
					<DrawerHeader className="relative mb-1 border border-tertiary bg-tibia-500 p-2">
						<DrawerTitle className="font-bold font-verdana text-secondary">
							Meu Carrinho
						</DrawerTitle>
						<button
							className="absolute top-1 right-1 p-1"
							type="button"
							onClick={() => {
								cart.setOpen(false);
							}}
						>
							<img
								alt="close button"
								className="rotate-45"
								src="/assets/icons/global/circle-symbol-plus.gif"
							/>
						</button>
					</DrawerHeader>

					<div className="flex flex-1 flex-col gap-2 overflow-y-auto border border-tertiary bg-tibia-500 p-2">
						{items.map((item) => {
							return (
								<div
									className="relative flex flex-row gap-1 border border-tertiary bg-tibia-700/20 p-2"
									key={item.id}
								>
									<img
										src="/assets/coins/coins_4.png"
										className="w-20"
										alt="coins"
									/>
									<div className="flex flex-col">
										<span className="font-bold font-verdana text-secondary text-sm">
											{item.effectiveQuantity} {item.title}
										</span>
										<span className="font-verdana text-secondary text-sm">
											{formatter(item.totalPriceCents, {
												cents: true,
											})}
										</span>
									</div>
									<button
										type="button"
										className="absolute top-1 right-1 disabled:opacity-50"
										disabled={removeLoading}
										onClick={async () => {
											await removeItem({
												productId: item.id,
											});
										}}
									>
										<img
											src="/assets/icons/global/circle-symbol-minus.gif"
											alt="remove item from cart"
										/>
									</button>
								</div>
							);
						})}
					</div>
					<div className="mt-1 flex flex-col border border-tertiary bg-tibia-500 p-1">
						{orderForm?.totals.totalizers.map((total) => {
							return (
								<div key={total.id}>
									<span className="font-bold font-verdana text-secondary text-sm">
										{TOTALIZERS_LABEL[total.id]}:{" "}
									</span>
									<span className="font-verdana text-secondary text-sm">
										{formatter(total.valueCents, {
											cents: true,
										})}
									</span>
								</div>
							);
						})}
					</div>
					<DrawerFooter className="mt-1 flex flex-col border border-tertiary bg-tibia-500 p-1">
						<div className="flex flex-row flex-wrap justify-between gap-2">
							<ButtonImage
								variant="red"
								onClick={() => {
									cart.setOpen(false);
								}}
							>
								Fechar
							</ButtonImage>
							<ButtonImage
								variant="green"
								onClick={() => {
									navigate({
										to: "/shop",
										viewTransition: {
											types: ["fade"],
										},
									});
									cart.setOpen(false);
								}}
							>
								Comprar
							</ButtonImage>
						</div>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
