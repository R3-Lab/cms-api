import dotenv from 'dotenv';
import { Fetcher } from './fetcher';
import { CMSResponse, IBlogPost, IBlogCategory } from './types';

// Load environment variables from .env file
dotenv.config();

// Export types
export type { CMSResponse, IBlogPost, IBlogCategory };

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
