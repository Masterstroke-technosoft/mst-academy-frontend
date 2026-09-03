"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SCRIPT_ID = "mst-chatbot-script";
const WIDGET_ID = "mst-chat-widget-container";

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
            script.src =
                "https://mst-academy-copilot.onrender.com/static/widget.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, [isAssessmentPage]);

    return null;
}