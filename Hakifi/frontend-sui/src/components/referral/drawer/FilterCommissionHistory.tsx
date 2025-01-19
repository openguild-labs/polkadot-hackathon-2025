import { DateRange } from "react-day-picker";
import {useState} from "react"
import CalendarDrawer from "@/components/BuyCover/Contract/Components/CalendarDrawer";
import DrawerWrapper from "@/components/common/Drawer";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import FormInput from "@/components/common/FormInput";
import SearchIcon from "@/components/common/Icons/SearchIcon";

type FilterCommissionHistoryProps = {
	searchTX: string;
	onChangeSearchTX: (e: React.FormEvent<HTMLInputElement>) => void;
	handleChangeDate: (range: DateRange | undefined) => void;
	date: DateRange | undefined;
};

const FilterCommissionHistory = ({
	handleChangeDate,
	date,
	searchTX,
	onChangeSearchTX,
}: FilterCommissionHistoryProps) => {
	const [open, setOpen] = useState(false);
	return (
		<div className="w-full flex items-center gap-x-3">
			<FormInput
				size="lg"
				value={searchTX}
				onChange={onChangeSearchTX}
				wrapperClassInput="w-full"
				suffixClassName="!border-none !py-0"
				placeholder="Search by wallet address"
				prefix={<SearchIcon className="size-4" />}
				classFocus=""
			/>
			<DrawerWrapper
				isOpen={open}
				handleOpenChange={() => setOpen((prev) => !prev)}
				content={
					<CalendarDrawer
						range={date}
						onChange={(range) => {
							handleChangeDate(range);
							setOpen((prev) => !prev);
						}}
						title="Select time"
					/>
				}
			>
				<button className="flex items-center text-sm justify-between w-max border py-1.5 rounded-md text-typo-secondary px-2 border-divider-secondary">
					<CalendarIcon />
				</button>
			</DrawerWrapper>
		</div>
	);
};

export default FilterCommissionHistory;
