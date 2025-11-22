import { cn } from "@/sdk/utils/cn";
import { Tooltip } from "@/ui/Tooltip";

type Props = {
	canGoToNextPage: boolean;
	canGoToPreviousPage: boolean;
	goToNextPage: () => void;
	goToPreviousPage: () => void;
	pagination: {
		page: number;
		size: number;
		total?: number;
	};
};

export const PaginationControls = ({
	canGoToNextPage,
	canGoToPreviousPage,
	goToNextPage,
	goToPreviousPage,
	pagination,
}: Props) => {
	const total = pagination?.total === 0 ? 1 : pagination?.total;

	return (
		<div className="flex flex-row justify-end gap-3">
			<Tooltip content="Previous Page">
				<button
					type="button"
					className={cn(
						"cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
					)}
					disabled={!canGoToPreviousPage}
					onClick={() => goToPreviousPage()}
				>
					<img
						alt="Previous Page"
						src="/assets/icons/global/back-to-top.gif"
						className="rotate-270 scale-x-[-1]"
					/>
				</button>
			</Tooltip>
			<span className="font-verdana text-secondary text-sm">
				Page {pagination.page} of {total}
			</span>
			<Tooltip content="Next Page">
				<button
					type="button"
					className={cn(
						"cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
					)}
					disabled={!canGoToNextPage}
					onClick={() => goToNextPage()}
				>
					<img
						alt="Next Page"
						src="/assets/icons/global/back-to-top.gif"
						className="rotate-90"
					/>
				</button>
			</Tooltip>
		</div>
	);
};
