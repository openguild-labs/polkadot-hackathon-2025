"use client";

import CoinListWrapper from "@/components/common/Accordion/CoinItem";
import Button from "@/components/common/Button";
import DatePicker from "@/components/common/Calendar/DatePicker";
import { DateRangePicker } from "@/components/common/Calendar/DateRangPicker";
import Checkbox from "@/components/common/Checkbox";
import Copy from "@/components/common/Copy";
import DataTable from "@/components/common/DataTable";
import DropdownWrapper from "@/components/common/Dropdown";
import FormInput from "@/components/common/FormInput";
import FormInputNumber from "@/components/common/FormInput/InputNumber";
import ArrowUpDownIcon from "@/components/common/Icons/ArrowUpDownIcon";
import BarIcons from "@/components/common/Icons/BarsIcons";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import CandleIcon from "@/components/common/Icons/CandleIcon";
import CheckIcon from "@/components/common/Icons/CheckIcon";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
import CloseIcon from "@/components/common/Icons/CloseIcon";
import ContractIcon from "@/components/common/Icons/ContractIcon";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import OtpInput from "@/components/common/InputOTP";
import Modal from "@/components/common/Modal";
import { useNotification } from "@/components/common/Notification";
import Pagination from "@/components/common/Pagination";
import SelectCustom from "@/components/common/Select";
import SelectSearch from "@/components/common/Select/SelectSearch";
import Spinner from "@/components/common/Spinner";
import TagStatus from "@/components/common/TagStatus";
import ToggleSwitch from "@/components/common/ToggleSwitch";
import TooltipCustom from "@/components/common/Tooltip";
import useToggle from "@/hooks/useToggle";
import { cn } from "@/utils";
import { STATE_INSURANCES } from "@/utils/constant";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Image from "next/image";
import {
	ChangeEvent,
	ReactElement,
	useCallback,
	useMemo,
	useState,
} from "react";
import { DateRange } from "react-day-picker";

type Payment = {
	id: string;
	amount: number;
	status: "pending" | "processing" | "success" | "failed";
	email: string;
};

const payments: Payment[] = [
	{
		id: "728ed52f",
		amount: 100,
		status: "pending",
		email: "m@example.com",
	},
	{
		id: "489e1d42",
		amount: 125,
		status: "processing",
		email: "example@gmail.com",
	},
	// ...
];

const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: "status",
		header: "Status",
		meta: {
			width: 800,
		},
	},
	{
		accessorKey: "email",
		header: "Email",
		meta: {
			width: 800,
		},
	},
	{
		accessorKey: "amount",
		header: "Amount",
		meta: {
			width: 800,
		},
	},
];

