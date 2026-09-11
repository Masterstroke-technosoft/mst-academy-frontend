import type { Metadata } from "next";
import { getAllModules, getPhases } from "@/lib/curriculum";
import { LandingPage } from "@/components/marketing/LandingPage";
import { HOMEPAGE_FAQS, generateFaqSchema } from "@/lib/faqs";

export const metadata: Metadata = {
  title: { absolute: "Online Blockchain Course in India | Masterstroke Academy" },
  description:
    "Live blockchain course in India: 21 modules, on-chain certificate, internship and grant path. Deploy real contracts on MST Chain. See plans.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Online Blockchain Course in India | Masterstroke Academy",
    description:
      "Live blockchain course in India: 21 modules, on-chain certificate, internship and grant path. Deploy real contracts on MST Chain. See plans.",
    url: "https://masterstroke.academy",
    images: [{ url: "https://masterstroke.academy/icon.png" }],
  },
};

export default function HomePage() {
  const phases = getPhases();
  const modules = getAllModules();
  const submoduleCount = modules.reduce(
    (n, m) => n + m.submodules.length,
    0
  );
  const faqSchema = generateFaqSchema(HOMEPAGE_FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <LandingPage
        phases={phases}
        moduleCount={modules.length}
        submoduleCount={submoduleCount}
      />
    </>
  );
}
