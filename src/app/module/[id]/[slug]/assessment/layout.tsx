"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Laptop, ExternalLink, Copy, Check, ShieldAlert, ArrowLeft } from "lucide-react";
import { useIsMobileOrTablet } from "@/lib/device";

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobileOrTablet();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const navbar = document.querySelector("header.sticky");
    if (navbar) (navbar as HTMLElement).style.display = "none";

    return () => {
      document.body.style.overflow = "";
      if (navbar) (navbar as HTMLElement).style.display = "";
    };
  }, []);

  const handleCopyLink = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "https://masterstroke.academy";
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center bg-[var(--bg)] p-6 text-center text-[var(--text)] overflow-y-auto">
        <div className="mx-auto max-w-md w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-8 shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-mst-red border border-mst-red/20">
            <div className="relative">
              <Laptop size={36} />
              <ShieldAlert
                size={18}
                className="absolute -bottom-1 -right-1 text-red-500 bg-[var(--surface-2)] rounded-full"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-mst-red/10 px-3 py-1 text-xs font-semibold text-mst-red mb-3">
            Proctored Assessment Security
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Laptop or PC Required
          </h1>

          <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
            For assessments, please use the{" "}
            <strong className="text-[var(--text)]">Masterstroke Academy Website</strong> on a laptop or desktop computer.
          </p>

          <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
            Assessments cannot be attempted on mobile phones or tablets because they require a secure proctored environment with webcam monitoring, full-screen lockdown, and code evaluation.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="https://masterstroke.academy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-mst-red to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-mst-red/25 hover:shadow-mst-red/40 hover:opacity-95 transition"
            >
              Visit Masterstroke Academy <ExternalLink size={16} />
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--border)] transition"
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

            <Link
              href="/learn"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--border)] transition"
            >
              <ArrowLeft size={16} />
              <span>Back to Course</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-lockdown fixed inset-0 z-[100] flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {children}
    </div>
  );
}
