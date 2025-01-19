import { handleRequest } from '@/utils/helper';
import algoliasearch from 'algoliasearch/lite';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || '',
);
const algoliaIndex = algoliaClient.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? '');

const Blog = dynamic(() => import("@/components/Blog"), { ssr: false });

const getArticles = async ({ query = '', limit = 8, page = 1, selected = '' }) => {

  const tagDefault = "";
  const tag = selected ? `${selected}` : tagDefault;
  const filterTag = [];
  if (tag.toLowerCase() !== tagDefault) {
    filterTag.push(tag);
  }

  const filter: { page: number; tagFilters?: string[]; hitsPerPage?: number; } = {
    page: page - 1,
    hitsPerPage: limit,
    tagFilters: filterTag,
  };

  const [err, response] = await handleRequest(algoliaIndex.search(query, filter));

  console.log(err);
  if (err) {
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

export default index;