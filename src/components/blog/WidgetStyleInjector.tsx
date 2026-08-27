"use client";

import { useEffect } from "react";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "https://cms-api.masterstroke.academy/";

/**
 * Handles dynamic widget loading, routing re-initialization, and
 * custom styles injection into the CMS widget's Shadow DOM.
 */
export default function WidgetStyleInjector() {
  useEffect(() => {
    // 1. Expose CMS_URL globally for our local widget.js to use
    (window as any).CMS_URL = CMS_URL;

    // 2. Append widget.js dynamically if not already loaded
    let script = document.getElementById("mst-widget-script") as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = "mst-widget-script";
      script.src = "/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // 3. Initialize widgets and inject styles
    const injectStylesAndInit = () => {
      // Re-run widget scanner to initialize any unhydrated widgets (crucial for client-side routing)
      if ((window as any).initializeMSTWidgets) {
        (window as any).initializeMSTWidgets();
      }

      const widgets = document.querySelectorAll("[data-widget]");
      widgets.forEach((widget) => {
        if (!widget.shadowRoot) return;
        if (widget.shadowRoot.querySelector(".mst-override-style")) return;

        const style = document.createElement("style");
        style.className = "mst-override-style";
        style.textContent = `
          .mst-list {
            grid-template-columns: repeat(auto-fill, minmax(min(215px, 100%), 1fr)) !important;
            gap: 16px !important;
          }
          .mst-card {
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
            border: 1px solid var(--border, #e5e7eb) !important;
            background: var(--surface, #fff) !important;
            border-radius: 16px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05) !important;
            isolation: isolate !important;
            -webkit-backface-visibility: hidden !important;
            backface-visibility: hidden !important;
            -webkit-transform: translate3d(0, 0, 0) !important;
            transform: translate3d(0, 0, 0) !important;
          }
          .mst-card:hover {
            transform: translate3d(0, -4px, 0) !important;
            box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.15) !important;
            border-color: rgba(239, 68, 68, 0.3) !important;
          }
          .mst-card-image {
            width: 100% !important;
            max-width: 100% !important;
            aspect-ratio: 16 / 9 !important;
            height: auto !important;
            object-fit: contain !important;
            background: var(--bg-muted, #f3f4f6) !important;
            display: block !important;
            border-top-left-radius: 15px !important;
            border-top-right-radius: 15px !important;
          }
          .mst-card-body { padding: 12px !important; gap: 6px !important; }
          .mst-card-category {
            color: #ef4444 !important;
            font-size: 9px !important;
            font-weight: 700 !important;
            letter-spacing: 0.05em !important;
          }
          .mst-card-heading {
            color: var(--text, #111827) !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            line-height: 1.4 !important;
            margin: 0 !important;
          }
          .mst-card-subheading {
            color: var(--text-muted, #4b5563) !important;
            font-size: 12px !important;
            line-height: 1.45 !important;
            margin: 0 !important;
          }
          .mst-card-meta { color: var(--text-muted, #9ca3af) !important; font-size: 10px !important; }
        `;
        widget.shadowRoot.appendChild(style);
      });
    };

    injectStylesAndInit();

    const interval = setInterval(injectStylesAndInit, 300);
    const observer = new MutationObserver(injectStylesAndInit);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return null;
}
