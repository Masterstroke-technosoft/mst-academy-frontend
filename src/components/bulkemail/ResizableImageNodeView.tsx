"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useState, useRef, useCallback, useEffect } from "react";

export default function ResizableImageNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const [showControls, setShowControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragSide, setDragSide] = useState<"left" | "right" | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const width = node.attrs.width as string || "100%";
  const align = (node.attrs.align as string) || "left";
  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string) || "";

  // Show controls when selected
  useEffect(() => {
    setShowControls(selected);
  }, [selected]);

  const handleMouseDown = useCallback((e: React.MouseEvent, side: "left" | "right") => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragSide(side);
    startX.current = e.clientX;
    startWidth.current = imgRef.current?.getBoundingClientRect().width || 300;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !imgRef.current || !dragSide) return;
    const diff = e.clientX - startX.current;
    const parentWidth = imgRef.current.parentElement?.getBoundingClientRect().width || 600;
    let newWidth: number;

    if (dragSide === "right") {
      newWidth = Math.min(Math.max(startWidth.current + diff, 50), parentWidth);
    } else {
      newWidth = Math.min(Math.max(startWidth.current - diff, 50), parentWidth);
    }

    const percentage = Math.round((newWidth / parentWidth) * 100);
    updateAttributes({ width: `${percentage}%` });
  }, [isDragging, dragSide, updateAttributes]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragSide(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getAlignStyle = (): React.CSSProperties => {
    switch (align) {
      case "center":
        return { display: "block", margin: "12px auto" };
      case "right":
        return { display: "block", margin: "12px 0 12px auto", float: "right", marginLeft: "12px" };
      default:
        return { display: "block", margin: "12px 0" };
    }
  };

  return (
    <NodeViewWrapper
      as="div"
      style={{
        ...getAlignStyle(),
        position: "relative",
        width: "100%",
        textAlign: align === "center" ? "center" : undefined,
      }}
      onMouseEnter={() => !isDragging && setShowControls(true)}
      onMouseLeave={() => !isDragging && !selected && setShowControls(false)}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          width: width,
          height: "auto",
          cursor: isDragging ? "col-resize" : "pointer",
          borderRadius: "4px",
          outline: selected ? "2px solid #3b82f6" : "none",
          outlineOffset: "2px",
          userSelect: "none",
        }}
        draggable={false}
      />

      {/* Resize handles */}
      {showControls && (
        <>
          <div
            onMouseDown={(e) => handleMouseDown(e, "left")}
            style={{
              position: "absolute",
              top: "50%",
              left: "-4px",
              transform: "translateY(-50%)",
              width: "8px",
              height: "32px",
              backgroundColor: "#3b82f6",
              borderRadius: "4px",
              cursor: "col-resize",
              zIndex: 10,
            }}
          />
          <div
            onMouseDown={(e) => handleMouseDown(e, "right")}
            style={{
              position: "absolute",
              top: "50%",
              right: "-4px",
              transform: "translateY(-50%)",
              width: "8px",
              height: "32px",
              backgroundColor: "#3b82f6",
              borderRadius: "4px",
              cursor: "col-resize",
              zIndex: 10,
            }}
          />
        </>
      )}

      {/* Alignment controls */}
      {showControls && (
        <div
          style={{
            position: "absolute",
            top: "-36px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "2px",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            padding: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 20,
          }}
        >
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateAttributes({ align: a });
              }}
              style={{
                padding: "2px 8px",
                fontSize: "11px",
                fontWeight: "bold",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: align === a ? "#3b82f6" : "transparent",
                color: align === a ? "white" : "#6b7280",
                textTransform: "capitalize",
              }}
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </NodeViewWrapper>
  );
}
