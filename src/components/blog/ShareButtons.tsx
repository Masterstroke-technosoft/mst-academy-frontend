"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Check, Copy } from "lucide-react";

interface ShareButtonsProps {
  /** "Share Article" on the live post page, "Share Preview" on the draft preview page. */
  label: string;
  /** Pre-filled tweet copy — differs between the live post and the draft preview. */
  tweetText: string;
}


export default function ShareButtons({ label, tweetText }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(tweetText);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
      <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-1.5 justify-center">
        <Share2 size={13} /> {label}
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShareTwitter}
          className="bg-[var(--bg)] hover:bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text)] text-xs font-bold py-2.5 rounded-xl cursor-pointer transition-colors duration-200"
        >
          Share to X
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopyLink}
          className="bg-[var(--bg)] hover:bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text)] text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors duration-200"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-500" /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> Copy Link
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
