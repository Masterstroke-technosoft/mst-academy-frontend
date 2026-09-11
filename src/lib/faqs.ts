export interface FaqItem {
  q: string;
  a: string;
}

export const HOMEPAGE_FAQS: FaqItem[] = [
  {
    q: "What is Masterstroke Academy and who is it designed for?",
    a: "Masterstroke Academy is India's leading practical blockchain developer academy. It is designed for students, software engineers, and Web3 enthusiasts looking to master Solidity, smart contract security, DeFi protocols, and decentralized application (dApp) architecture from fundamentals to production.",
  },
  {
    q: "Do I need prior blockchain or coding experience to enroll?",
    a: "No prior blockchain experience is required. The curriculum begins with internet fundamentals and programming basics before progressing into advanced topics like cryptography, EVM architecture, Solidity, Hardhat, ZK Proofs, and Real World Asset (RWA) tokenization.",
  },
  {
    q: "What makes Masterstroke Academy different from other online courses?",
    a: "Masterstroke Academy features interactive browser-based code execution, an on-chain verifiable credential system, full-screen lockdown assessments to guarantee skill validation, and a direct path to internship stipends and startup grant funding up to $50,000.",
  },
  {
    q: "Will I get an internship or job placement support?",
    a: "Yes. Our fellowship tracks include live project execution, portfolio reviews, mentor guidance, on-job training (OJT), and pre-placement offer (PPO) opportunities through our partner network and MST Chain ecosystem.",
  },
  {
    q: "How does the 70% passing threshold work?",
    a: "To ensure true mastery, each lesson and module requires a minimum score of 70% in assessments to unlock the subsequent stage. This ensures you build job-ready, production-grade proficiency.",
  },
  {
    q: "Are the certificates verifiable on-chain?",
    a: "Yes, upon completing the full curriculum and capstone project, your graduation certificate is minted on MST Blockchain, providing tamper-proof, publicly verifiable proof of your technical expertise.",
  },
];

export const CURRICULUM_FAQS: FaqItem[] = [
  {
    q: "How many modules and hours are included in the syllabus?",
    a: "The curriculum spans 4 structured phases, 21 comprehensive modules, 123 submodules, and over 130 hours of hands-on interactive training.",
  },
  {
    q: "What technologies and tools will I learn?",
    a: "You will master Solidity, EVM, Hardhat, Foundry, ethers.js, Web3.js, React/Next.js for dApps, IPFS, OpenZeppelin contract standards (ERC-20, ERC-721, ERC-1155), DeFi liquidity models, Smart Contract Auditing tools (Slither, Echidna), and Zero-Knowledge (ZK) proofs.",
  },
  {
    q: "How is the curriculum structured across the 4 phases?",
    a: "Phase 1 covers Internet Foundations & Decentralization. Phase 2 covers the MST Architecture & Developer Tooling. Phase 3 focuses on Core Project Development & MVP Startups. Phase 4 covers Security Auditing, Grant Applications, and Demo Day pitch preparation.",
  },
  {
    q: "Is there a capstone project required for graduation?",
    a: "Yes. In Phase 4, every learner designs, builds, audits, and deploys a complete decentralized application (dApp) on MST Chain testnet and presents it during Demo Day to potential investors and employers.",
  },
  {
    q: "Can I access the curriculum modules at my own pace?",
    a: "Yes. While the curriculum follows a structured learning progression unlocked via assessments, you have lifetime access to review lesson materials, code walkthroughs, and recorded sessions.",
  },
];

export function generateFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
