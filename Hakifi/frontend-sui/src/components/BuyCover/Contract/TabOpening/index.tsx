
import { Insurance } from '@/@type/insurance.type';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import ExternalLinkIcon from '@/components/common/Icons/ExternalLinkIcon';
import TwoWayArrowIcon from '@/components/common/Icons/TwoWayArrowIcon';
import { useIsTablet } from '@/hooks/useMediaQuery';
import useInsuranceStore from '@/stores/insurance.store';
import useWalletStore from '@/stores/wallet.store';
import { cn } from '@/utils';
import { formatNumber } from '@/utils/format';
import { shortenHexString, scanUrl } from '@/utils/helper';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { ENUM_INSURANCE_SIDE } from 'hakifi-formula';
import Image from 'next/image';
import { MouseEvent, useMemo, useState } from 'react';
import TickerWrapper from '../../Favorites/TickerWrapper';
import { CloseButton, DateExpiredWrapper, EmptyContract, PriceExpiredWrapper, QClaimWrapper } from '../utils';
import FilterWrapper from './Filter';
import MobileRecord from './MobileRecord';
import { useWallet } from '@suiet/wallet-kit';
import Pagination from '@/components/common/Pagination';
import MobileVersion from './MobileVersion';

const TabOpening = () => {
    const { connected } = useWallet();
    const [
        currentPage,
        setPagination,
        insurancesOpening,
        totalOpening,
        toggleDetailModal,
        setInsuranceSelected,
        toggleCloseModal,
    ] = useInsuranceStore((state) => [
        state.currentPage,
        state.setPagination,
        state.insurancesOpening,
        state.totalOpening,
        state.toggleDetailModal,
        state.setInsuranceSelected,
        state.toggleCloseModal,
    ]);

    const handleOnClickInsurance = (data: Insurance) => {
        toggleDetailModal();
        setInsuranceSelected(data);
    };

    const [sorting, setSorting] = useState<SortingState>([]);
    const [isFilter, setIsFilter] = useState<string[]>([]);
    const isLogging = useWalletStore((state) => state.isLogging);

    const handleCloseAction = (
        e: MouseEvent<HTMLButtonElement>,
        data: Insurance,
    ) => {
        e.stopPropagation();
        e.preventDefault();
        setInsuranceSelected(data);
        toggleCloseModal();
    };

    const isTablet = useIsTablet();

    const pageCount = useMemo(() => Math.ceil((totalOpening || 0) / 10), [totalOpening]);
    const previousPage = () => {
        setPagination(currentPage - 1);
    };
    const nextPage = () => {
        setPagination(currentPage + 1);
    };

    const getCanNextPage = useMemo(() => {
        return currentPage < totalOpening - 1;
    }, [totalOpening, currentPage]);
    const getCanPreviousPage = useMemo(() => {
        return currentPage > 0;
    }, [totalOpening, currentPage]);

    const handleOnScan = (event: MouseEvent<HTMLDivElement>, txh: string) => {
        event.preventDefault();
        event.stopPropagation();
        window.open(scanUrl(txh), '_blank');
    };

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
                        <div className="!text-body-12 flex items-center gap-2">
                            <Image
                                src={token.attachment}
                                width={24}
                                height={24}
                                alt="token"
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
                                side === ENUM_INSURANCE_SIDE.BULL ? 'bg-positive-label' : 'bg-negative-label',
                            )}>
                            {side}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'expiredAt',
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
                            Expire in
                            <TwoWayArrowIcon sort={isSort} />
                        </Button>
                    );
                },
                meta: {
                    width: 145,
                },
                cell: ({ row }) => (
                    <DateExpiredWrapper
                        expired={row.getValue('expiredAt')}
                        isCooldown={true}
                    />
                ),
            },
            {
                accessorKey: 'p_open',
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
                            Open Price
                            <TwoWayArrowIcon sort={isSort} />
                        </Button>
                    );
                },
                // header: ({ column }) => {
                //     const isSort =
                //         typeof column.getIsSorted() === 'boolean'
                //             ? ''
                //             : column.getIsSorted() === 'asc'
                //                 ? false
                //                 : true;
                //     return (
                //         <TooltipHeaderWrapper
                //             title="P-Open"
                //             tooltip="P-Open"
                //             onClick={() => {
                //                 column.toggleSorting(column.getIsSorted() === 'asc');
                //             }}
                //             suffix={<TwoWayArrowIcon sort={isSort} />}
                //         />
                //     );
                // },
                meta: {
                    width: 150,
                },
                cell: ({ row }) => (
                    <div className="text-typo-primary">
                        {formatNumber(row.getValue('p_open'))}
                    </div>
                ),
            },
            {
                accessorKey: 'p_claim',
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
                            Claim Price
                            <TwoWayArrowIcon sort={isSort} />
                        </Button>
                    );
                },
                // header: ({ column }) => {
                //     const isSort =
                //         typeof column.getIsSorted() === 'boolean'
                //             ? ''
                //             : column.getIsSorted() === 'asc'
                //                 ? false
                //                 : true;
                //     return (
                //         <TooltipHeaderWrapper
                //             title="P-Claim"
                //             tooltip="P-Claim"
                //             onClick={() => {
                //                 column.toggleSorting(column.getIsSorted() === 'asc');
                //             }}
                //             suffix={<TwoWayArrowIcon sort={isSort} />}
                //         />
                //     );
                // },
                meta: {
                    width: 107,
                },
                cell: ({ row }) => (
                    <div className="text-typo-primary">
                        {formatNumber(row.getValue('p_claim'))}
                    </div>
                ),
            },
            {
                accessorKey: 'p_market',
                header: "Market Price",
                // header: () => (
                //     <TooltipHeaderWrapper
                //         title="P-Market"
                //         tooltip="P-Market"
                //     />
                // ),
                meta: {
                    width: 115,
                },
                cell: ({ row }) => (
                    <TickerWrapper
                        jump
                        symbol={`${row.getValue('asset')}USDT`}
                        decimal={8}
                        labelclassName="!text-typo-primary !text-body-12"
                        showPercent={false}
                    />
                ),
            },
            {
                accessorKey: 'p_liquidation',
                header: "Liquid. Price",
                meta: {
                    width: 150,
                },
                cell: ({ row }) => (
                    <PriceExpiredWrapper
                        pExpired={row.getValue('p_liquidation')}
                        symbol={`${row.getValue('asset')}USDT`}
                    />
                ),
            },
            {
                accessorKey: 'q_claim',
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
                            Claim amount
                            <TwoWayArrowIcon sort={isSort} />
                        </Button>
                    );
                },
                meta: {
                    width: 210,
                },
                cell: ({ row }) => (
                    <QClaimWrapper
                        qClaim={row.getValue('q_claim')}
                        margin={row.getValue('margin')}
                        unit={row.getValue('unit')}
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
                            Insured value
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
                accessorKey: 'id',
                header: "Hash ID",
                meta: {
                    width: 150,
                },
                cell: ({ row }) => {
                    return (
                        <div className="text-support-white flex items-center gap-2 underline" onClick={(e) => handleOnScan(e, row.getValue('txhash'))}>
                            {row.getValue('txhash') ? shortenHexString(row.getValue('txhash') as string, 5, 4) : null}
                            <ExternalLinkIcon />
                        </div>
                    );
                },
            },
            {
                accessorKey: 'action',
                header: '',
                cell: ({ row }) => (
                    <CloseButton
                        onClick={(e) => handleCloseAction(e, row.original)}
                        symbol={`${row.getValue('asset')}USDT`}
                        pCancel={row.getValue('p_cancel') as number}
                        pClaim={row.getValue('p_claim')}
                        title="Cancel"
                        state={row.original.state as string}
                        side={row.getValue('side')}
                    />
                ),
                meta: {
                    fixed: 'left',
                    width: 97,
                },
            },
            {
                accessorKey: 'p_cancel',
                header: '',
                meta: {
                    show: false,
                },
            },
            {
                accessorKey: 'txhash',
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
            {
                accessorKey: 'unit',
                header: '',
                meta: {
                    show: false,
                },
            },
        ],
        [isLogging, connected],
    );

    return (
        <>
            <FilterWrapper sorting={sorting} isFilter={isFilter} handleIsFilter={setIsFilter} />
            {
                totalOpening <= 0 ? <EmptyContract /> :
                    !isTablet ? <DataTable
                        columns={columns}
                        data={insurancesOpening}
                        total={totalOpening}
                        onChangePagination={setPagination}
                        onClickRow={handleOnClickInsurance}
                        sorting={sorting}
                        isFilter={isFilter}
                        setSorting={setSorting}
                    /> : (
                        <MobileVersion/>
                    )
            }
        </>
    );
};

export default TabOpening;