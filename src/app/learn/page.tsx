import type { Metadata } from "next";
import { getCurriculum } from "@/lib/curriculum";
import { LearningRoadmap } from "@/components/learn/LearningRoadmap";

export const metadata: Metadata = {
  title: "Learning Tree — Interactive Blockchain Curriculum",
  description:
    "Navigate 21 modules across 4 phases in an interactive learning tree. Master blockchain development from fundamentals to funded founder.",
};

export default function LearnPage() {
  const curriculum = getCurriculum();
  return <LearningRoadmap curriculum={curriculum} />;
}
