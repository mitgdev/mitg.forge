import { forwardRef } from "react";
import { cn } from "@/sdk/utils/cn";

type Props = React.HTMLAttributes<HTMLDivElement> & {};

export const MessageContainer = forwardRef<HTMLDivElement, Props>(
	({ className, children, ...props }, ref) => {
		const corner = cn(
			"absolute h-[5px] w-[5px] bg-[url('/assets/borders/box-frame-edge.gif')] bg-no-repeat",
		);

		const borderAboves = cn(
			"block h-1 w-full bg-[url('/assets/borders/table-headline-border.gif')] bg-repeat-x",
		);

		const borderSides = cn(
			"absolute top-0 top-0 block h-full w-1 bg-[url('/assets/borders/box-frame-vertical.gif')] bg-repeat-y",
		);

		return (
			<div ref={ref} {...props} className={cn(className)}>
				<div className="relative">
					<span className={`${borderAboves}`} />
					<span className={`${borderSides} -right-px`} />
					<span className={`${corner} -top-px -right-px`} />
					<span className={`${corner} -right-px -bottom-px`} />
					<div className="gap-3 bg-tibia-600 px-3 py-1">{children}</div>
					<span className={`${borderAboves} -left-px`} />
					<span className={`${borderSides}`} />
					<span className={`${corner} -top-px -left-px`} />
					<span className={`${corner} -bottom-px -left-px`} />
				</div>
			</div>
		);
	},
);
