import { FormValue } from "@/@type/common.type";
import { PairDetail } from "@/@type/pair.type";
import Button from "@/components/common/Button";
import CheckIcon from "@/components/common/Icons/CheckIcon";
import ContractIcon from "@/components/common/Icons/ContractIcon";
import TooltipCustom from "@/components/common/Tooltip";
import useBalance from "@/hooks/useBalance";
import { useIsTablet } from "@/hooks/useMediaQuery";
import { Ticker, useTickerSocket } from "@/hooks/useTickerSocket";
import useAppStore from "@/stores/app.store";
import useBuyCoverStore from "@/stores/buy-cover.store";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/format";
import { useWallet } from "@suiet/wallet-kit";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";
import { useParams } from "next/navigation";
import { memo, useMemo, useState } from "react";
import { Controller, UseFormReturn, useFormState } from "react-hook-form";
import BasicInformationForm from "./BasicInformationForm";
import ClaimInput from "./ClaimInput";
import CoverAmountInput from "./CoverAmountInput";
import MarginInput from "./MarginInput";
import ModeInput from "./ModeInput";

type FormBuyCoverProps = {
	pair: PairDetail;
	pClaimRange: {
		min: number;
		max: number;
	} | null;
	form: UseFormReturn<FormValue>;
	handleToggleModalDetail: () => void;
	handleConfirmAction: () => void;
};

