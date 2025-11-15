import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { cn } from "@/sdk/utils/cn";
import { Tooltip } from "@/ui/Tooltip";

export const SectionHeader = ({
	color,
	children,
	backButton = false,
}: {
	children?: React.ReactNode;
	color: "red" | "green";
	backButton?: boolean;
}) => {
	const router = useRouter();
	const canGoBack = useCanGoBack();

	const classname = cn({
		'h-7 bg-[url("/assets/background/section-header-red.webp")]':
			color === "red",
		'h-6 bg-[url("/assets/background/section-header-green.webp")]':
			color === "green",
	});

	return (
		<header className={`${classname} relative block bg-repeat-x`}>
			<div className="absolute flex h-full w-full items-center px-2">
				{backButton && canGoBack && (
					<Tooltip content="Go Back">
						<button
							type="button"
							className="mr-2 cursor-pointer hover:opacity-80"
							onClick={() => router.history.back()}
						>
							<img
								width={18}
								height={18}
								alt="go back button"
								className="-rotate-90 scale-x-[-1]"
								src="/assets/icons/global/back-to-top.gif"
							/>
						</button>
					</Tooltip>
				)}
				{children}
			</div>
		</header>
	);
};
