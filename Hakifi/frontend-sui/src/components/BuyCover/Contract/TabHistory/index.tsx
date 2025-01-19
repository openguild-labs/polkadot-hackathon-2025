
import { Insurance } from '@/@type/insurance.type';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import ClipboardIcon from '@/components/common/Icons/ClipboardIcon';
import TwoWayArrowIcon from '@/components/common/Icons/TwoWayArrowIcon';
import { useNotification } from '@/components/common/Notification';
import Tag from '@/components/common/Tag';
import { useIsTablet } from '@/hooks/useMediaQuery';
import useInsuranceStore from '@/stores/insurance.store';
import useWalletStore from '@/stores/wallet.store';
import { cn } from '@/utils';
import { MODE, STATUS_DEFINITIONS } from '@/utils/constant';
import { formatNumber } from '@/utils/format';
import { copyToClipboard } from '@/utils/helper';
import { useWallet } from '@suiet/wallet-kit';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import Image from 'next/image';
import { MouseEvent, useMemo, useRef, useState } from 'react';
import { DateExpiredWrapper, EmptyContract, PnlWrapper } from '../utils';
import FilterWrapper from './Filter';
import MobileVersion from './MobileVersion';

const TabHistory = () => {
    const [
        currentPage,
        setPagination,
        insurancesHistory,
        totalHistory,
        toggleDetailModal,
        setInsuranceSelected,
    ] = useInsuranceStore((state) => [
        state.currentPage,
        state.setPagination,
        state.insurancesHistory,
        state.totalHistory,
        state.toggleDetailModal,
        state.setInsuranceSelected,
    ]);

    const isLogging = useWalletStore((state) => state.isLogging);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [isFilter, setIsFilter] = useState<string[]>([]);

    const handleOnClickInsurance = (data: Insurance) => {
        toggleDetailModal();
        setInsuranceSelected(data);
    };

    const notifications = useNotification();
    const copyTooltipRef = useRef<any>();
    const handleCopy = (e: MouseEvent<HTMLButtonElement>, str: string) => {
        e.stopPropagation();
        e.preventDefault();
        copyToClipboard(str);
        copyTooltipRef.current?.toggle(true);

        notifications.success('Copied');
    };

    const { connected } = useWallet();
    const columns: ColumnDef<Insurance>[] = useMemo(
        () => [
            {
                accessorKey: 'asset',
                header: "Pair",
                cell: ({ row }) => {
                    const token = row.getValue('token') as {
                        attachment: string;
                        name: string;
                    };
                    return (
                        <div className="text-body-12 flex items-center gap-2">
                            <Image
                                src={token.attachment}
                                width={24}
                                height={24}
                                alt="token"
                                className="rounded-full"
                            />
                            <div className="flex items-center gap-1">
                                <span className="text-typo-primary">{row.getValue('asset')}</span>/
                                <span>USDT</span>
                            </div>
                        </div>
                    );
                },
                meta: {
                    width: 120,
                },
            },
            {
                accessorKey: 'side',
                header: "Side",
                meta: {
                    width: 100,
                },
                cell: ({ row }) => {
                    const side = row.getValue('side') as string;
                    return (
                        <div
                            className={cn(
                                "text-body-12 text-typo-primary p-1 text-center rounded-sm",
                                side === MODE.BULL ? 'bg-positive-label' : 'bg-negative-label',
                            )}>
                            {side}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'closedAt',
                header: ({ column }) => {
                    const isSort =
                        typeof column.getIsSorted() === 'boolean'
                            ? ''
                            : column.getIsSorted() === 'asc'
                                ? false
                                : true;
                    return (
                        <Button
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === 'asc');
                            }}>
                            Closed time
                            <TwoWayArrowIcon sort={isSort} />
                        </Button>
                    );
                },
                meta: {
                    width: 185,
                },
                cell: ({ row }) => (
                    <DateExpiredWrapper
                        expired={row.getValue('closedAt')}
                        isCooldown={false}
                    />
                ),
            },
            {
                accessorKey: 'pnl',
                header: 'PnL',
                meta: {
                    width: 180,
                },
                cell: ({ row }) => (
                    <PnlWrapper
                        margin={row.getValue('margin')}
                        q_claim={row.getValue('q_claim')}
                        state={row.getValue('state')}
                    />
                ),
            },
            {
                accessorKey: 'margin',
                header: ({ column }) => {
                    const isSort =
                        typeof column.getIsSorted() === 'boolean'
                            ? ''
                            : column.getIsSorted() === 'asc'
                                ? false
                                : true;
                    return (
                        <Button
                            size="sm"
                            className="flex items-start gap-2"
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === 'asc');
                            }}>
                            Margin
                            <TwoWayArrowIcon sort={isSort} />
                        </Button>
                    );
                },
                meta: {
                    width: 90,
                },
                cell: ({ row }) => (
                    <div className="text-typo-primary">
                        {formatNumber(row.getValue('margin'))}
                    </div>
                ),
            },
            {
                accessorKey: 'q_covered',
                header: ({ column }) => {
                    const isSort =
                        typeof column.getIsSorted() === 'boolean'
                            ? ''
                            : column.getIsSorted() === 'asc'
                                ? false
                                : true;
                    return (
                        <Button
                            size="sm"
                            className="flex items-start gap-2"
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === 'asc');
                            }}>
                            Insured Value
                            <TwoWayArrowIcon sort={isSort} />
                        </Button>
                    );
                },
                meta: {
                    width: 150,
                },
                cell: ({ row }) => (
                    <div className="text-typo-primary">
                        {formatNumber(row.getValue('q_covered'))}
                    </div>
                ),
            },
            {
                accessorKey: 'state',
                header: "Status",
                cell: ({ row }) => {
                    const { variant, title } = STATUS_DEFINITIONS[row.getValue('state') as string];
                    return <Tag
                        variant={variant}
                        text={title}
                    />;
                },
                meta: {
                    width: 160,
                },
            },
            {
                accessorKey: 'txhash',
                header: 'Contract ID',
                meta: {
                    width: 150,
                    onCellClick: (data: Insurance) => {

                    }
                },
                cell: ({ row }) => {
                    // return (
                    //     <div className="text-support-white flex items-center gap-2 underline" onClick={(e) => handleOnScan(e, row.getValue('txhash'))}>
                    //         {row.getValue('txhash') ? shortenHexString(row.getValue('txhash') as string, 5, 4) : null}
                    //         <ExternalLinkIcon />
                    //     </div>
                    // );
                    return (
                        <div className="flex items-center gap-1">
                            <div className="text-typo-primary">{row.getValue('id')}</div>
                            <Button
                                size="md"
                                className=""
                                onClick={(e) => handleCopy(e, row.getValue('id'))}>
                                <ClipboardIcon height={20} width={20} />
                            </Button>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'id',
                header: '',
                meta: {
                    show: false,
                },
            },
            {
                accessorKey: 'q_claim',
                header: '',
                meta: {
                    show: false,
                },
            },
            {
                accessorKey: 'token',
                header: '',
                meta: {
                    show: false,
                },
            },
        ],
        [isLogging, connected],
    );

    const isTable = useIsTablet();

    return (
        <>
            <FilterWrapper sorting={sorting} isFilter={isFilter} handleIsFilter={setIsFilter} />
            {
                totalHistory <= 0 ? <EmptyContract /> :
                    !isTable ? <DataTable
                        columns={columns}
                        data={insurancesHistory}
                        total={totalHistory}
                        currentPage={currentPage}
                        onChangePagination={setPagination}
                        onClickRow={handleOnClickInsurance}
                        sorting={sorting}
                        setSorting={setSorting}
                        isFilter={isFilter}
                    /> : (
                        <MobileVersion />
                    )
            }
        </>
    );
};

export default TabHistory;