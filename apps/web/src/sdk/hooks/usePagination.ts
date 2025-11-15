import { useCallback, useMemo, useState } from "react";

export const usePagination = ({
	initialPage = 1,
	initialSize = 10,
}: {
	initialPage?: number;
	initialSize?: number;
}) => {
	const [pagination, setPagination] = useState<{
		page: number;
		size: number;
	}>({
		page: initialPage,
		size: initialSize,
	});

	return {
		pagination,
		setPagination,
	};
};

export const usePaginationControls = ({
	pagination,
	setPagination,
	totalItems,
	totalPages,
}: {
	pagination: { page: number; size: number };
	setPagination: React.Dispatch<
		React.SetStateAction<{ page: number; size: number }>
	>;
	totalItems?: number;
	totalPages?: number;
}) => {
	const canGoToPreviousPage = useMemo(
		() => pagination.page > 1,
		[pagination.page],
	);
	const canGoToNextPage = useMemo(() => {
		return totalPages !== undefined
			? pagination.page < totalPages
			: totalItems !== undefined
				? pagination.page * pagination.size < totalItems
				: true;
	}, [pagination.page, pagination.size, totalItems, totalPages]);

	const goToPreviousPage = useCallback(() => {
		if (!canGoToPreviousPage) return;

		setPagination((prev) => ({
			...prev,
			page: prev.page - 1,
		}));
	}, [canGoToPreviousPage, setPagination]);

	const goToNextPage = useCallback(() => {
		if (!canGoToNextPage) return;

		setPagination((prev) => ({
			...prev,
			page: prev.page + 1,
		}));
	}, [canGoToNextPage, setPagination]);

	return {
		canGoToPreviousPage,
		canGoToNextPage,
		goToPreviousPage,
		goToNextPage,
	};
};
