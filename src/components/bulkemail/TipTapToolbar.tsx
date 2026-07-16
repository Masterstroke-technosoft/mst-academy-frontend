"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  Quote,
  Minus,
  Undo,
  Redo,
  RemoveFormatting,
  Highlighter,
  Palette,
} from "lucide-react";
import { useRef, useState, useCallback } from "react";

interface ToolbarProps {
  editor: Editor | null;
  onImageUpload?: (file: File) => void;
}

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px"];
const FONT_FAMILIES = ["Arial", "Helvetica", "Georgia", "Times New Roman", "Courier New", "Verdana", "Tahoma", "Trebuchet MS"];
const TEXT_COLORS = ["#000000", "#434343", "#666666", "#999999", "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#ffffff"];
const HIGHLIGHT_COLORS = ["#fff3cd", "#d4edda", "#d1ecf1", "#f8d7da", "#e2e3e5", "#ffffcc", "#ccffcc", "#cce5ff"];

export default function TipTapToolbar({ editor, onImageUpload }: ToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);

  const setLink = useCallback(() => {
    if (!editor || !linkUrl) return;

    // Normalize: prepend https:// if no protocol is present
    const normalizedUrl = /^https?:\/\//i.test(linkUrl)
      ? linkUrl
      : `https://${linkUrl}`;

    const { from, to } = editor.state.selection;
    const isSelectionEmpty = from === to;

    if (isSelectionEmpty) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${normalizedUrl}" target="_blank" rel="noopener noreferrer">${linkUrl}</a>`)
        .run();
    } else {
      editor.chain().focus().setLink({ href: normalizedUrl, target: '_blank', rel: 'noopener noreferrer' }).run();
    }

    setLinkUrl("");
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  if (!editor) return null;

  const ToolBtn = ({
    onClick,
    active,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: "6px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: active ? "#e5e7eb" : "transparent",
        color: disabled ? "#d1d5db" : active ? "#111827" : "#6b7280",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) e.currentTarget.style.backgroundColor = "#f3f4f6";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {children}
    </button>
  );

  const Separator = () => (
    <div style={{ width: "1px", height: "24px", backgroundColor: "#e5e7eb", margin: "0 4px" }} />
  );

  const DropdownWrapper = ({
    show,
    onToggle,
    children,
    trigger,
  }: {
    show: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    trigger: React.ReactNode;
  }) => (
    <div style={{ position: "relative" }}>
      <div onClick={onToggle} style={{ cursor: "pointer" }}>
        {trigger}
      </div>
      {show && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "4px",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 50,
            minWidth: "140px",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "2px",
        padding: "8px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#fafafa",
        borderRadius: "8px 8px 0 0",
      }}
    >
      {/* Text Style */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline"
      >
        <Underline size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </ToolBtn>

      <Separator />

      {/* Headings */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 size={16} />
      </ToolBtn>

      <Separator />

      {/* Font Size */}
      <DropdownWrapper
        show={showFontSize}
        onToggle={() => { setShowFontSize(!showFontSize); setShowFontFamily(false); setShowColorPicker(false); setShowHighlightPicker(false); }}
        trigger={
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "32px",
              padding: "0 8px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#374151",
              backgroundColor: showFontSize ? "#e5e7eb" : "white",
              cursor: "pointer",
              minWidth: "48px",
            }}
          >
            Size
          </div>
        }
      >
        {FONT_SIZES.map((size) => (
          <div
            key={size}
            onClick={() => {
              editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
              setShowFontSize(false);
            }}
            style={{
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: "13px",
              borderRadius: "4px",
              color: "#374151",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            {size}
          </div>
        ))}
      </DropdownWrapper>

      {/* Font Family */}
      <DropdownWrapper
        show={showFontFamily}
        onToggle={() => { setShowFontFamily(!showFontFamily); setShowFontSize(false); setShowColorPicker(false); setShowHighlightPicker(false); }}
        trigger={
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "32px",
              padding: "0 8px",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
              color: "#374151",
              backgroundColor: showFontFamily ? "#e5e7eb" : "white",
              cursor: "pointer",
              minWidth: "48px",
            }}
          >
            Font
          </div>
        }
      >
        {FONT_FAMILIES.map((font) => (
          <div
            key={font}
            onClick={() => {
              editor.chain().focus().setFontFamily(font).run();
              setShowFontFamily(false);
            }}
            style={{
              padding: "4px 8px",
              cursor: "pointer",
              fontSize: "13px",
              borderRadius: "4px",
              color: "#374151",
              fontFamily: font,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            {font}
          </div>
        ))}
      </DropdownWrapper>

      <Separator />

      {/* Text Color */}
      <div style={{ position: "relative" }}>
        <ToolBtn
          onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); setShowFontSize(false); setShowFontFamily(false); }}
          active={showColorPicker}
          title="Text Color"
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
            <Palette size={14} />
            <div style={{ width: "14px", height: "3px", backgroundColor: editor.getAttributes("textStyle").color || "#000000", borderRadius: "1px" }} />
          </div>
        </ToolBtn>
        {showColorPicker && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: "4px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              zIndex: 50,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "4px",
            }}
          >
            {TEXT_COLORS.map((color) => (
              <div
                key={color}
                onClick={() => {
                  editor.chain().focus().setColor(color).run();
                  setShowColorPicker(false);
                }}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "4px",
                  backgroundColor: color,
                  border: "1px solid #d1d5db",
                  cursor: "pointer",
                }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlight Color */}
      <div style={{ position: "relative" }}>
        <ToolBtn
          onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); setShowFontSize(false); setShowFontFamily(false); }}
          active={showHighlightPicker}
          title="Highlight Color"
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
            <Highlighter size={14} />
            <div style={{ width: "14px", height: "3px", backgroundColor: "#f1c40f", borderRadius: "1px" }} />
          </div>
        </ToolBtn>
        {showHighlightPicker && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: "4px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              zIndex: 50,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "4px",
            }}
          >
            {HIGHLIGHT_COLORS.map((color) => (
              <div
                key={color}
                onClick={() => {
                  editor.chain().focus().toggleHighlight({ color }).run();
                  setShowHighlightPicker(false);
                }}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "4px",
                  backgroundColor: color,
                  border: "1px solid #d1d5db",
                  cursor: "pointer",
                }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Alignment */}
      <ToolBtn
        onClick={() => {
          if (editor.isActive("resizableImage")) {
            editor.chain().updateResizableImage({ align: "left" }).run();
          } else {
            editor.chain().focus().setTextAlign("left").run();
          }
        }}
        active={editor.isActive({ textAlign: "left" }) || editor.isActive("resizableImage", { align: "left" })}
        title="Align Left"
      >
        <AlignLeft size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => {
          if (editor.isActive("resizableImage")) {
            editor.chain().updateResizableImage({ align: "center" }).run();
          } else {
            editor.chain().focus().setTextAlign("center").run();
          }
        }}
        active={editor.isActive({ textAlign: "center" }) || editor.isActive("resizableImage", { align: "center" })}
        title="Align Center"
      >
        <AlignCenter size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => {
          if (editor.isActive("resizableImage")) {
            editor.chain().updateResizableImage({ align: "right" }).run();
          } else {
            editor.chain().focus().setTextAlign("right").run();
          }
        }}
        active={editor.isActive({ textAlign: "right" }) || editor.isActive("resizableImage", { align: "right" })}
        title="Align Right"
      >
        <AlignRight size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        active={editor.isActive({ textAlign: "justify" })}
        title="Justify"
      >
        <AlignJustify size={16} />
      </ToolBtn>

      <Separator />

      {/* Lists */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        active={editor.isActive("taskList")}
        title="Task List"
      >
        <ListChecks size={16} />
      </ToolBtn>

      <Separator />

      {/* Block Elements */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <Quote size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus size={16} />
      </ToolBtn>

      <Separator />

      {/* Link */}
      <div style={{ position: "relative" }}>
        <ToolBtn
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              setShowLinkInput(!showLinkInput);
            }
          }}
          active={editor.isActive("link")}
          title="Link"
        >
          <Link size={16} />
        </ToolBtn>
        {showLinkInput && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              right: 0,
              marginBottom: "8px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px",
              boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
              zIndex: 50,
              display: "flex",
              gap: "4px",
            }}
          >
            <input
              ref={linkInputRef}
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              onKeyDown={(e) => e.key === "Enter" && setLink()}
              style={{
                padding: "4px 8px",
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                fontSize: "13px",
                width: "180px",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={setLink}
              style={{
                padding: "4px 8px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      <ToolBtn
        onClick={() => imageInputRef.current?.click()}
        title="Insert Image"
      >
        <Image size={16} />
      </ToolBtn>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onImageUpload) onImageUpload(file);
          e.target.value = "";
        }}
        style={{ display: "none" }}
      />

      <Separator />

      {/* Clear Formatting */}
      <ToolBtn
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        title="Remove Formatting"
      >
        <RemoveFormatting size={16} />
      </ToolBtn>

      {/* Undo / Redo */}
      <ToolBtn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo size={16} />
      </ToolBtn>
    </div>
  );
}
