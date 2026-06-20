"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AssessmentViewer from "@/components/assessment/AssessmentViewer";

interface Assessment {
  _id?: any;
  submoduleId: string;
  setNumber?: number;
  title: string;
  estimatedTime: number;
  totalMarks: number;
  questions: any[];
}

export default function AssessmentPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const params = useParams();

  const moduleId = params.id as string;
  const slug = params.slug as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/assignments/submodule/${slug}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch assessment");
        const data = await response.json();
        setAssessment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [moduleId, slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-mst-red border-t-transparent mx-auto mb-4" />
          <p className="text-[var(--text-muted)]">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <p className="text-red-500 font-semibold">{error || "Assessment not found"}</p>
        </div>
      </div>
    );
  }

  return <AssessmentViewer assessment={assessment} moduleId={parseInt(moduleId)} slug={slug} />;
}