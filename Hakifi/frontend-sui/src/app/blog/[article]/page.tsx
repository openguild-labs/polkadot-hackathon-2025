import GHOST_DETAIL from "@/@type/blog.type";
import BlogPage from "@/components/Blog";
import BlogDetailPage from "@/components/Blog/Detail";
import BlogsApi from "@/components/Ghost";
import { handleParseDescription } from "@/utils/helper";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";


type BlogDetailProps = {
    posts: GHOST_DETAIL;
    tabPosts: GHOST_DETAIL[];
};

type Props = {
    params: { article: string; };
};

// export async function generateMetadata(
//     { params }: Props,
//     parent: ResolvingMetadata
// ): Promise<Metadata> {
//     const { article } = params;

//     let postDetail: GHOST_DETAIL;
//     try {
//         const { post } = await getData(article);
//         postDetail = post;
//     } catch (error) {
//         console.log(error);
//         notFound();
//     }


//     // optionally access and extend (rather than replace) parent metadata
//     const _parrent = await parent;
//     const previousImages = _parrent.openGraph?.images || [];
//     const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog/${article}`;
//     return {
//         title: postDetail?.title || '',
//         description: handleParseDescription(postDetail?.excerpt as string),
//         colorScheme: _parrent.colorScheme,
//         themeColor: _parrent.themeColor,
//         alternates: {
//             canonical: url,
//         },
//         openGraph: {
//             type: 'website',
//             title: postDetail?.title,
//             description: handleParseDescription(postDetail?.excerpt as string),
//             url: url,
//             siteName: _parrent.openGraph?.siteName,
//             images: [
//                 {
//                     url: postDetail?.feature_image || '',
//                     width: 1200,
//                     height: 674,
//                     alt: postDetail?.feature_image_alt || postDetail?.title,
//                 },
//                 ...previousImages,
//             ],
//         },
//         twitter: {
//             site: _parrent.twitter?.site || undefined,
//             title: postDetail?.twitter_title || postDetail?.title,
//             description: postDetail?.twitter_description || undefined,
//             card: 'summary_large_image',
//             images: [
//                 {
//                     url: postDetail?.feature_image || '',
//                     width: 1200,
//                     height: 674,
//                     alt: postDetail?.feature_image_alt || postDetail?.title,
//                 },
//             ],
//         },
//         authors: postDetail?.authors?.map((author) => ({
//             name: author.name,
//         })),
//     };
// }

async function getData(article: string) {
    try {
        const post = await BlogsApi.getSinglePost(article);
        const options = {
            page: 1,
            limit: 4,
            include: ['tags', 'authors'],
        };

        const relatedPosts = await BlogsApi.getTagPosts(options);

        return {
            post: post,
            relatedPosts
        };
    } catch (error) {
        console.log(error);
        notFound();
    }
}

export default async function BlogDetail({
    params,
}: {
    params: {
        article: string;
    };
}) {
    const blog = await getData(params.article);
    return (
        <main className="gap-2 bg-support-black">
            <BlogDetailPage post={blog.post} relatedPosts={blog.relatedPosts} />
        </main>
    );
}