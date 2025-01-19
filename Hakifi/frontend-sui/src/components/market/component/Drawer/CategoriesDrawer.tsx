import FilterIcon from "@/components/common/Icons/FilterIcon";
import ListOptionFilterMarket from "../ListOptionFilterMarket";
import DrawerFilterWrapper from "@/components/common/Drawer";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
import { TCategory } from "@/@type/pair.type";
import ArrowIcons from "@/components/common/Icons/ArrowIcon";

type TProps = {
	isOpen: boolean;
	handleOpen: () => void;
	handleClose: () => void;
	handleChooseCategories: (category: any) => void;
	categories: { value: number; label: string }[];
	data: { label: string; value: number }[];
};

const CategoriesDrawer = ({
	isOpen,
	handleOpen,
	handleClose,
	handleChooseCategories,
	categories,
	data,
}: TProps) => {
	return (
		<DrawerFilterWrapper
			isOpen={isOpen}
			handleOpenChange={handleOpen}
			classNameTitle="!text-title-24 text-typo-primary"
			title={isOpen ? "" : "Filter by"}
			content={
				<ListOptionFilterMarket
					listOption={data}
					handleChoose={handleChooseCategories}
					title="Category"
					listChoose={categories}
				/>
			}
			prefix={
				<button onClick={handleClose}>
					<ArrowIcons className="rotate-180" />
				</button>
			}>
			<div
				onClick={() => handleOpen()}
				className="text-typo-secondary text-xs font-medium font-saira flex items-center justify-between p-3 border border-solid bg-support-black border-divider-secondary rounded">
				{categories?.length > 0 ? (
					<div className="flex w-80 overflow-x-auto no-scrollbar ">
						{categories.map((option, index, arr) => (
							<span key={index} className="mr-1 min-w-max">
								{option.label}
								{index !== arr.length - 1 && ","}
							</span>
						))}
					</div>
				) : (
					"Select categories"
				)}
				<ChevronIcon />
			</div>
		</DrawerFilterWrapper>
	);
};

export default CategoriesDrawer;
