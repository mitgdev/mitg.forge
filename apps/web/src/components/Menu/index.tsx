import type { LinkProps } from "@tanstack/react-router";
import { MenuBox } from "@/components/Box/Menu";
import { MenuItem } from "./Item";

export const Icons = {
	management: "/assets/icons/32/loremaster_doll.gif",
	news: "/assets/icons/32/news-menu.gif",
	sphere: "/assets/icons/32/armillary_sphere.gif",
	munster: "/assets/icons/32/baby_munster.gif",
};

interface MenuProps {
	items: Array<{
		label: string;
		icon: keyof typeof Icons;
		menus: Array<{
			label: string;
			to: LinkProps["to"];
			hot?: boolean;
		}>;
	}>;
}

export const Menu = ({ items }: MenuProps) => {
	return (
		<div className="flex">
			<MenuBox>
				{items.map((item) => (
					<MenuItem label={item.label} icon={item.icon} menus={item.menus} />
				))}
			</MenuBox>
		</div>
	);
};
