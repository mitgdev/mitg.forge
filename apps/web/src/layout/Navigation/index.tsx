import { BoxDownload } from "@/components/Box/Download";
import { BoxLogin } from "@/components/Box/Login";
import { useSession } from "@/sdk/contexts/session";
import { Menu } from "../../components/Menu";

export const Navigation = () => {
	const role: number | null = useSession().session?.type || null;

	return (
		<nav
			className="relative hidden flex-col items-center gap-4 xl:flex"
			style={{
				gridArea: "navigation",
			}}
		>
			<BoxLogin />
			<BoxDownload />
			{role !== null && role >= 4 && (
				<Menu
					items={[
						{
							label: "Management",
							icon: "management",
							menus: [{ label: "List accounts", to: "/admin/accounts/list" }],
						},
					]}
				/>
			)}
			<Menu
				items={[
					{
						label: "News",
						icon: "news",
						menus: [{ label: "Latest News", to: "/terms" }],
					},
					{
						label: "Sphere",
						icon: "sphere",
						menus: [{ label: "Updates", to: "/", hot: true }],
					},
				]}
			/>
		</nav>
	);
};
