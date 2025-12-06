import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PaginationControls } from "@/components/Pagination";
import {
	usePagination,
	usePaginationControls,
} from "@/sdk/hooks/usePagination";
import { api } from "@/sdk/lib/api/factory";
import { cn } from "@/sdk/utils/cn";
import { Container } from "@/ui/Container";
import { InnerContainer } from "@/ui/Container/Inner";
import { Section } from "@/ui/Section";
import { SectionHeader } from "@/ui/Section/Header";
import { InnerSection } from "@/ui/Section/Inner";
import { Tooltip } from "@/ui/Tooltip";

export const ListAccounts = () => {
	const { pagination, setPagination } = usePagination({
		initialPage: 1,
		initialSize: 10,
	});
	const { data, refetch, isFetching } = useQuery(
		api.query.miforge.admin.accounts.list.queryOptions({
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

	const accounts = data?.results ?? [];

	const roles = [
		"GUEST",
		"PLAYER",
		"TUTOR",
		"SENIOR_TUTOR",
		"GAME_MASTER",
		"ADMIN",
	];

	return (
		<Section>
			<SectionHeader color="green">
				<h1 className="section-title">Management</h1>
			</SectionHeader>
			<InnerSection className="p-2">
				<Container
					title="Accounts"
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
									Name
								</th>
								<th className="border border-septenary p-1 text-start font-bold text-secondary">
									Email
								</th>
								<th className="w-[15%] border border-septenary p-1 text-start font-bold text-secondary">
									Role
								</th>
								<th className="w-[10%] border border-septenary p-1 text-start font-bold text-secondary">
									Action
								</th>
							</thead>
							<tbody>
								{accounts.map((account, index) => {
									return (
										<tr
											key={`${account.id}-${index}`}
											className="bg-tibia-900 even:bg-tibia-600"
										>
											<td className="border border-septenary p-1 text-center">
												<span className="font-bold text-secondary text-sm">
													{index + 1}.
												</span>
											</td>
											<td className="border border-septenary p-1 text-secondary text-sm">
												<p>{account.name}</p>
											</td>
											<td className="border border-septenary p-1 text-secondary text-sm">
												{account.email}
											</td>
											<td className="border border-septenary p-1 text-secondary text-sm">
												<p>{roles[account.type]}</p>
											</td>
											<td className="border border-septenary p-1 text-secondary text-sm">
												[
												<Link
													disabled={true}
													to="/"
													className={"font-bold text-blue-900 underline"}
												>
													Detailis
												</Link>
												]
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
			</InnerSection>
		</Section>
	);
};
