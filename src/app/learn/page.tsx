import type { Metadata } from "next";
import { getCurriculum } from "@/lib/curriculum";
import { LearningRoadmap } from "@/components/learn/LearningRoadmap";
import learnSchema from "@/lib/schema/learn-schema.json";

export const metadata: Metadata = {
  title: "Learning Tree - Interactive Blockchain Curriculum | Masterstroke Academy",
  description:
    "Navigate 21 modules across 4 phases in an interactive learning tree. Master blockchain development from fundamentals to funded founder.",
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "Learning Tree - Interactive Blockchain Curriculum | Masterstroke Academy",
    description:
      "Navigate 21 modules across 4 phases in an interactive learning tree. Master blockchain development from fundamentals to funded founder.",
    url: "https://masterstroke.academy/learn",
    images: [{ url: "https://masterstroke.academy/icon.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Tree - Interactive Blockchain Curriculum | Masterstroke Academy",
    description:
      "Navigate 21 modules across 4 phases in an interactive learning tree. Master blockchain development from fundamentals to funded founder.",
    images: ["https://masterstroke.academy/icon.png"],
  },
};

export default function LearnPage() {
  const curriculum = getCurriculum();

  return (
    <>
      {/* Schema.org LearningResource & BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learnSchema) }}
      />

      {/* Search engine crawlable semantic structure */}
      <div className="sr-only">
        <h1>Masterstroke Academy — Blockchain Learning Tree</h1>
        <p>
          Structured, interactive Web3 curriculum covering 4 phases, 21 modules, and 123 submodules.
        </p>
        {curriculum.phases.map((phase, idx) => (
          <section key={phase.id || idx}>
            <h2>
              Phase {idx + 1}: {phase.title}
            </h2>
            <ul>
              {curriculum.modules
                .filter((m) => String(m.phaseId) === String(phase.id) || m.phaseId === `phase-${idx + 1}`)
                .map((mod) => (
                  <li key={mod.id}>
                    <h3>
                      Module {mod.id}: {mod.title}
                    </h3>
                    <p>{mod.description}</p>
                    <ul>
                      {mod.submodules.map((sub) => (
                        <li key={sub.id || sub.slug}>
                          {sub.id} - {sub.title}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>

      <LearningRoadmap curriculum={curriculum} />
    </>
  );
}
