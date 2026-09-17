"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SCRIPT_ID =
    process.env.NEXT_PUBLIC_CHATBOT_SCRIPT_ID || "mst-chatbot-script";
const WIDGET_ID =
    process.env.NEXT_PUBLIC_CHATBOT_WIDGET_ID || "mst-chat-widget-container";
const WIDGET_URL =
    process.env.NEXT_PUBLIC_CHATBOT_WIDGET_URL ||
    "https://mst-academy-copilot.onrender.com/static/widget.js";

const RIBBON_BUBBLE_HTML = `
<div class="mst-3d-ribbon-wrapper">
    <img 
        src="/images/ask-me-anything-exact.png" 
        alt="Ask Me Anything?" 
        class="mst-3d-ribbon-img"
        draggable="false"
    />
</div>
`;

const STYLE_ID = "mst-chat-override-style";
const DYNAMIC_CSS = `
#mst-chat-widget-container {
    position: fixed !important;
    bottom: 24px !important;
    right: 24px !important;
    left: auto !important;
    top: auto !important;
    z-index: 9999 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-end !important;
    justify-content: flex-end !important;
    width: auto !important;
    height: auto !important;
    max-width: calc(100vw - 48px) !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    pointer-events: auto !important;
}

#mst-chat-thought {
    position: relative !important;
    bottom: 0 !important;
    right: 0 !important;
    left: auto !important;
    top: auto !important;
    height: auto !important;
    max-height: none !important;
    width: auto !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-end !important;
    justify-content: flex-end !important;
    margin: 0 !important;
    padding: 0 !important;
    animation: none !important;
    transform: none !important;
    overflow: visible !important;
}

#mst-chat-widget-button {
    position: relative !important;
    width: 56px !important;
    height: 56px !important;
    min-width: 56px !important;
    min-height: 56px !important;
    border-radius: 50% !important;
    background-color: #E53E3E !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.1) !important;
    margin: 0 2px 0 0 !important;
    padding: 0 !important;
    align-self: flex-end !important;
}

.mst-thought-cloud-bubble {
    position: relative !important;
    width: 120px !important;
    height: 84px !important;
    margin: 0 6px 2px 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: visible !important;
}

.mst-thought-dots {
    display: none !important;
}

@media (max-width: 640px) {
    #mst-chat-widget-container {
        bottom: 20px !important;
        right: 20px !important;
        max-width: calc(100vw - 40px) !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    #mst-chat-thought {
        position: relative !important;
        bottom: 0 !important;
        right: 0 !important;
        height: auto !important;
        width: auto !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    .mst-thought-cloud-bubble {
        width: 102px !important;
        height: 72px !important;
        margin: 0 4px 2px 0 !important;
    }
    #mst-chat-widget-button {
        width: 48px !important;
        height: 48px !important;
        min-width: 48px !important;
        min-height: 48px !important;
        margin: 0 2px 0 0 !important;
    }
    #mst-chat-widget-window {
        position: fixed !important;
        bottom: 16px !important;
        right: 12px !important;
        left: 12px !important;
        width: calc(100vw - 24px) !important;
        max-width: calc(100vw - 24px) !important;
    }
}

@media (max-width: 380px) {
    #mst-chat-widget-container {
        bottom: 16px !important;
        right: 16px !important;
        max-width: calc(100vw - 32px) !important;
    }
    .mst-thought-cloud-bubble {
        width: 94px !important;
        height: 66px !important;
        margin: 0 3px 2px 0 !important;
    }
    #mst-chat-widget-button {
        width: 44px !important;
        height: 44px !important;
        min-width: 44px !important;
        min-height: 44px !important;
        margin: 0 1px 0 0 !important;
    }
}
`;

