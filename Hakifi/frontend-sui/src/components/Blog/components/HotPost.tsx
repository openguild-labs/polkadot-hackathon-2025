
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Pagination from './Pagination';
import { cn } from '@/utils';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Image from 'next/image';

const breakpoints = {
    desktop: {
        point: 1068,
        slidesPerView: 4,
    },
    tablet: {
        point: 768,
        slidesPerView: 1.5,
    },
};

const HotPost = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const onSlideChange = ({ realIndex }: { realIndex: number; }) => {
        setCurrentPage(realIndex);
    };

    return (
        <>
            <div className="flex flex-col space-y-4 -mx-4 sm:mx-0 sm:space-y-8">
                <Swiper
                    // pagination={pagination}
                    // modules={[Autoplay]}
                    className="w-full h-full flex"
                    slidesPerGroupSkip={3}
                    slidesPerView={2.2}
                    spaceBetween={20}
                    loop
                    breakpoints={{
                        [breakpoints.desktop.point]: {
                            slidesPerView: breakpoints.desktop.slidesPerView,
                            spaceBetween: 20,
                        },
                        [breakpoints.tablet.point]: {
                            slidesPerView: breakpoints.tablet.slidesPerView,
                            spaceBetween: 12,
                        },
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    onSlideChange={onSlideChange}

                >
                    {[1, 2, 3, 4, 5].map((item) => {
                        return (
                            <SwiperSlide key={item} className={cn('relative sm:p-0')}>
                                <Image
                                    src="/assets/images/blog_default.png"
                                    width={335}
                                    height={189}
                                    alt="default"
                                    className="w-full lg:min-w-[335px] md:min-w-[171px] min-w-[118px]"
                                />
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
            <Pagination className="mt-4" total={5} page={currentPage} limit={1} />
        </>
    );
};

export default HotPost;