import { cn } from "@/sdk/utils/cn";

type Method = "PIX";

const METHOD_META: Record<Method, { icon: string; className?: string }> = {
	PIX: {
		icon: "/assets/payments/pix.webp",
		className: "mx-auto rounded-md w-[80px]",
	},
};

type Props = {
	selected: boolean;
	onClick: () => void;
	title: string;
	speed?: "instant" | "medium" | "slow";
	disabled?: boolean;
	method: Method;
};

export function PaymentMethod({
	selected,
	onClick,
	title,
	speed,
	disabled = false,
	method,
}: Props) {
	return (
		<button
			type="button"
			className="group relative flex h-[147px] w-[150px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
			style={{
				backgroundImage: 'url("/assets/payments/payment_icon_normal.webp")',
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
			disabled={disabled}
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
				src="/assets/payments/payment_icon_selected.webp"
				alt="Selected Payment Method"
			/>

			<img
				className={cn(
					"pointer-events-none absolute inset-0 h-[147px] w-[150px] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100",
					{
						"opacity-0": selected || disabled,
					},
				)}
				src="/assets/payments/payment_icon_hover.webp"
				alt="Payment Method Hover"
			/>
			<div className="absolute top-[9px] z-10 h-[50px] w-full">
				<img
					src={METHOD_META[method].icon}
					alt={`${title} Icon`}
					className={cn(
						"h-[50px] w-full object-contain",
						METHOD_META[method].className,
					)}
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
}
