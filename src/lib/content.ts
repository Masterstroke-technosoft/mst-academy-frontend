import fs from "fs";
import path from "path";
import sanitizeHtml from "sanitize-html";

const CONTENT_ROOT = path.join(process.cwd(), "content", "modules");

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "details",
    "summary",
    "pre",
    "code",
    "span",
    "div",
    "section",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "sup",
    "sub",
    "br",
    "hr",
    "figure",
    "figcaption",
    "dl",
    "dt",
    "dd",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "*": ["class", "id", "style"],
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    code: ["class"],
    pre: ["class"],
    td: ["colspan", "rowspan", "class", "style"],
    th: ["colspan", "rowspan", "class", "style"],
  },
  allowVulnerableTags: true,
};

/**
 * Strip all assessment/question content from lesson HTML so only
 * educational material remains.  Preserves any glossary section that
 * may follow the assessment block.
 */
function removeNestedDiv(html: string, className: string): string {
  const marker = `class="${className}"`;
  let searchFrom = 0;
  while (true) {
    const idx = html.indexOf(marker, searchFrom);
    if (idx === -1) break;
    const tagOpen = html.lastIndexOf("<div", idx);
    if (tagOpen === -1) { searchFrom = idx + 1; continue; }
    const between = html.slice(tagOpen, idx);
    if (between.includes(">")) { searchFrom = idx + 1; continue; }
    let depth = 0;
    let pos = tagOpen;
    while (pos < html.length) {
      if (html.startsWith("<div", pos)) {
        depth++;
        const close = html.indexOf(">", pos);
        pos = close === -1 ? html.length : close + 1;
      } else if (html.startsWith("</div>", pos)) {
        depth--;
        pos += 6;
        if (depth === 0) break;
      } else {
        pos++;
      }
    }
    html = html.slice(0, tagOpen) + html.slice(pos);
    searchFrom = tagOpen;
  }
  return html;
}

function stripLessonClutter(html: string): string {
  html = removeNestedDiv(html, "meta-bar");
  html = removeNestedDiv(html, "confetti-bar");
  html = removeNestedDiv(html, "page-footer");
  html = removeNestedDiv(html, "module-badge");
  html = html.replace(/<h1[^>]*class="[^"]*module-title[^"]*"[^>]*>[\s\S]*?<\/h1>/gi, "");
  html = html.replace(/<p[^>]*class="[^"]*module-subtitle[^"]*"[^>]*>[\s\S]*?<\/p>/gi, "");
  return html;
}

function stripAssessmentContent(html: string): string {
  html = stripLessonClutter(html);

  // 1. Remove <section> tags whose class contains "assessment"
  html = html.replace(
    /<section[^>]*class="[^"]*assessment[^"]*"[^>]*>[\s\S]*?<\/section>/gi,
    ""
  );

  // 2. Find the first occurrence of assessment-related content and
  //    strip from that point to end-of-document, but keep the glossary
  //    section (and anything after it) if one exists.
  const assessmentStart = html.search(
    /<div[^>]*class="[^"]*assessment-header[^"]*"[^>]*>|<div[^>]*class="[^"]*question-card[^"]*"[^>]*>|<h[1-6][^>]*>[^<]*(?:Assessment\s+Preparation|Section\s+[A-Z]\s*[--–])/i
  );

  if (assessmentStart !== -1) {
    const beforeAssessment = html.slice(0, assessmentStart);
    const fromAssessment = html.slice(assessmentStart);

    const glossaryMatch = fromAssessment.search(
      /<section[^>]*class="[^"]*glossary[^"]*"[^>]*>|<div[^>]*class="[^"]*glossary-grid[^"]*"[^>]*>|<div[^>]*class="[^"]*section-label[^"]*"[^>]*>[^<]*Glossary/i
    );

    if (glossaryMatch !== -1) {
      html = beforeAssessment + fromAssessment.slice(glossaryMatch);
    } else {
      html = beforeAssessment;
    }
  }

  // 3. Catch any remaining stray assessment blocks that appeared
  //    before the first big assessment boundary detected above.
  html = html.replace(
    /<div[^>]*class="[^"]*question-card[^"]*"[^>]*>[\s\S]*?<\/div>\s*(?:<\/div>)*/gi,
    ""
  );
  html = html.replace(
    /<div[^>]*class="[^"]*answer-block[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ""
  );
  html = html.replace(
    /<div[^>]*class="[^"]*marks-badge-big[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ""
  );
  html = html.replace(
    /<span[^>]*class="[^"]*q-marks[^"]*"[^>]*>[\s\S]*?<\/span>/gi,
    ""
  );
  html = html.replace(
    /<h[1-6][^>]*>[^<]*(?:Assessment\s+Preparation|Section\s+[A-Z]\s*[--–])[^<]*<\/h[1-6]>/gi,
    ""
  );

  return html;
}

export function getLessonHtml(moduleId: number, subSlug: string): string | null {
  const lessonPath = path.join(
    CONTENT_ROOT,
    String(moduleId),
    `${subSlug}-lesson.html`
  );
  if (!fs.existsSync(lessonPath)) {
    const mod = getModuleDir(moduleId);
    if (!mod) return null;
    const files = fs.readdirSync(mod).filter((f) => f.endsWith(".html") && !f.includes("-lesson"));
    const match = files.find((f) => f.includes(subSlug.replace("-", ".")));
    if (match) {
      const raw = fs.readFileSync(path.join(mod, match), "utf-8");
      return sanitizeHtml(stripAssessmentContent(raw), sanitizeOptions);
    }
    return null;
  }
  const raw = fs.readFileSync(lessonPath, "utf-8");
  return sanitizeHtml(stripAssessmentContent(raw), sanitizeOptions);
}

function getModuleDir(moduleId: number): string | null {
  const dir = path.join(CONTENT_ROOT, String(moduleId));
  return fs.existsSync(dir) ? dir : null;
}
