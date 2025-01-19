import { useIsMobile } from "@/hooks/useMediaQuery";
import ChevronIcon from "../Icons/ChevronIcon";
import { cn } from "@/utils";

type TProps = {
	onPreviousPage: () => void;
	canPreviousPage: boolean;
	onNextPage: () => void;
	pageIndex: number;
	pageCount: number;
	canNextPage: boolean;
	setPageIndex: (page: number) => void;
	limit?: number;
	className?: string;
};

const Pagination = ({
	onPreviousPage,
	onNextPage,
	canNextPage,
	canPreviousPage,
	pageCount,
	pageIndex,
	setPageIndex,
	limit = 10,
	className
}: TProps) => {
	const { totalPages, startPage, endPage, pages } = GetPager(
		pageCount * limit,
		pageIndex,
		limit,
		5
	);
	if (totalPages <= 1) return null;
	return (
		<section className={cn("flex w-full justify-end", className)}>
			<div
				className={cn(
					"flex w-fit items-center justify-end  text-typo-secondary gap-x-1 text-sm",
					{ "pointer-events-none": totalPages <= 1 }
				)}>
				<button
					className={cn(
						"lg:h-6 w-7 h-7 lg:w-6 border border-divider-secondary flex items-center justify-center rounded-sm",
						{
							"hover:border-typo-accent hover:bg-background-secondary hover:cursor-pointer":
								canPreviousPage,
							"hover:cursor-not-allowed": canPreviousPage === false,
						}
					)}
					onClick={onPreviousPage}
					disabled={canPreviousPage === false}>
					<ChevronIcon
						className={cn("h-4 w-4 rotate-90", {
							"opacity-30": canPreviousPage === false,
						})}
					/>
				</button>

				{startPage > 1 && (
					<>
						<button
							className={cn(
								"!bg-support-black text-typo-secondary border-divider-secondary hover:border-typo-accent border hover:bg-background-secondary hover:cursor-pointer lg:h-6 size-7 lg:w-8 lg:text-body-14 text-body-12",
								{
									"!text-typo-accent !border-typo-accent": pageIndex + 1 === 1,
								}
							)}
							onClick={() => setPageIndex(0)}>
							1
						</button>
						{startPage >= 2 && <div>...</div>}
					</>
				)}
				{pages.map((page, index) => {
					const isSelected = pageIndex + 1 === page;

					return (
						<button
							key={index}
							className={cn(
								"bg-support-black text-typo-secondary border rounded-[2px] border-divider-secondary hover:border-typo-accent hover:text-typo-accent hover:bg-background-secondary hover:cursor-pointer lg:h-6 size-7 lg:w-8 lg:text-body-14 text-body-12",
								{
									"!text-typo-accent !border-typo-accent !bg-background-secondary":
										isSelected,
								}
							)}
							onClick={() => setPageIndex(page - 1)}>
							{page}
						</button>
					);
				})}
				{endPage < totalPages - 1 && <div>...</div>}
				{endPage < totalPages && (
					<>
						<button
							className={cn(
								"!bg-support-black lg:w-8 lg:h-6 size-7 text-typo-secondary border rounded-[2px] border-divider-secondary min-h-6 min-w-6 hover:text-typo-accent hover:bg-background-secondary hover:cursor-pointer lg:text-body-14 text-body-12",
								{
									" !border-typo-accent !text-typo-accent":
										pageIndex === totalPages,
								}
							)}
							onClick={() =>
								pageCount <= totalPages ? setPageIndex(totalPages - 1) : null
							}>
							{totalPages}
						</button>
					</>
				)}

				<button
					className={cn(
						"lg:h-6 w-7 h-7 lg:w-6 rounded-sm border border-divider-secondary flex items-center justify-center",
						{
							"hover:border-typo-accent hover:bg-background-secondary hover:cursor-pointer":
								canNextPage,
							"hover:cursor-not-allowed": !canNextPage,
						}
					)}
					onClick={() => onNextPage()}
					disabled={!canNextPage}>
					<ChevronIcon
						className={cn("h-4 w-4 -rotate-90", !canNextPage && "opacity-30")}
					/>
				</button>
			</div>
		</section>
	);
};
function GetPager(
	totalItems: number,
	currentPage: number,
	pageSize: number,
	paginationSize: number
) {
	const totalPages = Math.ceil(totalItems / pageSize);

	let startPage, endPage;

	if (totalPages <= paginationSize) {
		startPage = 1;
		endPage = totalPages;
	} else {
		const distance = Math.floor(paginationSize / 2);

		if (currentPage <= distance + 1) {
			startPage = 1;
			endPage = paginationSize;
		} else if (currentPage + distance >= totalPages) {
			startPage = totalPages - paginationSize + 1;
			endPage = totalPages;
		} else {
			startPage = currentPage - distance;
			endPage = currentPage + distance;
		}
	}

	const pages: number[] = [];
	if (
		currentPage >= 4 &&
		totalPages > paginationSize &&
		currentPage < totalPages - 1
	) {
		for (let i = currentPage - 1; i <= currentPage + 2; i++) {
			pages.push(i);
		}
	} else if (currentPage < totalPages) {
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}
	}

	return {
		totalPages,
		startPage,
		endPage,
		pages,
	};
}

export default Pagination;
