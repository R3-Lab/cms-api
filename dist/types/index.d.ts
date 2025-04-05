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
    website: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
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
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    message?: string | undefined;
    phone?: string | undefined;
    company?: string | undefined;
    website?: string | undefined;
    source?: string | undefined;
    customData?: {
        key: string;
        value: string;
    }[] | undefined;
}, {
    firstName: string;
    lastName: string;
    email: string;
    message?: string | undefined;
    phone?: string | undefined;
    company?: string | undefined;
    website?: string | undefined;
    source?: string | undefined;
    customData?: {
        key: string;
        value: string;
    }[] | undefined;
}>;
type LeadSchemaType = z.infer<typeof leadSchema>;
type BlogPostsQuery = {
    category?: string;
    page?: number;
    limit?: number;
};
type RelatedBlogPostsQuery = {
    category?: string;
    limit?: number;
};

export { type BlogPostsQuery, type CMSResponse, type IBlogCategory, type IBlogPost, type ICustomData, type ILead, type LeadSchemaType, type RelatedBlogPostsQuery, leadSchema };
