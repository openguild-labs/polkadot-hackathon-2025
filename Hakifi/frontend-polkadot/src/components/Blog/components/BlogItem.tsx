"use client";

import { Blog } from '@/@type/blog.type';
import Button from '@/components/common/Button';
import { formatTime } from '@/utils/format';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const BlogItem = ({ blog }: { blog: Blog; }) => {
    const router = useRouter();
    const filters = useMemo<string[]>(() => blog._tags || [], [blog._tags]);

    const handleRedirectToDetail = () => {
        router.push(`/blog/${blog.slug}`);
    };

    return (
        <article className="p-3 lg:p-4 rounded-[6px] border-divider-secondary border cursor-pointer bg-background-tertiary hover:border-typo-accent hover:bg-background-secondary duration-300 ease-out" onClick={handleRedirectToDetail}>

            {
                blog.imageUrl ? <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    width={240}
                    height={170}
                    className="w-full object-cover h-[170px] rounded"
                /> :
                    <Image
                        src="/assets/images/blog_default.png"
                        width={240}
                        height={170}
                        alt="default"
                        className="w-full object-cover h-[170px] rounded"
                    />
            }

            <p className="mt-4 text-body-16 text-typo-primary whitespace-nowrap overflow-hidden text-ellipsis">{blog.title}</p>
            <section className="flex mt-3 items-center gap-2">
                <p className="text-body-14 text-typo-secondary">{formatTime(blog.createdAt, "yyyy-MM-dd")}</p>
                {
                    filters.map((item, index) => {
                        return <div key={item} className="text-typo-primary text-body-12 px-1 py-0.5 bg-background-primary rounded-sm">
                            {item}
                        </div>;
                    })
                }
            </section>
        </article>
    );
};

export default BlogItem;