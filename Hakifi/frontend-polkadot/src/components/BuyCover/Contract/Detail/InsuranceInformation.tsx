"use client";

import { statusDefined } from "@/components/common/TagStatus";
import TooltipCustom from "@/components/common/Tooltip";
import useTicker from "@/hooks/useTicker";
import { cn } from "@/utils";
import { ORDER_STATUS } from "@/utils/constant";
import { formatNumber, formatTime } from "@/utils/format";
import { useMemo } from "react";
import { InsuranceInformation } from ".";
import TickerWrapper from "../../Favorites/TickerWrapper";
import { PnlWrapper, TimeAgoInsurance } from "../utils";
import useInsuranceStore from "@/stores/insurance.store";

type InsuranceProps = {
    insurance: InsuranceInformation;
    className?: string;
};

export const OpeningInsurance = ({ insurance, className }: InsuranceProps) => {
    const ticker = useTicker(`${insurance.asset}USDT`);
    const p_market = ticker?.lastPrice || 0;
    const { plans } = useInsuranceStore();

    const qclaim_ratio = useMemo(() => {
        if (insurance.q_claim && insurance.margin)
            return formatNumber((insurance.q_claim / insurance.margin) * 100);
        return 0;
    }, [insurance]);

    const plan = useMemo(() => {
        return plans.find(item => item.id === insurance.q_cover_pack_id) || plans[0];
    }, [insurance]);

    const pclaim_ratio = useMemo(() => {
        if (insurance.p_claim)
            return {
                ratio: formatNumber(Math.abs((p_market - insurance.p_claim) / p_market) * 100),
                isIncrease: insurance.p_claim > p_market
            };
        return {
            ratio: 0,
            isIncrease: true
        };
    }, [insurance, p_market]);

    const pexpire_ratio = useMemo(() => {
        if (insurance.p_liquidation)
            return {
                ratio: formatNumber(Math.abs((p_market - insurance.p_liquidation) / p_market) * 100),
                isIncrease: insurance.p_liquidation > p_market
            };
        return {
            ratio: 0,
            isIncrease: true
        };
    }, [insurance.p_liquidation, p_market]);

    return <section className={cn("flex flex-col gap-4", className)}>

        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Select the appropriate insurance plan that aligns with the value of the assets you wish to protect</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Insurance plan</p>}
                showArrow={true}
            />

            <div className="text-typo-primary">{plan?.name}</div>
        </div>
        {/* <div className="flex items-center justify-between text-body-12">
            <div className="text-body-14 !text-typo-secondary text-body-14">Side</div>
            <div className={cn("text-body-12 text-typo-primary rounded-sm px-3 py-1", insurance.side === ENUM_INSURANCE_SIDE.BULL ? "bg-positive-label" : "bg-negative-label")}>{insurance.side}</div>
        </div> */}
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Margin to open an insurance contract</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Margin</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.margin)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Insurance payment value</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Claim amount</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.q_claim)} {insurance.unit} <span className="text-positive">({qclaim_ratio}%)</span></div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Duration of insurance contract</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Period</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{insurance.period} {insurance.periodUnit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Contract opening time</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Opened at</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatTime(insurance.openTime)}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Initial scheduled contract expiring time</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Scheduled Expiration</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatTime(insurance.expireTime)}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Contract opening price</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Open price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_open)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>The current price of the insured asset</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Market price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">
                <TickerWrapper jump symbol={`${insurance.asset}${insurance.unit}`} suffix={insurance.unit} showPercent={false} />
            </div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>The price triggering insurance payment</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Claim price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_claim)} {insurance.unit} <span className={cn(pclaim_ratio.isIncrease ? "text-positive" : "text-negative")}>({pclaim_ratio.ratio}%)</span></div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>The price within the margin refund zone</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Refund price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_refund)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>The price triggering contract liquidation</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Liquid. price</p>}
                showArrow={true}
            />

            <div className="text-typo-primary">{formatNumber(insurance.p_liquidation)} {insurance.unit} <span className={cn(pexpire_ratio.isIncrease ? "text-positive" : "text-negative")}>({pexpire_ratio.ratio}%)</span></div>
        </div>
    </section>;
};

