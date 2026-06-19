// Utility helpers for sanitising UI text: remove hyphens and emojis where desired
export function stripHyphens(s: string): string {
  return s.replace(/[‐‑‒–—−]/g, " ").replace(/\s+/g, " ").trim();
}

// Remove common emoji/unicode pictographs
export function stripEmojis(s: string): string {
  return s.replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|\uFE0F)/gu, "");
}

export function sanitizeHtml(html: string): string {
  if (!html) return html;
  // Remove emojis and replace hyphens with spaces in text nodes
  // Basic approach: operate on raw HTML string — good for demo purposes
  let out = html;
  out = stripEmojis(out);
  out = out.replace(/\bSub-Module\b/gi, "Submodule");
  out = out.replace(/\bSub-Modules\b/gi, "Submodules");
  // Replace various hyphen/dash characters with space
  out = out.replace(/[‐‑‒–—−]/g, " ");
  // Collapse multiple spaces
  out = out.replace(/\s{2,}/g, " ");
  return out;
}
