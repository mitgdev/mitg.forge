import { cn } from "@/sdk/utils/cn";

export type BaseProductServiceCardProps = {
	disabled?: boolean;
	selected?: boolean;
	icon: string | React.ReactNode;
	title: string;
	description: string;
};

export function BaseProductServiceCard(props: BaseProductServiceCardProps) {
	const selected = props.selected ?? false;
	const disabled = props.disabled ?? false;
	const icon = props.icon;
	const title = props.title;
	const description = props.description;

	return (
		<div
			className={cn("group relative flex h-[150px] w-[150px] cursor-pointer", {
				"disabled:cursor-not-allowed": disabled,
			})}
			style={{
				backgroundImage: 'url("/assets/service/service_icon_normal.png")',
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			<img
				src="/assets/service/service_icon_selected.png"
				alt="Selected Payment Method"
				className={cn({
					"pointer-events-none absolute inset-0 h-[150px] w-[150px] opacity-100 transition-opacity duration-200 ease-out":
						selected,
					"pointer-events-none absolute inset-0 h-[150px] w-[150px] opacity-0 transition-opacity duration-200 ease-out":
						!selected,
				})}
			/>
			<img
				src="/assets/service/service_deactivated.png"
				alt="Selected Payment Method"
				className={cn(
					"pointer-events-none absolute inset-0 z-20 h-[150px] w-[150px] opacity-100 transition-opacity duration-200 ease-out",
					{
						"opacity-0": !disabled,
					},
				)}
			/>
			<img
				src="/assets/service/service_icon_over.png"
				alt="Payment Method Hover"
				className={cn(
					"pointer-events-none absolute inset-0 h-[150px] w-[150px] opacity-0 transition-opacity duration-200 ease-out",
					{
						"group-hover:opacity-100": !disabled,
					},
				)}
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
				{description}
			</p>
		</div>
	);
}
