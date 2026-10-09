import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Layers,
  Code2,
} from "lucide-react";
import { GlossaryClientHub, type GlossaryTerm } from "./GlossaryClientHub";

export const metadata: Metadata = {
  title: {
    absolute:
      "Web3 & Blockchain Glossary - Key Terms Explained | Masterstroke Academy",
  },
  description:
    "Plain-English definitions of essential blockchain and Web3 terms - Solidity, DAO, Gas, EVM, Smart Contract, and more. From Masterstroke Academy.",
  alternates: { canonical: "https://masterstroke.academy/glossary" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Web3 & Blockchain Glossary | Masterstroke Academy",
    description:
      "20 essential blockchain and Web3 terms explained in plain English.",
    url: "https://masterstroke.academy/glossary",
    images: [
      {
        url: "/Academy_Logo.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web3 & Blockchain Glossary | Masterstroke Academy",
    description:
      "20 essential blockchain and Web3 terms explained in plain English.",
  },
};

const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Smart Contract",
    category: "Core Concepts",
    tag: "smart-contract",
    definition:
      "A self-executing program stored on a blockchain that runs exactly as coded, without any possibility of downtime, censorship, or third-party interference.",
  },
  {
    term: "Solidity",
    category: "Languages & Tooling",
    tag: "solidity",
    definition:
      "The primary programming language for writing smart contracts on Ethereum and other EVM-compatible blockchains, including MST Chain.",
  },
  {
    term: "EVM (Ethereum Virtual Machine)",
    category: "Architecture",
    tag: "evm",
    definition:
      "The runtime environment that executes smart contracts. 'EVM-compatible' means a blockchain can run the same smart contracts as Ethereum.",
  },
  {
    term: "Gas",
    category: "Network Economics",
    tag: "gas",
    definition:
      "The computational fee paid to execute a transaction or smart contract function on a blockchain. Named for the 'fuel' required to run operations.",
  },
  {
    term: "DAO (Decentralised Autonomous Organisation)",
    category: "Governance",
    tag: "dao",
    definition:
      "An organisation governed by smart contracts and community voting rather than a central authority or CEO.",
  },
  {
    term: "DeFi (Decentralised Finance)",
    category: "Applications",
    tag: "defi",
    definition:
      "Financial services - lending, trading, borrowing - built on blockchain smart contracts instead of traditional banks or intermediaries.",
  },
  {
    term: "NFT (Non-Fungible Token)",
    category: "Token Standards",
    tag: "nft",
    definition:
      "A unique digital asset recorded on a blockchain, commonly following the ERC-721 or ERC-1155 token standards.",
  },
  {
    term: "ZK Proof (Zero-Knowledge Proof)",
    category: "Cryptography & Privacy",
    tag: "zk-proof",
    definition:
      "A cryptographic method that lets you prove a statement is true without revealing the underlying data itself.",
  },
  {
    term: "Consensus Mechanism",
    category: "Network Consensus",
    tag: "consensus",
    definition:
      "The process by which a blockchain network agrees on the validity of transactions, e.g. Proof of Work or Proof of Stake.",
  },
  {
    term: "Hash Function",
    category: "Cryptography",
    tag: "hash-function",
    definition:
      "A mathematical function that converts input data into a fixed-length string of characters - the foundation of blockchain immutability.",
  },
  {
    term: "Public Key / Private Key",
    category: "Cryptography & Security",
    tag: "keys",
    definition:
      "A cryptographic key pair: the public key is your wallet address, shareable with anyone; the private key must never be shared and proves ownership.",
  },
  {
    term: "Wallet",
    category: "Infrastructure",
    tag: "wallet",
    definition:
      "Software (or hardware) that stores your private keys and lets you interact with a blockchain - sending transactions, holding tokens, and signing messages.",
  },
  {
    term: "Testnet",
    category: "Developer Environment",
    tag: "testnet",
    definition:
      "A test version of a blockchain network used for development and experimentation, using tokens with no real monetary value.",
  },
  {
    term: "Mainnet",
    category: "Developer Environment",
    tag: "mainnet",
    definition:
      "The live, production blockchain network where real transactions carry real value.",
  },
  {
    term: "Layer 1 / Layer 2",
    category: "Scalability",
    tag: "layer1-layer2",
    definition:
      "Layer 1 refers to a base blockchain (like Ethereum or MST Chain); Layer 2 refers to a scaling solution built on top of it.",
  },
  {
    term: "Token Standard (ERC-20, ERC-721, ERC-1155)",
    category: "Token Standards",
    tag: "erc-standards",
    definition:
      "Technical specifications that define how a token behaves on an EVM-compatible blockchain - ERC-20 for fungible tokens, ERC-721 and ERC-1155 for NFTs.",
  },
  {
    term: "Staking",
    category: "Network Consensus",
    tag: "staking",
    definition:
      "Locking up tokens to help secure a blockchain network (in Proof of Stake systems) in exchange for rewards.",
  },
  {
    term: "Web3",
    category: "Industry & Ecosystem",
    tag: "web3",
    definition:
      "The umbrella term for the decentralised internet built on blockchain technology, emphasising user ownership over data and assets.",
  },
  {
    term: "RWA (Real World Asset) Tokenisation",
    category: "Asset Tokenisation",
    tag: "rwa",
    definition:
      "The process of representing physical assets - real estate, commodities, invoices - as digital tokens on a blockchain.",
  },
  {
    term: "Reentrancy Attack",
    category: "Security & Audits",
    tag: "reentrancy",
    definition:
      "A common smart contract vulnerability where an external contract call is exploited to repeatedly withdraw funds before the original transaction completes.",
  },
];

