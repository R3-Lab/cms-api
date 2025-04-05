import { Fetcher } from './fetcher';
import { CMSResponse, IBlogPost, IBlogCategory, ILead, ICustomData } from './types';
import { leadSchema, LeadSchemaType } from './schema';
import { actionClient, rateLimitedActionClient, simpleActionClient } from './action/safe-action';

// Export fetcher
export { Fetcher };

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
export async function createLead(leadData: LeadSchemaType): Promise<void> {
    return fetcher.createLead(leadData);
}

// export async function createLeadAction(schema: LeadSchemaType) {
//     return rateLimitedActionClient
//         .schema(leadSchema)
//         .action(async ({ parsedInput }) => {
//             createLead(parsedInput);
//         });
// }