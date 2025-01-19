import GhostContentAPI from '@tryghost/content-api'
import { Params as GhostParams } from '@tryghost/content-api'

const apiGhost = new GhostContentAPI({
    url: process.env.NEXT_PUBLIC_GHOST_URL as string,
    key: process.env.NEXT_PUBLIC_GHOST_KEY as string,
    version: process.env.NEXT_PUBLIC_GHOST_VERSION || 'v5.82.2',
})

const BlogsApi = {
    getTagPosts: async (options: GhostParams | any): Promise<any> => {
        return await apiGhost.posts.browse(options).catch((err) => {
            throw new Error(err)
        })
    },
    getPosts: async (options: GhostParams): Promise<any> => {
        return await apiGhost.posts.browse(options).catch((err) => {
            console.error(err)
        })
    },
    getSinglePost: async (postSlug: string): Promise<any> => {
        return await apiGhost.posts
            .read(
                {
                    slug: postSlug,
                },
                { include: ['authors', 'tags'] },
            )
            .catch((err) => {
                console.error("Get single post error", err)
            })
    },

    getTags: async (options?: GhostParams): Promise<any> => {
        return await apiGhost.tags.browse(options).catch((err) => {
            console.error(err)
        })
    },

    getPage: async (options: GhostParams): Promise<any> => {
        return await apiGhost.pages.browse(options).catch((err) => {
            console.error(err)
        })
    },
}

export default BlogsApi
