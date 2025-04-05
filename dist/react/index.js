"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  BlogPostContent: () => BlogPostContent
});
module.exports = __toCommonJS(react_exports);

// src/react/blog-post-content.tsx
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlogPostContent
});
//# sourceMappingURL=index.js.map