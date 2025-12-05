import { forwardRef } from "react";
import { cn } from "@/sdk/utils/cn";

export const Label = forwardRef<
	HTMLLabelElement,
	React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: <will be used properly />
		<label
			ref={ref}
			className={cn("font-semibold text-secondary text-sm", className)}
			{...props}
		/>
	);
});
