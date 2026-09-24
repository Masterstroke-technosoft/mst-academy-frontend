import type { Metadata } from "next";
import { getCurriculum } from "@/lib/curriculum";
import { AcademyOverview } from "@/components/marketing/AcademyOverview";
import { CURRICULUM_FAQS, generateFaqSchema } from "@/lib/faqs";
import curriculumSchema from "@/lib/schema/curriculum-schema.json";

export const metadata: Metadata = {
  title: { absolute: "Blockchain Course Syllabus — 21 Modules, 130+ Hours" },
  description:
    "Full blockchain developer course syllabus: Solidity, DeFi, security audits, ZK proofs and RWA across 21 modules and 130+ hours. Free to browse.",
  alternates: { canonical: "/academy-overview" },
  openGraph: {
    title: "Blockchain Course Syllabus — 21 Modules, 130+ Hours",
    description:
      "Every phase, module and submodule — from fundamentals to capstone deployment and Demo Day.",
    url: "https://masterstroke.academy/academy-overview",
    images: [{ url: "https://masterstroke.academy/icon.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blockchain Course Syllabus — 21 Modules, 130+ Hours",
    description:
      "Every phase, module and submodule — from fundamentals to capstone deployment and Demo Day.",
    images: ["https://masterstroke.academy/icon.png"],
  },
};

export default async function AcademyOverviewPage() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  let result: any = null;

  try {
    const response = await fetch(`${baseURL}/api/academy-overview`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      throw new Error(`Response Status : ${response.status}`);
    }
    result = await response.json();
  } catch (error: any) {
    console.error("Failed to fetch academy overview:", error?.message ?? error);
  }

  const baseCurriculum = getCurriculum();
  const curriculum = (result && result.success !== false && (Array.isArray(result) || typeof result === "object"))
    ? (Array.isArray(result) ? result[0] : result)
    : null;

  const mergedCurriculum = curriculum
    ? {
        ...baseCurriculum,
        ...curriculum,
        phases: (curriculum.phases && curriculum.phases.length > 0) ? curriculum.phases : baseCurriculum.phases,
        modules: (curriculum.modules && curriculum.modules.length > 0) ? curriculum.modules : baseCurriculum.modules,
      }
    : baseCurriculum;

  const faqSchema = generateFaqSchema(CURRICULUM_FAQS);

  return (
    <>
      {/* Schema.org Course & BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(curriculumSchema) }}
      />
      {/* Schema.org FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AcademyOverview curriculum={mergedCurriculum} />
    </>
  );
}
