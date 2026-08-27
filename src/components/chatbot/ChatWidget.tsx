"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import {
  sendChatMessage,
  ChatApiError,
  type ChatHistoryItem,
  type ChatSource,
} from "@/lib/chatbot-api";
import { renderMarkdown } from "./markdown";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  isError?: boolean;
  source?: ChatSource;
}

const WELCOME_MESSAGE: DisplayMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hello! How can I help you with Academy support?",
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isSending]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMsg: DisplayMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    const history: ChatHistoryItem[] = messages
      .filter((m) => m.id !== "welcome" && !m.isError)
      .map((m) => ({ role: m.role, content: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      const { answer, source } = await sendChatMessage(trimmed, history, "openai");
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: answer, source },
      ]);
    } catch (err) {
      const msg =
        err instanceof ChatApiError
          ? err.message
          : "Something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: "assistant", text: msg, isError: true },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div id="mst-chat-widget-container">
      {/* Floating toggle button */}
      <button
        type="button"
        id="mst-chat-widget-button"
        className={isOpen ? "mst-chat-widget-hidden" : ""}
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
        style={{ padding: 0, overflow: "hidden" }}
      >
        <img
          src="/1.png"
          alt="Academy Logo"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </button>

      {/* Chat Window */}
      <div
        id="mst-chat-widget-window"
        className={isOpen ? "mst-chat-widget-open" : ""}
      >
        <div id="mst-chat-widget-header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="mst-chat-widget-robot-mascot">
              <img
                src="/1.png"
                alt="Academy Logo"
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              />
            </div>
            <div className="mst-chat-widget-title">
              <span>MST Academy</span>
              <span className="mst-chat-widget-subtitle">Support Assistant</span>
            </div>
          </div>
          <button
            type="button"
            id="mst-chat-widget-close"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </button>
        </div>

        <div id="mst-chat-widget-messages" ref={scrollRef}>
          {messages.map((m) => {
            let sourceText = "";
            if (m.source === "LOCAL_KB") sourceText = "Source: Academy Knowledge Base";
            else if (m.source === "WEBSITE") sourceText = "Source: MST Academy Website";
            else if (m.source === "BOTH") sourceText = "Source: Academy Knowledge Base + Website";

            return (
              <Fragment key={m.id}>
                <div className={`mst-chat-widget-message mst-chat-widget-${m.role}${m.isError ? " mst-chat-widget-error" : ""}`}>
                  {m.role === "assistant" && !m.isError ? renderMarkdown(m.text) : m.text}
                </div>
                {sourceText && (
                  <div className="mst-chat-widget-source">
                    {sourceText}
                  </div>
                )}
              </Fragment>
            );
          })}

          {isSending && (
            <div className="mst-chat-widget-loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>

        <form id="mst-chat-widget-input-area" onSubmit={handleSend}>
          <input
            ref={inputRef}
            type="text"
            id="mst-chat-widget-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your question..."
            autoComplete="off"
            disabled={isSending}
          />
          <button
            type="submit"
            id="mst-chat-widget-send"
            disabled={isSending || !input.trim()}
          >
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>

      <style>{`
        /* Isolation wrapper */
        #mst-chat-widget-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0F172A;
        }

        /* Chat Button */
        #mst-chat-widget-button {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease;
            padding: 0;
            overflow: hidden;
        }

        #mst-chat-widget-button:hover {
            transform: scale(1.05);
        }

        /* Chat Window */
        #mst-chat-widget-window {
            position: absolute;
            bottom: 20px;
            right: 0;
            width: 400px;
            height: 600px;
            max-height: calc(100vh - 100px);
            background: #FFFFFF; /* Card Surface */
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            display: none; /* Hidden by default */
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transition: opacity 0.3s ease, transform 0.3s ease;
            border: 1px solid #E2E8F0; /* Border */
        }

        #mst-chat-widget-window.mst-chat-widget-open {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        /* Hide button when chat is open */
        #mst-chat-widget-button.mst-chat-widget-hidden {
            display: none;
        }

        /* Header */
        #mst-chat-widget-header {
            background-color: #0F172A; /* Dark Slate */
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
        }

        #mst-chat-widget-header .mst-chat-widget-title {
            display: flex;
            flex-direction: column;
        }

        #mst-chat-widget-header .mst-chat-widget-title span {
            font-size: 16px;
        }

        #mst-chat-widget-header .mst-chat-widget-subtitle {
            font-size: 12px;
            color: #cbd5e1; /* Slightly muted white/gray for readability on dark */
            font-weight: 400;
        }

        #mst-chat-widget-close {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            line-height: 1;
            cursor: pointer;
            padding: 0;
            opacity: 0.8;
        }

        #mst-chat-widget-close:hover {
            opacity: 1;
        }

        /* Messages Area */
        #mst-chat-widget-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background-color: #f8fafc; /* Very light slate for contrast against white bubbles */
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        /* Individual Messages */
        .mst-chat-widget-message {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
        }

        .mst-chat-widget-message.mst-chat-widget-assistant {
            align-self: flex-start;
            background-color: #FFFFFF; /* Card Surface */
            color: #0F172A; /* Dark Slate for text */
            border: 1px solid #E2E8F0; /* Border */
            border-bottom-left-radius: 4px;
        }

        .mst-chat-widget-message.mst-chat-widget-user {
            align-self: flex-end;
            background-color: #E53E3E; /* Primary Accent (Red) */
            color: white;
            border-bottom-right-radius: 4px;
        }

        .mst-chat-widget-message.mst-chat-widget-error {
            align-self: flex-start;
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
            border-bottom-left-radius: 4px;
        }

        /* Source Badge */
        .mst-chat-widget-source {
            font-size: 11px;
            color: #64748B; /* Muted Text */
            margin-top: 4px;
            align-self: flex-start;
            padding-left: 4px;
        }

        /* Loading Indicator */
        .mst-chat-widget-loading {
            display: flex;
            gap: 4px;
            padding: 12px 14px;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            border-bottom-left-radius: 4px;
            align-self: flex-start;
            align-items: center;
        }

        .mst-chat-widget-loading span {
            width: 6px;
            height: 6px;
            background-color: #7C3AED; /* Secondary Accent (Purple) */
            border-radius: 50%;
            animation: mst-chat-widget-bounce 1.4s infinite ease-in-out both;
        }

        .mst-chat-widget-loading span:nth-child(1) { animation-delay: -0.32s; }
        .mst-chat-widget-loading span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes mst-chat-widget-bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        /* Input Area */
        #mst-chat-widget-input-area {
            display: flex;
            padding: 12px;
            background-color: #FFFFFF; /* Card Surface */
            border-top: 1px solid #E2E8F0; /* Border */
            gap: 8px;
        }

        #mst-chat-widget-input {
            flex: 1;
            padding: 10px 12px;
            border: 1px solid #E2E8F0; /* Border */
            border-radius: 20px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
            color: #0F172A; /* Dark Slate */
        }

        #mst-chat-widget-input:focus {
            border-color: #E53E3E; /* Primary Accent */
        }

        #mst-chat-widget-input:disabled {
            background-color: #f1f5f9;
            cursor: not-allowed;
        }

        #mst-chat-widget-send {
            background-color: #E53E3E; /* Primary Accent */
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        #mst-chat-widget-send:hover:not(:disabled) {
            background-color: #C53030; /* Darker Red */
        }

        #mst-chat-widget-send:disabled {
            background-color: #cbd5e1;
            cursor: not-allowed;
        }

        #mst-chat-widget-send svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
            margin-left: 2px;
        }

        /* Markdown Styles within assistant messages */
        .mst-chat-widget-assistant p { margin: 0 0 8px 0; }
        .mst-chat-widget-assistant p:last-child { margin: 0; }
        .mst-chat-widget-assistant ul, .mst-chat-widget-assistant ol { margin: 0 0 8px 0; padding-left: 20px; }
        .mst-chat-widget-assistant li { margin-bottom: 4px; }
        .mst-chat-widget-assistant a { color: #E53E3E; text-decoration: none; font-weight: 500; }
        .mst-chat-widget-assistant a:hover { text-decoration: underline; color: #C53030; }
        .mst-chat-widget-assistant strong { font-weight: 600; color: #0F172A; }
        .mst-chat-widget-assistant pre { background: #f1f5f9; padding: 8px; border-radius: 4px; overflow-x: auto; font-size: 12px; margin: 8px 0; border: 1px solid #E2E8F0; }
        .mst-chat-widget-assistant code { background: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-size: 12px; font-family: monospace; color: #E53E3E; }

        /* Mobile Responsiveness */
        @media (max-width: 480px) {
            #mst-chat-widget-window {
                width: calc(100vw - 40px);
                bottom: 80px;
                right: 0;
            }
        }

        /* Animated Robot in Header */
        .mst-chat-widget-robot-mascot {
            font-size: 28px;
            margin-right: 12px;
            animation: mst-chat-widget-wave 2.5s infinite ease-in-out;
            transform-origin: bottom center;
            display: inline-block;
        }

        @keyframes mst-chat-widget-wave {
            0% { transform: rotate(0deg); }
            15% { transform: rotate(15deg); }
            30% { transform: rotate(-10deg); }
            45% { transform: rotate(15deg); }
            60% { transform: rotate(-10deg); }
            75% { transform: rotate(0deg); }
            100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
