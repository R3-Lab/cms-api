"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BlogPostRenderer: () => BlogPostContent,
  Fetcher: () => Fetcher,
  actionClient: () => actionClient,
  createLead: () => createLead,
  getBlogCategories: () => getBlogCategories,
  getBlogPost: () => getBlogPost,
  getBlogPosts: () => getBlogPosts,
  leadSchema: () => leadSchema,
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
var import_zod = require("zod");
var customDataSchema = import_zod.z.object({
  key: import_zod.z.string().min(1, { message: "Key is required" }),
  value: import_zod.z.string().min(1, { message: "Value is required" })
});
var leadSchema = import_zod.z.object({
  firstName: import_zod.z.string().min(1, { message: "First name is required" }).max(50, { message: "First name must be less than 50 characters" }),
  lastName: import_zod.z.string().min(1, { message: "Last name is required" }).max(50, { message: "Last name must be less than 50 characters" }),
  email: import_zod.z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  phone: import_zod.z.string().optional().refine(
    (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
    { message: "Please enter a valid phone number" }
  ),
  company: import_zod.z.string().max(100, { message: "Company name must be less than 100 characters" }).optional(),
  website: import_zod.z.string().url({ message: "Please enter a valid URL" }).optional(),
  source: import_zod.z.string().max(100, { message: "Source must be less than 100 characters" }).optional(),
  message: import_zod.z.string().max(500, { message: "Message must be less than 500 characters" }).optional(),
  customData: import_zod.z.array(customDataSchema).optional()
});

// src/action/safe-action.ts
var import_next_safe_action4 = require("next-safe-action");

// src/action/safe-action-helpers.ts
var import_next_safe_action = require("next-safe-action");
var import_sonner = require("sonner");
var VALIDATION_ERROR_MESSAGE = "An error occurred validating your input.";

// src/action/safe-action.ts
var import_zod2 = require("zod");

// src/action/observability-middleware.ts
var import_next_safe_action2 = require("next-safe-action");
var loggingMiddleware = (0, import_next_safe_action2.createMiddleware)().define((_0) => __async(void 0, [_0], function* ({ next, metadata, clientInput }) {
  const result = yield next({ ctx: void 0 });
  if (process.env.NODE_ENV === "development") {
    console.debug({ clientInput }, "Input");
    console.debug({ result: result.data }, "Result");
    console.debug({ metadata }, "Metadata");
  }
  return result;
}));

// src/action/ratelimit.middleware.ts
var import_ratelimit = require("@upstash/ratelimit");
var import_next_safe_action3 = require("next-safe-action");
var import_headers = require("next/headers");
var import_redis = require("@upstash/redis");
var redisClient = new import_redis.Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});
var rateLimitingMiddleware = (0, import_next_safe_action3.createMiddleware)().define((_0) => __async(void 0, [_0], function* ({ next, metadata }) {
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
  const ip = (yield (0, import_headers.headers)()).get("x-forwarded-for");
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
var durationSchema = import_zod2.z.string().regex(/^\d+\s*[mshd]{1,2}$/, "Invalid duration format").refine((val) => {
  const [num, unit] = val.split(/\s+/).filter(Boolean);
  return !isNaN(Number(num)) && ["ms", "s", "m", "h", "d"].includes(unit);
}, "Duration must be a number followed by a valid unit (ms, s, m, h, d)");
var simpleActionClient = (0, import_next_safe_action4.createSafeActionClient)();
var actionClientWithMeta = (0, import_next_safe_action4.createSafeActionClient)({
  handleServerError(e) {
    if (e instanceof import_zod2.ZodError) {
      console.error(e.message);
      return VALIDATION_ERROR_MESSAGE;
    } else if (e instanceof Error) {
      return e.message;
    }
    return import_next_safe_action4.DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return import_zod2.z.object({
      name: import_zod2.z.string(),
      limiter: import_zod2.z.object({
        tokens: import_zod2.z.number(),
        window: durationSchema
      }).optional()
    });
  }
});
var actionClient = actionClientWithMeta.use(loggingMiddleware);
var rateLimitedActionClient = actionClientWithMeta.use(loggingMiddleware).use(rateLimitingMiddleware);

// src/blog-post-content.tsx
var import_react = __toESM(require("react"));
var import_react2 = require("@tiptap/react");
var import_starter_kit = __toESM(require("@tiptap/starter-kit"));
var import_extension_heading = __toESM(require("@tiptap/extension-heading"));
var import_extension_image = __toESM(require("@tiptap/extension-image"));
var import_extension_link = __toESM(require("@tiptap/extension-link"));
var import_extension_underline = __toESM(require("@tiptap/extension-underline"));
var import_extension_text_align = __toESM(require("@tiptap/extension-text-align"));
function BlogPostContent({ content }) {
  const editor = (0, import_react2.useEditor)({
    immediatelyRender: false,
    extensions: [
      import_starter_kit.default.configure({
        heading: false
      }),
      import_extension_heading.default.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "heading-styles"
        }
      }),
      import_extension_link.default.configure({
        openOnClick: false
      }),
      import_extension_image.default,
      import_extension_underline.default,
      import_extension_text_align.default.configure({
        types: ["heading", "paragraph"]
      })
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-base max-w-none focus:outline-none dark:prose-invert prose-p:my-2 prose-headings:mt-6 prose-headings:mb-3 [&_.heading-styles:is(h1)]:text-3xl [&_.heading-styles:is(h1)]:font-bold [&_.heading-styles:is(h2)]:text-2xl [&_.heading-styles:is(h2)]:font-semibold [&_.heading-styles:is(h3)]:text-xl [&_.heading-styles:is(h3)]:font-medium"
      }
    }
  });
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "min-h-[200px]" }, /* @__PURE__ */ import_react.default.createElement(import_react2.EditorContent, { editor }));
}

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlogPostRenderer,
  Fetcher,
  actionClient,
  createLead,
  getBlogCategories,
  getBlogPost,
  getBlogPosts,
  leadSchema,
  rateLimitedActionClient,
  simpleActionClient
});
