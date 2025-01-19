import Modal from '@/components/common/Modal';
import useBuyCoverStore from '@/stores/buy-cover.store';
import { cn } from '@/utils';
import { formatNumber, formatTime } from '@/utils/format';
import { compNumber } from '@/utils/helper';
import { ENUM_INSURANCE_SIDE } from 'hakifi-formula';
import { useParams } from 'next/navigation';
import { memo, useMemo } from 'react';

type ModalInsuranceDetailProps = {
    isOpen: boolean;
    handleCloseModal: () => void;
};

const Detail = ({ isOpen, handleCloseModal }: ModalInsuranceDetailProps) => {
    const handleOnCloseModal = () => {
        handleCloseModal();
    };
    const [p_open, expiredAt, margin, period, q_claim, side, unit, periodUnit, p_claim, p_refund, p_expire] =
        useBuyCoverStore((state) => [
            state.p_open,
            state.expiredAt,
            state.margin,
            state.period,
            state.q_claim,
            state.side,
            state.unit,
            state.periodUnit,
            state.p_claim,
            state.p_refund,
            state.p_liquidation
        ]);

    const { symbol } = useParams();
    const asset = useMemo(() => (symbol as string).split(unit)[0], [symbol]);

    const profit = q_claim ? q_claim - margin : 0;

    return (
        <Modal
            modal={true}
            isOpen={isOpen}
            isMobileFullHeight
            onRequestClose={handleOnCloseModal}
            // descriptionClassName="-mr-4"
            useDrawer={false}
        >
            <>
                <p className="text-title-20 lg:text-title-24 text-typo-primary">
                    <span className={cn(side === ENUM_INSURANCE_SIDE.BULL ? "text-positive-label" : "text-negative-label")}>{asset} {side}</span> Contract Information
                </p>
                <section className="flex flex-col gap-5">
                    <section className="border border-divider-secondary rounded p-4 flex flex-col gap-4 bg-support-black">
                        <section className="flex items-center justify-between text-body-14">
                            <p className="text-typo-secondary">Estimated profit</p>
                            <p className="text-typo-primary">{formatNumber(profit)} USDT</p>
                        </section>
                        <section className="flex items-center justify-between text-body-14">
                            <p className="text-typo-secondary">Open price</p>
                            <p className="text-typo-primary">{formatNumber(p_open)} USDT</p>
                        </section>
                        <section className="flex items-center justify-between text-body-14">
                            <p className="text-typo-secondary">Period</p>
                            <p className="text-typo-primary">{period} <span className="lowercase">{periodUnit}</span></p>
                        </section>
                    </section>
                    <section className="border border-typo-accent rounded">
                        <p className="bg-background-secondary text-typo-accent text-body-14 py-3 px-4 rounded-t">
                            During the contract period, market price is:
                        </p>
                        <section className="p-4 bg-support-black rounded-b">
                            <ul className="list-disc marker:text-typo-accent pl-4 flex flex-col md:gap-4 gap-3">
                                <li className="">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-typo-primary text-body-14">Between {formatNumber(compNumber(p_refund as number, p_claim || 0, true))} - {formatNumber(p_claim)}</p>
                                        <p className="text-typo-secondary text-body-14">Click 'Cancel' at 'Available contract' section to get margin refund.</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-typo-primary text-body-14">Reaches {formatNumber(p_claim)}</p>
                                        <p className="text-typo-secondary text-body-14">Get insurance payment after 15 minutes of reaching.</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-typo-primary text-body-14">Reaches {formatNumber(p_expire)}</p>
                                        <p className="text-typo-secondary text-body-14">Contract will be liquidated.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </section>
                    <section className="border border-typo-accent rounded">
                        <p className="bg-background-secondary text-typo-accent text-body-14 py-3 px-4 rounded-t">
                            When contract expires at {formatTime(expiredAt || new Date())}, close price is:
                        </p>
                        <section className="p-4 bg-support-black rounded-b">
                            <ul className="list-disc marker:text-typo-accent pl-4 flex flex-col md:gap-4 gap-3">
                                <li className="">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-typo-primary text-body-14">Between {formatNumber(p_refund)} - {formatNumber(p_claim)}</p>
                                        <p className="text-typo-secondary text-body-14">Get margin refund.</p>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-typo-primary text-body-14">Between {formatNumber(p_refund)} - {formatNumber(p_expire)}</p>
                                        <p className="text-typo-secondary text-body-14">Contract will be liquidated.</p>
                                    </div>
                                </li>
                            </ul>
                        </section>
                    </section>
                </section>
            </>
        </Modal>
    );
};

export default memo(Detail);