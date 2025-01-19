"use client";

import { Blog as BlogType } from '@/@type/blog.type';

import { useIsTablet } from '@/hooks/useMediaQuery';
import '@/styles/blog.scss';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import SpeakerIcon from '../common/Icons/SpeakerIcon';
import Pagination from '../common/Pagination';
import Spinner from '../common/Spinner';
import BlogItem from './components/BlogItem';
import Empty from './components/Empty';
import HotPost from './components/HotPost';
import Filter from './Filter';

type BlogProps = {
    blogs?: BlogType[],
    totalPage: number;
};

const Blog = ({ blogs = [], totalPage }: BlogProps) => {
    const isTablet = useIsTablet();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    // Blog management
    const [currentPage, setCurrentPage] = useState(0);
    const handleOnChangePage = (page: number) => {
        router.push(pathname + '?' + createQueryString('page', `${page + 1}`), {
            scroll: false
        });
        setCurrentPage(page);
    };

    const handleNextPage = () => {
        const page = searchParams.get('page') || currentPage + 1
        router.replace(pathname + '?' + createQueryString('page', `${+page + 1}`), {
            scroll: false
        });
        setCurrentPage(currentPage => currentPage + 1);
    };
    const handlePreviousPage = () => {
        const page = searchParams.get('page') || currentPage + 1
        router.replace(pathname + '?' + createQueryString('page', `${+page - 1}`), {
            scroll: false
        });
        setCurrentPage(currentPage => currentPage - 1);
    };
    const checkIsNextPage = () => {
        return currentPage < totalPage - 1;
    };
    const checkIsPreviousPage = () => {
        return currentPage > 0;
    };

    return (
        <>
            {/* Banner */}
            <section className="flex lg:flex-row flex-col items-center md:max-h-[500px] max-h-[448px] gap-0 lg:gap-6 lg:px-5 mt-4 md:mt-0">
                <section className="md:text-left text-center">
                    <p className="text-heading-3 md:text-heading-2 text-typo-accent">HAKIFI BLOG</p>
                    <p className="text-body-16 lg:text-title-20 lg:mt-4">Learn Crypto and Blockchain with Hakifi Blog:
                        a Free, Comprehensive and Unbiased resource for Blockchain knowledge</p>
                </section>
                <Image
                    src="/assets/images/bg_blog.png"
                    width={500}
                    height={500}
                    className="object-contain size-full lg:max-h-[550px] max-h-[448px] mt-[18px] md:mt-0"
                    alt="bg"
                />
            </section>

            {/* Notification */}
            <section className="md:mt-15 mt-8 lg:px-5">

                <section className="flex items-center">
                    <SpeakerIcon className="size-6" />
                    <p className="ml-1 w-full lg:text-body-16 text-body-14 overflow-hidden whitespace-nowrap text-ellipsis">
                        Hakifi updates the insurance mechanism, Upgrades the UI of information pages and optimizes insurance asset price charts
                    </p>
                </section>

            </section>

            {/* Hot */}
            <section className="lg:px-5 px-4 md:mt-4 mt-2">

                <HotPost />
            </section>

            {/* Filter */}
            <section className="mt-12 lg:mt-15 lg:px-5">
                <p className="text-heading-3 uppercase">Hakifi blog</p>
                <section className="mt-5">
                    <Filter />
                </section>
            </section>

            {/* Blogs */}
            <section className="md:my-10 mt-4 mb-15 lg:px-5">
                {
                    blogs.length > 0 ?
                        <>
                            <section className="lg:grid lg:grid-cols-4 lg:gap-5 gap-4 flex flex-col ">
                                {
                                    blogs.map(item => {
                                        return <BlogItem key={item.objectID} blog={item} />;
                                    })
                                }
                            </section>
                            <Pagination
                                onPreviousPage={handlePreviousPage}
                                onNextPage={handleNextPage}
                                canNextPage={checkIsNextPage()}
                                canPreviousPage={checkIsPreviousPage()}
                                pageCount={totalPage}
                                pageIndex={currentPage}
                                setPageIndex={handleOnChangePage}
                                className="lg:mt-10 mt-4 justify-center lg:justify-end py-3 lg:py-0"
                            />
                        </>
                        : <Empty/>
                }
            </section>
        </>
    );
};

export default Blog;