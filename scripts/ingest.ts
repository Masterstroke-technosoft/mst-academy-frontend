/**
 * Scans MST_Academy module folders, copies HTML, and generates curriculum + assessment JSON.
 * Run: npm run ingest
 */
import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

const ACADEMY_ROOT = path.resolve(__dirname, "..");
const CONTENT_SOURCE = path.resolve(ACADEMY_ROOT, "content", "modules");
const OUT_CONTENT = path.resolve(__dirname, "..", "content", "modules");
const OUT_DATA = path.resolve(__dirname, "..", "src", "data");

const PHASES = [
  {
    id: "phase-1",
    title: "The Internet, Decentralisation & Blockchain Foundation",
    modules: [1, 2, 3, 4],
  },
  {
    id: "phase-2",
    title: "The MST Difference & Developer Tooling",
    modules: [5, 6, 7, 8],
  },
  {
    id: "phase-3",
    title: "Core Project Starts — Building Your Startup MVP",
    modules: [9, 10, 11, 12, 13, 14, 15, 16, 17],
  },
  {
    id: "phase-4",
    title: "From Developer to Funded Founder/Intern — Grants, Pitch & Career",
    modules: [18, 19, 20, 21],
  },
];

const MODULE_TITLES: Record<number, string> = {
  1: "The Internet & Web Evolution",
  2: "Decentralisation Fundamentals",
  3: "Blockchain Core Concepts",
  4: "Cryptography & Wallet Security",
  5: "The MST Difference",
  6: "MST Architecture Deep Dive",
  7: "Developer Environment Setup",
  8: "Smart Contract Foundations",
  9: "Solidity Language Mastery",
  10: "Testing & Security Auditing",
  11: "DeFi & RWA Orbitals",
  12: "NFTs & Gaming",
  13: "Oracles & WASMify",
  14: "Cross-Chain & Bridges",
  15: "DAO Governance & Treasury",
  16: "SARAL & Permission Registry",
  17: "Capstone Project Launch",
  18: "Grant Writing & Funding",
  19: "Pitch Deck & VC Readiness",
  20: "Career & Interview Mastery",
  21: "Certification & Alumni Network",
};

type QuestionType =
  | "mcq"
  | "true_false"
  | "true_false_justification"
  | "descriptive"
  | "coding"
  | "coding_project"
  | "live_coding"
  | "other";

interface ParsedQuestion {
  id: string;
  number: number;
  type: QuestionType;
  difficulty?: string;
  marks: number;
  text: string;
  options?: { key: string; text: string; isCorrect: boolean }[];
  correctAnswer?: string;
  explanation?: string;
  modelAnswer?: string;
  starterCode?: string;
  language?: string;
  tfVerdict?: string;
}

function normalizeType(raw: string): QuestionType {
  const t = raw.toLowerCase().trim();
  if (t.includes("mcq") || t.includes("multiple choice")) return "mcq";
  if (t.includes("t/f") && t.includes("just")) return "true_false_justification";
  if (t.includes("true") && t.includes("false")) return "true_false";
  if (t.includes("descriptive") || t.includes("essay") || t.includes("design"))
    return "descriptive";
  if (t.includes("coding project") || t.includes("project submission"))
    return "coding_project";
  if (t.includes("live coding")) return "live_coding";
  if (t.includes("coding") || t.includes("solidity")) return "coding";
  return "other";
}

function parseMarks(text: string): number {
  const m = text.match(/(\d+)\s*mark/i);
  return m ? parseInt(m[1], 10) : 1;
}

function extractSubmoduleId(filename: string, moduleNum: number): string {
  const m1 = filename.match(/submodule_(\d+)_(\d+)/i);
  if (m1) return `${m1[1]}.${m1[2]}`;
  const m2 = filename.match(/(\d+)\.(\d+)/);
  if (m2) return `${m2[1]}.${m2[2]}`;
  const m3 = filename.match(/^(\d+)\.(\d+)/);
  if (m3) return `${m3[1]}.${m3[2]}`;
  return `${moduleNum}.1`;
}

