import { MarketPair } from "@/@type/pair.type";
import Button from "@/components/common/Button";
import DrawerWrapper from "@/components/common/Drawer";
import ArrowIcons from "@/components/common/Icons/ArrowIcon";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
import { format } from "date-fns";
import Image from "next/image";
import { useCallback, useState } from "react";
import { DateRange } from "react-day-picker";
import AssetDrawer from "../../Components/AssetDrawer";
import CalendarDrawer from "../../Components/CalendarDrawer";

export enum STEP_FILTER {
	BEGIN = "BEGIN",
	ASSET = "ASSET",
	TIME_START = "START",
	TIME_EXPIRE = "EXPIRE",
}

type MainMenuProps = {
	openTime?: DateRange;
	expireTime?: DateRange;
	selectedPair?: MarketPair;
	handleChangeStep: (step: STEP_FILTER) => void;

	handleApply: () => void;
	handleResetFilter: () => void;
};

const MainMenu = ({
	selectedPair,
	handleChangeStep,
	openTime,
	expireTime,
	handleApply,
	handleResetFilter,
}: MainMenuProps) => {
	return (
		<>
			<p className="my-4 text-title-20">Filter by</p>
			<section className="flex flex-col gap-6">
				<section>
					<p className="text-body-14">Asset</p>
					<Button
						size="lg"
						variant="outline"
						point={false}
						className="min-w-[250px] w-full mt-2"
						onClick={() => handleChangeStep(STEP_FILTER.ASSET)}
					>
						<section className="w-full flex items-center justify-between gap-2">
							<div className="!text-body-14">
								{selectedPair ? (
									<div className="flex items-center gap-2">
										<Image
											className="size-5"
											src={selectedPair.token.attachment}
											width={20}
											height={20}
											alt="logo"
										/>
										<span className="text-typo-primary">
											{selectedPair?.asset}
										</span>
										<span className="text-typo-secondary"> / USDT</span>
									</div>
								) : (
									<span className="text-typo-secondary">Select asset</span>
								)}
							</div>
							<ChevronIcon className="size-4"/>
						</section>
					</Button>
				</section>
				{/* <section>
					<p className="text-body-14">T-Start</p>
					<Button
						size="lg"
						variant="outline"
						point={false}
						className="min-w-[250px] w-full mt-2"
						onClick={() => handleChangeStep(STEP_FILTER.TIME_START)}
					>
						<section className="flex items-center justify-between w-full text-body-14 select-none">
							<div className="text-ellipsis overflow-hidden max-w-52">
								{openTime?.from ? (
									openTime.to ? (
										<>
											{format(openTime.from, "LLL dd, y")} -{" "}
											{format(openTime.to, "LLL dd, y")}
										</>
									) : (
										format(openTime.from, "LLL dd, y")
									)
								) : (
									<span className="text-typo-secondary group-hover:text-typo-accent">
										Select time
									</span>
								)}
							</div>

							<CalendarIcon />
						</section>
					</Button>
				</section> */}
				<section>
					<p className="text-body-14">T-Expire</p>
					<Button
						size="lg"
						variant="outline"
						point={false}
						className="min-w-[250px] w-full mt-2"
						onClick={() => handleChangeStep(STEP_FILTER.TIME_EXPIRE)}
					>
						<section className="flex items-center justify-between w-full text-body-14">
							<div className="text-ellipsis overflow-hidden max-w-52">
								{expireTime?.from ? (
									expireTime.to ? (
										<>
											{format(expireTime.from, "LLL dd, y")} -{" "}
											{format(expireTime.to, "LLL dd, y")}
										</>
									) : (
										format(expireTime.from, "LLL dd, y")
									)
								) : (
									<span className="text-typo-secondary group-hover:text-typo-accent">
										Select time
									</span>
								)}
							</div>

							<CalendarIcon className="size-4" />
						</section>
					</Button>
				</section>
			</section>
			<Button
				size="lg"
				variant="primary"
				className="w-full justify-center mt-8"
				onClick={handleApply}
			>
				Apply
			</Button>
			<Button
				size="lg"
				variant="outline"
				className="w-full justify-center mt-4"
				onClick={handleResetFilter}
			>
				Reset filter
			</Button>
		</>
	);
};

type FilterMobileProps = {
	isOpen: boolean;
	handleOpenStatusChange: () => void;

	handleChangeAsset: (asset?: string) => void;
	handleChangeOpenTime: (range?: DateRange) => void;
	handleChangeExpireTime: (range?: DateRange) => void;
};

const Mobile = ({
	isOpen,
	handleOpenStatusChange,
	handleChangeAsset,
	handleChangeOpenTime,
	handleChangeExpireTime,
}: FilterMobileProps) => {
	const [selectedPair, setSelectedPair] = useState<MarketPair | undefined>(
		undefined
	);
	const handleSelectedPair = useCallback((pair: MarketPair) => {
		setSelectedPair(pair);
	}, []);

	const [openTime, setOpenTime] = useState<DateRange | undefined>(undefined);
	const [expireTime, setExpireTime] = useState<DateRange | undefined>(
		undefined
	);

	const [step, setStep] = useState(STEP_FILTER.BEGIN);

	const handleChangeStep = (step: STEP_FILTER) => {
		setStep(step);
	};

	const handleClose = () => {
		handleOpenStatusChange();
		setStep(STEP_FILTER.BEGIN);
	};

	const handleApply = () => {
		handleChangeAsset(selectedPair?.asset || "");
		handleChangeOpenTime(openTime);
		handleChangeExpireTime(expireTime);
		handleClose();
	};

	const handleResetFilter = () => {
		setSelectedPair(undefined);
		setOpenTime(undefined);
		setExpireTime(undefined);

		// Reset set filter
		handleChangeAsset(undefined);
		handleChangeOpenTime(undefined);
		handleChangeExpireTime(undefined);
		handleClose();
	};

	return (
		<DrawerWrapper
			isOpen={isOpen}
			handleOpenChange={handleClose}
			prefix={
				step !== STEP_FILTER.BEGIN && (
					<Button size="md" point={false} onClick={() => handleChangeStep(STEP_FILTER.BEGIN)}>
						<ArrowIcons className="rotate-180" />
					</Button>
				)
			}
			content={
				<>
					{step === STEP_FILTER.BEGIN && (
						<MainMenu
							selectedPair={selectedPair}
							handleChangeStep={handleChangeStep}
							openTime={openTime}
							expireTime={expireTime}
							handleApply={handleApply}
							handleResetFilter={handleResetFilter}
						/>
					)}
					{step === STEP_FILTER.ASSET && (
						<AssetDrawer
							selectedPair={selectedPair}
							handleSelectedPair={handleSelectedPair}
						/>
					)}
					{step === STEP_FILTER.TIME_START && (
						<CalendarDrawer
							onChange={(range) => {
								setOpenTime(range);
								setStep(STEP_FILTER.BEGIN);
							}}
							range={openTime}
							title="T-Start"
						/>
					)}
					{step === STEP_FILTER.TIME_EXPIRE && (
						<CalendarDrawer
							onChange={(range) => {
								setExpireTime(range);
								setStep(STEP_FILTER.BEGIN);
							}}
							range={expireTime}
							title="T-Expire"
						/>
					)}
				</>
			}
		/>
	);
};

export default Mobile;
