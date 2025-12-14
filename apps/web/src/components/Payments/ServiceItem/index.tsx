import { cn } from "@/sdk/utils/cn";

export type ServiceItemProps = {
	selected: boolean;
	onClick: () => void;
	title: string;
	price: string;
	disabled?: boolean;
	icon?: React.ReactNode | string;
};

export const ServiceItem = ({
	title,
	onClick,
	price,
	selected,
	disabled = true,
	icon,
}: ServiceItemProps) => {
	return (
		<button
			type="button"
			className={cn("group relative flex h-[150px] w-[150px] cursor-pointer", {
				"disabled:cursor-not-allowed": disabled,
			})}
			style={{
				backgroundImage:
					'url("/assets/payments/service/serviceid_icon_normal.png")',
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
			onClick={onClick}
			disabled={disabled}
			aria-pressed={selected}
		>
			<img
				className={cn("", {
					"pointer-events-none absolute inset-0 h-[150px] w-[150px] opacity-100 transition-opacity duration-200 ease-out":
						selected,
					"pointer-events-none absolute inset-0 h-[150px] w-[150px] opacity-0 transition-opacity duration-200 ease-out":
						!selected,
				})}
				src="/assets/payments/service/serviceid_icon_selected.png"
				alt="Selected Payment Method"
			/>
			{disabled && (
				<img
					className={cn(
						"pointer-events-none absolute inset-0 z-20 h-[150px] w-[150px] opacity-100 transition-opacity duration-200 ease-out",
					)}
					src="/assets/payments/service/serviceid_deactivated.png"
					alt="Selected Payment Method"
				/>
			)}

			<img
				className={cn(
					"pointer-events-none absolute inset-0 h-[150px] w-[150px] opacity-0 transition-opacity duration-200 ease-out",
					{
						"group-hover:opacity-100": !disabled,
					},
				)}
				src="/assets/payments/service/serviceid_icon_over.png"
				alt="Payment Method Hover"
			/>
			<div className="absolute top-[50px] z-10 h-16 w-full">
				{typeof icon === "string" && (
					<div
						className={cn(
							"absolute top-0 left-0 z-10 h-16 w-full scale-100 bg-center bg-contain bg-no-repeat transition-transform duration-200 ease-out",
						)}
						style={{
							backgroundImage: `url('${icon}')`,
						}}
					/>
				)}
				{typeof icon !== "string" && icon}
			</div>
			<h1 className="absolute top-[18px] left-0 w-full overflow-hidden text-ellipsis whitespace-nowrap px-3.5 text-center font-medium text-white text-xs">
				{title}
			</h1>
			<p className="absolute top-[126px] left-0 line-clamp-2 w-full px-3.5 text-center font-medium text-white text-xs leading-tight">
				{price} *
			</p>
		</button>
	);
};