function parseQuestionBlock($: cheerio.CheerioAPI, el: cheerio.AnyNode): ParsedQuestion | null {
  const block = $(el);
  const badge = block.find(".q-badge").first().text().trim();
  const qNumMatch = badge.match(/Q(\d+)/i);
  const number = qNumMatch ? parseInt(qNumMatch[1], 10) : 0;

  const typeRaw = block.find(".q-type").first().text().trim();
  const type = normalizeType(typeRaw);
  const diff = block.find(".q-diff").first().text().trim() || undefined;
  const marksText = block.find(".q-marks").first().text().trim();
  const marks = parseMarks(marksText);

  const text = block.find(".q-text").first().html()?.trim() || block.find(".q-text").first().text().trim();
  if (!text) return null;

  const options: ParsedQuestion["options"] = [];
  block.find(".options li").each((_, opt) => {
    const li = $(opt);
    const key = li.find(".opt-key").first().text().trim() || li.text().trim().charAt(0);
    const isCorrect = li.hasClass("correct");
    const optText = li.clone().children(".opt-key").remove().end().text().replace(/✅/g, "").trim();
    options.push({ key: key.replace(/[^A-D]/gi, "").charAt(0) || key, text: optText, isCorrect });
  });

  let correctAnswer: string | undefined;
  const correctOpt = options.find((o) => o.isCorrect);
  if (correctOpt) correctAnswer = correctOpt.key;

  const answerBox = block.find(".answer-box").first();
  let explanation = answerBox.find("p").map((_, p) => $(p).text()).get().join("\n").trim();
  if (!explanation) {
    explanation = answerBox.find(".answer-box-label, .a-rubric-label").first().text().trim();
  }
  const modelAnswer = answerBox.html()?.trim() || undefined;

  const tfVerdict = block.find(".tf-verdict").first().text().trim() || undefined;
  if (tfVerdict && !correctAnswer) {
    correctAnswer = tfVerdict.toUpperCase().includes("TRUE")
      ? "TRUE"
      : tfVerdict.toUpperCase().includes("FALSE")
        ? "FALSE"
        : tfVerdict;
  }

  let starterCode: string | undefined;
  const codeEl = block.find(".code-snippet pre, .code-block code, .code-block pre").first();
  if (codeEl.length) starterCode = codeEl.text().trim();

  const lang = type === "coding" || type === "live_coding" ? "solidity" : undefined;

  return {
    id: `q${number}`,
    number,
    type,
    difficulty: diff,
    marks,
    text,
    options: options.length ? options : undefined,
    correctAnswer,
    explanation: explanation || modelAnswer,
    modelAnswer,
    starterCode,
    language: lang,
    tfVerdict,
  };
}

function parseQuestionCard($: cheerio.CheerioAPI, el: cheerio.AnyNode, index: number): ParsedQuestion | null {
  const card = $(el);
  const qNumText = card.find(".q-num").first().text().trim();
  const numMatch = qNumText.match(/(\d+)/);
  const number = numMatch ? parseInt(numMatch[1], 10) : index + 1;

  const typeRaw = card.find(".q-type").first().text().trim();
  const type = normalizeType(typeRaw);
  const diff = card.find(".difficulty").first().text().trim() || undefined;
  const marksText = card.find(".marks-badge").first().text().trim();
  const marks = parseMarks(marksText);

  const text =
    card.find(".question-text").first().html()?.trim() ||
    card.find(".question-text").first().text().trim();
  if (!text) return null;

  const options: ParsedQuestion["options"] = [];
  card.find(".options .option, .options li").each((_, opt) => {
    const li = $(opt);
    const keyEl = li.find(".opt-label").first();
    const key = keyEl.text().trim() || "A";
    const isCorrect = li.hasClass("correct");
    const optText = li.clone().children(".opt-label").remove().end().text().trim();
    options.push({ key, text: optText, isCorrect });
  });

  let correctAnswer: string | undefined;
  const label = card.find(".answer-label").first().text().trim();
  const ansMatch = label.match(/:\s*([A-D])/i);
  if (ansMatch) correctAnswer = ansMatch[1].toUpperCase();
  else if (label.toUpperCase().includes("TRUE")) correctAnswer = "TRUE";
  else if (label.toUpperCase().includes("FALSE")) correctAnswer = "FALSE";

  const correctOpt = options.find((o) => o.isCorrect);
  if (correctOpt && !correctAnswer) correctAnswer = correctOpt.key;

  const explanation = card.find(".answer-block p").map((_, p) => $(p).html()).get().join("") || card.find(".answer-block").html();

  return {
    id: `q${number}`,
    number,
    type,
    difficulty: diff,
    marks,
    text,
    options: options.length ? options : undefined,
    correctAnswer,
    explanation: explanation || undefined,
    modelAnswer: card.find(".answer-block").html() || undefined,
  };
}

function parseAssessment(html: string, submoduleId: string) {
  const $ = cheerio.load(html);
  const section = $("section.assessment-section").first();
  if (!section.length) {
    const cards = $(".question-card");
    if (!cards.length) return null;
  }

  const totalMarks =
    parseInt(section.find(".marks-total-badge .num, .score-num").first().text().trim(), 10) ||
    0;

  const questions: ParsedQuestion[] = [];

  section.find(".question-block").each((i, el) => {
    const q = parseQuestionBlock($, el);
    if (q) questions.push(q);
  });

  if (!questions.length) {
    $("section .question-card, .question-card").each((i, el) => {
      if ($(el).closest(".assessment-section, section[id*='assessment']").length || $("section.assessment-section").length === 0) {
        const q = parseQuestionCard($, el, i);
        if (q) questions.push(q);
      }
    });
  }

  if (!questions.length) return null;

  const computedTotal = questions.reduce((s, q) => s + q.marks, 0);

  return {
    submoduleId,
    totalMarks: totalMarks || computedTotal,
    questions,
  };
}

