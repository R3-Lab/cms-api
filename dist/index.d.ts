import { z } from 'zod';

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

declare const leadSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    company: z.ZodOptional<z.ZodString>;
    website: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    customData: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        key: string;
        value: string;
    }, {
        key: string;
        value: string;
    }>, "many">>;
    websiteId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    websiteId: string;
    firstName: string;
    lastName: string;
    email: string;
    website: string;
    phone?: string | undefined;
    company?: string | undefined;
    source?: string | undefined;
    notes?: string | undefined;
    customData?: {
        key: string;
        value: string;
    }[] | undefined;
}, {
    websiteId: string;
    firstName: string;
    lastName: string;
    email: string;
    website: string;
    phone?: string | undefined;
    company?: string | undefined;
    source?: string | undefined;
    notes?: string | undefined;
    customData?: {
        key: string;
        value: string;
    }[] | undefined;
}>;
type LeadSchemaType = z.infer<typeof leadSchema>;

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

export { type CMSResponse, type IBlogCategory, type IBlogPost, type ICustomData, type ILead, type LeadSchemaType, createLead, getBlogCategories, getBlogPost, getBlogPosts, leadSchema };
