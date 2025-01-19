import Button from '@/components/common/Button';
import { DateRangePicker } from '@/components/common/Calendar/DateRangPicker';
import FormInput from '@/components/common/FormInput';
import CalendarIcon from '@/components/common/Icons/CalendarIcon';
import FilterIcon from '@/components/common/Icons/FilterIcon';
import SearchIcon from '@/components/common/Icons/SearchIcon';
import useDebounce from '@/hooks/useDebounce';
import { useIsTablet } from '@/hooks/useMediaQuery';
import useToggle from '@/hooks/useToggle';
import useInsuranceStore from '@/stores/insurance.store';
import { cn } from '@/utils';
import { SortingState } from '@tanstack/react-table';
import { endOfDay, format, startOfDay } from "date-fns";
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import AssetDropdown from '../../Components/AssetsDropdown';
import StatusDropdown from '../StatusDropdown';
import Mobile from './Mobile';
import { useWallet } from '@suiet/wallet-kit';

type FilterWrapperProps = {
    sorting: SortingState;
    handleIsFilter: (status: string[]) => void;
    isFilter: string[];
};

const FilterWrapper = ({ sorting, handleIsFilter, isFilter }: FilterWrapperProps) => {
    const isTablet = useIsTablet();
    const [asset, setAsset] = useState<string | undefined>(undefined);
    const handleChangeAsset = (asset?: string) => {
        setAsset(asset);
        handleIsFilter(["asset"]);
    };

    const [status, setStatus] = useState<string | undefined>(undefined);
    const handleChangeStatus = (status?: string) => {
        setStatus(status);
        handleIsFilter(["status"]);
    };

    // const [openTime, setOpenTime] = useState<DateRange | undefined>(undefined);
    const [expireTime, setExpireTime] = useState<DateRange | undefined>(undefined);
    const handleChangeExpireTime = (range?: DateRange) => {
        setExpireTime(range);
        handleIsFilter(["texpire"]);
    };

    const [searchTX, setSetsearchTX] = useState('');
    const debouncedValue = useDebounce(searchTX, 500);
    const onChangeSearchTX = (e: React.FormEvent<HTMLInputElement>) => {
        setSetsearchTX(e.currentTarget.value);
        handleIsFilter(["search"]);
    };

    const [currentPage, setPagination, getInsuranceHistory, hideOtherSymbol] = useInsuranceStore(state => [
        state.currentPage,
        state.setPagination,
        state.getInsuranceHistory,
        state.hideOtherSymbol,
    ]);

    const { closedFrom, closedTo } = useMemo(() => {
        if (expireTime) {
            const closedFrom = startOfDay(expireTime.from || new Date());
            const closedTo = expireTime.to && expireTime.from?.getTime() !== expireTime.to?.getTime() ? endOfDay(expireTime.to) : endOfDay(expireTime?.from || new Date());
            return {
                closedFrom,
                closedTo
            };
        }
        return {
            closedFrom: undefined,
            closedTo: undefined
        };
    }, [expireTime]);

    const { symbol } = useParams();
    const { connected } = useWallet();
    useEffect(() => {
        console.log(currentPage)
        if (connected) {
            const filterAsset = hideOtherSymbol ? (symbol as string).split('USDT')[0] : asset;
            getInsuranceHistory({
                page: Number(currentPage || 1),
                sort: sorting.map(item => `${item.desc ? '-' : ''}${item.id}`).join('') || undefined,
                q: debouncedValue || undefined,
                closedFrom,
                closedTo,
                // createdFrom,
                // createdTo,
                asset: filterAsset,
                state: status
            });
        }

    }, [hideOtherSymbol, connected, sorting, debouncedValue, expireTime, asset, status, currentPage]);

    const handleResetFilter = () => {
        // Reset set filter
        handleChangeAsset(undefined);
        handleChangeStatus(undefined);
        handleChangeExpireTime(undefined);
        setSetsearchTX('');
        handleIsFilter([]);
    };

    const { toggle, handleToggle } = useToggle();
    if (isTablet) {
        return <>
            <div className="flex items-center gap-3 px-4 mt-5">
                <FormInput
                    size="md"
                    value={searchTX}
                    onChange={onChangeSearchTX}
                    wrapperClassInput="w-full"
                    suffixClassName="!border-none !py-0"
                    placeholder="Search by Hash ID"
                    prefix={<SearchIcon className="size-4" />}
                />
                <Button size="lg" onClick={() => handleToggle()} point={false} className="p-[7px] flex items-center justify-center border border-divider-secondary rounded box-border">
                    <FilterIcon className="size-4" />
                </Button>
            </div>

            <Mobile
                isOpen={toggle}
                handleOpenStatusChange={handleToggle}
                handleChangeAsset={setAsset}
                handleChangeStatus={handleChangeStatus}
                // handleChangeOpenTime={setOpenTime}
                handleChangeExpireTime={setExpireTime}
            />

        </>;
    }

    return (
        <div className="flex items-end gap-4 px-5 py-6">
            <section>
                <p className="text-body-16 text-typo-primary">Pair</p>
                <section className="mt-2 w-[250px]">
                    <AssetDropdown asset={asset} handleSetAsset={(asset: string) => handleChangeAsset(asset)} classContent="!w-full"
                    />
                </section>
            </section>
            <section>
                <p className="text-body-16 text-typo-primary">Status</p>
                <section className="mt-2 md:min-w-[180px]">
                    <StatusDropdown status={status} handleSetStatus={(status: string | undefined) => handleChangeStatus(status)} classContent="!w-full"
                    />
                </section>
            </section>
            <section>
                <p className="text-body-16 text-typo-primary">Closed Time</p>
                <section className="mt-2 md:min-w-[180px]">
                    <DateRangePicker onChange={handleChangeExpireTime} range={expireTime}>
                        <Button point={false} size="lg" className="group border border-divider-secondary hover:border-divider-primary hover:bg-background-secondary duration-300 py-2 px-4 flex items-center justify-between w-full text-body-14 [&>svg>path]:active:fill-background-primary">
                            {/* <section className="flex items-center justify-between w-full text-body-14"> */}
                            <div className="text-ellipsis overflow-hidden max-w-20">
                                {expireTime?.from ? (
                                    expireTime.to ? (
                                        <>
                                            {format(expireTime.from, "LLL dd, y")} -{" "}
                                            {format(expireTime.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(expireTime.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span className="">Select time</span>
                                )}
                            </div>

                            <CalendarIcon
                                className={cn("size-4 group-hover:fill-background-primary")}
                            />
                            {/* </section> */}
                        </Button>
                    </DateRangePicker>
                </section>
            </section>
            <section>
                <p className="text-body-16 text-typo-primary">Search</p>
                <section className="mt-2 md:min-w-[206px]">
                    <FormInput
                        size="lg"
                        value={searchTX}
                        onChange={onChangeSearchTX}
                        suffixClassName="!border-none !py-0"
                        placeholder="Search by Contract ID"
                        wrapperClassInput="hover:bg-background-secondary"
                        prefix={<SearchIcon className="size-4" />}
                    />
                </section>
            </section>
            <Button
                size="md"
                variant="default"
                className="justify-center mt-4 px-8 py-2 hover:text-typo-accent"
                onClick={handleResetFilter}
            >
                Reset
            </Button>
        </div >
    );
};

export default FilterWrapper;