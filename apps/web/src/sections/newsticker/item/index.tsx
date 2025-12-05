import type React from "react";
import { useState } from "react";
import { cn } from "@/sdk/utils/cn";

const Icons = {
	community: "/assets/icons/16/newsicon_community_small.png",
	technical: "/assets/icons/16/newsicon_technical_small.png",
};

type Props = {
	icon: keyof typeof Icons;
	title?: string;
	inverted?: boolean;
	children?: React.ReactNode;
};

export const NewstickerItem = ({ icon, children, title, inverted }: Props) => {
	const [open, setOpen] = useState(false);
	const date = new Date().toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});

	const handleToggle = () => setOpen((prev) => !prev);

	const handleContentClick = (e: React.MouseEvent<HTMLSpanElement>) => {
		const target = e.target as HTMLElement;
		if (target.closest("a")) {
			e.stopPropagation();
		}
	};

	return (
		<button
			className={cn(
				"cursor-pointer select-none p-0.5 font-roboto text-secondary text-xs",
				{
					"bg-tibia-500": inverted,
					"bg-tibia-600": !inverted,
				},
			)}
			onClick={handleToggle}
			type="button"
		>
			{/* HEADER */}
			<div className="flex flex-row items-start gap-1">
				<img src={Icons[icon]} alt={`${icon}-icon`} />
				<span className="min-w-max">{date} - </span>

				{title && (
					<span className="whitespace-nowrap font-bold capitalize">
						[{title}]
					</span>
				)}

				{/* PREVIEW MOBILE */}
				<span
					className={cn(
						"flex-1 cursor-pointer overflow-hidden text-start transition-all md:hidden",
						{
							"line-clamp-1 h-4": !open,
							hidden: open,
						},
					)}
					onClick={handleContentClick}
					role="button"
				>
					{children}
				</span>

				{/* DESKTOP INLINE */}
				<span
					className={cn(
						"hidden flex-1 cursor-pointer overflow-hidden text-start transition-all md:block",
						{
							"md:line-clamp-6": open,
							"md:line-clamp-1 md:h-4": !open,
						},
					)}
					onClick={handleContentClick}
					role="button"
				>
					{children}
				</span>

				<img
					src={open ? "/assets/buttons/minus.gif" : "/assets/buttons/plus.gif"}
					alt="newsticker-toggle"
					className="mt-0.5 mr-0.5 ml-auto"
				/>
			</div>

			{/* MOBILE: BLOCO DEBAIXO QUANDO ABRE */}
			<div
				className={cn(
					"mt-1 overflow-hidden text-start transition-all md:hidden",
					{
						"max-h-0 opacity-0": !open,
						"max-h-96 opacity-100": open,
					},
				)}
			>
				<p className="text-xs leading-snug">{children}</p>
			</div>
		</button>
	);
};
