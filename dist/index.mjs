var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

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
  request(_0) {
    return __async(this, arguments, function* (endpoint, options = {}) {
      if (!this.defaultWebsiteId) {
        throw new FetcherError("Website ID is required");
      }
      if (!this.defaultApiKey) {
        throw new FetcherError("API Key is required");
      }
      const headers2 = __spreadValues({
        "Content-Type": "application/json",
        "x-api-key": this.defaultApiKey
      }, options.headers);
      try {
        const response = yield fetch(`${this.baseUrl}${endpoint}`, __spreadProps(__spreadValues({}, options), {
          headers: headers2
        }));
        const data = yield response.json();
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
    });
  }
  get(endpoint, options) {
    return __async(this, null, function* () {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      url.searchParams.append("websiteId", this.defaultWebsiteId);
      return this.request(url.pathname + url.search, __spreadProps(__spreadValues({}, options), {
        method: "GET"
      }));
    });
  }
  post(endpoint, body, options) {
    return __async(this, null, function* () {
      const requestBody = __spreadProps(__spreadValues({}, body), {
        websiteId: this.defaultWebsiteId
      });
      return this.request(endpoint, __spreadProps(__spreadValues({}, options), {
        method: "POST",
        body: JSON.stringify(requestBody)
      }));
    });
  }
  // Helper methods for blog posts
  getBlogPosts(options) {
    return __async(this, null, function* () {
      return this.get("/api/blog-posts", options);
    });
  }
  getBlogPost(slug, options) {
    return __async(this, null, function* () {
      return this.get(`/api/blog-posts/${slug}`, options);
    });
  }
  // Helper method for blog categories
  getBlogCategories(options) {
    return __async(this, null, function* () {
      return this.get("/api/blog-categories", options);
    });
  }
  // Helper method for leads
  createLead(leadData, options) {
    return __async(this, null, function* () {
      try {
        const response = yield fetch(`${this.baseUrl}/api/leads`, __spreadValues({
          method: "POST",
          headers: __spreadValues({
            "Content-Type": "application/json",
            "x-api-key": this.defaultApiKey
          }, options == null ? void 0 : options.headers),
          body: JSON.stringify(__spreadProps(__spreadValues({}, leadData), {
            websiteId: this.defaultWebsiteId
          }))
        }, options));
        if (!response.ok) {
          const errorData = yield response.json().catch(() => ({}));
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
    });
  }
};

// src/schema.ts
import { z } from "zod";
var customDataSchema = z.object({
  key: z.string().min(1, { message: "Key is required" }),
  value: z.string().min(1, { message: "Value is required" })
});
var leadSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }).max(50, { message: "First name must be less than 50 characters" }),
  lastName: z.string().min(1, { message: "Last name is required" }).max(50, { message: "Last name must be less than 50 characters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  phone: z.string().optional().refine(
    (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
    { message: "Please enter a valid phone number" }
  ),
  company: z.string().max(100, { message: "Company name must be less than 100 characters" }).optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional(),
  source: z.string().max(100, { message: "Source must be less than 100 characters" }).optional(),
  message: z.string().max(500, { message: "Message must be less than 500 characters" }).optional(),
  customData: z.array(customDataSchema).optional()
});

// src/action/safe-action.ts
import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE as DEFAULT_SERVER_ERROR_MESSAGE2 } from "next-safe-action";

// src/action/safe-action-helpers.ts
import { DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { toast } from "sonner";
var VALIDATION_ERROR_MESSAGE = "An error occurred validating your input.";

// src/action/safe-action.ts
import { z as z2, ZodError } from "zod";

// src/action/observability-middleware.ts
import { createMiddleware } from "next-safe-action";
var loggingMiddleware = createMiddleware().define((_0) => __async(void 0, [_0], function* ({ next, metadata, clientInput }) {
  const result = yield next({ ctx: void 0 });
  if (process.env.NODE_ENV === "development") {
    console.debug({ clientInput }, "Input");
    console.debug({ result: result.data }, "Result");
    console.debug({ metadata }, "Metadata");
  }
  return result;
}));

// src/action/ratelimit.middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { createMiddleware as createMiddleware2 } from "next-safe-action";
import { headers } from "next/headers";
import { Redis } from "@upstash/redis";
var redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});
var rateLimitingMiddleware = createMiddleware2().define((_0) => __async(void 0, [_0], function* ({ next, metadata }) {
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
  const ip = (yield headers()).get("x-forwarded-for");
  const { success, remaining } = yield ratelimit.limit(
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
}));

// src/action/safe-action.ts
var durationSchema = z2.string().regex(/^\d+\s*[mshd]{1,2}$/, "Invalid duration format").refine((val) => {
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
    return z2.object({
      name: z2.string(),
      limiter: z2.object({
        tokens: z2.number(),
        window: durationSchema
      }).optional()
    });
  }
});
var actionClient = actionClientWithMeta.use(loggingMiddleware);
var rateLimitedActionClient = actionClientWithMeta.use(loggingMiddleware).use(rateLimitingMiddleware);

// src/index.ts
var fetcher = new Fetcher();
function getBlogPosts() {
  return __async(this, null, function* () {
    return fetcher.getBlogPosts();
  });
}
function getBlogPost(slug) {
  return __async(this, null, function* () {
    return fetcher.getBlogPost(slug);
  });
}
function getBlogCategories() {
  return __async(this, null, function* () {
    return fetcher.getBlogCategories();
  });
}
function createLead(leadData) {
  return __async(this, null, function* () {
    return fetcher.createLead(leadData);
  });
}
export {
  Fetcher,
  actionClient,
  createLead,
  getBlogCategories,
  getBlogPost,
  getBlogPosts,
  leadSchema,
  rateLimitedActionClient,
  simpleActionClient
};
