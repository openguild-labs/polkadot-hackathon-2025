import { Insurance } from '@/@type/insurance.type';
import Button from '@/components/common/Button';
import ClipboardIcon from '@/components/common/Icons/ClipboardIcon';
import { useNotification } from '@/components/common/Notification';
import { Separator } from '@/components/common/Separator';
import TooltipCustom from '@/components/common/Tooltip';
import { cn } from '@/utils';
import { copyToClipboard, shortenHexString, scanUrl } from '@/utils/helper';
import { ENUM_INSURANCE_SIDE } from 'hakifi-formula';
import Image from 'next/image';
import { MouseEvent, useMemo, useRef } from 'react';
import { CloseButton, DateExpiredWrapper, PriceExpiredWrapper, QClaimWrapper } from '../utils';
import { formatNumber } from '@/utils/format';
import TickerWrapper from '../../Favorites/TickerWrapper';
import useInsuranceStore from '@/stores/insurance.store';
import ExternalLinkIcon from '@/components/common/Icons/ExternalLinkIcon';

type RecordProps = {
    data: Insurance;
    onShowDetail: (data: Insurance) => void;
};

const MobileRecord = ({ data, onShowDetail }: RecordProps) => {
    const { asset, token, side, expiredAt, id, txhash, p_claim, p_liquidation, q_claim, margin, q_covered, p_cancel, state, unit, p_open } = useMemo(() => data, [data]);
    const { setInsuranceSelected, toggleCloseModal } = useInsuranceStore();
    const handleOnScan = (txh: string) => {
        window.open(scanUrl(txh), '_blank');
    };
    const handleCloseAction = (
        data: Insurance,
    ) => {
        setInsuranceSelected(data);
        toggleCloseModal();
    };
    return (
        <section className="flex flex-col border border-divider-secondary p-3 rounded">
            <section className="flex items-center justify-between" onClick={() => onShowDetail(data)}>
                <div className="text-body-12 flex items-center gap-2">
                    <Image
                        src={token.attachment}
                        width={24}
                        height={24}
                        alt="token"
                    />
                    <div className="flex items-center gap-1">
                        <span className="text-typo-primary">{data.asset}</span>
                        <span className="text-typo-secondary">/ USDT</span>
                    </div>
                </div>
                <div
                    className={cn(
                        "!text-body-12 text-typo-primary py-2 px-3 text-center rounded-sm",
                        side === ENUM_INSURANCE_SIDE.BULL ? 'bg-positive-label' : 'bg-negative-label',
                    )}>
                    {side}
                </div>
            </section>
            <Separator className="my-3" />
            <section className="flex flex-col gap-4">
                <div className="grid grid-cols-2">
                    <div className="flex flex-col gap-1 text-body-12">
                        <p className="text-typo-secondary">Expire in</p>
                        <DateExpiredWrapper
                            expired={new Date(expiredAt)}
                            isCooldown={true}
                        />
                    </div>
                    <div className="flex flex-col gap-1 text-body-12">
                        <p className="text-typo-secondary">TxH</p>

                        <Button
                            size="sm"
                            className="flex items-center gap-1 underline"
                            onClick={() => handleOnScan(txhash)}>
                            <div className="text-typo-primary">{shortenHexString(txhash as string, 5, 4)}</div>
                            <ExternalLinkIcon className="size-5"/>
                        </Button>

                    </div>
                </div>
                <div className="grid grid-cols-2">
                    <div className="flex flex-col gap-1 text-body-12">
                        <p className="text-typo-secondary">Liquid. price</p>
                        <PriceExpiredWrapper
                            pExpired={p_liquidation}
                            symbol={`${asset}USDT`}
                        />
                    </div>
                    <div className="flex flex-col gap-1 text-body-12">
                        <p className="text-typo-secondary">Claim amount</p>
                        <QClaimWrapper
                            qClaim={q_claim}
                            margin={margin}
                            unit={unit}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2">
                    <div className="flex flex-col gap-1 text-body-12">
                        <p className="text-typo-secondary">Margin</p>
                        <p className="text-typo-primary">
                            {formatNumber(margin)} {unit}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 text-body-12">
                        <p className="text-typo-secondary">Insured Value</p>
                        <p className="text-typo-primary">
                            {formatNumber(q_covered)} {unit}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <div className="flex flex-col gap-1 text-body-12">
                        <p className="text-typo-secondary">Open price</p>
                        <p className="text-typo-primary">
                            {formatNumber(p_open)} {unit}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 text-body-12">
                        <p className="text-typo-secondary">Claim price</p>
                        <p className="text-typo-primary">
                            {formatNumber(p_claim)} {unit}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 text-body-12">
                        <p className="text-typo-secondary">Market price</p>
                        <TickerWrapper
                            jump
                            symbol={`${asset}USDT`}
                            decimal={8}
                            labelclassName="!text-typo-primary text-body-12"
                            showPercent={false}
                        />
                    </div>
                </div>
                <CloseButton
                    onClick={() => handleCloseAction(data)}
                    symbol={`${asset}USDT`}
                    pCancel={p_cancel as number}
                    pClaim={p_claim}
                    title="Close"
                    state={state as string}
                    side={side}
                />
            </section>
        </section>
    );
};

export default MobileRecord;