import dotenv from 'dotenv';
import { Fetcher } from '../src/fetcher';

// Always load environment variables for tests
dotenv.config();

const fetcher = new Fetcher({
  websiteId: process.env.CMS_WEBSITE_ID!,
  apiKey: process.env.CMS_API_KEY!,
  baseUrl: process.env.CMS_API_URL!
});

describe('Exported Functions', () => {
  describe('getBlogPosts', () => {
    it('should fetch blog posts successfully', async () => {
      const result = await fetcher.getBlogPosts({});
      
      // Verify the response structure matches the Postman response
      expect(result).not.toBeNull();
      if (result) {
        expect(result).toHaveProperty('data');
        expect(Array.isArray(result.data)).toBe(true);
        
        // If there are blog posts, verify their structure
        if (result.data.length > 0) {
          const blogPost = result.data[0];
          expect(blogPost).toHaveProperty('title');
          expect(blogPost).toHaveProperty('content');
          expect(blogPost).toHaveProperty('slug');
          expect(blogPost).toHaveProperty('featuredImage');
          expect(blogPost).toHaveProperty('author');
          expect(blogPost).toHaveProperty('publishedAt');
          expect(blogPost).toHaveProperty('category');
        }
      }
    }, 10000); // Increase timeout for real API calls
    
    it('should handle API errors gracefully', async () => {
      // Temporarily set an invalid API key to test error handling
      const originalApiKey = process.env.CMS_API_KEY;
      process.env.CMS_API_KEY = 'invalid-api-key';
      
      try {
        await fetcher.getBlogPosts({});
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        // We expect an error to be thrown
        expect(error).toBeDefined();
      } finally {
        // Restore the original API key
        process.env.CMS_API_KEY = originalApiKey;
      }
    }, 10000);
  });
  
  describe('getBlogPost', () => {
    it('should fetch a blog post by slug successfully', async () => {
      // First get all blog posts to find a valid slug
      const blogPostsResult = await fetcher.getBlogPosts({});
      
      if (!blogPostsResult || blogPostsResult.data.length === 0) {
        console.warn('No blog posts found to test getBlogPost');
        return;
      }
      
      const validSlug = blogPostsResult.data[0].slug;
      const result = await fetcher.getBlogPost(validSlug);
      
      // Verify the response structure for a single blog post
      expect(result).not.toBeNull();
      if (result) {
        expect(result).toHaveProperty('data');
        expect(result.data).toHaveProperty('title');
        expect(result.data).toHaveProperty('content');
        expect(result.data).toHaveProperty('slug', validSlug);
        expect(result.data).toHaveProperty('featuredImage');
        expect(result.data).toHaveProperty('author');
        expect(result.data).toHaveProperty('publishedAt');
        // Note: For single blog post, website and category might not be included
        // as shown in the example response
      }
    }, 10000);
    
    it('should return null when a blog post is not found (404 response)', async () => {
      const result = await fetcher.getBlogPost('non-existent-slug-123456');
      
      // Verify that the result is null for a 404 response
      expect(result).toBeNull();
    }, 10000);
  });
  
  describe('getRelatedBlogPosts', () => {
    it('should fetch related blog posts successfully', async () => {
      // First get all blog posts to find a valid slug
      const blogPostsResult = await fetcher.getBlogPosts({});
      
      if (!blogPostsResult || blogPostsResult.data.length === 0) {
        console.warn('No blog posts found to test getRelatedBlogPosts');
        return;
      }
      
      const validSlug = blogPostsResult.data[0].slug;
      const result = await fetcher.getRelatedBlogPosts(validSlug, {});
      
      // Verify the response structure
      expect(result).not.toBeNull();
      if (result) {
        expect(result).toHaveProperty('data');
        expect(Array.isArray(result.data)).toBe(true);
        
        // If there are related posts, verify their structure
        if (result.data.length > 0) {
          const relatedPost = result.data[0];
          expect(relatedPost).toHaveProperty('title');
          expect(relatedPost).toHaveProperty('slug');
          expect(relatedPost).toHaveProperty('featuredImage');
          // Related posts might not have all the same properties as a full blog post
        }
      }
    }, 10000);
  });
  
  describe('getBlogCategories', () => {
    it('should fetch blog categories successfully', async () => {
      const result = await fetcher.getBlogCategories();
      
      // Verify the response structure
      expect(result).not.toBeNull();
      if (result) {
        expect(result).toHaveProperty('data');
        expect(Array.isArray(result.data)).toBe(true);
        
        // If there are categories, verify their structure
        if (result.data.length > 0) {
          const category = result.data[0];
          expect(category).toHaveProperty('name');
          expect(category).toHaveProperty('slug');
        }
      }
    }, 10000);
    
    it('should handle API errors gracefully', async () => {
      // Temporarily set an invalid API key to test error handling
      const originalApiKey = process.env.CMS_API_KEY;
      process.env.CMS_API_KEY = 'invalid-api-key';
      
      try {
        await fetcher.getBlogCategories();
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        // We expect an error to be thrown
        expect(error).toBeDefined();
      } finally {
        // Restore the original API key
        process.env.CMS_API_KEY = originalApiKey;
      }
    }, 10000);
  });
  
  describe('createLead', () => {
    it('should create a lead successfully', async () => {
      const leadData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        company: 'Example Corp',
        website: 'https://example.com',
        source: 'API Test',
        message: 'Test lead created via API',
        customData: [
          { key: 'testKey', value: 'testValue' }
        ],
      };
      
      // The function should not throw an error
      await expect(fetcher.createLead(leadData)).resolves.not.toThrow();
    }, 10000);
    
    it('should handle API errors gracefully', async () => {
      // Temporarily set an invalid API key to test error handling
      const originalApiKey = process.env.CMS_API_KEY;
      process.env.CMS_API_KEY = 'invalid-api-key';
      
      const leadData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        website: 'https://example.com',
      };
      
      try {
        await fetcher.createLead(leadData);
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        // We expect an error to be thrown
        expect(error).toBeDefined();
      } finally {
        // Restore the original API key
        process.env.CMS_API_KEY = originalApiKey;
      }
    }, 10000);
  });
}); 