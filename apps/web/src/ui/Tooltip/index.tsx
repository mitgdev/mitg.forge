import {
	TooltipArrow,
	TooltipContent,
	TooltipPortal,
	TooltipProvider,
	Tooltip as TooltipRoot,
	TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { forwardRef } from "react";
import { cn } from "@/sdk/utils/cn";

type TooltipProps = {
	/** Elemento que dispara o tooltip (botão, ícone, etc.) */
	children: React.ReactElement;
	/** Conteúdo do tooltip */
	content: React.ReactNode;
	/** Classes extras no content */
	className?: string;
	/** Controla abertura externamente (opcional) */
	open?: boolean;
	/** Abertura inicial (não-controlado) */
	defaultOpen?: boolean;
	/** Delay pra abrir (ms). Em testes, use 0. */
	delayDuration?: number;
	/** Posição / alinhamento do tooltip */
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
	/** data-testid para o conteúdo (facilita o teste) */
	contentTestId?: string;
};

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
	(
		{
			children,
			content,
			className,
			open,
			defaultOpen,
			delayDuration = 200,
			side = "top",
			align = "center",
			contentTestId = "tooltip-content",
		},
		ref,
	) => {
		return (
			<TooltipProvider delayDuration={delayDuration} skipDelayDuration={0}>
				<TooltipRoot open={open} defaultOpen={defaultOpen}>
					{/* asChild permite passar qualquer elemento React como trigger */}
					<TooltipTrigger asChild>{children}</TooltipTrigger>

					{/* O Radix usa portal; isso é ok em testes também */}
					<TooltipPortal>
						<TooltipContent
							ref={ref}
							side={side}
							align={align}
							className={cn(
								"rounded-md bg-black px-2 py-1 text-sm text-white shadow-lg",
								className,
							)}
							data-testid={contentTestId}
						>
							{content}
							<TooltipArrow />
						</TooltipContent>
					</TooltipPortal>
				</TooltipRoot>
			</TooltipProvider>
		);
	},
);
