"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Fetcher: () => Fetcher,
  actionClient: () => actionClient,
  rateLimitedActionClient: () => rateLimitedActionClient,
  simpleActionClient: () => simpleActionClient
});
module.exports = __toCommonJS(index_exports);

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
var import_next_safe_action4 = require("next-safe-action");

// src/action/safe-action-helpers.ts
var import_next_safe_action = require("next-safe-action");
var import_sonner = require("sonner");
var VALIDATION_ERROR_MESSAGE = "An error occurred validating your input.";

// src/action/safe-action.ts
var import_zod = require("zod");

// src/action/observability-middleware.ts
var import_next_safe_action2 = require("next-safe-action");
var loggingMiddleware = (0, import_next_safe_action2.createMiddleware)().define(async ({ next, metadata, clientInput }) => {
  const result = await next({ ctx: void 0 });
  if (process.env.NODE_ENV === "development") {
    console.debug({ clientInput }, "Input");
    console.debug({ result: result.data }, "Result");
    console.debug({ metadata }, "Metadata");
  }
  return result;
});

// src/action/ratelimit.middleware.ts
var import_ratelimit = require("@upstash/ratelimit");
var import_next_safe_action3 = require("next-safe-action");
var import_headers = require("next/headers");
var import_redis = require("@upstash/redis");
var redisClient = new import_redis.Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});
var rateLimitingMiddleware = (0, import_next_safe_action3.createMiddleware)().define(async ({ next, metadata }) => {
  const {
    limiter = {
      // Default to 1 requests per 14 hours
      tokens: 1,
      window: "14h"
    },
    name
  } = metadata;
  const channel = "action";
  const ratelimit = new import_ratelimit.Ratelimit({
    limiter: import_ratelimit.Ratelimit.fixedWindow(limiter.tokens, limiter.window),
    redis: redisClient
  });
  const ip = (await (0, import_headers.headers)()).get("x-forwarded-for");
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
var durationSchema = import_zod.z.string().regex(/^\d+\s*[mshd]{1,2}$/, "Invalid duration format").refine((val) => {
  const [num, unit] = val.split(/\s+/).filter(Boolean);
  return !isNaN(Number(num)) && ["ms", "s", "m", "h", "d"].includes(unit);
}, "Duration must be a number followed by a valid unit (ms, s, m, h, d)");
var simpleActionClient = (0, import_next_safe_action4.createSafeActionClient)();
var actionClientWithMeta = (0, import_next_safe_action4.createSafeActionClient)({
  handleServerError(e) {
    if (e instanceof import_zod.ZodError) {
      console.error(e.message);
      return VALIDATION_ERROR_MESSAGE;
    } else if (e instanceof Error) {
      return e.message;
    }
    return import_next_safe_action4.DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return import_zod.z.object({
      name: import_zod.z.string(),
      limiter: import_zod.z.object({
        tokens: import_zod.z.number(),
        window: durationSchema
      }).optional()
    });
  }
});
var actionClient = actionClientWithMeta.use(loggingMiddleware);
var rateLimitedActionClient = actionClientWithMeta.use(loggingMiddleware).use(rateLimitingMiddleware);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Fetcher,
  actionClient,
  rateLimitedActionClient,
  simpleActionClient
});
//# sourceMappingURL=index.js.map