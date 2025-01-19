export type Blog = {
    title: string;
    url: string;
    description: string;
    _tags: string[];
    type: string;
    createdAt: Date;
    imageUrl: string;
    slug: string;
    objectID: string;
};

export default interface GHOST_DETAIL {
    slug: string
    id: string
    uuid: string
    title: string
    html: string
    comment_id: string
    feature_image: string
    featured: boolean
    visibility: string
    created_at: Date
    updated_at: Date
    published_at: Date
    custom_excerpt: string
    codeinjection_head: null
    codeinjection_foot: null
    custom_template: null
    canonical_url: null
    authors: Author[]
    tags: Tag[]
    primary_author: Author
    primary_tag: Tag
    url: string
    excerpt: string
    reading_time: number
    access: boolean
    comments: boolean
    og_image: null
    og_title: null
    og_description: null
    twitter_image: null
    twitter_title: null
    twitter_description: null
    meta_title: null
    meta_description: null
    email_subject: null
    frontmatter: null
    feature_image_alt: null
    feature_image_caption: null
}

export interface Author {
    id: string
    name: string
    slug: string
    profile_image: string
    cover_image: null
    bio: string
    website: string
    location: null
    facebook: string
    twitter: string
    meta_title: null
    meta_description: null
    url: string
}

export interface Tag {
    id: string
    name: string
    slug: string
    description: null
    feature_image: null
    visibility: string
    meta_title: null
    meta_description: null
    og_image: null
    og_title: null
    og_description: null
    twitter_image: null
    twitter_title: null
    twitter_description: null
    codeinjection_head: null
    codeinjection_foot: null
    canonical_url: null
    accent_color: null
    url: string
}
