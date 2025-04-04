type IBlogPost = {
    slug: string;
    category?: {
        name: string;
        slug: string;
    };
    title: string;
    excerpt?: string;
    content: string;
    featuredImage: string;
    author: string;
    publishedAt?: Date;
};
type IBlogCategory = {
    name: string;
    slug: string;
};
type CMSResponse<T> = {
    data: T;
    meta?: {
        [key: string]: any;
    };
};

/**
 * Get all blog posts
 * @returns Promise with blog posts data
 */
declare function getBlogPosts(): Promise<CMSResponse<IBlogPost[]>>;
/**
 * Get a specific blog post by slug
 * @param slug - The blog post slug
 * @returns Promise with blog post data
 */
declare function getBlogPost(slug: string): Promise<CMSResponse<IBlogPost>>;
/**
 * Get all blog categories
 * @returns Promise with blog categories data
 */
declare function getBlogCategories(): Promise<CMSResponse<IBlogCategory[]>>;

export { type CMSResponse, type IBlogCategory, type IBlogPost, getBlogCategories, getBlogPost, getBlogPosts };
