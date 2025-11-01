import { Link } from "@tanstack/react-router";
import { MenuBox } from "@/components/Box/Menu";
import { ButtonLogout } from "@/components/Buttons/ButtonLogout";
import { useSession } from "@/sdk/contexts/session";
import { ButtonLink } from "@/ui/Buttons/ButtonLink";

export const BoxLogin = () => {
	const { session } = useSession();

	return (
		<div>
			<Link
				to="/"
				className="-right-0.5 absolute top-[-155px] flex w-full items-center"
			>
				<img
					alt="logo tibia artwork"
					src="/assets/logo/tibia-logo-artwork-top.webp"
				/>
			</Link>
			<MenuBox background chains>
				<div className="flex flex-col items-center gap-1">
					{session ? (
						<>
							<ButtonLink to="/account">My Account</ButtonLink>
							<ButtonLogout />
						</>
					) : (
						<>
							<ButtonLink to="/login" preload={false}>
								Login
							</ButtonLink>
							<Link to="/" className="fondamento-title text-xs hover:underline">
								Create Account
							</Link>
						</>
					)}
				</div>
			</MenuBox>
		</div>
	);
};
