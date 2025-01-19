import GHOST_DETAIL, { IReponseBlogDetail, IReponseBlogs } from '@/@type/blog.type';
import { GHOST_KEY, GHOST_URL } from '@/utils/constant';
import axios from 'axios';

export const getDetailBlogApi = async (slug: string): Promise<IReponseBlogDetail> => {
    return await axios({
        method: 'get',
        url: `${GHOST_URL}/ghost/api/content/posts/slug/${slug}`,
        params: {
            key: GHOST_KEY,
            include: `tags, authors`
        }
    });
};

export const getDetailRelatedBlogApi = async (): Promise<IReponseBlogs> => {
    return await axios({
        method: 'get',
        url: `${GHOST_URL}/ghost/api/content/posts`,
        params: {
            key: GHOST_KEY,
            page: 1,
            limit: 4,
            include: `tags, authors`
        }
    });
};