export const HistoryInsurance = ({ insurance, className }: InsuranceProps) => {
    const { plans } = useInsuranceStore();
    const qclaim_ratio = useMemo(() => {
        if (insurance.q_claim && insurance.margin)
            return formatNumber((insurance.q_claim / insurance.margin) * 100);
        return 0;
    }, [insurance]);

    const plan = useMemo(() => {
        return plans.find(item => item.id === insurance.q_cover_pack_id) || plans[0];
    }, [insurance]);

    const pclaim_ratio = useMemo(() => {
        if (insurance.p_claim && insurance.p_close)
            return {
                ratio: formatNumber(Math.abs((insurance.p_close - insurance.p_claim) / insurance.p_close) * 100),
                isIncrease: insurance.p_claim > insurance.p_close
            };
        return {
            ratio: 0,
            isIncrease: true
        };
    }, [insurance.p_close, insurance.p_claim]);

    const pexpire_ratio = useMemo(() => {
        if (insurance.p_liquidation && insurance.p_close)
            return {
                ratio: formatNumber(Math.abs((insurance.p_close - insurance.p_liquidation) / insurance.p_close) * 100),
                isIncrease: insurance.p_liquidation > insurance.p_close
            };
        return {
            ratio: 0,
            isIncrease: true
        };
    }, [insurance.p_liquidation, insurance.p_close]);

    const statusInfo = useMemo(() => {
        return statusDefined?.[insurance.status];
    }, [insurance.status, statusDefined]);

    return <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-body-14">
            <div className="text-typo-secondary text-body-14">{statusInfo?.title} time</div>
            <div className="text-typo-primary">{formatTime(insurance.closeTime)}</div>
        </div>

        <div className="flex items-center justify-between text-body-14">
            <div className="text-typo-secondary text-body-14">Elapsed time</div>
            <TimeAgoInsurance insurance={insurance} className="text-typo-primary" />
        </div>

        {
            insurance.invalidReason && <div className="flex items-center justify-between text-body-14">
                <div className="text-typo-secondary text-body-14">Reason</div>
                <div className="text-typo-primary">{insurance.invalidReason}</div>
            </div>
        }
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Select the appropriate insurance plan that aligns with the value of the assets you wish to protect</p>}
                title={<p className="border-b border-dashed border-divider-secondary text-body-14 !text-typo-secondary">Insurance plan</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{plan?.name}</div>
        </div>
        {/* <div className="flex items-center justify-between text-body-14">
            <div className="text-typo-secondary text-body-14">Side</div>
            <div className={cn("text-body-12 text-typo-primary rounded-sm px-2", insurance.side === ENUM_INSURANCE_SIDE.BULL ? "bg-positive-label" : "bg-negative-label")}>{insurance.side}</div>
        </div> */}
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Margin to open an insurance contract</p>}
                title={<p className="border-b border-dashed border-divider-secondary text-body-14 !text-typo-secondary">Margin</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.margin)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Insurance payment value</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Claim amount</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.q_claim)} {insurance.unit} <span className="text-positive">({qclaim_ratio}%)</span></div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <div className="text-typo-secondary text-body-14">PnL</div>
            <PnlWrapper margin={insurance.margin as number} q_claim={insurance.q_claim as number} state={insurance.state as string} />
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Duration of insurance contract</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Period</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{insurance.period} {insurance.periodUnit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Contract opening time</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Opened at</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatTime(insurance.openTime)}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Initial scheduled contract expiring time</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Scheduled Expiration</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatTime(insurance.expireTime)}</div>
        </div>
        {insurance.status === ORDER_STATUS.CANCELLED && <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Contract cancellation time</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Closed at</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatTime(insurance.closeTime)}</div>
        </div>}
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Contract opening price</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Open price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_open)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Contract closing price</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Close price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_close)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>The price triggering insurance payment</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Claim price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_claim)} {insurance.unit} <span className={cn(pclaim_ratio.isIncrease ? "text-positive" : "text-negative")}>({pclaim_ratio.ratio}%)</span></div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>The price within the margin refund zone</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Refund price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_refund)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>The price triggering contract liquidation</p>}
                title={<p className="text-body-14 !text-typo-secondary border-b border-dashed border-divider-secondary">Liquid. price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_liquidation)} {insurance.unit} <span className={cn(pexpire_ratio.isIncrease ? "text-positive" : "text-negative")}>({pexpire_ratio.ratio}%)</span></div>
        </div>

    </section>;
};