"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)] py-6 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            © 2026 Masterstroke Academy. All Rights Reserved.
          </p>
          <p className="text-xs font-medium text-[var(--text)]/70">
            Operated by Masterstroke Technosoft Private Limited.
          </p>
        </div>
      </div>
    </footer>
  );
}
