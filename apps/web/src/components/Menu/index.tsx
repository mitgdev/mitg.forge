import { MenuBox } from "@/components/Box/Menu";
import { MenuItem } from "./Item";

export const Menu = () => {
	return (
		<div className="flex">
			<MenuBox>
				<MenuItem
					label="News"
					icon="news"
					menus={[{ label: "Latest News", to: "/terms" }]}
				/>
				<MenuItem
					label="Sphere"
					icon="sphere"
					menus={[{ label: "Updates", to: "/", hot: true }]}
				/>
				<MenuItem
					label="Donate"
					icon="tibiora_box"
					menus={[{ label: "Shop", to: "/shop" }]}
				/>
			</MenuBox>
		</div>
	);
};
