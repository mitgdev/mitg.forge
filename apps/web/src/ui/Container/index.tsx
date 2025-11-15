import { forwardRef } from "react";
import { cn } from "@/sdk/utils/cn";
import { InnerContainer } from "./Inner";

type Props = React.HTMLAttributes<HTMLDivElement> & {
	title: string;
	innerContainer?: boolean;
	actions?: React.ReactNode;
};

export const Container = forwardRef<HTMLDivElement, Props>(
	({ children, className, innerContainer, title, actions, ...props }, ref) => {
		const anchorId = title.toLowerCase().replace(/\s+/g, "-");

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
			<div ref={ref} {...props} className={cn(className)} id={anchorId}>
				<div className="relative">
					<span className={`${borderAboves}`} />
					<span className={`${borderSides} -right-px`} />
					<span className={`${corner} -top-px -right-px`} />
					<span className={`${corner} -right-px -bottom-px`} />
					<div className="flex items-center justify-between gap-3 bg-tibia-700 px-3 py-1">
						<h1 className="font-bold font-poppins text-sm text-white">
							{title}
						</h1>
						{actions}
					</div>
					<span className={`${borderAboves} -left-px`} />
					<span className={`${borderSides}`} />
					<span className={`${corner} -top-px -left-px`} />
					<span className={`${corner} -bottom-px -left-px`} />
				</div>
				{innerContainer ? (
					<div className="border-3 border-t-0 bg-tibia-800 p-2 text-senary">
						<InnerContainer className="p-1">{children}</InnerContainer>
					</div>
				) : (
					<div className="border-3 border-t-0 bg-tibia-800 p-2 text-senary">
						{children}
					</div>
				)}
			</div>
		);
	},
);
