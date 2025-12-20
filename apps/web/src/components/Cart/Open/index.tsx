import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useOrderForm } from "@/sdk/contexts/orderform";
import { cn } from "@/sdk/utils/cn";
import { Tooltip } from "@/ui/Tooltip";

export function CartOpen() {
	const { cart } = useOrderForm();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	return createPortal(
		<div
			className={cn(
				"fixed right-4 bottom-4 z-9999 transition-all duration-300 ease-in-out md:right-10 md:bottom-10",
				{
					hidden: cart.open,
				},
			)}
		>
			<Tooltip content="Open Cart">
				<button
					type="button"
					onClick={() => cart.setOpen(true)}
					className="relative flex max-w-max items-center justify-center rounded-full transition-colors duration-200 ease-in-out hover:bg-tibia-500/70"
				>
					<img
						src="/assets/cart/purchasecomplete_idle.png"
						alt="cart-open"
						className="pointer-events-none h-12 w-12 animate-bounce select-none"
					/>
				</button>
			</Tooltip>
		</div>,
		document.body,
	);
}
