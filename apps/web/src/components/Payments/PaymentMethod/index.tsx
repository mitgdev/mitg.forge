import { cn } from "@/sdk/utils/cn";

type MethodMetaKey = "mercado-pago" | "pag-seguro" | "pix";

const METHOD_META: Record<MethodMetaKey, { icon: string; className?: string }> =
	{
		"mercado-pago": {
			icon: "/assets/payments/methods/mercado-pago.png",
		},
		pix: {
			icon: "/assets/payments/methods/pix.webp",
			className: " mx-auto rounded-md w-[80px]",
		},
		"pag-seguro": {
			icon: "/assets/payments/methods/pag-seguro.png",
		},
	};

type PaymentMethodItemProps = {
	selected: boolean;
	onClick: () => void;
	title: string;
	speed?: "instant" | "medium" | "slow";
	method: MethodMetaKey;
};

export const PaymentMethodItem = ({
	onClick,
	selected,
	title,
	speed = "instant",
	method,
}: PaymentMethodItemProps) => {
	const methodMeta = METHOD_META[method];

	return (
		<button
			type="button"
			className="group relative flex h-[147px] w-[150px] cursor-pointer"
			style={{
				backgroundImage:
					'url("/assets/payments/methods/payment_icon_normal.webp")',
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
			onClick={onClick}
			aria-pressed={selected}
		>
			<img
				className={cn("", {
					"pointer-events-none absolute inset-0 h-[147px] w-[150px] opacity-100 transition-opacity duration-200 ease-out":
						selected,
					"pointer-events-none absolute inset-0 h-[147px] w-[150px] opacity-0 transition-opacity duration-200 ease-out":
						!selected,
				})}
				src="/assets/payments/methods/payment_icon_selected.webp"
				alt="Selected Payment Method"
			/>

			<img
				className="pointer-events-none absolute inset-0 h-[147px] w-[150px] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
				src="/assets/payments/methods/payment_icon_hover.webp"
				alt="Payment Method Hover"
			/>

			<div className="absolute top-[9px] z-10 h-[50px] w-full">
				{/* <div
					className={cn(
						"absolute top-0 left-0 h-[50px] w-full scale-90 bg-center bg-contain bg-no-repeat transition-transform duration-200 ease-out group-hover:scale-100",
						methodMeta.className,
					)}
					style={{
						backgroundImage: `url('${methodMeta.icon}')`,
					}}
				/> */}
				<img
					src={methodMeta.icon}
					alt={`${title} Icon`}
					className={cn("h-[50px] w-full object-contain", methodMeta.className)}
				/>
			</div>
			<h1 className="absolute top-[70px] left-0 w-full overflow-hidden text-ellipsis whitespace-nowrap px-3.5 text-center font-medium text-white text-xs">
				{title}
			</h1>
			<p className="absolute top-[103px] left-0 line-clamp-2 w-full px-3.5 text-center font-medium text-white text-xs leading-tight">
				Usual Process Time:
				<br />
				{speed === "instant"
					? "Instant"
					: speed === "medium"
						? "1-3 Business Days"
						: "3-5 Business Days"}
			</p>
		</button>
	);
};
