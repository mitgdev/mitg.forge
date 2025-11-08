import { forwardRef } from "react";
import { cn } from "@/sdk/utils/cn";

type Props = React.HTMLAttributes<HTMLDivElement> & {};

export const InnerContainer = forwardRef<HTMLDivElement, Props>(
	({ className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				{...props}
				className={cn(
					"relative mb-3 block h-max w-full border border-septenary bg-tibia-600 p-0.5 shadow-container outline-1 outline-quaternary last:mb-0",
					className,
				)}
			/>
		);
	},
);
