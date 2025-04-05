// src/react/blog-post-content.tsx
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
function BlogPostContent({ content }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "heading-styles"
        }
      }),
      Link.configure({
        openOnClick: false
      }),
      Image,
      Underline,
      TextAlign.configure({
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
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-[200px]" }, /* @__PURE__ */ React.createElement(EditorContent, { editor }));
}
export {
  BlogPostContent
};
//# sourceMappingURL=index.mjs.map