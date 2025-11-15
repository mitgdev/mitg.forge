import { forwardRef, useMemo } from "react";
import { assets } from "@/assets";
import { cn } from "@/sdk/utils/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean;
	variant?: "regular" | "large" | "info" | "green" | "red";
};

export const ButtonImage = forwardRef<HTMLButtonElement, Props>(
	(
		{
			variant = "regular",
			className: classNameProp,
			children,
			loading = false,
			...props
		},
		ref,
	) => {
		const backgroundImage = useMemo<string>(() => {
			switch (variant) {
				case "red":
					return assets.buttons.buttonRed;
				case "green":
					return assets.buttons.buttonGreen;
				case "info":
					return assets.buttons.buttonBlue;
				case "large":
					return assets.buttons.buttonExtend;
				case "regular":
					return assets.buttons.button;
				default:
					return assets.buttons.button;
			}
		}, [variant]);

		return (
			<button
				ref={ref}
				{...props}
				className={cn(
					classNameProp,
					"hover:filter-hover fondamento-title line-clamp-1 flex cursor-pointer items-center justify-center border-none bg-transparent p-0 font-fondamento text-black capitalize transition-all disabled:cursor-not-allowed disabled:opacity-80",
					{
						"h-[25px] w-[135px] text-sm":
							variant === "red" || variant === "info" || variant === "green",
						"h-[34px] w-[142px] px-2 text-base": variant === "regular",
						"h-[34px] w-[150px] px-2 text-base": variant === "large",
					},
				)}
				style={{
					backgroundImage: `url('${backgroundImage}')`,
				}}
			>
				{loading && (
					<img alt="loading" src="/assets/icons/global/spinner.png" />
				)}
				{!loading && children}
			</button>
		);
	},
);