export default function Guide() {
	const notication = useNotification();
	const renderSuffix = useCallback(() => {
		return (
			<div className="text-body-14 flex items-center">
				<span className="mr-1">{"USDT"}</span>
				<Button size="md" variant="ghost" className="!p-0">
					<ChevronIcon />
				</Button>
			</div>
		) as ReactElement;
	}, []);

	// const {
	// 	containerRef,
	// 	container_id,
	// 	chartReady,
	// 	chart,
	// 	widget,
	// 	setIntervalChart,
	// 	handleChangeIndicator,
	// 	indicator,
	// } = useChart("BNBUSDT");

	// Dropdown
	const colors = useMemo(
		() => [
			{ value: "ocean", label: "Ocean" },
			{ value: "blue", label: "Blue" },
			{ value: "purple", label: "Purple" },
			{ value: "red", label: "Red" },
			{ value: "orange", label: "Orange" },
			{ value: "yellow", label: "Yellow" },
		],
		[]
	);
	const [color, setColor] = useState<{ value: string; label: string; }>(
		colors[0]
	);
	const onChangeColor = (value: string) => {
		setColor(colors.find((item) => item.value === value) || colors[0]);
	};

	// Checkbox
	const [checked, setChecked] = useState<boolean>(false);
	const onChangeChecked = (event: ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};
	// Date picker
	const [date, setDate] = useState<Date | undefined>(undefined);

	// Date range picker
	const [rangeTime, setRangeTime] = useState<DateRange | undefined>(undefined);
	const [toggleSwitch, setToggleSwitch] = useState<boolean>(false);
	const { handleToggle, toggle } = useToggle();

	const handleOnSuccessNotification = () => {
		notication.success("Connected successfull!");
	};
	const [otp, setOtp] = useState("");
	return (
		<div>
			<DropdownWrapper
				label={color.label}
				size="lg"
				content={colors}
				onChange={onChangeColor}
				defaultValue={color.value}
			/>

			<SelectCustom
				options={[
					{ value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
					{ value: "blue", label: "Blue", color: "#0052CC", isDisabled: true },
					{ value: "purple", label: "Purple", color: "#5243AA" },
					{ value: "red", label: "Red", color: "#FF5630", isFixed: true },
					{ value: "orange", label: "Orange", color: "#FF8B00" },
					{ value: "yellow", label: "Yellow", color: "#FFC400" },
					{ value: "green", label: "Green", color: "#36B37E" },
					{ value: "forest", label: "Forest", color: "#00875A" },
					{ value: "slate", label: "Slate", color: "#253858" },
					{ value: "silver", label: "Silver", color: "#666666" },
				]}
				defaultValue={[
					{ value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
				]}
				value={{ value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true }}
			/>

			{/* Input Section */}
			<section className="flex gap-4 items-center flex-wrap">
				<FormInput
					placeholder="Search by Id"
					size="md"
					prefix={<SearchIcon className="h-4 w-4" />}
				/>
				<FormInputNumber
					placeholder="Error input message"
					size="md"
					label="Input Label"
					wrapperClassLabel="border-b border-dashed border-typo-secondary"
					suffix={renderSuffix()}
					errorMessage="This is a dummy text for error content"
				/>
				<FormInputNumber
					placeholder="Warning input message"
					size="md"
					label="Input Label"
					suffix={renderSuffix()}
					warning={true}
				/>
			</section>

			{/* Modal section */}
			<section className="flex items-center gap-4 flex-wrap">
				<Button size="md" variant="outline" onClick={() => handleToggle()}>
					Open Modal
				</Button>
				<Modal
					isOpen={toggle}
					onRequestClose={handleToggle}
					isMobileFullHeight={false}
					showCloseButton={true}
					className="text-typo-primary"
					// onInteractOutside={(e) => {
					//     e.preventDefault();
					// }}
					modal={true}
					contentClassName={cn("z-[52]")}
					overlayClassName={cn("z-[51]")}
				>
					<section className="flex flex-col justify-center items-center gap-5 text-center">
						<Image
							src="/assets/images/icons/email_icon.png"
							width={80}
							height={80}
							className=""
							alt="email icon"
						/>

						<section>
							<div className="text-title-24 text-typo-primary">
								Nhận thông báo
							</div>
							<div className="text-body-14 text-typo-secondary">
								Nhập địa chỉ email để nhận thông báo
							</div>
						</section>

						{/* Input Section */}
						<section className="flex gap-4 items-center flex-wrap">
							<FormInput
								placeholder="Search by Id"
								size="md"
								prefix={<SearchIcon className="size-4" />}
							/>
							<FormInputNumber
								placeholder="Error input message"
								size="md"
								label="Input Label"
								wrapperClassLabel="border-b border-dashed border-typo-secondary"
								suffix={renderSuffix()}
								errorMessage="This is a dummy text for error content"
							/>
							<FormInputNumber
								placeholder="Warning input message"
								size="md"
								label="Input Label"
								suffix={renderSuffix()}
								warning={true}
							/>
						</section>
						<section className="flex gap-4 items-center">
							<Button variant="primary" size="lg">
								Component Button Primary
							</Button>
							<Button variant="ghost" size="lg">
								Component Button Ghost
							</Button>
						</section>
						<section className="grid grid-cols-6 gap-4">
							<ArrowUpDownIcon />
							<BarIcons />
							<CalendarIcon />
							<CandleIcon />
							<CheckIcon />
							<ChevronIcon />
							<CloseIcon />
							<ContractIcon />
						</section>
					</section>
				</Modal>
				{/* Button section */}
				<section className="flex items-center gap-4 flex-wrap">
					<Button variant="outline" size="lg">
						Component Button Outline
					</Button>
					<Button variant="primary" size="lg">
						Component Button Primary
					</Button>
					<Button variant="ghost" size="lg">
						Component Button Ghost
					</Button>
				</section>

				{/* Tooltip */}
				<TooltipCustom
					content={<div>Abc</div>}
					titleClassName="text-[#FFFFFF]"
					title={<div className="text-[#FFFFFF]">ABCSD</div>}
					showArrow={true}
				/>

				{/* Dropdown */}
				<DropdownWrapper
					label={color.label}
					size="lg"
					content={colors}
					onChange={onChangeColor}
					defaultValue={color.value}
				/>

				{/* Input Section */}
				<section className="flex gap-4 items-center flex-wrap">
					<FormInput
						placeholder="Search by Id"
						size="md"
						prefix={<SearchIcon className="h-4 w-4" />}
					/>
					<FormInputNumber
						placeholder="Error input message"
						size="md"
						label="Input Label"
						wrapperClassLabel="border-b border-dashed border-typo-secondary"
						suffix={renderSuffix()}
						errorMessage="This is a dummy text for error content"
					/>
					<FormInputNumber
						placeholder="Warning input message"
						size="md"
						label="Input Label"
						suffix={renderSuffix()}
						warning={true}
					/>
				</section>

				{/* Modal section */}
				<section className="flex items-center gap-4 flex-wrap">
					<Button size="md" variant="outline" onClick={() => handleToggle()}>
						Open Modal
					</Button>
					<Modal
						isOpen={toggle}
						onRequestClose={handleToggle}
						isMobileFullHeight={false}
						showCloseButton={true}
						className="text-typo-primary"
						// onInteractOutside={(e) => {
						//     e.preventDefault();
						// }}
						modal={true}
						contentClassName={cn("z-[52]")}
						overlayClassName={cn("z-[51]")}
					>
						<section className="flex flex-col justify-center items-center gap-5 text-center">
							<Image
								src="/assets/images/icons/email_icon.png"
								width={80}
								height={80}
								className=""
								alt="email icon"
							/>

							<section>
								<div className="text-title-24 text-typo-primary">
									Nhận thông báo
								</div>
								<div className="text-body-14 text-typo-secondary">
									Nhập địa chỉ email để nhận thông báo
								</div>
							</section>

							{/* Input Section */}
							<section className="flex gap-4 items-center flex-wrap">
								<FormInput
									placeholder="Search by Id"
									size="md"
									prefix={<SearchIcon className="size-4" />}
								/>
								<FormInputNumber
									placeholder="Error input message"
									size="md"
									label="Input Label"
									wrapperClassLabel="border-b border-dashed border-typo-secondary"
									suffix={renderSuffix()}
									errorMessage="This is a dummy text for error content"
								/>
								<FormInputNumber
									placeholder="Warning input message"
									size="md"
									label="Input Label"
									suffix={renderSuffix()}
									warning={true}
								/>
							</section>
							<section className="flex gap-4 items-center">
								<Button variant="primary" size="lg">
									Component Button Primary
								</Button>
								<Button variant="ghost" size="lg">
									Component Button Ghost
								</Button>
							</section>
						</section>
					</Modal>
				</section>

				{/* Toggle button */}
				<ToggleSwitch
					onChange={() => setToggleSwitch(!toggleSwitch)}
					defaultValue={toggleSwitch}
				/>

				{/* Calender section */}
				<section className="flex items-center gap-4 flex-wrap">
					<DatePicker date={date} onChange={(date: Date) => setDate(date)}>
						<Button variant="outline" size="lg">
							Date Picker ( {date ? format(date, "yyyy - MM - dd") : ""} )
						</Button>
					</DatePicker>

					<DateRangePicker onChange={setRangeTime} range={rangeTime}>
						<Button variant="outline" size="lg" className="group">
							<section className="flex items-center gap-2">
								{rangeTime?.from ? (
									rangeTime.to ? (
										<>
											{format(rangeTime.from, "LLL dd, y")} -{" "}
											{format(rangeTime.to, "LLL dd, y")}
										</>
									) : (
										format(rangeTime.from, "LLL dd, y")
									)
								) : (
									"Date Time range"
								)}

								<CalendarIcon
									className={cn("group-hover:[&>path]:fill-background-primary")}
								/>
							</section>
						</Button>
					</DateRangePicker>
				</section>

				{/* Table section */}
				<section className="flex items-center gap-4 w-full">
					<DataTable columns={columns} data={payments} />
				</section>

				{/* Checkbox */}
				<section className="flex items-center gap-4 w-full">
					<Checkbox
						label="Checkbox lg"
						checked={checked}
						onChange={onChangeChecked}
					/>
					<Checkbox
						label="Checkbox md"
						size="md"
						checked={checked}
						onChange={onChangeChecked}
					/>
				</section>

				{/* TV chart */}
				{/* <section className="h-[600px] w-full">
				<div
					ref={containerRef as React.RefObject<HTMLDivElement>}
					id={container_id as string}
					className={cn("", "h-full")}
				/>*/}
			</section>

			{/* Notification */}
			<section className="flex items-center gap-4 flex-wrap">
				<Button
					variant="outline"
					size="lg"
					onClick={handleOnSuccessNotification}
				>
					Successfully Notification
				</Button>
			</section>

			{/* CoinList mobile */}
			<section className="flex items-center gap-4 flex-wrap">
				<CoinListWrapper
					labelClassName="w-[300px]"
					content={
						<section>
							<div className="flex items-center justify-between text-body-12">
								<p className="text-typo-secondary">Category</p>
								<p className="text-typo-accent">Layer 1</p>
							</div>
							<Button
								variant="primary"
								size="lg"
								className="w-full mt-5 justify-center"
								onClick={handleOnSuccessNotification}
							>
								Successfully Notification
							</Button>
						</section>
					}
				>
					<section className="flex items-center gap-2 w-full">
						<Image
							src='/assets/images/wallets/metamask.svg'
							width={24}
							height={24}
							alt="logo"
						/>
						<div className="text-body-12 flex flex-col items-start">
							<p>BTC/USDT</p>
							<p>Bitcoin</p>
						</div>
						<Button
							variant="primary"
							size="lg"
							className="w-full mt-5 justify-center"
							onClick={handleOnSuccessNotification}
						>
							Successfully Notification
						</Button>
					</section>
					<section className="flex items-center gap-2 w-full">
						<Image
							src='/assets/images/wallets/metamask.svg'
							width={24}
							height={24}
							alt="logo"
						/>
						<div className="text-body-12 flex flex-col items-start">
							<p>BTC/USDT</p>
							<p>Bitcoin</p>
						</div>
					</section>
				</CoinListWrapper>
			</section>

			{/* Status tag */}
			{Object.keys(STATE_INSURANCES).map((item) => (
				<div key={item}>
					<TagStatus status={item as keyof typeof STATE_INSURANCES} />
				</div>
			))}

			{/* Status tag */}
			{Object.keys(STATE_INSURANCES).map((item) => (
				<div key={item}>
					<TagStatus status={item as keyof typeof STATE_INSURANCES} />
				</div>
			))}
			{/* Pagination */}
			<Pagination
				onPreviousPage={function (): void {
					throw new Error("Function not implemented.");
				}}
				canPreviousPage={false}
				onNextPage={function (): void {
					throw new Error("Function not implemented.");
				}}
				pageIndex={1}
				pageCount={10}
				canNextPage={false}
				setPageIndex={function (page: number): void {
					throw new Error("Function not implemented.");
				}}
			/>

			{/* Spinner */}
			<div className="relative">
				<Spinner size="xs" />
			</div>

			{/* Copy button */}
			<Copy prefix="Copy" styleContent="" text="Copy" />

			{/* Otp input */}
			<OtpInput value={otp} onChange={(value) => setOtp(value)} />
			<div className="max-w-20">
				<SelectSearch
					size="lg"
					value={"purple"}
					options={colors}
					placeholder={"Select"}
					onChange={(value) => console.log(value)}
				/>
			</div>

		</div>
	);
}