const FormBuyCover = ({
	pClaimRange,
	pair,
	form,
	handleToggleModalDetail,
	handleConfirmAction,
}: FormBuyCoverProps) => {
	const isTablet = useIsTablet();
	const { connected } = useWallet();
	const { toggleConnectWalletModal } = useAppStore();
	const { toggleFormBuyCover } = useBuyCoverStore();
	const { symbol } = useParams();
	const [p_claim, q_covered, margin, period, q_claim, side] = useBuyCoverStore(
		(state) => [
			state.p_claim,
			state.q_covered,
			state.margin,
			state.period,
			state.q_claim,
			state.side,
		]
	);

	const handleToggleConnectWallet = () => {
		toggleFormBuyCover(false);

		toggleConnectWalletModal(true);
	};

	const [ticker, setTicker] = useState<Ticker | null>(null);
	useTickerSocket(symbol, setTicker);
	const p_market = useMemo(() => ticker?.lastPrice, [ticker]);

	const profit = q_claim ? q_claim - margin : 0;
	const pnl_spot = useMemo(() => {
		if (p_market && p_claim)
			return -((q_covered / p_market) * Math.abs(+p_claim - p_market));
		return 0;
	}, [p_claim, q_covered, p_market]);

	const modalTitle = useMemo(() => {
		const expect = side === ENUM_INSURANCE_SIDE.BULL ? "Bull" : "Bear";
		return expect;
	}, [side]);

	const { balance } = useBalance();
	const { isValid } = useFormState({
		control: form.control,
	});

	const isDisableBuyCover = useMemo(() => {
		return balance === 0 || !isValid;
	}, [balance, isValid]);
	const marginRangeValidate = useMemo(() => {
		if (balance === 0) return "Invalid balance";
		const minMargin = balance === 0 ? 0 : q_covered * 0.02;
		const maxMargin = balance > q_covered * 0.1 ? q_covered * 0.1 : balance;
		if (margin < minMargin)
			return `Margin must be greater than ${formatNumber(minMargin)}`;
		if (margin > maxMargin)
			return `Margin must be less than ${formatNumber(maxMargin)}`;
	}, [q_covered, balance, margin]);

	return (
		<>
			<section data-tour="place-order" className="flex flex-col gap-6">
				{!isTablet ? (
					<Controller
						name="side"
						render={({ field }) => <ModeInput {...field} />}
					/>
				) : (
					<p className="text-title-20 lg:text-title-24 text-left">
						<span
							className={cn(
								side === ENUM_INSURANCE_SIDE.BULL
									? "text-positive-label"
									: "text-negative-label"
							)}>
							{modalTitle}
						</span>{" "}
						Insurance contract
					</p>
				)}

				<BasicInformationForm pair={pair} setValue={form.setValue} />

				<section className="grid grid-cols-2 gap-3">
					<Controller
						name="q_covered"
						render={({ field, fieldState }) => (
							<CoverAmountInput
								{...field}
								setValue={form.setValue}
								errorMessage={fieldState.error?.message}
							/>
						)}
					/>
					<Controller
						name="margin"
						render={({ field, fieldState }) => (
							<MarginInput
								{...field}
								setValue={form.setValue}
								errorMessage={marginRangeValidate}
							/>
						)}
					/>
				</section>

				<Controller
					name="p_claim"
					render={({ field: { onChange, onBlur, value }, fieldState }) => (
						<ClaimInput
							value={value}
							onChange={onChange}
							onBlur={onBlur}
							min={pClaimRange?.min || 0}
							max={pClaimRange?.max || 0}
							setValue={form.setValue}
							errorMessage={fieldState.error?.message}
						/>
					)}
				/>
			</section>

			<section data-tour="confirm-order" className="!mt-6">
				<section className="border-divider-primary rounded border">
					<section className="bg-background-secondary text-body-14 text-typo-accent rounded-t p-3">
						Insurance benefit
					</section>
					<section className="flex flex-col gap-4 px-3 py-4 bg-support-black rounded-b">
						<section className="flex items-center justify-between">
							<div className="flex items-center gap-1">
								<CheckIcon className="size-4" />
								<TooltipCustom
									content={
										<p>
											Insurance payment value. When the market price reaches
											Claim price of{" "}
											<span
												className={cn(
													side === ENUM_INSURANCE_SIDE.BULL
														? "text-positive"
														: "text-negative"
												)}>
												{formatNumber(p_claim)}
											</span>{" "}
											USDT, a payment of{" "}
											<span className="text-positive">
												{formatNumber(q_claim)}
											</span>{" "}
											USDT will be automatically transferred to your wallet
										</p>
									}
									title={
										<p className="border-typo-secondary text-body-14 !text-typo-secondary border-b border-dashed">
											Claim amount
										</p>
									}
									showArrow={true}
								/>
							</div>
							<div className="flex items-center gap-2">
								<p className="text-body-12 bg-background-primary text-typo-primary rounded-sm px-1 py-0.5">
									+{q_claim ? formatNumber((q_claim / margin) * 100) : 0}%
								</p>
								<p className="text-body-14 text-typo-primary">
									{q_claim ? formatNumber(q_claim) : "-"} USDT
								</p>
							</div>
						</section>
						<section className="flex items-center justify-between">
							<div className="flex items-center gap-1">
								<CheckIcon className="size-4" />
								<TooltipCustom
									content={
										<>
											<div className="flex items-center">
												<p className="w-80">
													Profit from insurance payment
												</p>
												<p className="whitespace-nowrap">
													{formatNumber(profit)} USDT
												</p>
											</div>
										</>
									}
									contentClassName="!max-w-[330px]"
									title={
										<p className="border-typo-secondary text-body-14 !text-typo-secondary border-b border-dashed">
											Profit
										</p>
									}
									showArrow={true}
								/>
							</div>
							<p className="text-body-14 text-typo-primary">
								Save {formatNumber(profit)} USDT
							</p>
						</section>
					</section>
				</section>

				{/* Submit button */}
				{connected ? (
					<Button
						variant={isTablet ? "custom" : "primary"}
						size="lg"
						type="submit"
						disabled={isDisableBuyCover}
						onClick={form.handleSubmit(handleConfirmAction)}
						className={cn(
							"my-4 w-full justify-center",
							!isDisableBuyCover &&
							!isTablet &&
							side === ENUM_INSURANCE_SIDE.BULL &&
							"sm:hover:!bg-positive-label sm:hover:!text-typo-primary",
							!isDisableBuyCover &&
							!isTablet &&
							side === ENUM_INSURANCE_SIDE.BEAR &&
							"sm:hover:!bg-negative-label sm:hover:!text-typo-primary",
							!isDisableBuyCover &&
							isTablet &&
							side === ENUM_INSURANCE_SIDE.BULL &&
							"bg-positive-label !text-typo-primary",
							!isDisableBuyCover &&
							isTablet &&
							side === ENUM_INSURANCE_SIDE.BEAR &&
							"bg-negative-label !text-typo-primary"
						)}
						pointClassName="!bg-support-white">
						Buy cover
					</Button>
				) : (
					<Button
						variant="primary"
						size="lg"
						type="button"
						onClick={handleToggleConnectWallet}
						className={cn(
							"my-4 w-full justify-center",
							isTablet &&
							side === ENUM_INSURANCE_SIDE.BULL &&
							"bg-positive-label !text-typo-primary",
							isTablet &&
							side === ENUM_INSURANCE_SIDE.BEAR &&
							"bg-negative-label !text-typo-primary"
						)}
						pointClassName="!bg-support-white">
						Connect wallet
					</Button>
				)}

				<div className="flex items-center gap-1 text-body-14 mt-6 w-max text-typo-secondary">
					<ContractIcon />
					<div


						className="border-b border-dashed border-typo-secondary cursor-pointer"
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							handleToggleModalDetail();
						}}>
						Insurance contract detail
					</div>
				</div>
			</section>
		</>
	);
};

export default memo(FormBuyCover);
