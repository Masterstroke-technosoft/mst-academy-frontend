import { stripHyphens, stripEmojis } from "./text";

/** Card/list titles: badge shows id — strip duplicate numbering from heading text. */
export function getCardSubmoduleTitle(title: string): string {
  let t = title.replace(/^Sub-Module\s*/i, "").trim();
  t = t.replace(/^\d+\.\d+\s*/, "");
  t = t.replace(/^([\d+\.\d+])(?=[A-Za-z])/, "");
  t = t.replace(/^[–—-]\s*/, "").trim();
  t = stripHyphens(t);
  t = stripEmojis(t);
  return t;
}

/** Lesson page headings keep educational numbering (e.g. "1.1 The Birth of the Internet"). */
export function getLessonDisplayTitle(title: string, id: string): string {
  const name = getCardSubmoduleTitle(title);
  return `${id} ${name}`;
}

/** Normalise UI copy: replace hyphenated labels with spaced words where appropriate. */
export function formatUiLabel(label: string): string {
  return label
    .replace(/\bSub-Modules\b/gi, "Submodules")
    .replace(/\bSub-Module\b/gi, "Submodule")
    .replace(/\bNon-Validator\b/gi, "Web3 Enthusiast")
    .replace(/\bUser\/Developer\b/gi, "User / Developer");
}
