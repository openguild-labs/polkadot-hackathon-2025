import ListOptionFilterMarket from "../ListOptionFilterMarket";
import DrawerFilterWrapper from "@/components/common/Drawer";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
import { useMemo } from "react";
import {
	DATA_SORT_FAVORITE,
	DATA_SORT_HOT,
	DATA_SORT_POLICY,
} from "../../constants";

type TProps = {
	isOpen: boolean;
	handleOpen: () => void;
	handleClose: () => void;
	handleChooseSortType: (category: any) => void;
	sortType: any;
	sort: any;
};

const SortTypeDrawer = ({
	isOpen,
	handleOpen,
	handleClose,
	handleChooseSortType,
	sortType,
	sort,
}: TProps) => {
	const dataSort = useMemo(() => {
		switch (sort.value) {
			case "pair": {
				return [
					{
						value: "asc",
						label: "A to Z",
					},
					{
						value: "desc",
						label: "Z to A",
					},
				];
			}
			default: {
				return [
					{
						value: "asc",
						label: "Ascending",
					},
					{
						value: "desc",
						label: "Decrease",
					},
				];
			}
		}
	}, []);
	return (
		<DrawerFilterWrapper
			isOpen={isOpen}
			handleOpenChange={handleOpen}
			classNameTitle="!text-title-24 text-typo-primary"
			title={isOpen ? "" : "Filter by"}
			content={
				<ListOptionFilterMarket
					listOption={dataSort}
					handleChoose={handleChooseSortType}
					title="Contract Data"
					listChoose={sortType ? [sortType] : []}
				/>
			}
		>
			<button
				onClick={() => handleOpen()}
				className=" text-xs font-medium font-saira flex items-center w-full justify-between p-3 border border-solid border-divider-secondary rounded"
			>
				{sortType?.label || "Default"}
				<ChevronIcon />
			</button>
		</DrawerFilterWrapper>
	);
};

export default SortTypeDrawer;
