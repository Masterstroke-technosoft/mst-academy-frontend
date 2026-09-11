import type { Metadata } from "next";
import { BlogListClient } from "@/components/marketing/BlogListClient";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: { absolute: "Blockchain Developer Blog India — Tutorials & Web3 Guides | Masterstroke Academy" },
  description:
    "The premier blockchain developer blog in India. Explore in-depth Solidity tutorials, smart contract security guides, Web3 development practices, and industry updates.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Blockchain Developer Blog India — Tutorials & Web3 Guides | Masterstroke Academy",
    description:
      "The premier blockchain developer blog in India. Explore in-depth Solidity tutorials, smart contract security guides, Web3 development practices, and industry updates.",
    url: "https://masterstroke.academy/blogs",
    images: [{ url: "https://masterstroke.academy/icon.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blockchain Developer Blog India — Tutorials & Web3 Guides | Masterstroke Academy",
    description:
      "The premier blockchain developer blog in India. Explore in-depth Solidity tutorials, smart contract security guides, Web3 development practices, and industry updates.",
    images: ["https://masterstroke.academy/icon.png"],
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return <BlogListClient initialPosts={posts} />;
}
