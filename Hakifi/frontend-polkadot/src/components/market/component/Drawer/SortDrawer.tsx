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
	handleChooseSort: (category: any) => void;
	type: string;
	sort: any;
};

const SortDrawer = ({
	isOpen,
	handleOpen,
	handleClose,
	handleChooseSort,
	sort,
	type,
}: TProps) => {
	const dataSort = useMemo(() => {
		switch (type) {
			case "favorite": {
				return DATA_SORT_FAVORITE;
			}
			case "hot": {
				return DATA_SORT_HOT;
			}
			default: {
				return DATA_SORT_POLICY;
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
					handleChoose={handleChooseSort}
					title="Contract Data"
					listChoose={sort ? [sort] : []}
				/>
			}
		>
			<button
				onClick={handleOpen}
				className="text-typo-secondary  bg-support-black text-xs font-medium font-saira flex items-center w-full justify-between p-3 border border-solid border-divider-secondary rounded"
			>
				{sort?.label || "Default"}
				<ChevronIcon />
			</button>
		</DrawerFilterWrapper>
	);
};

export default SortDrawer;
