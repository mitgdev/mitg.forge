import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { forwardRef, type LinkHTMLAttributes, useMemo } from "react";
import { assets } from "@/assets";
import { cn } from "@/sdk/utils/cn";

type Props = LinkHTMLAttributes<HTMLAnchorElement> & {
	variant?: "regular" | "large" | "info" | "green" | "red";
} & LinkComponentProps;

export const ButtonImageLink = forwardRef<HTMLAnchorElement, Props>(
	function Button(
		{ variant = "regular", className: classNameProp, to, ...props },
		ref,
	) {
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
			<Link
				to={to}
				ref={ref}
				className={cn(
					"hover:filter-hover fondamento-title line-clamp-1 flex cursor-pointer items-center justify-center border-none bg-transparent p-0 text-black capitalize transition-all disabled:cursor-not-allowed disabled:opacity-80",
					classNameProp,
					{
						"h-[25px] w-[135px] text-sm":
							variant === "red" || variant === "info" || variant === "green",
						"h-[34px] w-[142px] px-2 text-base": variant === "regular",
						"h-[34px] w-[150px] px-2 text-base": variant === "large",
					},
				)}
				{...props}
				style={{
					backgroundImage: `url('${backgroundImage}')`,
				}}
			/>
		);
	},
);
