import { notFound } from "next/navigation";
import { FullscreenAssessment } from "@/components/assessment/FullscreenAssessment";
import { getSubmodule } from "@/lib/curriculum";
import { getAssessment } from "@/lib/curriculum.server";
import { getCardSubmoduleTitle } from "@/lib/display-titles";

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;
  const moduleId = parseInt(id, 10);
  const submodule = getSubmodule(moduleId, slug);
  if (!submodule) notFound();

  const assessment = getAssessment(moduleId, slug);
  if (!assessment) notFound();

  return (
    <FullscreenAssessment
      moduleId={moduleId}
      subSlug={slug}
      submoduleId={submodule.id}
      submoduleTitle={getCardSubmoduleTitle(submodule.title)}
      assessment={assessment}
    />
  );
}
