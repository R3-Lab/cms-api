import { CMSResponse, BlogPostsQuery, IBlogPost, IBlogCategory, RelatedBlogPostsQuery, LeadSchemaType } from './types/index.js';
import * as next_safe_action from 'next-safe-action';
import { z } from 'zod';
import { Duration } from '@upstash/ratelimit';

type FetcherOptions = {
    websiteId?: string;
    apiKey?: string;
    baseUrl?: string;
};
type RequestOptions = Omit<RequestInit, 'headers'> & {
    headers?: Record<string, string>;
};
declare class Fetcher {
    private baseUrl;
    private defaultWebsiteId?;
    private defaultApiKey?;
    constructor(options?: FetcherOptions);
    private request;
    get<T>(endpoint: string, params?: Record<string, string | number>, options?: RequestOptions): Promise<CMSResponse<T> | null>;
    post<T>(endpoint: string, body: any, options?: RequestOptions): Promise<CMSResponse<T> | null>;
    getBlogPosts(query?: BlogPostsQuery, options?: RequestOptions): Promise<CMSResponse<IBlogPost[]>>;
    getBlogPost(slug: string, options?: RequestOptions): Promise<CMSResponse<IBlogPost> | null>;
    getBlogCategories(options?: RequestOptions): Promise<CMSResponse<IBlogCategory[]>>;
    getRelatedBlogPosts(slug: string, query?: RelatedBlogPostsQuery, options?: RequestOptions): Promise<CMSResponse<IBlogPost[]> | null>;
    createLead(leadData: LeadSchemaType, options?: RequestOptions): Promise<void>;
}

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

export { Fetcher, actionClient, rateLimitedActionClient, simpleActionClient };
