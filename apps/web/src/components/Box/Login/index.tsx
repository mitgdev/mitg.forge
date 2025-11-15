import { Link } from "@tanstack/react-router";
import { MenuBox } from "@/components/Box/Menu";
import { ButtonLogout } from "@/components/Buttons/ButtonLogout";
import { useSession } from "@/sdk/contexts/session";
import { ButtonImageLink } from "@/ui/Buttons/ButtonImageLink";

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
							<ButtonImageLink to="/account">My Account</ButtonImageLink>
							<ButtonLogout />
						</>
					) : (
						<>
							<ButtonImageLink to="/login" preload={false}>
								Login
							</ButtonImageLink>
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
