import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/sdk/utils/cn";

type Props = HTMLAttributes<HTMLDivElement> & {};

export const Section = forwardRef<HTMLDivElement, Props>(
	({ children, className: classNameProps, ...props }, ref) => {
		const cornerClass = cn(
			"absolute z-10 block h-[17px] w-[17px] bg-[url('/assets/borders/corner.webp')] bg-no-repeat",
		);

		const borderImageClass = cn(
			"block h-[6px] w-full border-0 bg-[url('/assets/borders/border-1.webp')] bg-repeat",
		);

		return (
			<section
				className={cn(
					"relative border-quaternary border-r-2 border-l-2 bg-tibia-400",
					classNameProps,
				)}
				ref={ref}
				{...props}
			>
				<span className={`${cornerClass} -top-1 right-[-5px]`} />
				<span
					className={`${cornerClass} right-[-5px] bottom-[-3px] rotate-90 transform`}
				/>
				<span className={borderImageClass} />
				{children}
				<span className={borderImageClass} />
				<span
					className={`${cornerClass} -top-1 left-[-5px] rotate-270 transform`}
				/>
				<span
					className={`${cornerClass} bottom-[-3px] left-[-5px] rotate-180 transform`}
				/>
			</section>
		);
	},
);
