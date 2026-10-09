import { stripHyphens, stripEmojis } from "./text";

/** Card/list module titles: strip duplicate "MODULE 1:" prefix and normalize formatting */
export function getCardModuleTitle(title: string): string {
  let t = title.replace(/^MODULE\s*\d+\s*[:–—-]\s*/i, "").trim();
  t = t.replace(/^Module\s*\d+\s*[:–—-]\s*/i, "").trim();
  t = stripHyphens(t);
  t = stripEmojis(t);
  if (t === t.toUpperCase() && t.length > 4) {
    t = t.toLowerCase().replace(/(?:^|\s|-|\/)\S/g, (match) => match.toUpperCase());
    t = t.replace(/\bWeb\s*3(?:\.0)?\b/gi, "Web 3.0")
         .replace(/\bWeb\s*1(?:\.0)?\b/gi, "Web 1.0")
         .replace(/\bWeb\s*2(?:\.0)?\b/gi, "Web 2.0")
         .replace(/\bMvp\b/g, "MVP")
         .replace(/\bArpanet\b/g, "ARPANET")
         .replace(/\bMst\b/g, "MST")
         .replace(/\bEvm\b/g, "EVM")
         .replace(/\bDao\b/g, "DAO")
         .replace(/\bNft\b/g, "NFT")
         .replace(/\bApi\b/g, "API");
  }
  return t;
}

/** Card/list titles: badge shows id - strip duplicate numbering from heading text. */
export function getCardSubmoduleTitle(title: string): string {
  let t = title.replace(/^Sub-Module\s*/i, "").trim();
  t = t.replace(/^Submodule\s*/i, "").trim();
  t = t.replace(/^\d+\.\d+\s*[:–—-]?\s*/, "");
  t = t.replace(/^([\d+\.\d+])(?=[A-Za-z])/, "");
  t = t.replace(/^[-–—:]\s*/, "").trim();
  t = stripHyphens(t);
  t = stripEmojis(t);
  if (t === t.toUpperCase() && t.length > 4) {
    t = t.toLowerCase().replace(/(?:^|\s|-|\/)\S/g, (match) => match.toUpperCase());
    t = t.replace(/\bWeb\s*3(?:\.0)?\b/gi, "Web 3.0")
         .replace(/\bWeb\s*1(?:\.0)?\b/gi, "Web 1.0")
         .replace(/\bWeb\s*2(?:\.0)?\b/gi, "Web 2.0")
         .replace(/\bArpanet\b/g, "ARPANET")
         .replace(/\bMvp\b/g, "MVP")
         .replace(/\bMst\b/g, "MST")
         .replace(/\bEvm\b/g, "EVM")
         .replace(/\bDao\b/g, "DAO")
         .replace(/\bNft\b/g, "NFT")
         .replace(/\bApi\b/g, "API");
  }
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
