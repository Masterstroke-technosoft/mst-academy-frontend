/** Phase hour estimates for programme overview (total ~130+ hrs). */
export const PHASE_HOURS: Record<string, { hours: number; label: string }> = {
  "phase-1": { hours: 18, label: "Modules 01–04" },
  "phase-2": { hours: 20, label: "Modules 05–08" },
  "phase-3": { hours: 70, label: "Modules 09–17" },
  "phase-4": { hours: 22, label: "Modules 18–21" },
};

export const PROGRAMME_STATS = {
  phases: 4,
  modules: 21,
  submodules: 122,
  hours: 130,
  passThreshold: 75,
};

export const PROGRAMME_BADGES = [
  "EVM Compatible",
  "Solidity + Web3",
  "Security Auditing",
  "DeFi & RWA",
  "ZK Proofs",
  "Live Demo Day",
  "On-Chain Certificate",
  "Grant Funding Path",
  "College Syllabus Integrated",
];

export const OUTCOMES = [
  {
    title: "Job-Ready Blockchain Engineer",
    description:
      "Write, test, audit, and deploy Solidity smart contracts. Build full-stack dApps with wallet integration on MST Blockchain.",
    icon: "code",
  },
  {
    title: "Funded Web3 Founder",
    description:
      "Graduate with a live dApp, investor pitch deck, and a path to MST grant funding up to $50,000.",
    icon: "star",
  },
  {
    title: "Security & Audit Specialist",
    description:
      "Master reentrancy, proxy patterns, and formal verification. Produce professional audit reports before mainnet.",
    icon: "shield",
  },
  {
    title: "Web3 Entrepreneur",
    description:
      "Learn tokenomics, DAO governance, DeFi mechanics, and RWA tokenisation — the full product stack.",
    icon: "globe",
  },
];

export const ASSESSMENT_TYPES = [
  { type: "MCQ + True/False", pct: 35, desc: "Concept recall with justification where required." },
  { type: "Coding & Completion", pct: 30, desc: "Solidity exercises, debugging, and testnet deployment." },
  { type: "Descriptive & Design", pct: 15, desc: "Scenario answers, architecture diagrams, essays." },
  { type: "Projects & Practicals", pct: 12, desc: "GitHub repos, audit reports, NFT mints, capstone." },
  { type: "Presentations & Pitches", pct: 8, desc: "Slide decks, live pitches, Demo Day presentations." },
];
