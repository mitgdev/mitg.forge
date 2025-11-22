import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TibiaCoins } from "@/components/Coins";
import { PaginationControls } from "@/components/Pagination";
import {
	usePagination,
	usePaginationControls,
} from "@/sdk/hooks/usePagination";
import { useTimezone } from "@/sdk/hooks/useTimezone";
import { api } from "@/sdk/lib/api/factory";
import { cn } from "@/sdk/utils/cn";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Tooltip } from "@/ui/Tooltip";

export const AccountCoinsHistory = () => {
	const { pagination, setPagination } = usePagination({
		initialPage: 1,
		initialSize: 10,
	});
	const { formatDate } = useTimezone();
	const { data, refetch, isFetching } = useQuery(
		api.query.miforge.accounts.store.history.queryOptions({
			placeholderData: keepPreviousData,
			input: {
				page: pagination?.page,
				size: pagination?.size,
			},
		}),
	);

	const {
		canGoToNextPage,
		canGoToPreviousPage,
		goToNextPage,
		goToPreviousPage,
	} = usePaginationControls({
		pagination,
		setPagination,
		totalItems: data?.meta?.total,
		totalPages: data?.meta?.totalPages,
	});

	const storeHistory = data?.results ?? [];

	return (
		<Container
			title="Coins History"
			actions={
				<Tooltip content="Refresh History">
					<button
						type="button"
						disabled={isFetching}
						onClick={() => refetch()}
						className={cn(
							"cursor-pointer rounded bg-tibia-1000 p-0.5 text-sm disabled:cursor-not-allowed disabled:opacity-50",
							{
								"animate-spin": isFetching,
							},
						)}
					>
						<img
							alt="refresh history"
							src="/assets/icons/global/refresh-ccw-dot.png"
							className="h-4 w-4"
						/>
					</button>
				</Tooltip>
			}
		>
			<InnerContainer className="p-0">
				<table className="w-full border-collapse">
					<thead>
						<th className="w-[2%] border border-septenary p-1 text-start font-bold text-secondary">
							#
						</th>
						<th className="border border-septenary p-1 text-start font-bold text-secondary">
							Date
						</th>
						<th className="border border-septenary p-1 text-start font-bold text-secondary">
							Description
						</th>
						<th className="w-[10%] border border-septenary p-1 text-start font-bold text-secondary">
							Balance
						</th>
					</thead>
					<tbody>
						{storeHistory.map((history, index) => {
							return (
								<tr
									key={`${history.id}-${history.account_id}-${index}`}
									className="bg-tibia-900 even:bg-tibia-600"
								>
									<td className="border border-septenary p-1 text-center">
										<span className="font-bold text-secondary text-sm">
											{index + 1}.
										</span>
									</td>
									<td className="border border-septenary p-1 text-secondary text-sm">
										{formatDate(history?.time ?? new Date(), {
											year: "2-digit",
											month: "2-digit",
											day: "2-digit",
											hour: "2-digit",
											minute: "2-digit",
											second: "2-digit",
										})}
									</td>
									<td className="border border-septenary p-1 text-secondary text-sm">
										{history.description}
									</td>
									<td className="border border-septenary p-1 text-secondary text-sm">
										<TibiaCoins
											amount={history.coin_amount}
											type={history.coin_type}
										/>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</InnerContainer>
			<InnerContainer>
				<PaginationControls
					canGoToNextPage={canGoToNextPage}
					canGoToPreviousPage={canGoToPreviousPage}
					goToNextPage={goToNextPage}
					goToPreviousPage={goToPreviousPage}
					pagination={{
						...pagination,
						total: data?.meta?.totalPages,
					}}
				/>
			</InnerContainer>
		</Container>
	);
};
