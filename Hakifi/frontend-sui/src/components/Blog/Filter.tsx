"use client";

import { cn } from '@/utils';
import { ChangeEvent, ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import Button from '../common/Button';

import SearchIcon from '../common/Icons/SearchIcon';
import FormInput from './components/FormInputSearch';
import useDebounce from '@/hooks/useDebounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CloseIcon from '../common/Icons/CloseIcon';
import { useIsTablet } from '@/hooks/useMediaQuery';

type FilterProps = {
    handleSelected: (selected: string) => void;
    // handleOnchangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
};

const filters = [
    {
        label: "All",
        value: ""
    },
    {
        label: "Stablecoin",
        value: "stablecoin"
    },
    {
        label: "Vnst",
        value: "#vnst"
    },
    {
        label: "News",
        value: "news"
    },
];
const Filter = () => {
    const isTablet = useIsTablet();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams);
            params.delete('page');

            if (value) params.set(name, value);
            else params.delete(name);
            params.set('page', '1');


            router.replace(`${pathname}?${params.toString()}`, {
                scroll: false
            });
        },
        [searchParams]
    );
    const [selected, setSelected] = useState(filters[0].value);
    const handleOnSelect = (value: string) => {
        setSelected(value);
        createQueryString('tag', value);
    };

    const [searchBlog, setSetsearchBlog] = useState('');
    // const debouncedValue = useDebounce(searchBlog, 500);
    const handleOnchangeSearch = (e: React.FormEvent<HTMLInputElement>) => {
        setSetsearchBlog(e.currentTarget.value);
        createQueryString('search', e.currentTarget.value);
    };

    const handleOnClose = () => {
        setSetsearchBlog('');
        createQueryString('search', '');
    };

    useEffect(() => {
        if (searchParams.get("tag")) setSelected(searchParams.get("tag") || '');
        if (searchParams.get("search")) setSetsearchBlog(searchParams.get("search") || '');
    }, []);

    return (
        <section className="flex flex-col-reverse lg:flex-row  lg:justify-between">
            <section className="flex items-center lg:gap-4 gap-3 mt-4 lg:mt-0">
                {
                    filters.map((item, index) => {
                        return <Button size={isTablet ? "sm" : "md"} className={cn("p-2 rounded-sm text-typo-secondary border border-divider-secondary",
                            item.value === selected && "border-typo-accent bg-background-secondary text-typo-accent"
                        )} key={item.label} onClick={() => handleOnSelect(item.value)}>
                            {item.label}
                        </Button>;
                    })
                }
            </section>
            <section className="md:min-w-[350px]">
                <FormInput
                    size={isTablet ? "md" : "lg"}
                    value={searchBlog}
                    onChange={handleOnchangeSearch}
                    suffixClassName="!border-none !py-0"
                    placeholder="Search post"
                    wrapperClassInput="w-full hover:bg-background-secondary"
                    prefix={<SearchIcon className="size-4" />}
                    suffix={<CloseIcon onClick={handleOnClose} className={cn("size-4", searchBlog ? "block" : "hidden")} />}
                />
            </section>
        </section>
    );
};



export default Filter;