function extractLessonMeta(html: string) {
  const $ = cheerio.load(html);
  const title =
    $(".module-title").first().text().trim() ||
    $("title").text().split("|")[0]?.trim() ||
    "Lesson";
  const subtitle =
    $(".module-subtitle").first().text().trim() ||
    $("p.hero-sub").first().text().trim() ||
    $("p.subtitle").first().text().trim() ||
    "";

  const toc: { id: string; title: string }[] = [];
  $(".section-title, h2.section-title").each((i, el) => {
    const t = $(el).text().replace(/^[\d\s·]+/, "").trim();
    if (t && !t.toLowerCase().includes("assessment")) {
      const id = `section-${i}`;
      toc.push({ id, title: t.slice(0, 80) });
    }
  });

  $(".section-label").each((i, el) => {
    const t = $(el).text().replace(/^[\d\s·&nbsp;]+/, "").trim();
    if (t && t.length > 3) {
      toc.push({ id: `label-${i}`, title: t.slice(0, 80) });
    }
  });

  return { title, subtitle, toc: toc.slice(0, 25) };
}

function stripAssessmentFromBody(html: string): string {
  const $ = cheerio.load(html);
  $("section.assessment-section").remove();
  $(".assessment-section").remove();
  const style = $("style").map((_, s) => $(s).html()).get().join("\n");
  const bodyHtml = $("body").html() || $.root().html() || html;
  return bodyHtml;
}

function listModuleFiles(moduleDir: string): string[] {
  if (!fs.existsSync(moduleDir)) return [];
  return fs
    .readdirSync(moduleDir)
    .filter(
      (f) =>
        f.endsWith(".html") &&
        !f.includes("NICE") &&
        !f.includes("-lesson") &&
        !f.includes("-lesson.html")
    )
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function main() {
  fs.mkdirSync(OUT_CONTENT, { recursive: true });
  fs.mkdirSync(OUT_DATA, { recursive: true });

  const modules: {
    id: number;
    slug: string;
    title: string;
    phaseId: string;
    description: string;
    submodules: {
      id: string;
      slug: string;
      filename: string;
      title: string;
      subtitle: string;
      hasAssessment: boolean;
      totalMarks: number;
      toc: { id: string; title: string }[];
    }[];
  }[] = [];

  for (let n = 1; n <= 21; n++) {
    const moduleDir = path.join(CONTENT_SOURCE, String(n));
    const files = listModuleFiles(moduleDir);
    const phase = PHASES.find((p) => p.modules.includes(n))!;
    const submodules: (typeof modules)[0]["submodules"] = [];

    for (const file of files) {
      const srcPath = path.join(moduleDir, file);
      const html = fs.readFileSync(srcPath, "utf-8");
      const subId = extractSubmoduleId(file, n);
      const slug = subId.replace(".", "-");
      const meta = extractLessonMeta(html);
      const assessment = parseAssessment(html, subId);

      const destDir = path.join(OUT_CONTENT, String(n));
      fs.mkdirSync(destDir, { recursive: true });
      const destFile = path.join(destDir, file);
      fs.copyFileSync(srcPath, destFile);

      const lessonPath = path.join(destDir, `${slug}-lesson.html`);
      fs.writeFileSync(lessonPath, stripAssessmentFromBody(html), "utf-8");

      if (assessment) {
        const assessDir = path.join(OUT_DATA, "assessments", String(n));
        fs.mkdirSync(assessDir, { recursive: true });
        fs.writeFileSync(
          path.join(assessDir, `${slug}.json`),
          JSON.stringify(assessment, null, 2),
          "utf-8"
        );
      }

      submodules.push({
        id: subId,
        slug,
        filename: file,
        title: meta.title,
        subtitle: meta.subtitle,
        hasAssessment: !!assessment,
        totalMarks: assessment?.totalMarks ?? 0,
        toc: meta.toc,
      });
    }

    modules.push({
      id: n,
      slug: `module-${n}`,
      title: MODULE_TITLES[n] || `Module ${n}`,
      phaseId: phase.id,
      description: `${submodules.length} lessons covering ${MODULE_TITLES[n] || `Module ${n}`}.`,
      submodules,
    });
  }

  const curriculum = { phases: PHASES, modules };
  fs.writeFileSync(
    path.join(OUT_DATA, "curriculum.json"),
    JSON.stringify(curriculum, null, 2),
    "utf-8"
  );

  console.log(`Ingested ${modules.length} modules, ${modules.reduce((s, m) => s + m.submodules.length, 0)} submodules.`);
}

main();
