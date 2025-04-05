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
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports, module) {
    module.exports = {
      name: "dotenv",
      version: "16.4.7",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module) {
    "use strict";
    var fs = __require("fs");
    var path = __require("path");
    var os = __require("os");
    var crypto = __require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path2 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path2, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path2} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// src/index.ts
var import_dotenv = __toESM(require_main());

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
    this.baseUrl = process.env.CMS_API_URL || "https://cms.r3lab.com";
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
  website: z.string().min(1, { message: "Website is required" }).url({ message: "Please enter a valid URL" }),
  source: z.string().max(100, { message: "Source must be less than 100 characters" }).optional(),
  notes: z.string().max(500, { message: "Notes must be less than 500 characters" }).optional(),
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
if (typeof window === "undefined" && !process.env.VERCEL && !process.env.NEXT_PUBLIC_VERCEL_ENV) {
  import_dotenv.default.config();
}
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
  actionClient,
  createLead,
  getBlogCategories,
  getBlogPost,
  getBlogPosts,
  leadSchema,
  rateLimitedActionClient,
  simpleActionClient
};
