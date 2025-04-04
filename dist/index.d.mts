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
type ICustomData = {
    key: string;
    value: string;
};
type ILead = {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    website: string;
    source?: string;
    notes?: string;
    customData?: ICustomData[];
    websiteId: string;
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
/**
 * Create a new lead
 * @param leadData - The lead data to create
 * @returns Promise that resolves when the lead is created
 */
declare function createLead(leadData: Omit<ILead, 'websiteId'>): Promise<void>;

export { type CMSResponse, type IBlogCategory, type IBlogPost, type ICustomData, type ILead, createLead, getBlogCategories, getBlogPost, getBlogPosts };
