import { AssessmentReview } from "@/components/assessment/AssessmentReview";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;
  return (
    <AssessmentReview moduleId={parseInt(id, 10)} subSlug={slug} />
  );
}
