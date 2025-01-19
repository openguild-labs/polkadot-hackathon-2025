import AccordionCustom from "@/components/common/Accordion/Custom";
import TooltipCustom from "@/components/common/Tooltip";
import useTicker from "@/hooks/useTicker";
import { informula } from "@/lib/informula";
import useBuyCoverStore from "@/stores/buy-cover.store";
import useInsuranceStore from "@/stores/insurance.store";
import { cn } from "@/utils";
import { HEDGE_INIT } from "@/utils/constant";
import { formatNumber } from "@/utils/format";
import { ENUM_INSURANCE_SIDE, PERIOD_UNIT } from "hakifi-formula";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { STEP } from ".";
import styles from "./styles/Loader.module.scss";
type StepStepWaiting = {
	asset: string;
	setStep: (step: STEP) => void;
};

const StepWaiting = ({ asset, setStep }: StepStepWaiting) => {
	const { symbol } = useParams();
	const ticker = useTicker(symbol as string);
	const p_market = ticker?.lastPrice || 0;

	const [
		q_claim,
		q_covered,
		margin,
		period,
		periodUnit,
		hedge,
		periodChangeRatio,
		p_claim,
		side,
		unit,
	] = useBuyCoverStore((state) => [
		state.q_claim,
		state.q_covered,
		state.margin,
		state.period,
		state.periodUnit,
		state.hedge,
		state.periodChangeRatio,
		state.p_claim,
		state.side,
		state.unit,
	]);

	const general = useMemo(() => {
		let getQClaim = 0;
		try {
			getQClaim = informula.calculateQClaim({
				hedge: Number(hedge) || HEDGE_INIT,
				day_change_token: Number(periodChangeRatio),
				margin: Number(margin),
				p_claim: Number(p_claim),
				p_open: p_market,
				period_unit: periodUnit as PERIOD_UNIT,
			});
		} catch (error) {
			// throw error
		}
		const _q_claim = getQClaim || 0;
		const _r_claim = (_q_claim / margin) * 100 || 0;

		const profit = _q_claim - margin;
		const _r_profit = (profit / Number(margin)) * 100;

		return {
			q_claim: _q_claim || q_claim || 0,
			r_claim: _r_claim,
			profit,
			r_profit: _r_profit,
		};
	}, [p_claim, p_market]);

	const insurance = useInsuranceStore((state) => state.insuranceSelected);

	useEffect(() => {
		if (insurance) {
			setStep(STEP.SUCCESS);
		}
	}, [insurance]);

	return (
		<section className="flex flex-col items-center gap-5">
			<Image
				src="/assets/images/icons/SandClockIcon.png"
				width={125}
				height={125}
				alt="waiting"
			/>
			<div className="text-typo-primary text-title-20 sm:text-title-24">
				<div className="flex items-end justify-starts">
					<p className="text-typo-primary">Processing...</p>
					{/* <div className={styles.loader}>
						<div className={styles.ball}></div>
						<div className={styles.ball}></div>
						<div className={styles.ball}></div>
					</div> */}
				</div>
				{/* Waiting for{" "}
        <span
          className={cn(
            "text-title-24",
            side === ENUM_INSURANCE_SIDE.BULL
              ? "text-positive-label"
              : "text-negative-label",
          )}
        >
          {asset} {side}
        </span>{" "}
        contract margin */}
			</div>

			<section className="border-divider-secondary flex w-full flex-col gap-3 rounded border p-4">
				<div className="text-body-14 flex justify-between">
					<p className="text-typo-secondary">Estimated profit</p>
					<p className="text-positive">
						{formatNumber(general.profit)} USDT (
						{formatNumber(general.r_profit)}%)
					</p>
				</div>
				<div className="flex items-center justify-between text-body-14">
					<p className="text-typo-secondary">Claim amount</p>
					<div className="text-body-14 flex items-center gap-1">
						<p className="text-typo-primary">
							{formatNumber(general.q_claim)} USDT
						</p>{" "}
						<span className="text-positive">
							({formatNumber(general.r_claim)}%)
						</span>
					</div>
				</div>
			</section>
			<AccordionCustom
				labelClassName="w-full"
				content={
					<section className="flex flex-col gap-4">
						<div className="flex items-center justify-between text-body-14">
							<p className="text-typo-secondary">Insured Value</p>

							<p className=" text-typo-primary">
								{formatNumber(q_covered)} USDT
							</p>
						</div>
						<div className="flex items-center justify-between text-body-14">
							<p className="text-typo-secondary">Claim price</p>
							<div className="text-body-14">
								<span className="text-typo-primary">
									{formatNumber(p_claim)} USDT{" "}
									<span className="text-typo-accent">
										({formatNumber(general.r_profit)}%)
									</span>
								</span>
							</div>
						</div>
						<div className="flex items-center justify-between text-body-14">
							<p className="text-typo-secondary">Period</p>

							<p className="text-typo-primary">
								{period} {periodUnit}
							</p>
						</div>
					</section>
				}
			>
				<p className="text-body-14">Detail</p>
			</AccordionCustom>
		</section>
	);
};

export default StepWaiting;
