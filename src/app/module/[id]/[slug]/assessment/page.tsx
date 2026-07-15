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
    setLoading(true);
    setAssessment(null);
    setError(null);
    const fetchAssessment = async () => {
      try {
        // const savedAssignmentId = typeof window !== "undefined" ? localStorage.getItem("assignment-id") : null;
        // let response;
        // if (savedAssignmentId) {
        //   response = await fetch(`${baseUrl}/api/assignments/student/${savedAssignmentId}`, {
        //     method: "GET",
        //     credentials: "include",
        //   });
        // }
        // const savedSubmoduleId = typeof window !== "undefined" ? localStorage.getItem("submodule-id") : null;
        // const savedAssignmentId = typeof window !== "undefined" ? localStorage.getItem("assignment-id") : null;
        const savedIdsStr = typeof window !== "undefined" ? localStorage.getItem("assignment-submodule-ids") : null;
        let savedAssignmentId = null;
        let savedSubmoduleId = null;
        if (savedIdsStr) {
          try {
            const parsed = JSON.parse(savedIdsStr);
            if (Array.isArray(parsed)) {
              if (parsed.length === 2 && !Array.isArray(parsed[0])) {
                if (parsed[1] === slug) {
                  savedAssignmentId = parsed[0];
                  savedSubmoduleId = parsed[1];
                }
              } else {
                const match = parsed.find((item: any) => Array.isArray(item) && item[1] === slug);
                if (match) {
                  savedAssignmentId = match[0];
                  savedSubmoduleId = match[1];
                }
              }
            }
          } catch (e) {
            console.error("Error parsing assignment-submodule-ids", e);
          }
        }
        let response;
        if (savedSubmoduleId && savedSubmoduleId === slug) {
          response = await fetch(`${baseUrl}/api/assignments/submodule/assignment/${savedSubmoduleId}/${savedAssignmentId}`, {
            method: "GET",
            credentials: "include",
          });
        } else {
          response = await fetch(`${baseUrl}/api/assignments/submodule/${slug}`, {
            method: "GET",
            credentials: "include",
          });
        }

        if (!response.ok) throw new Error("Failed to fetch assessment");
        const data = await response.json();
        setAssessment(data);
        if (data && data._id && typeof window !== "undefined") {
          localStorage.setItem("all-assignment-ids", JSON.stringify([data._id]));
          
          let existingList: any[] = [];
          const existingStr = localStorage.getItem("assignment-submodule-ids");
          if (existingStr) {
            try {
              const parsed = JSON.parse(existingStr);
              if (Array.isArray(parsed)) {
                if (parsed.length === 2 && !Array.isArray(parsed[0])) {
                  existingList = [parsed];
                } else {
                  existingList = parsed.filter((item: any) => Array.isArray(item));
                }
              }
            } catch (e) {
              console.error(e);
            }
          }
          const activeSubmoduleId = data.submoduleId || slug;
          existingList = existingList.filter((item) => item[1] !== activeSubmoduleId);
          existingList.push([data._id, activeSubmoduleId]);
          localStorage.setItem("assignment-submodule-ids", JSON.stringify(existingList));
        }
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

  return <AssessmentViewer key={slug} assessment={assessment} moduleId={parseInt(moduleId)} slug={slug} />;
}