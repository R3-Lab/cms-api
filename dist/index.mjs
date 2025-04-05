// src/fetcher.ts
var FetcherError = class extends Error {
  constructor(message = "An error occurred", status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "FetcherError";
  }
};
var Fetcher = class {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || process.env.CMS_API_URL || "https://cms.r3lab.com";
    this.defaultWebsiteId = options.websiteId || process.env.CMS_WEBSITE_ID;
    this.defaultApiKey = options.apiKey || process.env.CMS_API_KEY;
  }
  async request(endpoint, options = {}) {
    if (!this.defaultWebsiteId) {
      throw new FetcherError("Website ID is required");
    }
    if (!this.defaultApiKey) {
      throw new FetcherError("API Key is required");
    }
    const headers2 = {
      "Content-Type": "application/json",
      "x-api-key": this.defaultApiKey,
      ...options.headers
    };
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: headers2
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "An error occurred";
        throw new FetcherError(
          typeof errorMessage === "string" ? errorMessage : "An error occurred",
          response.status,
          data
        );
      }
      return data;
    } catch (error) {
      if (error instanceof FetcherError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      throw new FetcherError(
        typeof errorMessage === "string" ? errorMessage : "An error occurred"
      );
    }
  }
  async get(endpoint, params, options) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append("websiteId", this.defaultWebsiteId);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });
    }
    return this.request(url.pathname + url.search, {
      ...options,
      method: "GET"
    });
  }
  async post(endpoint, body, options) {
    const requestBody = {
      ...body,
      websiteId: this.defaultWebsiteId
    };
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(requestBody)
    });
  }
  // Helper methods for blog posts
  async getBlogPosts(query, options) {
    return this.get("/api/blog-posts", query, options);
  }
  // Helper method for blog post by slug
  async getBlogPost(slug, options) {
    return this.get(`/api/blog-posts/${slug}`, {}, options);
  }
  // Helper method for blog categories
  async getBlogCategories(options) {
    return this.get("/api/blog-categories", {}, options);
  }
  // Helper method for related blog posts
  async getRelatedBlogPosts(slug, query, options) {
    return this.get(`/api/blog-posts/${slug}/related`, query, options);
  }
  // Helper method for leads
  async createLead(leadData, options) {
    try {
      const response = await fetch(`${this.baseUrl}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.defaultApiKey,
          ...options == null ? void 0 : options.headers
        },
        body: JSON.stringify({
          ...leadData,
          websiteId: this.defaultWebsiteId
        }),
        ...options
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new FetcherError(
          errorData.message || "Failed to create lead",
          response.status,
          errorData
        );
      }
      return;
    } catch (error) {
      if (error instanceof FetcherError) {
        throw error;
      }
      throw new FetcherError(
        error instanceof Error ? error.message : "Failed to create lead"
      );
    }
  }
};

// src/action/safe-action.ts
import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE as DEFAULT_SERVER_ERROR_MESSAGE2 } from "next-safe-action";

// src/action/safe-action-helpers.ts
import { DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { toast } from "sonner";
var VALIDATION_ERROR_MESSAGE = "An error occurred validating your input.";

// src/action/safe-action.ts
import { z, ZodError } from "zod";

// src/action/observability-middleware.ts
import { createMiddleware } from "next-safe-action";
var loggingMiddleware = createMiddleware().define(async ({ next, metadata, clientInput }) => {
  const result = await next({ ctx: void 0 });
  if (process.env.NODE_ENV === "development") {
    console.debug({ clientInput }, "Input");
    console.debug({ result: result.data }, "Result");
    console.debug({ metadata }, "Metadata");
  }
  return result;
});

// src/action/ratelimit.middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { createMiddleware as createMiddleware2 } from "next-safe-action";
import { headers } from "next/headers";
import { Redis } from "@upstash/redis";
var redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});
var rateLimitingMiddleware = createMiddleware2().define(async ({ next, metadata }) => {
  const {
    limiter = {
      // Default to 1 requests per 14 hours
      tokens: 1,
      window: "14h"
    },
    name
  } = metadata;
  const channel = "action";
  const ratelimit = new Ratelimit({
    limiter: Ratelimit.fixedWindow(limiter.tokens, limiter.window),
    redis: redisClient
  });
  const ip = (await headers()).get("x-forwarded-for");
  const { success, remaining } = await ratelimit.limit(
    `${ip}-${channel}-${name}`
  );
  if (!success) {
    throw new Error("Seems like you've already send this form. Please try again later.");
  }
  return next({
    ctx: {
      ratelimit: {
        remaining
      }
    }
  });
});

// src/action/safe-action.ts
var durationSchema = z.string().regex(/^\d+\s*[mshd]{1,2}$/, "Invalid duration format").refine((val) => {
  const [num, unit] = val.split(/\s+/).filter(Boolean);
  return !isNaN(Number(num)) && ["ms", "s", "m", "h", "d"].includes(unit);
}, "Duration must be a number followed by a valid unit (ms, s, m, h, d)");
var simpleActionClient = createSafeActionClient();
var actionClientWithMeta = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof ZodError) {
      console.error(e.message);
      return VALIDATION_ERROR_MESSAGE;
    } else if (e instanceof Error) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE2;
  },
  defineMetadataSchema() {
    return z.object({
      name: z.string(),
      limiter: z.object({
        tokens: z.number(),
        window: durationSchema
      }).optional()
    });
  }
});
var actionClient = actionClientWithMeta.use(loggingMiddleware);
var rateLimitedActionClient = actionClientWithMeta.use(loggingMiddleware).use(rateLimitingMiddleware);
export {
  Fetcher,
  actionClient,
  rateLimitedActionClient,
  simpleActionClient
};
//# sourceMappingURL=index.mjs.map