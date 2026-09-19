"use client";

import React, { useState } from "react";
import { Laptop, Copy, Check, ExternalLink, X, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface DesktopOnlyAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentUrl?: string;
}

export function DesktopOnlyAssessmentModal({
  isOpen,
  onClose,
  assessmentUrl,
}: DesktopOnlyAssessmentModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const urlToCopy =
    assessmentUrl ||
    (typeof window !== "undefined"
      ? window.location.href
      : "https://masterstroke.academy");

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(urlToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement("textarea");
      textarea.value = urlToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-2xl text-[var(--text)] text-center transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)] transition"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Icon Header */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-mst-red border border-mst-red/20">
          <div className="relative">
            <Laptop size={34} />
            <ShieldAlert
              size={18}
              className="absolute -bottom-1 -right-1 text-red-500 bg-[var(--bg)] rounded-full"
            />
          </div>
        </div>

        {/* Title & Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-mst-red/10 px-3 py-1 text-xs font-semibold text-mst-red mb-2">
          Desktop Only Environment
        </div>
        <h3 className="text-xl font-bold tracking-tight text-[var(--text)]">
          Laptop or PC Required
        </h3>

        {/* Description */}
        <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
          For assessments, please use the{" "}
          <strong className="text-[var(--text)]">Masterstroke Academy Website</strong> on
          a laptop or desktop computer.
        </p>

        <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
          Assessments cannot be attempted on mobile phones or tablets because they require a proctored environment with webcam tracking, full-screen lockdown, and code evaluation.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href="https://masterstroke.academy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-mst-red/25 hover:shadow-mst-red/40 hover:opacity-95 transition"
          >
            Visit Masterstroke Academy <ExternalLink size={16} />
          </Link>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--border)] transition"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Link Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy Assessment Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="mt-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition"
          >
            Stay on Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
