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
    }, [isAssessmentPage]);

    return null;
}