const glossarySchema = [
  {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Web3 & Blockchain Glossary",
    "url": "https://masterstroke.academy/glossary",
    "hasDefinedTerm": glossaryTerms.map((item) => ({
      "@type": "DefinedTerm",
      "name": item.term,
      "description": item.definition,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://masterstroke.academy/",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Glossary",
        "item": "https://masterstroke.academy/glossary",
      },
    ],
  },
];

export default function GlossaryPage() {
  return (
    <>
      {/* Schema.org DefinedTermSet & BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(glossarySchema) }}
      />

      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        {/* Subtle background glows */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl bg-gradient-to-b from-mst-red/10 via-purple-500/5 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 -right-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute top-2/3 -left-32 h-72 w-72 rounded-full bg-mst-red/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
            {/* Back to Home Link */}
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-mst-red hover:underline text-sm font-medium"
              >
                <ChevronLeft size={16} />
                Back to Home
              </Link>
            </div>

            {/* Header Section */}
            <header className="mx-auto max-w-3xl text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-mst-red/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mst-red shadow-sm mb-6">
                <Bookmark size={14} className="animate-pulse" />
                Comprehensive Web3 Dictionary
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-[var(--text)]">
                Web3 & Blockchain <span className="text-mst-red">Glossary</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-muted)] max-w-2xl mx-auto">
                Clear, plain-English definitions of the terms you&apos;ll encounter throughout your blockchain development journey. Each term below can become its own page for deeper SEO reach — this hub lists them all in one place.
              </p>
            </header>

            {/* Interactive Terms Hub */}
            <GlossaryClientHub terms={glossaryTerms} />

            {/* Bottom CTA Card */}
            <section className="mt-20 sm:mt-28">
              <div className="relative overflow-hidden rounded-3xl border border-mst-red/30 bg-gradient-to-br from-[var(--surface)] via-[var(--bg-muted)] to-[var(--surface)] p-8 sm:p-12 shadow-2xl text-center">
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-mst-red/15 blur-3xl" />
                <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />

                <div className="relative z-10 max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full border border-mst-red/30 bg-mst-red/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-mst-red mb-4">
                    <Sparkles size={14} />
                    From Concepts to Code
                  </div>

                  <h3 className="text-2xl font-black sm:text-4xl text-[var(--text)] tracking-tight">
                    Want to Go Beyond Definitions?
                  </h3>

                  <p className="mt-4 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                    Learn to build with these concepts hands-on in our full blockchain developer course.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/academy-overview"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-mst-red px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-mst-red/25 hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Explore the Curriculum
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/register"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-sm font-bold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-all duration-200"
                    >
                      Start Free Today
                    </Link>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      Live Solidity IDE
                    </span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      On-Chain Certificates
                    </span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      $50K Grants Path
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
