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

export default function ChatBotWidget() {
    const pathname = usePathname();
    const isAssessmentPage = pathname.endsWith("/assessment");

    useEffect(() => {
        if (isAssessmentPage) {
            // Remove chatbot script + widget when entering assessment
            document.getElementById(WIDGET_ID)?.remove();
            document.getElementById(SCRIPT_ID)?.remove();
            return;
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
            const bubble = document.querySelector(".mst-thought-cloud-bubble");
            if (bubble && !(bubble as any).__exact_ribbon_applied) {
                (bubble as any).__exact_ribbon_applied = true;
                bubble.innerHTML = RIBBON_BUBBLE_HTML;
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

        observer.observe(document.body, { childList: true, subtree: true });
        upgradeWidget();

        return () => {
            observer.disconnect();
        };
    }, [isAssessmentPage]);

    return null;
}