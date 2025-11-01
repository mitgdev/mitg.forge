import { useSession } from "@/sdk/contexts/session";

export const ButtonLogout = () => {
	const { logout } = useSession();

	return (
		<button
			className="fondamento-title cursor-pointer text-xs hover:underline disabled:cursor-not-allowed disabled:opacity-50"
			type="button"
			onClick={logout}
		>
			Logout
		</button>
	);
};
