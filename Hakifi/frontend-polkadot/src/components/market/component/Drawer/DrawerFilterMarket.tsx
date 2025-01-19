import Button from "@/components/common/Button";
import DrawerFilterWrapper from "@/components/common/Drawer";
import FilterIcon from "@/components/common/Icons/FilterIcon";
import { cn } from "@/utils";
import { forwardRef, useEffect } from "react";
import CategoriesDrawer from "./CategoriesDrawer";
import SortDrawer from "./SortDrawer";
import SortTypeDrawer from "./SortTypeDrawer";
import { TCategory } from "@/@type/pair.type";

type DrawerFilterMarket = {
	isOpen: boolean;
	sort: any;
	categories: any[];
	sortType: any;
	openCategory: boolean;
	openSort: boolean;
	openSortType: boolean;
	handleClose: () => void;
	handleOpen: () => void;
	handleOpenCategory: () => void;
	handleCloseCategories: () => void;
	handleOpenSort: () => void;
	handleCloseSort: () => void;
	handleChooseSort: (sort: any) => void;
	handleResetFilter: () => void;
	handleChooseCategories: (category: any) => void;
	handleOpenSortType: () => void;
	handleCloseSortType: () => void;
	handleChooseSortType: (sortType: any) => void;
	handleConfirm: () => void;
	dataCategories: { label: string; value: number }[];
};

const DrawerFilterMarket = forwardRef<HTMLButtonElement, DrawerFilterMarket>(
	(
		{
			isOpen,
			openCategory,
			handleClose,
			handleOpenCategory,
			handleOpenSort,
			sort,
			categories,
			handleChooseCategories,
			handleCloseCategories,
			openSort,
			handleCloseSort,
			handleChooseSort,
			openSortType,
			handleCloseSortType,
			handleChooseSortType,
			handleOpenSortType,
			sortType,
			handleResetFilter,
			handleOpen,
			handleConfirm,
			dataCategories,
		},
		forwardRef
	) => {
		return (
			<DrawerFilterWrapper
				isOpen={isOpen}
				handleOpenChange={() => {
					if (isOpen) {
						handleClose();
						handleResetFilter();
					} else {
						handleOpen();
					}
				}}
				classNameTitle="!text-title-24 text-typo-primary"
				title={isOpen ? "" : "Filter by"}
				content={
					<section
						className={cn("pt-5 relative min-h-80 h-max")}
					>
						<div className={cn("flex flex-col gap-y-5 w-full h-max")}>
							<p className="text-xl">Filter by</p>
							<div className="">
								<p className="text-sm mb-2 font-saira font-medium text-typo-primary">
									Categories
								</p>
								<CategoriesDrawer
									isOpen={openCategory}
									handleOpen={() => {
										return openCategory === true
											? handleCloseCategories()
											: handleOpenCategory();
									}}
									handleClose={handleCloseCategories}
									handleChooseCategories={handleChooseCategories}
									categories={categories}
									data={dataCategories}
								/>
							</div>
							<div className="w-full">
								<p className="text-sm w-full text-start mb-2 font-saira font-medium text-typo-primary">
									Contract Data
								</p>
								<SortDrawer
									isOpen={openSort}
									handleOpen={() => {
										return openSort === true
											? handleCloseSort()
											: handleOpenSort();
									}}
									handleClose={handleCloseSort}
									handleChooseSort={handleChooseSort}
									type={"favorite"}
									sort={sort}
								/>
							</div>
							{sort?.label ? (
								<div className="w-full">
									<p className="text-sm w-full text-start mb-2 font-saira font-medium text-typo-primary">
										Arrange
									</p>
									<SortTypeDrawer
										isOpen={openSortType}
										handleOpen={() => {
											return openSortType === true
												? handleCloseSortType()
												: handleOpenSortType();
										}}
										handleClose={handleCloseSortType}
										handleChooseSortType={handleChooseSortType}
										sortType={sortType}
										sort={sort}
									/>
								</div>
							) : null}
							<Button
								size="lg"
								variant="primary"
								className={cn("w-full justify-center")}
								onClick={handleConfirm}
							>
								Confirm
							</Button>
							<Button
								size="lg"
								variant="outline"
								className={cn("w-full justify-center")}
								onClick={handleResetFilter}
							>
								Reset filter
							</Button>
						</div>
					</section>
				}
			>
				<button onClick={handleOpen} ref={forwardRef} className="">
					<FilterIcon />
				</button>
			</DrawerFilterWrapper>
		);
	}
);

export default DrawerFilterMarket;
