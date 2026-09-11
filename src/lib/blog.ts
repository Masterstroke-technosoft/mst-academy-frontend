const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "https://cms-api.masterstroke.academy";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "site_token_demo_mst_academy_1785489667016";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  _id?: string;
  id?: string;
  slug: string;
  title?: string;
  heading?: string;
  metaTitle?: string;
  description?: string;
  subHeading?: string;
  metaDescription?: string;
  excerpt?: string;
  content?: string;
  body?: string;
  html?: string;
  coverImage?: string;
  image?: string;
  featuredImage?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  canonical?: string;
  primaryKeyword?: string;
  supportKeywords?: string[];
  articleSection?: string;
  inLanguage?: string;
  author?: string | { name?: string; avatar?: string; bio?: string; url?: string };
  category?: string;
  tags?: string[];
  keywords?: string[];
  createdAt?: string;
  publishedAt?: string;
  updatedAt?: string;
  modifiedAt?: string;
  readTime?: string | number;
  faqs?: FAQItem[];
}

export const FEATURED_BLOGS: BlogPost[] = [
  {
    slug: "how-to-learn-blockchain-2026-roadmap",
    title: "How to Learn Blockchain in 2026: A Complete Roadmap | Masterstroke Academy",
    heading: "How to Learn Blockchain in 2026: A Complete Roadmap",
    metaTitle: "How to Learn Blockchain in 2026: A Complete Roadmap | Masterstroke Academy",
    metaDescription:
      "A step-by-step roadmap to learning blockchain development in 2026 — skills, tools, timeline, and how to land your first Web3 job in India.",
    excerpt:
      "A step-by-step roadmap to learning blockchain development in 2026 — skills, tools, timeline, and how to land your first Web3 job in India.",
    canonical: "https://masterstroke.academy/blogs/how-to-learn-blockchain-2026-roadmap",
    ogTitle: "How to Learn Blockchain in 2026: A Complete Roadmap",
    ogDescription:
      "Skills, tools, and a month-by-month timeline to go from zero to job-ready blockchain developer in 2026.",
    ogImage: "/api/og?title=How+to+Learn+Blockchain+in+2026",
    twitterCard: "summary_large_image",
    primaryKeyword: "how to learn blockchain 2026",
    supportKeywords: [
      "blockchain roadmap 2026",
      "learn blockchain step by step",
      "blockchain developer roadmap India",
    ],
    keywords: [
      "how to learn blockchain 2026",
      "blockchain roadmap 2026",
      "blockchain developer India",
      "web3 roadmap",
    ],
    tags: ["Blockchain", "Solidity", "Web3", "Developer Roadmap", "Learn Blockchain 2026"],
    category: "Roadmap",
    articleSection: "Blockchain Development",
    inLanguage: "en-IN",
    author: {
      name: "Masterstroke Academy",
      url: "https://masterstroke.academy",
    },
    createdAt: "2026-08-01T00:00:00.000Z",
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-27",
    modifiedAt: "2026-08-27",
    readTime: "8 min read",
    faqs: [
      {
        question: "How long does it take to learn blockchain in 2026?",
        answer:
          "With a structured program and consistent daily study, most learners become job-ready in 4 to 6 months. Self-directed learning without a structured curriculum typically takes 12 to 18 months.",
      },
      {
        question: "What is the best way to learn blockchain development in 2026?",
        answer:
          "The fastest path combines structured theory with live, on-chain coding practice rather than passive video-only learning. Programs that include real testnet deployment, project-based assessments, and mentorship compress the learning timeline significantly.",
      },
      {
        question: "Do I need a coding background to start learning blockchain?",
        answer:
          "No prior blockchain experience is required, though basic familiarity with any programming language helps. Structured courses typically start from internet and cryptography fundamentals before introducing Solidity.",
      },
    ],
    content: `
      <p class="lead text-lg md:text-xl font-medium text-[var(--text)] mb-8">
        Blockchain development remains one of the fastest-growing technical skill sets in 2026, and India has become one of the largest sources of new Web3 talent globally. If you're wondering how to learn blockchain in 2026 without wasting months on scattered YouTube tutorials, this roadmap lays out exactly what to learn, in what order, and how long each stage should take.
      </p>

      <h2>Why Learn Blockchain in 2026?</h2>
      <p>
        Blockchain adoption has moved well past speculation into production use &mdash; DeFi protocols manage billions in value, NFT infrastructure powers real-world asset tokenisation, and enterprise blockchain use cases in supply chain and identity verification are scaling across Indian industry. Developers who understand smart contracts, EVM-compatible chains, and Web3 tooling are in short supply relative to demand, which keeps blockchain developer salaries meaningfully higher than equivalent traditional software roles.
      </p>

      <h2>Step 1: Blockchain Fundamentals (Weeks 1&ndash;3)</h2>
      <p>Before writing any code, build a real understanding of how blockchains work. This stage should cover:</p>
      <ul>
        <li>Cryptographic hash functions and how they secure data</li>
        <li>Public-key cryptography and digital signatures</li>
        <li>Consensus mechanisms &mdash; proof of work vs. proof of stake</li>
        <li>The EVM (Ethereum Virtual Machine) and what &ldquo;EVM-compatible&rdquo; means</li>
        <li>How transactions, gas, and blocks actually function</li>
      </ul>
      <p>
        Skipping this stage is the most common mistake self-taught developers make &mdash; it leads to writing code that works but doesn't reflect a real understanding of why it works, which becomes obvious in technical interviews and in production security reviews.
      </p>

      <h2>Step 2: Learn Solidity (Weeks 4&ndash;7)</h2>
      <p>
        Solidity is the primary smart contract language for Ethereum and every EVM-compatible chain, including Polygon, Arbitrum, BNB Chain, and MST Chain. Focus on:
      </p>
      <ul>
        <li>Data types, state variables, and functions</li>
        <li>Modifiers, events, and access control</li>
        <li>Contract inheritance and interfaces</li>
        <li>Common patterns: ERC-20 tokens, basic NFT contracts</li>
      </ul>
      <p>
        Most learners write their first working smart contract within two weeks of consistent practice. The goal at this stage isn't mastery &mdash; it's fluency with the basic building blocks.
      </p>

      <h2>Step 3: Developer Tooling (Weeks 8&ndash;10)</h2>
      <p>Professional blockchain development uses a specific toolchain:</p>
      <ul>
        <li><strong>Hardhat</strong> or <strong>Foundry</strong> for compiling, testing, and deploying contracts</li>
        <li><strong>Ethers.js</strong> or <strong>Web3.js</strong> for connecting a frontend to deployed contracts</li>
        <li><strong>MetaMask</strong> for wallet integration and transaction signing</li>
        <li>A testnet (or a live EVM-compatible chain like MST Chain) for real deployment practice</li>
      </ul>
      <p>
        This is the stage where &ldquo;writing Solidity&rdquo; turns into &ldquo;being a blockchain developer&rdquo; &mdash; you move from isolated code snippets to a real development workflow.
      </p>

      <h2>Step 4: Build Real Projects (Weeks 11&ndash;18)</h2>
      <p>Theory and tutorials only go so far. The strongest blockchain developer portfolios include:</p>
      <ol>
        <li>An ERC-20 token with custom logic</li>
        <li>An NFT collection using ERC-721 with minting and metadata</li>
        <li>A simple decentralised exchange (AMM) or lending protocol</li>
        <li>A DAO with on-chain voting</li>
      </ol>
      <p>
        Building all four gives you working examples across the major categories of blockchain application &mdash; DeFi, NFTs, and governance &mdash; which is exactly what employers and grant committees look for.
      </p>

      <h2>Step 5: Security and Advanced Topics (Weeks 19&ndash;22)</h2>
      <p>Smart contracts are immutable once deployed, which makes security a non-negotiable skill, not an optional add-on:</p>
      <ul>
        <li>Reentrancy attacks and how to prevent them</li>
        <li>Integer overflow/underflow protections</li>
        <li>Access control vulnerabilities</li>
        <li>Basic auditing methodology using tools like Slither</li>
      </ul>
      <p>
        Developers who understand security are significantly more employable &mdash; and significantly less likely to ship a contract that gets exploited.
      </p>

      <h2>Step 6: Portfolio and Job Readiness (Weeks 23&ndash;26)</h2>
      <p>By this stage, you should have:</p>
      <ul>
        <li>A GitHub portfolio with deployed, verified contracts</li>
        <li>A short write-up explaining the design decisions behind each project</li>
        <li>Familiarity with how to read and respond to a basic audit report</li>
        <li>A clear answer to &ldquo;what have you built&rdquo; for interviews</li>
      </ul>

      <h2>A Realistic Blockchain Learning Timeline for 2026</h2>
      <div class="overflow-x-auto my-8">
        <table class="w-full text-left border-collapse border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
          <thead>
            <tr class="bg-[var(--surface-2)] border-b border-[var(--border)]">
              <th class="p-4 font-bold text-[var(--text)]">Stage</th>
              <th class="p-4 font-bold text-[var(--text)]">Duration</th>
              <th class="p-4 font-bold text-[var(--text)]">Outcome</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--border)]">
            <tr class="hover:bg-[var(--bg-muted)] transition-colors">
              <td class="p-4 font-medium text-[var(--text)]">Fundamentals</td>
              <td class="p-4 text-[var(--text-muted)]">Weeks 1&ndash;3</td>
              <td class="p-4 text-[var(--text)]">Understand how blockchains work</td>
            </tr>
            <tr class="hover:bg-[var(--bg-muted)] transition-colors">
              <td class="p-4 font-medium text-[var(--text)]">Solidity</td>
              <td class="p-4 text-[var(--text-muted)]">Weeks 4&ndash;7</td>
              <td class="p-4 text-[var(--text)]">Write your first smart contracts</td>
            </tr>
            <tr class="hover:bg-[var(--bg-muted)] transition-colors">
              <td class="p-4 font-medium text-[var(--text)]">Developer tooling</td>
              <td class="p-4 text-[var(--text-muted)]">Weeks 8&ndash;10</td>
              <td class="p-4 text-[var(--text)]">Professional dev workflow</td>
            </tr>
            <tr class="hover:bg-[var(--bg-muted)] transition-colors">
              <td class="p-4 font-medium text-[var(--text)]">Real projects</td>
              <td class="p-4 text-[var(--text-muted)]">Weeks 11&ndash;18</td>
              <td class="p-4 text-[var(--text)]">4 portfolio-ready dApps</td>
            </tr>
            <tr class="hover:bg-[var(--bg-muted)] transition-colors">
              <td class="p-4 font-medium text-[var(--text)]">Security</td>
              <td class="p-4 text-[var(--text-muted)]">Weeks 19&ndash;22</td>
              <td class="p-4 text-[var(--text)]">Auditing fundamentals</td>
            </tr>
            <tr class="hover:bg-[var(--bg-muted)] transition-colors">
              <td class="p-4 font-medium text-[var(--text)]">Portfolio</td>
              <td class="p-4 text-[var(--text-muted)]">Weeks 23&ndash;26</td>
              <td class="p-4 text-[var(--text)] font-semibold text-[var(--mst-red)]">Job-ready</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Following this roadmap consistently puts most learners at job-ready level in roughly six months &mdash; significantly faster than the 12&ndash;18 months typical of unstructured, self-directed learning.
      </p>

      <h2>Structured Programs vs. Self-Learning</h2>
      <p>
        Self-learning works, but it's slow because there's no clear sequence, no accountability, and no live feedback on whether your code is actually secure or just &ldquo;working.&rdquo; Structured programs that combine this exact roadmap with live code execution, graded assessments, and real blockchain deployment compress the timeline considerably. Masterstroke Academy's blockchain developer curriculum follows this same structure &mdash; 4 phases, 21 modules, and live deployment on MST Chain &mdash; with the added benefit of an on-chain certificate and a path to internship and grant funding for top performers.
      </p>

      <div class="my-12 p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]">
        <h2 class="text-2xl font-bold text-[var(--text)] mb-6 flex items-center gap-2">
          Frequently Asked Questions
        </h2>
        <div class="space-y-6">
          <div class="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 class="text-lg font-bold text-[var(--text)] mb-2">
              Q: How long does it take to learn blockchain in 2026?
            </h3>
            <p class="text-[var(--text-muted)] text-sm md:text-base leading-relaxed">
              <strong>A:</strong> With a structured program and consistent daily study, most learners become job-ready in 4 to 6 months. Self-directed learning without a structured curriculum typically takes 12 to 18 months.
            </p>
          </div>
          <div class="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 class="text-lg font-bold text-[var(--text)] mb-2">
              Q: What is the best way to learn blockchain development in 2026?
            </h3>
            <p class="text-[var(--text-muted)] text-sm md:text-base leading-relaxed">
              <strong>A:</strong> The fastest path combines structured theory with live, on-chain coding practice rather than passive video-only learning. Programs that include real testnet deployment, project-based assessments, and mentorship compress the learning timeline significantly.
            </p>
          </div>
          <div class="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 class="text-lg font-bold text-[var(--text)] mb-2">
              Q: Do I need a coding background to start learning blockchain?
            </h3>
            <p class="text-[var(--text-muted)] text-sm md:text-base leading-relaxed">
              <strong>A:</strong> No prior blockchain experience is required, though basic familiarity with any programming language helps. Structured courses typically start from internet and cryptography fundamentals before introducing Solidity.
            </p>
          </div>
        </div>
      </div>

      <div class="my-10 p-8 rounded-2xl border border-[rgba(227,30,36,0.3)] bg-gradient-to-r from-[rgba(227,30,36,0.06)] to-[rgba(139,92,246,0.06)] text-center">
        <h3 class="text-2xl font-black text-[var(--text)] mb-3">
          Ready to Start Your Blockchain Journey?
        </h3>
        <p class="text-base text-[var(--text-muted)] max-w-2xl mx-auto mb-6">
          Ready to follow this exact roadmap with live code execution and a real blockchain? Explore the <a href="/academy-overview" class="font-bold text-[var(--mst-red)] underline hover:opacity-80">full Masterstroke Academy curriculum</a> or <a href="/register" class="font-bold text-[var(--mst-red)] underline hover:opacity-80">start free today</a>.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <a href="/academy-overview" class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[var(--mst-red)] text-white font-bold text-sm shadow-md hover:bg-[var(--mst-red-dark)] transition">
            Explore Curriculum
          </a>
          <a href="/register" class="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-semibold text-sm hover:bg-[var(--bg-muted)] transition">
            Start Free Today &rarr;
          </a>
        </div>
      </div>
    `,
  },
  {
    slug: "smart-contract-security-audit-guide",
    title: "Smart Contract Security Auditing Guide: Common Vulnerabilities & Tools",
    heading: "Smart Contract Security Auditing Guide: Common Vulnerabilities & Tools",
    metaTitle: "Smart Contract Security Auditing Guide",
    metaDescription:
      "Learn how to audit Solidity smart contracts, identify reentrancy and access control flaws, and use automated tools like Slither.",
    excerpt:
      "A deep dive into common smart contract vulnerabilities, formal verification, and producing professional security audit reports.",
    content: `
      <h2>The Importance of Smart Contract Security</h2>
      <p>Because blockchain transactions are immutable, a single vulnerability in a smart contract can result in millions of dollars in lost liquidity. Auditing is therefore the most critical phase before mainnet launch.</p>
      
      <h2>Top Vulnerabilities to Guard Against</h2>
      <p>1. <strong>Reentrancy:</strong> Always follow the Checks-Effects-Interactions pattern or implement OpenZeppelin's ReentrancyGuard.</p>
      <p>2. <strong>Integer Overflows & Rounding Errors:</strong> Ensure math precision is maintained, especially in DeFi yield calculation.</p>
      <p>3. <strong>Access Control:</strong> Implement granular role-based permissions using AccessControl rather than simple Ownable patterns.</p>
    `,
    coverImage: "https://masterstroke.academy/icon.png",
    author: "Security Team",
    category: "Security",
    tags: ["Security", "Auditing", "Solidity", "DeFi"],
    createdAt: "2026-02-01T00:00:00.000Z",
    readTime: "10 min read",
  },
  {
    slug: "defi-and-real-world-assets-tokenization",
    title: "DeFi and Real World Assets (RWA) Tokenization Explained",
    heading: "DeFi and Real World Assets (RWA) Tokenization Explained",
    metaTitle: "DeFi and RWA Tokenization Explained",
    metaDescription:
      "Understand how real world asset tokenization is transforming decentralized finance and institutional Web3 adoption.",
    excerpt:
      "Explore token standards, oracle integration, regulatory frameworks, and smart contract architecture for tokenizing real estate and credit.",
    content: `
      <h2>What is Real World Asset (RWA) Tokenization?</h2>
      <p>Real World Asset tokenization bridges traditional financial instruments—such as real estate, private credit, treasury bonds, and commodities—onto the blockchain as liquid, programmable tokens.</p>
      
      <h2>Core Architectural Components</h2>
      <p>Building an RWA protocol requires compliant permissioned tokens (ERC-3643 / ERC-1400), verified on-chain identity (KYC/AML), and real-time oracle price feeds (Chainlink/Pyth).</p>
    `,
    coverImage: "https://masterstroke.academy/icon.png",
    author: "Research Team",
    category: "DeFi",
    tags: ["DeFi", "RWA", "Tokenomics", "Web3"],
    createdAt: "2026-02-15T00:00:00.000Z",
    readTime: "7 min read",
  },
];

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!slug) return null;

  try {
    const url = `${CMS_URL}/api/v1/connector/posts/${encodeURIComponent(slug)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-site-token": SITE_TOKEN,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data) {
        const post: BlogPost = data.data || data.post || data;
        if (post && (post.title || post.heading || post.slug)) {
          return post;
        }
      }
    }
  } catch (error: any) {
    console.warn("CMS API fetch failed, checking fallback posts:", error?.message || error);
  }

  // Fallback to local featured post if available
  const fallback = FEATURED_BLOGS.find((p) => p.slug === slug);
  return fallback || null;
}

export async function getAllPosts(limit?: number): Promise<BlogPost[]> {
  try {
    const url = new URL(`${CMS_URL}/api/v1/connector/posts`);
    if (limit) url.searchParams.set("limit", limit.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-site-token": SITE_TOKEN,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data) {
        const posts = Array.isArray(data) ? data : data.data || data.posts || [];
        if (Array.isArray(posts) && posts.length > 0) {
          return posts;
        }
      }
    }
  } catch (error: any) {
    console.warn("CMS API list fetch failed, using fallback list:", error?.message || error);
  }

  return limit ? FEATURED_BLOGS.slice(0, limit) : FEATURED_BLOGS;
}

export function generateBlogSchemas(post: BlogPost, slug: string) {
  const headline = post.heading || post.title || post.metaTitle || "Blog Post";
  const description =
    post.metaDescription || post.subHeading || post.excerpt || post.description || "";
  const datePublished = post.publishedAt || post.createdAt || "2026-08-01";
  const dateModified = post.modifiedAt || post.updatedAt || datePublished;
  const image =
    post.ogImage ||
    post.coverImage ||
    post.image ||
    post.featuredImage ||
    `https://masterstroke.academy/api/og?title=${encodeURIComponent(headline)}`;
  const absoluteImage = image.startsWith("http") ? image : `https://masterstroke.academy${image}`;

  const authorName =
    typeof post.author === "string"
      ? post.author
      : post.author?.name || "Masterstroke Academy";
  const authorUrl =
    typeof post.author === "object" && post.author?.url
      ? post.author.url
      : "https://masterstroke.academy";

  const articleKeywords = post.keywords || [
    ...(post.primaryKeyword ? [post.primaryKeyword] : []),
    ...(post.supportKeywords || []),
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: headline,
    description: description,
    image: absoluteImage,
    author: {
      "@type": "Organization",
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Masterstroke Academy",
      logo: {
        "@type": "ImageObject",
        url: "https://masterstroke.academy/Acadmy Logo.png",
      },
    },
    datePublished: datePublished,
    dateModified: dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.canonical || `https://masterstroke.academy/blogs/${slug}`,
    },
    articleSection: post.articleSection || post.category || "Blockchain Development",
    keywords: articleKeywords,
    inLanguage: post.inLanguage || "en-IN",
  };

  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://masterstroke.academy/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blogs",
        item: "https://masterstroke.academy/blogs",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: headline,
        item: post.canonical || `https://masterstroke.academy/blogs/${slug}`,
      },
    ],
  };

  return { articleSchema, faqSchema, breadcrumbSchema };
}

// Backward compatibility helper
export function generateArticleSchema(post: BlogPost, slug: string) {
  return generateBlogSchemas(post, slug).articleSchema;
}
