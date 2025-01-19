import AccordionCustom from '@/components/common/Accordion/Custom';
import Button from '@/components/common/Button';
import ClipboardIcon from '@/components/common/Icons/ClipboardIcon';
import { useNotification } from '@/components/common/Notification';
import useInsuranceStore from '@/stores/insurance.store';
import { cn } from '@/utils';
import { formatNumber } from '@/utils/format';
import { copyToClipboard, shortenHexString } from '@/utils/helper';
import { ENUM_INSURANCE_SIDE } from 'hakifi-formula';
import Image from 'next/image';
import { useMemo, useRef } from 'react';
import { CountdownWrapper } from '../../Contract/utils';

type StepSuccessProps = {
    onCloseModal: () => void;
};

const StepSuccess = ({ onCloseModal }: StepSuccessProps) => {
    const [insurance, plans] = useInsuranceStore(state => [state.insuranceSelected, state.plans]);

    // const insurance = {
    //     "stateLogs": [],
    //     "metadata": null,
    //     "id": "6597bfadc94e3f0072a371be",
    //     "userId": "6582bc6fc164706407c904cd",
    //     "txhash": "0xd748e76daad7c88647ce2993a23518786254385ff07f5dc14d218d192f7bcbc5",
    //     "asset": "BNB",
    //     "unit": "USDT",
    //     "margin": 3.75,
    //     "q_claim": 6.604435737527461,
    //     "q_covered": 75,
    //     "p_open": 318.84,
    //     "p_close": null,
    //     "p_liquidation": 299.4432,
    //     "p_claim": 331.86,
    //     "p_refund": 320.4342,
    //     "p_cancel": 326.1471,
    //     "leverage": 16,
    //     "periodChangeRatio": 0.04,
    //     "hedge": 0.05,
    //     "systemCapital": 1.710999247271359,
    //     "invalidReason": null,
    //     "period": 1,
    //     "periodUnit": "DAY",
    //     "state": "AVAILABLE",
    //     "side": "BULL",
    //     "isTransferBinance": false,
    //     "expiredAt": "2024-01-06T08:37:16.417Z",
    //     "closedAt": null,
    //     "createdAt": "2024-01-05T08:37:01.366Z",
    //     "updatedAt": "2024-01-05T08:37:16.424Z"
    // };

    const notifications = useNotification();
    const q_claim = Number(insurance?.q_claim) || 0;
    const p_claim = Number(insurance?.p_claim) ?? 0;
    const p_open = Number(insurance?.p_open) ?? 0;
    const p_liquidation = Number(insurance?.p_liquidation) ?? 0;
    const period = Number(insurance?.period) || 1;
    const margin = Number(insurance?.margin) || 0;
    const side = insurance?.side || ENUM_INSURANCE_SIDE.BULL;
    const asset = insurance?.asset || '';
    const txhash = insurance?.txhash || '';
    const periodUnit = insurance?.periodUnit || '';

    const t_expired = useMemo(() => {
        return insurance?.expiredAt ? new Date(insurance?.expiredAt) : new Date();
    }, [insurance]);

    const copyTooltipRef = useRef<any>();
    const handleCopy = () => {
        copyToClipboard(txhash as string);
        copyTooltipRef.current?.toggle(true);

        notifications.success("Copied");
    };

    const [toggleDetailModal] = useInsuranceStore(state => [
        state.toggleDetailModal
    ]);

    const pr_claim = useMemo(() => {
        return ((Number(p_claim) - Number(p_open)) / Number(p_open)) * 100;
    }, [p_claim, p_open]);

    const qr_claim = useMemo(() => {
        return (Number(q_claim) / Number(margin)) * 100;
    }, [q_claim, margin]);

    const pr_liquidation = useMemo(() => {
        return ((Number(p_liquidation) - Number(p_open)) / Number(p_open)) * 100;
    }, [p_liquidation, p_open]);

    const hashId = useMemo(() => {
        return shortenHexString(txhash as string, 12, 4);
    }, [txhash]);

    const predict_profit = useMemo(() => {
        const profit = Number(q_claim) - Number(margin);
        const ratio = ((Number(q_claim) - Number(margin)) / Number(margin)) * 100;
        return {
            profit, ratio
        };
    }, [p_liquidation, p_open]);

    const pack = useMemo(() => plans.find((item) => item.id === insurance?.q_cover_pack_id), [plans, insurance]);
    const timeframe = useMemo(() => {
        return `${period} ${periodUnit}${period > 1 ? "s" : ""}`;
    }, [period, periodUnit]);

    const handleMoreDetailAction = () => {
        onCloseModal();
        toggleDetailModal();
    };

    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <Image
                width={124}
                height={124}
                quality={100}
                src="/assets/images/icons/SuccessIcon.png"
                alt="waiting_contract"
                className="mt-5"
            />
            <section className="text-title-24 text-center">
                <p className="text-typo-primary">
                    Contract <span className={cn(side === ENUM_INSURANCE_SIDE.BULL ? "text-positive-label" : "text-negative-label")}>{asset} {side}</span>
                </p>
                <p className="text-typo-primary">
                    successfully margined <span className="text-positive">{formatNumber(margin)} USDT</span>
                </p>
            </section>
            <section className="border border-divider-secondary rounded flex flex-col gap-3 p-4 w-full">
                <div className="flex justify-between text-body-14">
                    <p className="text-typo-secondary">HashID</p>
                    <div className="flex items-center gap-1">
                        <p className="text-typo-primary">{hashId}</p>
                        <Button
                            size="sm"
                            onClick={handleCopy}
                        >
                            <ClipboardIcon className="size-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between text-body-14">
                    <p className="text-typo-secondary">Estimated profit</p>
                    <p className="text-positive">
                        {formatNumber(predict_profit.profit)} USDT ({formatNumber(predict_profit.ratio)}%)
                    </p>
                </div>
                <div className="flex items-center justify-between text-body-14">
                    <p className="text-typo-secondary">Claim amount</p>
                    <div className="flex items-center gap-1">
                        <p className="text-typo-primary">{formatNumber(q_claim)} USDT</p> <span className="text-positive">({formatNumber(qr_claim)}%)</span>
                    </div>
                </div>
            </section>
            <AccordionCustom
                labelClassName="w-full"
                content={
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between text-body-14">
                            <p className="text-typo-secondary">Insurance Plan</p>

                            <p className=" text-typo-primary text-body-14">
                                {pack?.name}
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-body-14">
                            <p className="text-typo-secondary">Open price</p>
                            <p className="text-typo-primary">
                                {formatNumber(p_open)} USDT
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-body-14">
                            <p className="text-typo-secondary">Claim price</p>


                            <span className="text-typo-primary">{formatNumber(p_claim)} USDT <span className="text-typo-accent">({formatNumber(pr_claim)}%)</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-body-14">
                            <p className="text-typo-secondary">Liquid. price</p>

                            <span className="text-typo-primary">{formatNumber(p_liquidation)} USDT    <span className="text-typo-accent">({formatNumber(pr_liquidation)}%)
                            </span>
                            </span>

                        </div>
                        <div className="flex items-center justify-between text-body-14">
                            <p className="text-typo-secondary">
                                Period
                            </p>

                            <p className="text-typo-primary lowercase">{timeframe}</p>
                        </div>
                        <div className="flex items-center justify-between text-body-14">
                            <p className="text-typo-secondary">
                                Expires in
                            </p>

                            <CountdownWrapper date={t_expired} />
                        </div>
                    </section>
                }
            >
                <p className="text-body-14">Detail</p>
            </AccordionCustom>

            <section className="flex flex-col gap-4 w-full">
                <Button size="lg" onClick={handleMoreDetailAction} variant="primary" className="justify-center">
                    See detail
                </Button>

                <Button size="lg" variant="outline" className="justify-center">
                    Share
                </Button>
            </section>
        </div>
    );
};

export default StepSuccess;