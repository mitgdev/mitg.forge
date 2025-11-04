import { type PropsWithChildren, useId } from "react";
import { cn } from "@/sdk/utils/cn";

type TooltipProps = PropsWithChildren<{
	content: React.ReactNode;
	className?: string; // tamanho/cor do trigger
}>;

export function Tooltip({ content, children, className }: TooltipProps) {
	const id = useId();
	return (
		<span className="group relative inline-block h-max w-max">
			<button
				type="button"
				aria-describedby={id}
				className={cn("flex", className)}
			>
				{children}
			</button>

			<span
				id={id}
				role="tooltip"
				className="-translate-x-1/2 pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 whitespace-nowrap rounded-md bg-black/90 px-2 py-1 text-white text-xs opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
			>
				{content}
				<span className="-translate-x-1/2 absolute top-full left-1/2 border-4 border-transparent border-t-black/90" />
			</span>
		</span>
	);
}
