import { useState } from 'react';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import GHOST_DETAIL, { Blog } from '@/@type/blog.type';
import { cn } from '@/utils';

import BlogItem from '../components/BlogItem';
import Pagination from '../components/Pagination';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const breakpoints = {
    desktop: {
        point: 1068,
        slidesPerView: 4,
    },
    tablet: {
        point: 768,
        slidesPerView: 2,
    },
    mobile: {
        point: 480,
        slidesPerView: 1,
    }
};

const Related = ({ related }: { related: GHOST_DETAIL[]; }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const onSlideChange = ({ realIndex }: { realIndex: number; }) => {
        if (related.length > 0) setCurrentPage(realIndex);
    };
    if(related.length ===0) return <div/>
    return (
        <>
            <div className="flex flex-col space-y-4 sm:mx-0 sm:space-y-8">
                <Swiper
                    // pagination={pagination}
                    // modules={[Autoplay]}
                    className="w-full h-full"
                    slidesPerGroupSkip={1}
                    slidesPerView={1}
                    spaceBetween={12}
                    breakpoints={{
                        [breakpoints.desktop.point]: {
                            slidesPerView: breakpoints.desktop.slidesPerView,
                            spaceBetween: 20,
                        },
                        [breakpoints.tablet.point]: {
                            slidesPerView: breakpoints.tablet.slidesPerView,
                            spaceBetween: 12,
                        },
                        [breakpoints.mobile.point]: {
                            slidesPerView: breakpoints.mobile.slidesPerView,
                            spaceBetween: 12,
                        },
                    }}
                    loop
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    onSlideChange={onSlideChange}

                >
                    {related?.map((post: GHOST_DETAIL, index) => {
                        const blog = {
                            imageUrl: post.feature_image || '',
                            _tags: post.tags.map(item => item.name),
                            createdAt: post.created_at || new Date(),
                            description: post.meta_description || '',
                            objectID: post.id,
                            slug: post.slug,
                            title: post.title,
                            type: '',
                            url: post.url
                        } as Blog;
                        return (
                            <SwiperSlide key={index} className={cn('relative h-full sm:p-0')}>
                                <Link href={`/blog/${post?.slug}`}>
                                    <BlogItem blog={blog} />
                                </Link>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
            <Pagination className="mt-5" total={related.length} page={currentPage} limit={1} />
        </>
    );
};

export default Related;
