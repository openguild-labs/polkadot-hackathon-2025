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
import StatusDropdown from "../StatusDropdown";
import { STATE_INSURANCES } from "@/utils/constant";
import Modal from "@/components/common/Modal";

export enum STEP_FILTER {
	BEGIN = "BEGIN",
	ASSET = "ASSET",
	STATUS = "STATUS",
	TIME_START = "START",
	TIME_EXPIRE = "EXPIRE",
}

type MainMenuProps = {
	// openTime?: DateRange;
	expireTime?: DateRange;
	status?: string;
	selectedPair?: MarketPair;
	handleChangeStep: (step: STEP_FILTER) => void;
	handleApply: () => void;
	handleResetFilter: () => void;
};

const MainMenu = ({
	selectedPair,
	handleChangeStep,
	expireTime,
	handleApply,
	handleResetFilter,
	status,
}: MainMenuProps) => {
	return (
		<>
			<p className="text-title-20 mb-5 font-medium">Filter by</p>
			<section>
				<section className="flex flex-col gap-6">
					<section>
						<p className="text-body-14">Asset</p>
						<Button
							size="lg"
							variant="outline"
							point={false}
							className="min-w-[250px] w-full mt-2"
							onClick={() => handleChangeStep(STEP_FILTER.ASSET)}>
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
								<ChevronIcon />
							</section>
						</Button>
					</section>
					<section>
						<p className="text-body-14">Status</p>
						<Button
							size="lg"
							variant="outline"
							point={false}
							className="min-w-[250px] w-full mt-2"
							onClick={() => handleChangeStep(STEP_FILTER.STATUS)}>
							<section className="w-full flex items-center justify-between gap-2">
								<div className="!text-body-14">
									{status ? (
										<p>{STATE_INSURANCES[status]}</p>
									) : (
										<span className="text-typo-secondary">Select status</span>
									)}
								</div>
								<ChevronIcon />
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
                        <section className="flex items-center justify-between w-full text-body-14">
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
                                    <span className="text-typo-secondary group-hover:text-typo-accent">Select time</span>
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
							onClick={() => handleChangeStep(STEP_FILTER.TIME_EXPIRE)}>
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

								<CalendarIcon className="lg:w-6 lg:h-6 w-4 h-4" />
							</section>
						</Button>
					</section>
				</section>
				<Button
					size="lg"
					variant="primary"
					className="w-full justify-center mt-8"
					onClick={handleApply}>
					Apply
				</Button>
				<Button
					size="lg"
					variant="outline"
					className="w-full justify-center mt-4"
					onClick={handleResetFilter}>
					Reset filter
				</Button>
			</section>
		</>
	);
};

type FilterMobileProps = {
	isOpen: boolean;
	handleOpenStatusChange: () => void;
	handleChangeAsset: (asset?: string) => void;
	handleChangeStatus: (status?: string) => void;
	// handleChangeOpenTime: (range?: DateRange) => void;
	handleChangeExpireTime: (range?: DateRange) => void;
};

const Mobile = ({
	isOpen,
	handleOpenStatusChange,
	handleChangeAsset,
	handleChangeExpireTime,
	handleChangeStatus,
}: FilterMobileProps) => {
	const [selectedPair, setSelectedPair] = useState<MarketPair | undefined>(
		undefined
	);
	const [status, setStatus] = useState<string | undefined>(undefined);
	const handleSelectedPair = useCallback((pair: MarketPair) => {
		setSelectedPair(pair);
	}, []);

	const [openTime, setOpenTime] = useState<DateRange | undefined>(undefined);
	const handleOnChangeOpenTime = useCallback((date: DateRange) => {
		setOpenTime(date);
		handleChangeStep(STEP_FILTER.BEGIN);
	}, []);
	const [expireTime, setExpireTime] = useState<DateRange | undefined>(
		undefined
	);
	const handleOnChangeExpireTime = useCallback((date: DateRange) => {
		setExpireTime(date);
		handleChangeStep(STEP_FILTER.BEGIN);
	}, []);

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
		handleChangeStatus(status);
		handleChangeExpireTime(expireTime);
		handleClose();
	};

	const handleResetFilter = () => {
		setSelectedPair(undefined);
		setOpenTime(undefined);
		setExpireTime(undefined);

		// Reset
		handleChangeAsset(undefined);
		handleChangeStatus(undefined);
		handleChangeExpireTime(undefined);
		handleClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={handleClose}
			contentClassName="overflow-hidden px-4"
			prefix={
				step !== STEP_FILTER.BEGIN && (
					<Button size="md" onClick={() => handleChangeStep(STEP_FILTER.BEGIN)}>
						<ArrowIcons className="rotate-180" />
					</Button>
				)
			}
			useDrawer={false}>
			<>
				{step === STEP_FILTER.BEGIN && (
					<MainMenu
						selectedPair={selectedPair}
						handleChangeStep={handleChangeStep}
						expireTime={expireTime}
						status={status}
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
				{step === STEP_FILTER.STATUS && (
					<StatusDropdown
						status={status}
						handleSetStatus={(status: string | undefined) => setStatus(status)}
					/>
				)}
				{/* {
                    step === STEP_FILTER.TIME_START && <CalendarDrawer onChange={handleOnChangeOpenTime} range={openTime} title="T-Start" />
                } */}
				{step === STEP_FILTER.TIME_EXPIRE && (
					<CalendarDrawer
						onChange={handleOnChangeExpireTime}
						range={expireTime}
						title="T-Expire"
					/>
				)}
			</>
		</Modal>
	);
};

export default Mobile;
