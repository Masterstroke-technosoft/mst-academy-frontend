"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyableCodeBlocks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current?.parentElement;
    if (!container) return;

    const pres = container.querySelectorAll<HTMLPreElement>("pre");
    pres.forEach((pre, index) => {
      if (pre.querySelector(".copy-code-btn")) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "copy-code-btn absolute right-3 top-3 rounded-md bg-white/10 px-2 py-1 text-xs text-white hover:bg-mst-red transition";
      btn.textContent = "Copy";
      btn.setAttribute("data-index", String(index));

      pre.style.position = "relative";
      pre.appendChild(btn);

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code")?.textContent || pre.textContent || "";
        await navigator.clipboard.writeText(code.replace("Copy", "").trim());
        btn.textContent = "Copied!";
        setCopiedId(String(index));
        setTimeout(() => {
          btn.textContent = "Copy";
          setCopiedId(null);
        }, 2000);
      });
    });
  }, []);

  return <div ref={containerRef} className="hidden" aria-hidden />;
}

export function CodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2 py-1 text-xs hover:border-mst-red hover:text-mst-red"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
