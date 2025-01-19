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
import dynamic from 'next/dynamic';
import AssetDropdown from '../../Components/AssetsDropdown';
import { useWallet } from '@suiet/wallet-kit';
import { useAccount } from 'wagmi';

const Mobile = dynamic(() => import('./Mobile'),
    { ssr: false }
);

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
        handleIsFilter([...isFilter, "asset"]);
    };

    const [openTime, setOpenTime] = useState<DateRange | undefined>(undefined);
    const [expireTime, setExpireTime] = useState<DateRange | undefined>(undefined);
    const handleChangeExpireTime = (range?: DateRange) => {
        setExpireTime(range);
        handleIsFilter([...isFilter, "texpire"]);
    };

    const [searchTX, setSetsearchTX] = useState('');
    const debouncedValue = useDebounce(searchTX, 500);
    const onChangeSearchTX = (e: React.FormEvent<HTMLInputElement>) => {
        setSetsearchTX(e.currentTarget.value);
        handleIsFilter([...isFilter, "search"]);
    };
    const { symbol } = useParams();
    const { isConnected } = useAccount()
    const [currentPage, getInsuranceOpening, hideOtherSymbol] = useInsuranceStore(state => [
        state.currentPage,
        state.getInsuranceOpening,
        state.hideOtherSymbol
    ]);

    const { expiredFrom, expiredTo } = useMemo(() => {
        if (expireTime) {
            const expiredFrom = startOfDay(expireTime.from || new Date());
            const expiredTo = expireTime.to && expireTime.from?.getTime() !== expireTime.to?.getTime() ? endOfDay(expireTime.to) : endOfDay(expireTime?.from || new Date());
            return {
                expiredFrom,
                expiredTo
            };
        }
        return {
            expiredFrom: undefined,
            expiredTo: undefined
        };
    }, [expireTime]);

    const { createdFrom, createdTo } = useMemo(() => {
        if (openTime) {
            const createdFrom = startOfDay(openTime.from || new Date());
            const createdTo = openTime.to && openTime.from?.getTime() !== openTime.to?.getTime() ? endOfDay(openTime.to) : endOfDay(openTime.from || new Date());

            return {
                createdFrom,
                createdTo
            };
        }
        return {
            createdFrom: undefined,
            createdTo: undefined
        };
    }, [openTime]);

    useEffect(() => {
        if (isConnected) {
            const assetFilter = hideOtherSymbol ? (symbol as string).split('USDT')[0] : (asset || "");
            getInsuranceOpening({
                page: Number(currentPage || 1),
                sort: sorting.map(item => `${item.desc ? '-' : ''}${item.id}`).join('') || undefined,
                q: debouncedValue || undefined,
                expiredFrom,
                expiredTo,
                createdFrom,
                createdTo,
                asset: assetFilter
            });
        }

    }, [
        currentPage,
        isConnected,
        sorting,
        debouncedValue,
        openTime,
        expireTime,
        hideOtherSymbol,
        asset
    ]);

    const { toggle, handleToggle } = useToggle();

    const handleResetFilter = () => {
        // Reset set filter
        handleIsFilter([]);
        handleChangeAsset(undefined);
        handleChangeExpireTime(undefined);
        setSetsearchTX('');
    };

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
                    <FilterIcon className="size-4"/>
                </Button>
            </div>


            <Mobile
                isOpen={toggle}
                handleOpenStatusChange={handleToggle}
                handleChangeAsset={setAsset}
                handleChangeOpenTime={setOpenTime}
                handleChangeExpireTime={setExpireTime}
            />

        </>;
    }

    return (
        <div className="flex items-end gap-4 px-5 py-6">
            <section>
                <p className="text-body-16 text-typo-primary">Asset</p>
                <section className="mt-2 md:min-w-[218px]">
                    <AssetDropdown asset={asset} handleSetAsset={(asset: string) => setAsset(asset)} classContent="!w-full"
                    />
                </section>
            </section>
            {/* <section>
                <p className="text-body-16 text-typo-primary">T-Start</p>
                <section className="mt-2">
                    <DateRangePicker onChange={setOpenTime} range={openTime}>
                        <Button variant="outline" point={false} size="lg" className="group w-[150px]">
                            <section className="flex items-center justify-between w-full text-body-14">
                                <div className="text-ellipsis overflow-hidden max-w-20">
                                    {openTime?.from ? (
                                        openTime.to ? (
                                            <>
                                                {format(openTime.from, "LLL dd, y")} -{" "}
                                                {format(openTime.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(openTime.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span className="text-typo-secondary group-hover:text-typo-accent">Select time</span>
                                    )}
                                </div>

                                <CalendarIcon
                                    className={cn("group-hover:[&>path]:fill-background-primary size-4")}
                                />
                            </section>
                        </Button>
                    </DateRangePicker>
                </section>
            </section> */}
            <section>
                <p className="text-body-16 text-typo-primary">Expire Time</p>
                <section className="mt-2 md:min-w-[218px]">
                    <DateRangePicker onChange={setExpireTime} range={expireTime}>
                        <Button point={false} size="lg" className="group w-full border border-divider-secondary hover:border-divider-primary hover:bg-background-secondary duration-300 py-2 px-4">
                            <section className="flex items-center justify-between w-full text-body-14 focus-within:[&>svg>path]:fill-background-primary ">
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
                                    className={cn(" size-4")}
                                />
                            </section>
                        </Button>
                    </DateRangePicker>
                </section>
            </section>
            <section>
                <p className="text-body-16 text-typo-primary">Search by Hash ID</p>
                <section className="mt-2 md:min-w-[276px]">
                    <FormInput
                        size="lg"
                        value={searchTX}
                        onChange={onChangeSearchTX}
                        suffixClassName="!border-none !py-0"
                        placeholder="Search by Hash ID"
                        wrapperClassInput="w-full hover:bg-background-secondary"
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
        </div>
    );
};

export default FilterWrapper;