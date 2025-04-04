import { Fetcher } from '../src/fetcher';
import { CMSResponse, IBlogPost } from '../src/types';

// Mock fetch
global.fetch = jest.fn();

describe('Fetcher', () => {
  let fetcher: Fetcher;
  
  beforeEach(() => {
    // Reset mocks
    jest.resetAllMocks();
    
    // Create a new fetcher instance for each test
    fetcher = new Fetcher({
      websiteId: 'test-website-id',
      apiKey: 'test-api-key',
    });
  });
  
  describe('constructor', () => {
    it('should use provided options', () => {
      const fetcher = new Fetcher({
        websiteId: 'custom-website-id',
        apiKey: 'custom-api-key',
      });
      
      // @ts-ignore - accessing private properties for testing
      expect(fetcher.defaultWebsiteId).toBe('custom-website-id');
      // @ts-ignore - accessing private properties for testing
      expect(fetcher.defaultApiKey).toBe('custom-api-key');
    });
    
    it('should use environment variables if options not provided', () => {
      // Mock environment variables
      process.env.CMS_WEBSITE_ID = 'env-website-id';
      process.env.CMS_API_KEY = 'env-api-key';
      
      const fetcher = new Fetcher();
      
      // @ts-ignore - accessing private properties for testing
      expect(fetcher.defaultWebsiteId).toBe('env-website-id');
      // @ts-ignore - accessing private properties for testing
      expect(fetcher.defaultApiKey).toBe('env-api-key');
    });
  });
  
  describe('getBlogPosts', () => {
    it('should fetch blog posts successfully', async () => {
      const mockBlogPosts: CMSResponse<IBlogPost[]> = {
        data: [
          {
            title: 'Test Blog Post',
            content: 'Test Content',
            updatedAt: new Date(),
            slug: 'test-blog-post',
            featuredImage: 'test-image.jpg',
            author: 'Test Author',
          },
        ],
      };
      
      // Mock fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBlogPosts),
      });
      
      const result = await fetcher.getBlogPosts();
      
      expect(result).toEqual(mockBlogPosts);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/blog-posts?websiteId=test-website-id'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
          }),
        })
      );
    });
    
    it('should throw an error if the request fails', async () => {
      // Mock fetch error response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' }),
      });
      
      await expect(fetcher.getBlogPosts()).rejects.toThrow('Not found');
    });
  });
  
  describe('getBlogPost', () => {
    it('should fetch a blog post by slug successfully', async () => {
      const mockBlogPost: CMSResponse<IBlogPost> = {
        data: {
          title: 'Test Blog Post',
          content: 'Test Content',
          updatedAt: new Date(),
          slug: 'test-blog-post',
          featuredImage: 'test-image.jpg',
          author: 'Test Author',
        },
      };
      
      // Mock fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBlogPost),
      });
      
      const result = await fetcher.getBlogPost('test-blog-post');
      
      expect(result).toEqual(mockBlogPost);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/blog-post/test-blog-post?websiteId=test-website-id'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
          }),
        })
      );
    });
    
    it('should throw an error if the request fails', async () => {
      // Mock fetch error response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Blog post not found' }),
      });
      
      await expect(fetcher.getBlogPost('non-existent-slug')).rejects.toThrow('Blog post not found');
    });
  });
}); 