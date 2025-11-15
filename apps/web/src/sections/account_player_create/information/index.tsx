import { Link } from "@tanstack/react-router";

export const AccountPlayerCreateInformation = () => {
	return (
		<span className="text-secondary text-sm">
			Please choose a name and sex for your character as well as the game world
			on which you want the character to live. The name must not violate the
			naming conventions stated in the{" "}
			<Link to="/" className="font-bold text-blue-800 hover:underline">
				Rules
			</Link>
			, or your character might get deleted or name locked.
		</span>
	);
};
