import { Insurance } from '@/@type/insurance.type';
import { Separator } from '@/components/common/Separator';
import Tag from '@/components/common/Tag';
import TooltipCustom from '@/components/common/Tooltip';
import { cn } from '@/utils';
import { STATUS_DEFINITIONS } from '@/utils/constant';
import { formatNumber } from '@/utils/format';
import { ENUM_INSURANCE_SIDE } from 'hakifi-formula';
import Image from 'next/image';
import { useMemo } from 'react';
import { DateExpiredWrapper, PnlWrapper } from '../utils';
import ExternalLinkIcon from '@/components/common/Icons/ExternalLinkIcon';
import { shortenHexString, scanUrl } from '@/utils/helper';
import Button from '@/components/common/Button';

type RecordProps = {
    data: Insurance;
    onShowDetail: (data: Insurance) => void;
};

const MobileRecord = ({ data, onShowDetail }: RecordProps) => {
    const { token, side, expiredAt, q_claim, margin, q_covered, state, txhash, unit, closedAt } = useMemo(() => data, [data]);
    const { variant, title } = STATUS_DEFINITIONS[state];

    const handleOnScan = (txh: string) => {
        window.open(scanUrl(txh), '_blank');
    };

    return (
        <section className="border border-divider-secondary p-3 rounded">
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
            <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-body-12">
                    <p className="text-typo-secondary">State</p>
                    <Tag
                        variant={variant}
                        text={title}
                    />
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <p className="text-typo-secondary">Expire time</p>
                    <DateExpiredWrapper
                        expired={new Date(closedAt)}
                        isCooldown={false}
                    />
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <p className="text-typo-secondary">TxH</p>
                    <Button size="sm" onClick={() => handleOnScan(txhash)} className="text-support-white flex items-center gap-2">
                        {txhash ? shortenHexString(txhash as string, 5, 4) : null}
                        <ExternalLinkIcon />
                    </Button>
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <p className="text-typo-secondary">PnL</p>
                    <PnlWrapper
                        margin={margin}
                        q_claim={q_claim}
                        state={state as string}
                    />
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <p className="text-typo-secondary">Margin</p>
                    <p>
                        {formatNumber(margin)} {unit}
                    </p>
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <p className="text-typo-secondary">Insured Value</p>
                    <p>{formatNumber(q_covered)} {unit}</p>
                </div>
            </section>
        </section>
    );
};

export default MobileRecord;