import * as next_safe_action__ from 'next-safe-action/.';
import * as zod from 'zod';
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
    website: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
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
    websiteId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    website: string;
    websiteId: string;
    phone?: string | undefined;
    company?: string | undefined;
    source?: string | undefined;
    notes?: string | undefined;
    customData?: {
        value: string;
        key: string;
    }[] | undefined;
}, {
    firstName: string;
    lastName: string;
    email: string;
    website: string;
    websiteId: string;
    phone?: string | undefined;
    company?: string | undefined;
    source?: string | undefined;
    notes?: string | undefined;
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
        tokens: number;
        window: Duration;
    }, {
        tokens: number;
        window: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    limiter?: {
        tokens: number;
        window: Duration;
    } | undefined;
}, {
    name: string;
    limiter?: {
        tokens: number;
        window: string;
    } | undefined;
}>, {
    name: string;
    limiter?: {
        tokens: number;
        window: Duration;
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
        tokens: number;
        window: Duration;
    }, {
        tokens: number;
        window: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    limiter?: {
        tokens: number;
        window: Duration;
    } | undefined;
}, {
    name: string;
    limiter?: {
        tokens: number;
        window: string;
    } | undefined;
}>, {
    name: string;
    limiter?: {
        tokens: number;
        window: Duration;
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
declare function createLeadAction(schema: LeadSchemaType): Promise<next_safe_action__.SafeActionFn<string, zod.ZodObject<{
    firstName: zod.ZodString;
    lastName: zod.ZodString;
    email: zod.ZodString;
    phone: zod.ZodEffects<zod.ZodOptional<zod.ZodString>, string | undefined, string | undefined>;
    company: zod.ZodOptional<zod.ZodString>;
    website: zod.ZodString;
    source: zod.ZodOptional<zod.ZodString>;
    notes: zod.ZodOptional<zod.ZodString>;
    customData: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
        key: zod.ZodString;
        value: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        value: string;
        key: string;
    }, {
        value: string;
        key: string;
    }>, "many">>;
    websiteId: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    website: string;
    websiteId: string;
    phone?: string | undefined;
    company?: string | undefined;
    source?: string | undefined;
    notes?: string | undefined;
    customData?: {
        value: string;
        key: string;
    }[] | undefined;
}, {
    firstName: string;
    lastName: string;
    email: string;
    website: string;
    websiteId: string;
    phone?: string | undefined;
    company?: string | undefined;
    source?: string | undefined;
    notes?: string | undefined;
    customData?: {
        value: string;
        key: string;
    }[] | undefined;
}>, readonly [], {
    _errors?: string[] | undefined;
    firstName?: {
        _errors?: string[] | undefined;
    } | undefined;
    lastName?: {
        _errors?: string[] | undefined;
    } | undefined;
    email?: {
        _errors?: string[] | undefined;
    } | undefined;
    website?: {
        _errors?: string[] | undefined;
    } | undefined;
    websiteId?: {
        _errors?: string[] | undefined;
    } | undefined;
    phone?: {
        _errors?: string[] | undefined;
    } | undefined;
    company?: {
        _errors?: string[] | undefined;
    } | undefined;
    source?: {
        _errors?: string[] | undefined;
    } | undefined;
    notes?: {
        _errors?: string[] | undefined;
    } | undefined;
    customData?: {
        _errors?: string[] | undefined;
    } | undefined;
}, readonly [], void>>;

export { type CMSResponse, type IBlogCategory, type IBlogPost, type ICustomData, type ILead, type LeadSchemaType, actionClient, createLead, createLeadAction, getBlogCategories, getBlogPost, getBlogPosts, leadSchema, rateLimitedActionClient, simpleActionClient };
