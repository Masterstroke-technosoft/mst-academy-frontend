import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import ResizableImageNodeView from "./ResizableImageNodeView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resizableImage: {
      setResizableImage: (options: {
        src: string;
        alt?: string;
        width?: string;
        align?: "left" | "center" | "right";
      }) => ReturnType;
      updateResizableImage: (options: {
        src?: string;
        alt?: string;
        width?: string;
        align?: "left" | "center" | "right";
      }) => ReturnType;
    };
  }
}

const ResizableImage = Node.create({
  name: "resizableImage",

  group: "block",

  atom: true,

  addOptions() {
    return {
      inline: false,
      allowBase64: true,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => ({ src: attributes.src }),
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => ({ alt: attributes.alt }),
      },
      width: {
        default: "100%",
        parseHTML: (element) => element.getAttribute("width") || element.style?.width || "100%",
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      align: {
        default: "left",
        parseHTML: (element) => {
          const style = element.getAttribute("style") || "";
          if (style.includes("margin: 12px auto") || style.includes("margin:12px auto")) return "center";
          if (style.includes("float: right") || style.includes("float:right")) return "right";
          return "left";
        },
        renderHTML: (attributes) => ({ align: attributes.align }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'img[src]:not([src^="data:"])' }];
  },

  renderHTML({ HTMLAttributes }) {
    const { align, ...rest } = HTMLAttributes;
    const style: string[] = [];

    if (rest.width) style.push(`width: ${rest.width}`);
    style.push("height: auto");
    style.push("display: block");

    if (align === "center") {
      style.push("margin: 12px auto");
    } else if (align === "right") {
      style.push("margin: 12px 0 12px auto");
      style.push("float: right");
      style.push("margin-left: 12px");
    } else {
      style.push("margin: 12px 0");
    }

    return ["img", mergeAttributes(this.options.HTMLAttributes, rest, { style: style.join("; ") })];
  },

  addCommands() {
    return {
      setResizableImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              alt: options.alt || "",
              width: options.width || "100%",
              align: options.align || "left",
            },
          });
        },
      updateResizableImage:
        (options) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options);
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNodeView);
  },
});

export default ResizableImage;
