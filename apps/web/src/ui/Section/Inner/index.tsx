import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/sdk/utils/cn";

type Props = HTMLAttributes<HTMLDivElement> & {};

export const InnerSection = forwardRef<HTMLDivElement, Props>(
	({ className, children, ...props }, ref) => {
		const classnames = cn(
			"flex flex-col gap-4 border border-tertiary bg-tibia-500 p-1",
			className,
		);

		return (
			<div className="p-1">
				<div ref={ref} className={cn(classnames)} {...props}>
					{children}
				</div>
			</div>
		);
	},
);
