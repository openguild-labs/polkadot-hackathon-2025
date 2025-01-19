// import dynamic from 'next/dynamic';
import Blog from '@/components/Blog';
import { handleRequest } from '@/utils/helper';
import { Params as GhostParams } from '@tryghost/content-api';
import algoliasearch from 'algoliasearch/lite';
import { notFound } from 'next/navigation';

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || '',
);
const algoliaIndex = algoliaClient.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? '');

// const BlogPage = dynamic(() => import("@/components/Blog"), { ssr: false });

const getArticles = async ({ query = '', limit = 8, page = 1, selected = '' }) => {

  const tag = selected ? `${selected}` : '';

  const filter: { page: number; tagFilters?: string[]; hitsPerPage?: number; } = {
    page: page - 1,
    hitsPerPage: limit,
    tagFilters: selected ? [tag] : undefined,
  };

  const options: GhostParams = {
    page: page,
    limit: 8,
    include: "tags",
    // filter: typeof selected !== 'undefined' ? `tag:${selected}` : undefined,
    // filter,
    // filter: query

  };
  if (selected) options.filter = `tag:${selected}`;
  const [err, response] = await handleRequest(algoliaIndex.search(query, filter));
  // const [err, response] = await handleRequest(BlogsApi.getPosts(options));
  if (err) {
    console.log(err);
    notFound();
  }

  return {
    // blogs: response,
    // totalPage: response?.meta?.pagination?.pages || 0
    blogs: response.hits,
    totalPage: response.nbPages || 0
  };
};


const index = async ({
  params,
  searchParams,
}: {
  params: { slug: string; };
  searchParams: { [key: string]: string | string[] | undefined; };
}) => {

  const { blogs, totalPage } = await getArticles({
    query: `${searchParams.search || ''}`,
    selected: `${searchParams.tag || ''}`,
    page: searchParams.page ? +`${searchParams.page}` : 1,
  });

  return (
    <div className="lg:page-container px-4 lg:px-0">
        <Blog blogs={blogs || []} totalPage={totalPage} />
    </div>
  );
};


export default index


