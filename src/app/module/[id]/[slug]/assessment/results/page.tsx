import { AssessmentResults } from "@/components/assessment/AssessmentResults";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;
  return (
    <AssessmentResults moduleId={parseInt(id, 10)} subSlug={slug} />
  );
}
