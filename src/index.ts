import dotenv from 'dotenv';
import { Fetcher } from './fetcher';
import { CMSResponse, IBlogPost, IBlogCategory, ILead, ICustomData } from './types';

// Load environment variables from .env file
dotenv.config();

// Export types
export type { CMSResponse, IBlogPost, IBlogCategory, ILead, ICustomData };

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
