import { z } from 'zod';
import * as next_safe_action from 'next-safe-action';
import { Duration } from '@upstash/ratelimit';

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
        value: string;
        key: string;
    }, {
        value: string;
        key: string;
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
        value: string;
        key: string;
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
        value: string;
        key: string;
    }[] | undefined;
}>;
type LeadSchemaType = z.infer<typeof leadSchema>;

declare const simpleActionClient: next_safe_action.SafeActionClient<string, undefined, undefined, undefined, {}, undefined, undefined, undefined, readonly [], {
    formErrors: string[];
    fieldErrors: {};
} | undefined, readonly []>;
declare const actionClient: next_safe_action.SafeActionClient<string, undefined, z.ZodObject<{
    name: z.ZodString;
    limiter: z.ZodOptional<z.ZodObject<{
        tokens: z.ZodNumber;
        window: z.ZodEffects<z.ZodString, Duration, string>;
    }, "strip", z.ZodTypeAny, {
        window: Duration;
        tokens: number;
    }, {
        window: string;
        tokens: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    limiter?: {
        window: Duration;
        tokens: number;
    } | undefined;
}, {
    name: string;
    limiter?: {
        window: string;
        tokens: number;
    } | undefined;
}>, {
    name: string;
    limiter?: {
        window: Duration;
        tokens: number;
    } | undefined;
}, object, undefined, undefined, undefined, readonly [], {
    formErrors: string[];
    fieldErrors: {};
} | undefined, readonly []>;
declare const rateLimitedActionClient: next_safe_action.SafeActionClient<string, undefined, z.ZodObject<{
    name: z.ZodString;
    limiter: z.ZodOptional<z.ZodObject<{
        tokens: z.ZodNumber;
        window: z.ZodEffects<z.ZodString, Duration, string>;
    }, "strip", z.ZodTypeAny, {
        window: Duration;
        tokens: number;
    }, {
        window: string;
        tokens: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    limiter?: {
        window: Duration;
        tokens: number;
    } | undefined;
}, {
    name: string;
    limiter?: {
        window: string;
        tokens: number;
    } | undefined;
}>, {
    name: string;
    limiter?: {
        window: Duration;
        tokens: number;
    } | undefined;
}, {
    ratelimit: {
        remaining: number;
    };
}, undefined, undefined, undefined, readonly [], {
    formErrors: string[];
    fieldErrors: {};
} | undefined, readonly []>;

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
declare function createLead(leadData: LeadSchemaType): Promise<void>;

export { type CMSResponse, type IBlogCategory, type IBlogPost, type ICustomData, type ILead, type LeadSchemaType, actionClient, createLead, getBlogCategories, getBlogPost, getBlogPosts, leadSchema, rateLimitedActionClient, simpleActionClient };
