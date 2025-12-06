import { Link, type LinkProps, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/sdk/utils/cn";
import { Icons } from "..";

type Props = {
	label: string;
	icon: keyof typeof Icons;
	menus: Array<{
		label: string;
		to: LinkProps["to"];
		new?: boolean;
		hot?: boolean;
	}>;
};

export const MenuItem = ({ icon, label, menus = [] }: Props) => {
	const routerState = useRouterState();
	const [show, setShow] = useState(() => {
		return menus.some(
			(subMenu) => subMenu.to === routerState.location.pathname,
		);
	});

	useEffect(() => {
		const shouldShow = menus.some(
			(subMenu) => subMenu.to === routerState.location.pathname,
		);
		setShow((prev) => (prev ? prev : shouldShow));
	}, [routerState.location.pathname, menus]);

	const heightTotal = menus.length * 18.8;

	return (
		<div>
			<button
				type="button"
				className={cn(
					"hover:filter-hover relative flex h-8 w-[170px] cursor-pointer items-center gap-1 bg-no-repeat px-1 transition-all",
				)}
				style={{
					backgroundImage: `url('/assets/buttons/button-menu.webp')`,
				}}
				onClick={() => setShow(!show)}
			>
				<img
					alt={`${label}-icon-plus-minus`}
					src={show ? "/assets/buttons/minus.gif" : "/assets/buttons/plus.gif"}
					className="absolute right-0 bottom-0"
				/>
				<img src={Icons[icon]} alt="teste" className="absolute" />
				<span className="fondamento-title flex-1 text-center text-base capitalize">
					{label}
				</span>
			</button>

			<div
				className="relative flex h-0 w-[170px] flex-col overflow-hidden px-0.5 transition-all duration-300"
				style={{
					height: show ? `${heightTotal}px` : "0px",
				}}
			>
				<div
					className="absolute top-0 right-0 h-full w-[7px] bg-[url('/assets/borders/chain.webp')] bg-repeat-y transition-all duration-300"
					style={{ height: show ? `${heightTotal}px` : "0px" }}
				/>
				<div
					style={{ height: show ? `${heightTotal}px` : "0px" }}
					className="absolute top-0 left-0 h-full w-[7px] bg-[url('/assets/borders/chain.webp')] bg-repeat-y transition-all duration-300"
				/>
				{menus.map((subMenu) => {
					const isActive = routerState.location.pathname === subMenu.to;

					return (
						<Link
							to={subMenu.to}
							key={subMenu.label}
							className={cn(
								"line-clamp-1 flex cursor-pointer flex-row items-center gap-2 border-tertiary border-b bg-tibia-200 px-2 py-0.5 font-poppins text-white text-xs decoration-0 transition-all hover:bg-tibia-300",
								{
									"bg-tibia-300": isActive,
								},
							)}
						>
							<div>
								{isActive && <span className="mr-1">{">"}</span>}
								{subMenu.label}
							</div>
							{subMenu.new && (
								<img
									alt={`${subMenu.label}-new`}
									src="/assets/icons/global/new.gif"
								/>
							)}
							{subMenu.hot && (
								<img
									alt={`${subMenu.label}-hot`}
									src="/assets/icons/global/hot.gif"
								/>
							)}
						</Link>
					);
				})}
			</div>
		</div>
	);
};
