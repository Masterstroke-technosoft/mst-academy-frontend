const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "https://cms-api.masterstroke.academy";
const SITE_TOKEN = process.env.NEXT_PUBLIC_CMS_SITE_TOKEN || "site_token_demo_mst_academy_1785489667016";

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
  author?: string | { name?: string; avatar?: string; bio?: string };
  category?: string;
  tags?: string[];
  createdAt?: string;
  publishedAt?: string;
  updatedAt?: string;
  modifiedAt?: string;
  readTime?: string | number;
}

export const FEATURED_BLOGS: BlogPost[] = [
  {
    slug: "how-to-learn-blockchain-2026-roadmap",
    title: "How to Learn Blockchain in 2026: Complete Roadmap",
    heading: "How to Learn Blockchain in 2026: A Complete Roadmap",
    metaTitle: "How to Learn Blockchain in 2026: Complete Roadmap",
    metaDescription:
      "The definitive guide to becoming a Web3 and smart contract developer in 2026, from cryptography to full-stack dApps.",
    excerpt:
      "Master Solidity, EVM internals, DeFi protocols, smart contract auditing, and real-world deployment with this structured 2026 roadmap.",
    content: `
      <h2>Introduction: The Web3 Landscape in 2026</h2>
      <p>Blockchain development in 2026 has transitioned from speculative experimentation into robust, production-grade software engineering. From modular Layer-2 rollups and Zero-Knowledge (ZK) applications to Real World Asset (RWA) tokenization, the demand for certified, security-conscious blockchain engineers is higher than ever.</p>
      
      <h2>Phase 1: Computer Science & Cryptography Foundations</h2>
      <p>Before writing a single line of smart contract code, you need a firm grasp of how decentralized systems work under the hood. Study peer-to-peer networks, SHA-256 and Keccak-256 hashing, asymmetric public-key cryptography (ECDSA, secp256k1), and consensus mechanisms like Proof of Stake.</p>

      <h2>Phase 2: Mastering Solidity & EVM Internals</h2>
      <p>Solidity remains the premier language of decentralized applications. Focus on data types, gas optimization, memory vs. storage layouts, assembly (Yul), reentrancy guards, and OpenZeppelin contract standards including ERC-20, ERC-721, and ERC-1155.</p>

      <h2>Phase 3: Modern Developer Tooling (Foundry & Hardhat)</h2>
      <p>Professional blockchain teams rely heavily on modern testing environments. Learn how to write comprehensive unit and fuzz tests using Foundry, fork mainnet states, simulate gas consumption, and automate script deployments with ethers.js and viem.</p>

      <h2>Phase 4: Smart Contract Security & Auditing</h2>
      <p>Security is the bedrock of Web3. Master common vulnerability patterns including oracle manipulation, flash loan exploits, signature replay, and uninitialized proxy storage collisions. Utilize automated static analyzers like Slither and Mythril.</p>

      <h2>Phase 5: Building Full-Stack dApps & Capstone Project</h2>
      <p>Connect your on-chain contracts to modern web frontends using Next.js, Wagmi, RainbowKit, and TailwindCSS. Deploy your capstone application to MST Chain, verify your smart contracts on the block explorer, and prepare your startup pitch for Demo Day.</p>
    `,
    coverImage: "https://masterstroke.academy/icon.png",
    author: "Masterstroke Academy",
    category: "Roadmap",
    tags: ["Blockchain", "Solidity", "Web3", "Developer"],
    createdAt: "2026-01-15T00:00:00.000Z",
    readTime: "8 min read",
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

export function generateArticleSchema(post: BlogPost, slug: string) {
  const title = post.metaTitle || post.title || post.heading || "Blog Post";
  const description =
    post.metaDescription || post.subHeading || post.excerpt || post.description || "";
  const datePublished =
    post.publishedAt || post.createdAt || new Date().toISOString();
  const dateModified = post.updatedAt || post.modifiedAt || datePublished;
  const image =
    post.coverImage ||
    post.image ||
    post.featuredImage ||
    "https://masterstroke.academy/icon.png";

  const authorName =
    typeof post.author === "string"
      ? post.author
      : post.author?.name || "Masterstroke Academy";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Masterstroke Academy",
      url: "https://masterstroke.academy",
      logo: {
        "@type": "ImageObject",
        url: "https://masterstroke.academy/icon.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://masterstroke.academy/blogs/${slug}`,
    },
  };
}
