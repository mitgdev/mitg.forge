import { cn } from "@/sdk/utils/cn";
import { BorderBox } from "../Box/Border";

const Icons = {
	coin: {
		path: "/assets/icons/64/coin_animation.gif",
		className: "left-0 -top-6",
	},
	journal: {
		path: "/assets/icons/32/journal_shield.gif",
		className: "left-2 -top-1 ",
	},
} as const;

const Themes = {
	pink: "/assets/box/theme-pink.png",
	blue: "/assets/box/theme-blue.png",
};

export const ThemeBox = ({
	children,
	title,
	icon,
	theme = "pink",
}: {
	title: string;
	theme?: keyof typeof Themes;
	icon?: keyof typeof Icons;
	children?: React.ReactNode;
}) => {
	return (
		<div className="flex flex-col">
			<div className="relative w-full">
				{icon && (
					<img
						alt={`theme-box-${icon}-icon`}
						src={Icons[icon].path}
						className={cn("absolute z-20", {
							[Icons[icon].className]: true,
						})}
					/>
				)}
				<img alt="theme-box" src={Themes[theme]} />
				<span className="section-title -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 text-white">
					{title}
				</span>
			</div>
			<div className="relative w-[162px] self-center bg-tibia-400 transition-all">
				<div className="-left-0.5 absolute top-0 h-full w-[3px] bg-[url('/assets/borders/box-frame-vertical.gif')] bg-repeat-y transition-all duration-700" />
				<div className="-right-0.5 absolute top-0 h-full w-[3px] bg-[url('/assets/borders/box-frame-vertical.gif')] bg-repeat-y transition-all duration-700" />
				{children}
			</div>
			<BorderBox golden />
		</div>
	);
};
