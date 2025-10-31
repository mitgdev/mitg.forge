import { useState } from "react";
import { cn } from "@/sdk/utils/cn";

const Icons = {
	community: "/assets/icons/16/newsicon_community_small.png",
	technical: "/assets/icons/16/newsicon_technical_small.png",
};

type Props = {
	icon: keyof typeof Icons;
	title?: string;
	content: string;
	inverted?: boolean;
};

export const NewstickerItem = ({ icon, content, title, inverted }: Props) => {
	const [open, setOpen] = useState(false);
	const date = new Date().toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});

	return (
		<article
			className={cn(
				"flex cursor-pointer select-none flex-row items-start gap-1 overflow-hidden p-0.5 font-roboto text-secondary text-xs",
				{
					"bg-tibia-500": inverted,
					"bg-tibia-600": !inverted,
				},
			)}
			onClick={() => setOpen(!open)}
		>
			<img src={Icons[icon]} alt={`${icon}-icon`} />
			<span className="min-w-max">{date}</span>
			<span>-</span>
			{title && (
				<span className="whitespace-nowrap font-bold capitalize">
					[{title}]
				</span>
			)}
			<span
				className={cn("overflow-hidden transition-all", {
					"line-clamp-6": open,
					"line-clamp-1 h-4": !open,
				})}
			>
				{content}
			</span>
			<img
				src={open ? "/assets/buttons/minus.gif" : "/assets/buttons/plus.gif"}
				alt="newsticker-plus"
				className="mt-0.5 mr-0.5 ml-auto"
			/>
		</article>
	);
};
