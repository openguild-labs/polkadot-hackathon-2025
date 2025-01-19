
import Link from 'next/link';

// Import Swiper styles
import GHOST_DETAIL, { Blog } from '@/@type/blog.type';

import BlogItem from '../components/BlogItem';

const Related = ({ related }: { related: GHOST_DETAIL[]; }) => {
    if (related.length === 0) return <div />;
    return (
        <>
            <div className="flex flex-col space-y-4 sm:mx-0 sm:space-y-8">
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
                        <section key={index} className="relative h-full sm:p-0">
                            <Link href={`/blog/${post?.slug}`}>
                                <BlogItem blog={blog} />
                            </Link>
                        </section>
                    );
                })}
            </div>
        </>
    );
};

export default Related;
