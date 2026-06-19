# Masterstroke Academy Platform

Production learning platform for the MST Blockchain program (21 modules, 4 phases).

## Run

```bash
cd masterstroke-platform
npm install
npm run ingest    # sync HTML from ../Module 1 … Module 21
npm run dev
```

Open **http://localhost:3000** → **Open Learning Tree**

## Theme

- **Default**: light (white) — matches MST Blockchain website
- **Toggle**: moon/sun icon in the navbar → dark mode
- Preference saved in `localStorage`

## Interaction model (Avax-style)

- **Left sidebar**: 4 phase buttons — only **one phase tree** visible at a time
- Click a phase → tree reloads, camera centers, fade transition
- **Module cards**: locked / active / completed with progress bar
- **Pan & zoom** on the tree (React Flow)

## Routes

| Path | Purpose |
|------|---------|
| `/learn` | Phase switcher + learning tree |
| `/module/[id]` | Module detail + ordered sub-modules |
| `/module/[id]/[slug]` | Lesson (TOC sidebar, Prism code, copy) |
| `/module/[id]/[slug]/assessment` | **Full-screen** assessment |
| `/module/[id]/[slug]/assessment/results` | Score, %, pass/fail, time |
| `/module/[id]/[slug]/assessment/review` | Per-question review |

## Assessments

- One question per screen
- Timer + progress bar
- MCQ, T/F (+ justification), descriptive (auto-save)
- Coding: LeetCode layout (problem left, Monaco right, output bottom) + Piston run
- Answers/explanations parsed from your HTML files

## Progress

Stored in `localStorage` (lesson + assessment completion, unlock next module).

## Content updates

Edit HTML in `MST_Academy/Module N/`, then:

```bash
npm run ingest
```
