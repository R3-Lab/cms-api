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

// src/types/index.ts
var types_exports = {};
__export(types_exports, {
  leadSchema: () => leadSchema
});
module.exports = __toCommonJS(types_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  leadSchema
});
//# sourceMappingURL=index.js.map