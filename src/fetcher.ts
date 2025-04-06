import { CMSResponse, IBlogPost, IBlogCategory, ILead } from './types';
import { BlogPostsQuery, LeadSchemaType, RelatedBlogPostsQuery } from './schema';

type FetcherOptions = {
    websiteId?: string;
    apiKey?: string;
    baseUrl?: string;
}

type RequestOptions = Omit<RequestInit, 'headers'> & {
    headers?: Record<string, string>;
}

export class FetcherError extends Error {
    constructor(
        message: string = 'An error occurred',
        public status?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'FetcherError';
    }
}

export class Fetcher {
    private baseUrl: string;
    private defaultWebsiteId?: string;
    private defaultApiKey?: string;

    constructor(options: FetcherOptions = {}) {
        this.baseUrl = options.baseUrl || process.env.CMS_API_URL || 'https://cms.r3lab.com';
        this.defaultWebsiteId = options.websiteId || process.env.CMS_WEBSITE_ID;
        this.defaultApiKey = options.apiKey || process.env.CMS_API_KEY;
    }

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<CMSResponse<T> | null> {
        if (!this.defaultWebsiteId) {
            throw new FetcherError('Website ID is required');
        }

        if (!this.defaultApiKey) {
            throw new FetcherError('API Key is required');
        }

        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': this.defaultApiKey,
            ...options.headers,
        };

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            // Handle 404 responses gracefully by returning null
            if (response.status === 404) {
                return null;
            }

            if (!response.ok) {
                const errorMessage = data.message || 'An error occurred';
                throw new FetcherError(
                    typeof errorMessage === 'string' ? errorMessage : 'An error occurred',
                    response.status,
                    data
                );
            }

            return data;
        } catch (error) {
            if (error instanceof FetcherError) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            throw new FetcherError(
                typeof errorMessage === 'string' ? errorMessage : 'An error occurred'
            );
        }
    }

    async get<T>(endpoint: string, params?: Record<string, string | number>, options?: RequestOptions): Promise<CMSResponse<T> | null> {
        // Add websiteId to search params for GET requests
        const url = new URL(`${this.baseUrl}${endpoint}`);
        url.searchParams.append('websiteId', this.defaultWebsiteId!);        

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value.toString());
            });
        }

        return this.request<T>(url.pathname + url.search, { 
            ...options, 
            method: 'GET' 
        });
    }

    async post<T>(
        endpoint: string,
        body: any,
        options?: RequestOptions
    ): Promise<CMSResponse<T> | null> {
        // Include websiteId in the body for POST requests
        const requestBody = {
            ...body,
            websiteId: this.defaultWebsiteId,
        };
        
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(requestBody),
        });
    }
    
    // Helper methods for blog posts
    async getBlogPosts(query?: BlogPostsQuery, options?: RequestOptions): Promise<CMSResponse<IBlogPost[]>> {
        const result = await this.get<IBlogPost[]>('/api/blog-posts', query, options);
        return result || { data: [] };
    }
    
    // Helper method for blog post by slug
    async getBlogPost(slug: string, options?: RequestOptions): Promise<CMSResponse<IBlogPost> | null> {
        return this.get<IBlogPost>(`/api/blog-posts/${slug}`, {}, options);
    }
    
    // Helper method for blog categories
    async getBlogCategories(options?: RequestOptions): Promise<CMSResponse<IBlogCategory[]>> {
        const result = await this.get<IBlogCategory[]>('/api/blog-categories', {}, options);
        return result || { data: [] };
    }

    // Helper method for related blog posts
    async getRelatedBlogPosts(slug: string, query?: RelatedBlogPostsQuery, options?: RequestOptions): Promise<CMSResponse<IBlogPost[]> | null> {
        const result = await this.get<IBlogPost[]>(`/api/blog-posts/${slug}/related`, query, options);
        return result || { data: [] };
    }
    
    // Helper method for leads
    async createLead(leadData: LeadSchemaType, options?: RequestOptions): Promise<void> {
        try {
            // For lead creation, we don't expect a standard CMSResponse format
            // Instead, we'll handle the response directly
            const response = await fetch(`${this.baseUrl}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.defaultApiKey!,
                    ...options?.headers,
                },
                body: JSON.stringify({
                    ...leadData,
                    websiteId: this.defaultWebsiteId,
                }),
                ...options,
            });

            // Check if the response is successful (any 2xx status code)
            if (!response.ok) {
                // If the response is not successful, handle the error
                const errorData = await response.json().catch(() => ({}));
                throw new FetcherError(
                    errorData.message || 'Failed to create lead',
                    response.status,
                    errorData
                );
            }
            
            // For lead creation, we don't need to return any data
            return;
        } catch (error) {
            if (error instanceof FetcherError) {
                throw error;
            }
            throw new FetcherError(
                error instanceof Error ? error.message : 'Failed to create lead'
            );
        }
    }
} 