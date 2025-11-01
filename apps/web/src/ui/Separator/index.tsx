import { forwardRef } from "react";
import { cn } from "@/sdk/utils/cn";

type Props = React.HTMLAttributes<HTMLDivElement> & {
	title: string;
};

export const Separator = forwardRef<HTMLDivElement, Props>(
	({ className, title, ...props }, ref) => {
		return (
			<div
				className={cn(className, "relative my-3 flex items-center gap-3")}
				ref={ref}
				{...props}
			>
				<span className="h-0.5 grow bg-linear-to-r from-transparent via-[#d0a85a] to-[#6b4a17]" />

				<span className="relative inline-flex items-center gap-2">
					<span className="font-bold font-verdana text-secondary text-sm uppercase">
						{title}
					</span>
				</span>

				<span className="h-0.5 grow bg-linear-to-l from-transparent via-[#d0a85a] to-[#6b4a17]" />
			</div>
		);
	},
);
