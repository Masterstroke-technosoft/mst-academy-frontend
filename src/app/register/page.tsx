import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import registerSchema from "@/lib/schema/register-schema.json";

export const metadata: Metadata = {
  title: { absolute: "Free Blockchain Course India — Sign Up | Masterstroke Academy" },
  description:
    "Register for free to start your online blockchain course in India. Learn Solidity, smart contract development, and explore the Web3 learning tree.",
  alternates: { canonical: "/register" },
  openGraph: {
    title: "Free Blockchain Course India — Sign Up | Masterstroke Academy",
    description:
      "Register for free to start your online blockchain course in India. Learn Solidity, smart contract development, and explore the Web3 learning tree.",
    url: "https://masterstroke.academy/register",
    images: [{ url: "https://masterstroke.academy/icon.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Blockchain Course India — Sign Up | Masterstroke Academy",
    description:
      "Register for free to start your online blockchain course in India. Learn Solidity, smart contract development, and explore the Web3 learning tree.",
    images: ["https://masterstroke.academy/icon.png"],
  },
};

export default function RegisterPage() {
  return (
    <>
      {/* Schema.org WebPage & BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(registerSchema) }}
      />
      <Suspense fallback={<div className="px-4 py-10 text-center">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </>
  );
}
