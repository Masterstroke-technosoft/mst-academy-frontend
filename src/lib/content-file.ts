const UPLOADS_PREFIX = "uploads/learning-content-files";

/** Normalize DB paths like bare filenames to the uploads folder. */
export function normalizeContentFilePath(contentFile: string): string {
  const trimmed = contentFile.trim().replace(/^\//, "");
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith(`${UPLOADS_PREFIX}/`)) {
    return trimmed;
  }

  if (!trimmed.includes("/")) {
    return `${UPLOADS_PREFIX}/${trimmed}`;
  }

  return trimmed;
}

/** Build an absolute URL for a submodule HTML file served by the API. */
export function resolveContentFileUrl(contentFile: string): string {
  if (!contentFile) return "";

  if (/^https?:\/\//i.test(contentFile)) {
    return contentFile;
  }

  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const path = normalizeContentFilePath(contentFile);
  return `${base}/${path}`;
}
/** Uploaded admin HTML files are full documents with their own layout. */
export function isFullHtmlDocument(html: string): boolean {
  const trimmed = html.trimStart();
  return /^<!DOCTYPE\s+html/i.test(trimmed) || /^<html[\s>]/i.test(trimmed);
}
