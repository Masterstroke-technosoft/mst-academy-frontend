"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-6 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Side - Legal Links */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs">
            <Link
              href="/refund-policy"
              className="font-medium text-mst-red hover:text-red-600 transition-colors"
            >
              Refund Policy
            </Link>
            <span className="text-[var(--border)]">•</span>
            <Link
              href="/terms-conditions"
              className="font-medium text-mst-red hover:text-red-600 transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>

          {/* Center - Copyright */}
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="text-xs text-[var(--text-muted)]">
              © 2026 Masterstroke Academy. All Rights Reserved.
            </p>
            <p className="text-xs font-medium text-[var(--text)]/70">
              Operated by Masterstroke Technosoft Private Limited.
            </p>
          </div>

          {/* Right Side - Legal Links */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 text-xs">
            <Link
              href="/privacy-policy"
              className="font-medium text-mst-red hover:text-red-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-[var(--border)]">•</span>
            <Link
              href="/contact-us"
              className="font-medium text-mst-red hover:text-red-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
