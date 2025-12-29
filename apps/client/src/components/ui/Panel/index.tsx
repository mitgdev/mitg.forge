import { forwardRef } from "react";
import { cn } from "@/sdk/utils/cn";

type Props = {
	area: string;
	border?: "left" | "right" | "top" | "bottom";
} & React.HTMLAttributes<HTMLDivElement>;

export const Panel = forwardRef<HTMLDivElement, Props>(
	({ className, style, area, ...rest }, ref) => {
		return (
			<div
				ref={ref}
				{...rest}
				className={cn(
					"border-neutral-800",
					{
						"border-l": rest.border === "left",
						"border-r": rest.border === "right",
						"border-t": rest.border === "top",
						"border-b": rest.border === "bottom",
					},
					className,
				)}
				style={{
					...style,
					gridArea: area,
					backgroundImage: "url(/textures/background.png)",
					backgroundRepeat: "repeat",
					backgroundSize: "64px 64px",
				}}
			/>
		);
	},
);
