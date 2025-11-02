import { Link } from "@tanstack/react-router";
import { Container } from "@/ui/Container";

export const AccountDownload = () => {
	return (
		<Container innerContainer title="Download Client">
			<div className="flex flex-row flex-wrap items-center justify-center gap-5 md:justify-between md:gap-1">
				<span className="max-w-xl text-center font-verdana text-secondary text-sm">
					Click{" "}
					<Link to="/" className="font-bold text-blue-900 underline">
						here
					</Link>{" "}
					to download the latest version of the game client.
				</span>
				<Link
					to="/"
					className="flex flex-col items-center gap-0.5 rounded p-2 text-secondary text-sm hover:bg-secondary/10"
				>
					<img
						alt="download-client"
						src="/assets/icons/global/librarian.gif"
						className="h-8 w-8"
					/>
					<span className="font-bold text-blue-900">Download</span>
				</Link>
			</div>
		</Container>
	);
};