export default function ChatBotWidget() {
    const pathname = usePathname();
    const isAssessmentPage = pathname.endsWith("/assessment");

    useEffect(() => {
        if (isAssessmentPage) {
            // Remove chatbot script + widget when entering assessment
            document.getElementById(WIDGET_ID)?.remove();
            document.getElementById(SCRIPT_ID)?.remove();
            document.getElementById(STYLE_ID)?.remove();
            return;
        }

        // Inject dynamic style tag to always override remote widget.css
        let styleTag = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = STYLE_ID;
            styleTag.innerHTML = DYNAMIC_CSS;
            document.head.appendChild(styleTag);
        }

        // Don't add again if already loaded
        if (!document.getElementById(SCRIPT_ID)) {
            const script = document.createElement("script");
            script.id = SCRIPT_ID;
            script.src = WIDGET_URL;
            script.async = true;
            document.body.appendChild(script);
        }

        const upgradeWidget = () => {
            // Ensure style override tag is at the very end of head
            if (styleTag && document.head.lastElementChild !== styleTag) {
                document.head.appendChild(styleTag);
            }

            const isMobile = window.innerWidth <= 640;
            const isSmallMobile = window.innerWidth <= 380;
            const offsetRight = isSmallMobile ? "16px" : isMobile ? "20px" : "24px";
            const offsetBottom = isSmallMobile ? "16px" : isMobile ? "20px" : "24px";

            const container = document.getElementById("mst-chat-widget-container");
            if (container) {
                container.style.setProperty("position", "fixed", "important");
                container.style.setProperty("bottom", offsetBottom, "important");
                container.style.setProperty("right", offsetRight, "important");
                container.style.setProperty("left", "auto", "important");
                container.style.setProperty("top", "auto", "important");
                container.style.setProperty("z-index", "9999", "important");
                container.style.setProperty("display", "flex", "important");
                container.style.setProperty("flex-direction", "column", "important");
                container.style.setProperty("align-items", "flex-end", "important");
                container.style.setProperty("justify-content", "flex-end", "important");
                container.style.setProperty("margin", "0", "important");
                container.style.setProperty("padding", "0", "important");
                container.style.setProperty("overflow", "visible", "important");
                container.style.setProperty("pointer-events", "auto", "important");
            }

            const thought = document.getElementById("mst-chat-thought");
            if (thought) {
                thought.style.setProperty("position", "relative", "important");
                thought.style.setProperty("bottom", "0", "important");
                thought.style.setProperty("right", "0", "important");
                thought.style.setProperty("left", "auto", "important");
                thought.style.setProperty("top", "auto", "important");
                thought.style.setProperty("height", "auto", "important");
                thought.style.setProperty("max-height", "none", "important");
                thought.style.setProperty("width", "auto", "important");
                thought.style.setProperty("display", "flex", "important");
                thought.style.setProperty("flex-direction", "column", "important");
                thought.style.setProperty("align-items", "flex-end", "important");
                thought.style.setProperty("justify-content", "flex-end", "important");
                thought.style.setProperty("margin", "0", "important");
                thought.style.setProperty("padding", "0", "important");
                thought.style.setProperty("overflow", "visible", "important");
            }

            const bubble = document.querySelector(".mst-thought-cloud-bubble") as HTMLElement | null;
            if (bubble && !(bubble as any).__exact_ribbon_applied) {
                (bubble as any).__exact_ribbon_applied = true;
                bubble.innerHTML = RIBBON_BUBBLE_HTML;

                // Auto-dismiss after 5 seconds of being displayed (1.8s entrance + 5s display)
                setTimeout(() => {
                    const el = document.querySelector(".mst-thought-cloud-bubble");
                    if (el) {
                        el.classList.add("mst-thought-dismissed");
                    }
                }, 6800);
            }

            const chatButton = document.getElementById("mst-chat-widget-button");
            if (chatButton && !(chatButton as any).__stop_bubble_attached) {
                (chatButton as any).__stop_bubble_attached = true;
                chatButton.addEventListener("click", (e) => {
                    e.stopPropagation();
                });
            }
        };

        const observer = new MutationObserver(() => {
            upgradeWidget();
        });

        window.addEventListener("resize", upgradeWidget);
        observer.observe(document.body, { childList: true, subtree: true });
        observer.observe(document.head, { childList: true, subtree: true });
        upgradeWidget();

        return () => {
            window.removeEventListener("resize", upgradeWidget);
            observer.disconnect();
        };
    }, [isAssessmentPage]);

    return null;
}