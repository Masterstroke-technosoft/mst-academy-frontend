"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import FontFamily from "@tiptap/extension-font-family";
import { useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import TipTapToolbar from "./TipTapToolbar";
import ResizableImage from "./resizable-image";

export interface TipTapEditorHandle {
  insertImageAtCursor: (src: string, alt?: string, width?: string) => void;
}

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const TipTapEditor = forwardRef<TipTapEditorHandle, TipTapEditorProps>(
  function TipTapEditor({ content, onChange, placeholder }, ref) {
    const editor = useEditor({
      immediatelyRender: true,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          link: false,
          underline: false,
        }),
        Underline,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TextStyle,
        FontSize,
        Color,
        Highlight.configure({ multicolor: true }),
        Link.configure({
          openOnClick: true,
          HTMLAttributes: {
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        }),
        ResizableImage,
        TaskList,
        TaskItem.configure({ nested: true }),
        Placeholder.configure({ placeholder: placeholder || "Write your email body here..." }),
        FontFamily,
      ],
      content,
      editorProps: {
        attributes: {
          style: "min-height: 200px; padding: 12px; outline: none; line-height: 1.6; font-size: 14px;",
        },
      },
      onUpdate: ({ editor: ed }) => {
        onChange(ed.getHTML());
      },
    });

    // Expose insertImageAtCursor to parent via ref
    useImperativeHandle(ref, () => ({
      insertImageAtCursor: (src: string, alt?: string, width?: string) => {
        if (!editor) return;
        editor.chain().focus().setResizableImage({ src, alt: alt || "", width: width || "100%" }).run();
      },
    }), [editor]);

    // Sync external content changes (e.g., resetForm) into the editor
    useEffect(() => {
      if (!editor || editor.isDestroyed) return;
      try {
        const currentHTML = editor.getHTML();
        if (content !== currentHTML) {
          editor.commands.setContent(content, { emitUpdate: false });
        }
      } catch {
        // Editor not fully initialized yet, skip sync
      }
    }, [content, editor]);

    const handleImageUpload = useCallback(
      (file: File) => {
        if (!editor) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          editor.chain().focus().setResizableImage({ src: base64, alt: file.name, width: "100%" }).run();
        };
        reader.readAsDataURL(file);
      },
      [editor]
    );

    return (
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "visible", backgroundColor: "white", position: "relative" }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .ProseMirror {
            outline: none;
          }
          .ProseMirror h1 {
            font-size: 2.25rem !important;
            font-weight: 800 !important;
            line-height: 1.25 !important;
            margin-top: 1.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          .ProseMirror h2 {
            font-size: 1.875rem !important;
            font-weight: 700 !important;
            line-height: 1.3 !important;
            margin-top: 1.25rem !important;
            margin-bottom: 0.5rem !important;
          }
          .ProseMirror h3 {
            font-size: 1.5rem !important;
            font-weight: 600 !important;
            line-height: 1.35 !important;
            margin-top: 1rem !important;
            margin-bottom: 0.5rem !important;
          }
          .ProseMirror p {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          .ProseMirror ul {
            list-style-type: disc !important;
            padding-left: 1.5rem !important;
          }
          .ProseMirror ol {
            list-style-type: decimal !important;
            padding-left: 1.5rem !important;
          }
          .ProseMirror li {
            display: list-item !important;
          }
          .ProseMirror a {
            color: #3b82f6 !important;
            text-decoration: underline !important;
            cursor: pointer !important;
          }
          .ProseMirror a:hover {
            color: #1d4ed8 !important;
          }
        `}} />
        <TipTapToolbar editor={editor} onImageUpload={handleImageUpload} />
        <div style={{ minHeight: "200px" }}>
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }
);

export default TipTapEditor;
