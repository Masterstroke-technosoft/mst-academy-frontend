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
        // Clean up any stale override style tag from previous sessions
        document.getElementById("mst-chat-override-style")?.remove();

        if (isAssessmentPage) {
            // Remove chatbot script + widget when entering assessment
            document.getElementById(WIDGET_ID)?.remove();
            document.getElementById(SCRIPT_ID)?.remove();
            return;
        }

        // Load widget script if not already present
        if (!document.getElementById(SCRIPT_ID)) {
            const script = document.createElement("script");
            script.id = SCRIPT_ID;
            script.src = WIDGET_URL;
            script.async = true;
            document.body.appendChild(script);
        }

        const openChatWindow = () => {
            const chatWindow = document.getElementById("mst-chat-widget-window");
            const chatThought = document.getElementById("mst-chat-thought");
            const chatButton = document.getElementById("mst-chat-widget-button");
            if (chatWindow) {
                chatWindow.classList.add("mst-chat-widget-open");
                chatWindow.style.display = "flex";
                chatWindow.style.opacity = "1";
                chatWindow.style.transform = "translateY(0) scale(1)";
            }
            if (chatThought) {
                chatThought.classList.add("mst-thought-hidden");
                chatThought.style.display = "none";
            }
            if (chatButton) {
                chatButton.classList.add("mst-chat-widget-hidden");
            }
            // Focus input if available
            setTimeout(() => {
                const input = document.getElementById("mst-chat-widget-input") as HTMLInputElement | null;
                input?.focus();
            }, 100);
        };

        const closeChatWindow = () => {
            const chatWindow = document.getElementById("mst-chat-widget-window");
            const chatThought = document.getElementById("mst-chat-thought");
            const chatButton = document.getElementById("mst-chat-widget-button");
            if (chatWindow) {
                chatWindow.classList.remove("mst-chat-widget-open");
                chatWindow.style.display = "none";
                chatWindow.style.opacity = "0";
                chatWindow.style.transform = "translateY(20px) scale(0.95)";
            }
            if (chatThought) {
                chatThought.classList.remove("mst-thought-hidden");
                chatThought.style.display = "flex";
            }
            if (chatButton) {
                chatButton.classList.remove("mst-chat-widget-hidden");
                chatButton.style.display = "flex";
            }
        };

        const upgradeWidget = () => {
            const bubble = document.querySelector(".mst-thought-cloud-bubble");
            if (bubble && !(bubble as any).__exact_ribbon_applied) {
                (bubble as any).__exact_ribbon_applied = true;
                bubble.innerHTML = RIBBON_BUBBLE_HTML;
            }

            // Ensure the thought cloud area ignores clicks
            const thought = document.getElementById("mst-chat-thought");
            if (thought) {
                thought.style.pointerEvents = "none";
                thought.style.cursor = "default";
            }

            // ONLY clicking directly on the circle button opens the bot
            const button = document.getElementById("mst-chat-widget-button");
            if (button && !(button as any).__click_attached) {
                (button as any).__click_attached = true;
                button.style.cursor = "pointer";
                button.style.pointerEvents = "auto";
                button.addEventListener("click", (e) => {
                    e.stopPropagation();
                    openChatWindow();
                });
            }

            const closeBtn = document.getElementById("mst-chat-widget-close");
            if (closeBtn && !(closeBtn as any).__click_attached) {
                (closeBtn as any).__click_attached = true;
                closeBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    closeChatWindow();
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