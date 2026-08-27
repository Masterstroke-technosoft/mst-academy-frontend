import type { ReactNode } from "react";

/**
 * Minimal Markdown -> React renderer for chatbot replies.
 *
 * Intentionally NOT using a third-party package (marked, react-markdown, etc.)
 * to avoid adding a new dependency for a handful of formatting needs, and
 * NOT using dangerouslySetInnerHTML — every node below is a real React
 * element built from parsed text, so there's no HTML/script injection risk
 * even though the text originates from an external API.
 *
 * Supports: **bold**, *italic*, `inline code`, ```code blocks```,
 * [text](url) links, "- "/"* " bullet lists, "1. " ordered lists,
 * and paragraphs with single line breaks.
 */

let keySeed = 0;
function nextKey(prefix: string) {
  keySeed += 1;
  return `${prefix}-${keySeed}`;
}

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Order matters: code spans first so ** or [ inside `code` isn't touched.
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)\s]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={nextKey("code")}
          className="rounded bg-[var(--lesson-code-bg)] px-1 py-0.5 text-[0.85em] font-mono"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={nextKey("b")}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={nextKey("i")}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);
      if (linkMatch) {
        nodes.push(
          <a
            key={nextKey("a")}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-mst-red hover:text-[var(--mst-red-dark)]"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderParagraph(block: string, key: string): ReactNode {
  const lines = block.split("\n");
  return (
    <p key={key} className="whitespace-pre-wrap">
      {lines.map((line, i) => (
        <span key={i}>
          {parseInline(line)}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}

export function renderMarkdown(text: string): ReactNode {
  const blocks = text.trim().split(/\n\s*\n/);

  return blocks.map((block) => {
    const trimmed = block.trim();

    // Fenced code block
    if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
      const code = trimmed.replace(/^```[a-zA-Z0-9]*\n?/, "").replace(/```$/, "");
      return (
        <pre
          key={nextKey("pre")}
          className="overflow-x-auto rounded-lg bg-[var(--lesson-code-bg)] p-2.5 text-xs font-mono"
        >
          <code>{code}</code>
        </pre>
      );
    }

    const lines = trimmed.split("\n").filter((l) => l.trim().length > 0);

    // Bullet list
    if (lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l.trim()))) {
      return (
        <ul key={nextKey("ul")} className="list-disc space-y-0.5 pl-5">
          {lines.map((l) => (
            <li key={nextKey("li")}>{parseInline(l.trim().replace(/^[-*]\s+/, ""))}</li>
          ))}
        </ul>
      );
    }

    // Ordered list
    if (lines.length > 0 && lines.every((l) => /^\d+\.\s+/.test(l.trim()))) {
      return (
        <ol key={nextKey("ol")} className="list-decimal space-y-0.5 pl-5">
          {lines.map((l) => (
            <li key={nextKey("li")}>{parseInline(l.trim().replace(/^\d+\.\s+/, ""))}</li>
          ))}
        </ol>
      );
    }

    return renderParagraph(trimmed, nextKey("p"));
  });
}
