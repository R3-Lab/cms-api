import dotenv from 'dotenv';
import { Fetcher } from './fetcher';
import { CMSResponse, IBlogPost, IBlogCategory, ILead, ICustomData } from './types';
import { leadSchema, LeadSchemaType } from './schema';
import { actionClient, rateLimitedActionClient, simpleActionClient } from './action/safe-action';

// Load environment variables from .env file only if not in Next.js or Vercel environment
if (typeof window === 'undefined' && !process.env.VERCEL && !process.env.NEXT_PUBLIC_VERCEL_ENV) {
    dotenv.config();
}

// Export types
export type { CMSResponse, IBlogPost, IBlogCategory, ILead, ICustomData };

// Export schema
export { leadSchema, type LeadSchemaType };

// Export actions
export { actionClient, rateLimitedActionClient, simpleActionClient };

// Create a singleton fetcher instance
const fetcher = new Fetcher();

/**
 * Get all blog posts
 * @returns Promise with blog posts data
 */
export async function getBlogPosts(): Promise<CMSResponse<IBlogPost[]>> {
    return fetcher.getBlogPosts();
}

/**
 * Get a specific blog post by slug
 * @param slug - The blog post slug
 * @returns Promise with blog post data
 */
export async function getBlogPost(slug: string): Promise<CMSResponse<IBlogPost>> {
    return fetcher.getBlogPost(slug);
}

/**
 * Get all blog categories
 * @returns Promise with blog categories data
 */
export async function getBlogCategories(): Promise<CMSResponse<IBlogCategory[]>> {
    return fetcher.getBlogCategories();
}

/**
 * Create a new lead
 * @param leadData - The lead data to create
 * @returns Promise that resolves when the lead is created
 */
export async function createLead(leadData: Omit<ILead, 'websiteId'>): Promise<void> {
    return fetcher.createLead(leadData);
}
