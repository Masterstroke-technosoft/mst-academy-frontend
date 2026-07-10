"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  BookOpen,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  X,
  Eye,
  Loader2,
  GitBranch,
  Inbox,
  Check
} from "lucide-react";

interface Answer {
  questionNumber: number;
  questionType: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

interface SubmissionItem {
  submissionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  assignmentId: string;
  submoduleId: string;
  submoduleTitle: string;
  questionNumber: number;
  selectedAnswer: string;
  isCorrect: boolean;
  rawSubmission: any;
  submittedAt: string;
}

export default function SubmissionReviewPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [submodulesMap, setSubmodulesMap] = useState<Record<string, { title: string; index: string }>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "all">("pending");
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [promptSubmission, setPromptSubmission] = useState<SubmissionItem | null>(null);
  const [promptScore, setPromptScore] = useState<string>("10");
  const [evaluationScore, setEvaluationScore] = useState<number>(10);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getSubmissionTime = (id: string, createdAt?: string) => {
    if (createdAt) return new Date(createdAt).toLocaleString();
    try {
      if (id && id.length === 24) {
        const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
        return new Date(timestamp).toLocaleString();
      }
    } catch (e) { }
    return "N/A";
  };

  useEffect(() => {
    if (selectedSubmission) {
      setEvaluationScore(selectedSubmission.rawSubmission?.score ?? selectedSubmission.rawSubmission?.partialScore ?? 10);
    }
  }, [selectedSubmission]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
        const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // 1. Fetch Curriculum Submodules to map titles
        const courseId = "6a2934912b48a13769669f8e";
        const curriculumRes = await fetch(`${baseURL}/api/phases/course/${courseId}`, {
          method: "GET",
          credentials: "include",
          headers
        });

        let tempMap: Record<string, { title: string; index: string }> = {};
        if (curriculumRes.ok) {
          const resData = await curriculumRes.json();
          const rawPhases = resData.data || resData || [];

          await Promise.all(
            rawPhases.map(async (phase: any) => {
              try {
                const fullRes = await fetch(`${baseURL}/api/phases/full/${phase._id || phase.id}`, {
                  method: "GET",
                  credentials: "include",
                  headers
                });
                if (fullRes.ok) {
                  const fullData = await fullRes.json();
                  const fullPhaseObj = fullData.data || fullData;
                  const rawModules = fullPhaseObj.modules || [];
                  rawModules.forEach((mod: any) => {
                    const rawSubmodules = mod.submodules || [];
                    rawSubmodules.forEach((sub: any) => {
                      const id = sub.id || sub._id;
                      tempMap[id] = {
                        title: sub.title,
                        index: `${mod.index || ''}.${sub.index || ''}`
                      };
                    });
                  });
                }
              } catch (err) {
                console.error("Error fetching full phase hierarchy:", err);
              }
            })
          );
          setSubmodulesMap(tempMap);
        }

        // 2. Fetch Users
        const usersResponse = await fetch(`${baseURL}/api/admin/users?page=1&limit=100`, {
          method: "GET",
          credentials: "include",
          headers
        });

        if (!usersResponse.ok) {
          throw new Error(`Failed to fetch users: ${usersResponse.statusText}`);
        }

        const usersResult = await usersResponse.json();
        const rawUsers = Array.isArray(usersResult)
          ? usersResult
          : (usersResult?.data?.users || usersResult?.users || usersResult?.data || []);

        setUsers(rawUsers);

        // 3. Fetch all practical submissions directly
        const allSubmissionItems: SubmissionItem[] = [];
        try {
          const subRes = await fetch(`${baseURL}/api/assignment-submissions/practical`, {
            method: "GET",
            credentials: "include",
            headers
          });

          if (subRes.ok) {
            const data = await subRes.json();
            const rawSubmissions = Array.isArray(data) ? data : (data?.data || []);
            rawSubmissions.forEach((submission: any) => {
              const answers = submission.answers || [];
              answers.forEach((ans: any) => {
                if (ans.questionType === "PRACTICAL") {
                  const subId = submission.submodule || submission.submoduleId || "";
                  const userObj = submission.user;
                  const uId = userObj ? (userObj._id || userObj.id || "") : "";
                  const uName = userObj ? (userObj.fullName || userObj.name || "Unknown User") : "Unknown User";
                  const uEmail = userObj ? (userObj.email || "No Email") : "No Email";
                  const uRole = userObj ? (userObj.role || "student") : "student";

                  allSubmissionItems.push({
                    submissionId: submission._id || submission.id,
                    userId: uId,
                    userName: uName,
                    userEmail: uEmail,
                    userRole: uRole,
                    assignmentId: submission.assignment || submission.assignmentId || "",
                    submoduleId: subId,
                    submoduleTitle: tempMap[subId]?.title || `Submodule (${subId.substring(0, 8)}...)`,
                    questionNumber: ans.questionNumber || 1,
                    selectedAnswer: ans.selectedAnswer || ans.submission || "",
                    isCorrect: submission.evaluated || false,
                    rawSubmission: submission,
                    submittedAt: getSubmissionTime(submission._id || submission.id, submission.createdAt || submission.updatedAt)
                  });
                }
              });
            });
          }
        } catch (err) {
          console.error("Error fetching practical submissions:", err);
        }

        setSubmissions(allSubmissionItems);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load submissions review data.");
        console.error("Submission review load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleGrade = async (item: SubmissionItem, isCorrect: boolean, customScore?: number) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      let scoreVal = isCorrect ? 10 : 0;
      if (isCorrect) {
        if (customScore !== undefined) {
          scoreVal = customScore;
        }
      }

      const res = await fetch(`${baseURL}/api/assignment-submissions/evaluate/${item.submissionId}`, {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify({
          score: scoreVal
        })
      });

      if (!res.ok) {
        throw new Error(`Failed to evaluate submission: ${res.statusText}`);
      }

      const resData = await res.json();
      const updatedSubmission = resData.submission || resData;

      showToast(resData.message || `Submission successfully marked as ${isCorrect ? "Correct" : "Incorrect"} with score ${scoreVal}`, "success");

      setSubmissions(prev =>
        prev.map(sub => {
          if (sub.submissionId === item.submissionId && sub.questionNumber === item.questionNumber) {
            return {
              ...sub,
              isCorrect: isCorrect,
              rawSubmission: updatedSubmission
            };
          }
          return sub;
        })
      );

      if (selectedSubmission?.submissionId === item.submissionId && selectedSubmission?.questionNumber === item.questionNumber) {
        setSelectedSubmission(prev => prev ? { ...prev, isCorrect: isCorrect, rawSubmission: updatedSubmission } : null);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update submission status", "error");
      console.error("Error evaluating submission:", err);
    }
  };

  // Filter and search logic
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(item => {
      // Filter by Tab
      if (activeTab === "pending" && item.isCorrect) return false;
      if (activeTab === "approved" && !item.isCorrect) return false;

      // Filter by Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesUser = item.userName.toLowerCase().includes(query) || item.userEmail.toLowerCase().includes(query);
        const matchesSubmodule = item.submoduleTitle.toLowerCase().includes(query);
        const matchesAnswer = item.selectedAnswer.toLowerCase().includes(query);
        return matchesUser || matchesSubmodule || matchesAnswer;
      }

      // Display score value too
      return true;
    });
  }, [submissions, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);

  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubmissions.slice(start, start + itemsPerPage);
  }, [filteredSubmissions, currentPage, itemsPerPage]);

  const stats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter(s => !s.isCorrect).length;
    const approved = total - pending;
    return { total, pending, approved };
  }, [submissions]);

  const isLink = (val: string) => {
    return val.startsWith("http://") || val.startsWith("https://") || val.startsWith("github.com");
  };

  const formatLink = (val: string) => {
    if (val.startsWith("github.com")) {
      return `https://${val}`;
    }
    return val;
  };

  const TableSkeleton = () => (
    <tbody className="divide-y divide-[var(--border)]">
      {[...Array(5)].map((_, idx) => (
        <tr key={idx} className="animate-pulse">
          <td className="px-3 py-4">
            <div className="space-y-2">
              <div className="h-4 bg-[var(--border)] rounded w-32"></div>
              <div className="h-3 bg-[var(--border)] rounded w-24"></div>
              <div className="h-3 bg-[var(--border)] rounded w-12"></div>
            </div>
          </td>
          <td className="px-3 py-4">
            <div className="h-4 bg-[var(--border)] rounded w-40"></div>
          </td>
          <td className="px-3 py-4">
            <div className="h-4 bg-[var(--border)] rounded w-28"></div>
          </td>
          <td className="px-3 py-4">
            <div className="h-4 bg-[var(--border)] rounded w-20"></div>
          </td>
          <td className="px-3 py-4 text-center">
            <div className="h-6 bg-[var(--border)] rounded-full w-20 mx-auto"></div>
          </td>
          <td className="px-3 py-4 text-right">
            <div className="flex justify-end gap-2">
              <div className="h-8 w-8 bg-[var(--border)] rounded-lg"></div>
              <div className="h-8 w-16 bg-[var(--border)] rounded-lg"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <DashboardShell role="admin" title="Submission Review">
      <div className="space-y-6">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-mst-red/10 p-3">
              <BookOpen size={24} className="text-mst-red" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Total Submissions</p>
              <h3 className="text-2xl font-black text-[var(--text)]">{stats.total}</h3>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-amber-500/10 p-3">
              <Inbox size={24} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Pending Review</p>
              <h3 className="text-2xl font-black text-[var(--text)]">{stats.pending}</h3>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-green-500/10 p-3">
              <CheckCircle2 size={24} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Approved</p>
              <h3 className="text-2xl font-black text-[var(--text)]">{stats.approved}</h3>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[var(--border)] sm:border-0 pb-3 sm:pb-0">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === "pending"
                  ? "bg-mst-red/15 text-mst-red"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
            >
              Pending Reviews ({stats.pending})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === "approved"
                  ? "bg-mst-red/15 text-mst-red"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === "all"
                  ? "bg-mst-red/15 text-mst-red"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
            >
              All Submissions ({stats.total})
            </button>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search user, submodule, or answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] outline-none focus:border-mst-red transition-all"
            />
          </div>
        </div>

        {/* Submissions List Container */}
        {errorMsg && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-500 shadow-sm">
            <h3 className="font-bold text-lg mb-2">Error Loading Review Queue</h3>
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm text-[var(--text-muted)] border-collapse">
                <thead className="bg-[var(--bg-muted)] text-xs font-bold uppercase tracking-wider text-[var(--text)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-3 py-3 w-[22%]">User</th>
                    <th className="px-3 py-3 w-[22%]">Submodule</th>
                    <th className="px-3 py-3 w-[24%]">Submitted Link/Answer</th>
                    <th className="px-3 py-3 w-[15%]">Submitted At</th>
                    <th className="px-3 py-3 w-[10%] text-center">Status / Score</th>
                    <th className="px-3 py-3 w-[7%] text-right">Actions</th>
                  </tr>
                </thead>
                <TableSkeleton />
              </table>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-20">
              <Inbox size={48} className="mx-auto text-[var(--text-muted)] opacity-50 mb-3" />
              <h3 className="font-bold text-lg text-[var(--text)]">No submissions found</h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {activeTab === "pending"
                  ? "Hooray! No practical assessments are currently pending review."
                  : activeTab === "approved"
                    ? "No approved submissions have been found in the system."
                    : "No submissions have been found in the system."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm text-[var(--text-muted)] border-collapse">
                <thead className="bg-[var(--bg-muted)] text-xs font-bold uppercase tracking-wider text-[var(--text)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-3 py-3 w-[22%]">User</th>
                    <th className="px-3 py-3 w-[22%]">Submodule</th>
                    <th className="px-3 py-3 w-[24%]">Submitted Link/Answer</th>
                    <th className="px-3 py-3 w-[15%]">Submitted At</th>
                    <th className="px-3 py-3 w-[10%] text-center">Status / Score</th>
                    <th className="px-3 py-3 w-[7%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {paginatedSubmissions.map((item) => (
                    <tr key={`${item.submissionId}-${item.questionNumber}`} className="transition-colors hover:bg-[var(--bg-muted)]/40">
                      <td className="px-3 py-3 max-w-[200px]">
                        <div>
                          <div className="font-bold text-[var(--text)] text-xs sm:text-sm truncate">{item.userName}</div>
                          <div className="text-[10px] sm:text-xs text-[var(--text-muted)] truncate">{item.userEmail}</div>
                          <span className="inline-block mt-0.5 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-[var(--bg-muted)] text-[var(--text-muted)]">
                            {item.userRole}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 max-w-[200px] break-words">
                        <span className="font-semibold text-[var(--text)] text-xs sm:text-sm block line-clamp-2">
                          {item.submoduleTitle}
                        </span>
                      </td>
                      <td className="px-3 py-3 max-w-[240px]">
                        <div className="flex items-center gap-2">
                          {isLink(item.selectedAnswer) ? (
                            <a
                              href={formatLink(item.selectedAnswer)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-mst-red hover:underline break-all"
                            >
                              <GitBranch size={13} className="shrink-0" />
                              <span className="truncate max-w-[150px]">{item.selectedAnswer.replace(/^https?:\/\/(www\.)?/, '')}</span>
                              <ExternalLink size={11} className="shrink-0" />
                            </a>
                          ) : (
                            <span className="truncate text-xs font-mono bg-[var(--bg-muted)] px-2 py-1 rounded max-w-full">
                              {item.selectedAnswer || <span className="italic text-[var(--text-muted)] text-[10px]">Empty submission</span>}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-[10px] sm:text-xs text-[var(--text-muted)] font-medium block leading-tight">
                          {item.submittedAt}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-bold whitespace-nowrap ${item.isCorrect
                              ? "bg-green-500/10 text-green-500 border border-green-500/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            }`}>
                            {item.isCorrect ? "Approved" : "Pending Review"}
                          </span>
                          {item.isCorrect && (
                            <span className="text-xs font-bold text-[var(--text)]">
                              Score: {item.rawSubmission?.score ?? item.rawSubmission?.partialScore ?? 0}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedSubmission(item)}
                            title="View Full Details"
                            className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-muted)] text-[var(--text)] transition-colors cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>

                          {!item.isCorrect ? (
                            <button
                              onClick={() => {
                                setPromptSubmission(item);
                                setPromptScore(String(item.rawSubmission?.score ?? item.rawSubmission?.partialScore ?? 10));
                              }}
                              className="px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold transition-colors cursor-pointer shadow-sm"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => handleGrade(item, false)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold hover:bg-red-600/10 hover:text-red-500 hover:border-red-500/20 transition-colors cursor-pointer"
                            >
                              Approved
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--bg-muted)]/30 px-4 py-3 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--bg-muted)] disabled:opacity-50 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--bg-muted)] disabled:opacity-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] font-medium">
                        Showing <span className="font-bold text-[var(--text)]">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                        <span className="font-bold text-[var(--text)]">
                          {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)}
                        </span>{" "}
                        of <span className="font-bold text-[var(--text)]">{filteredSubmissions.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-l-md border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--bg-muted)] disabled:opacity-50 transition-colors"
                        >
                          Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNum = index + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              aria-current={currentPage === pageNum ? "page" : undefined}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-bold border border-[var(--border)] transition-colors ${currentPage === pageNum
                                  ? "z-10 bg-mst-red text-white border-mst-red"
                                  : "bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--bg-muted)]"
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--bg-muted)] disabled:opacity-50 transition-colors"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 shrink-0">
              <h3 className="text-lg font-bold text-[var(--text)]">
                Review Practical Submission
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] text-[var(--text-muted)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-auto py-5 space-y-5">
              {/* User Metadata */}
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]/50 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block font-bold">Student Name</span>
                  <span className="text-sm font-bold text-[var(--text)]">{selectedSubmission.userName}</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block font-bold">Email Address</span>
                  <span className="text-sm font-bold text-[var(--text)] break-all">{selectedSubmission.userEmail}</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block font-bold">Role</span>
                  <span className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">{selectedSubmission.userRole}</span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block font-bold">Status</span>
                  <span className={`inline-block mt-0.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${selectedSubmission.isCorrect
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    }`}>
                    {selectedSubmission.isCorrect ? "Approved" : "Pending Review"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block font-bold">Submitted At</span>
                  <span className="text-sm font-bold text-[var(--text)]">{selectedSubmission.submittedAt}</span>
                </div>
              </div>

              {/* Assessment details */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">Assessment details</h4>
                <div className="p-4 rounded-xl border border-[var(--border)] space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Submodule Title</span>
                    <span className="font-bold text-[var(--text)] text-right">{selectedSubmission.submoduleTitle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Submodule ID</span>
                    <span className="font-mono text-xs text-[var(--text)]">{selectedSubmission.submoduleId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Assignment ID</span>
                    <span className="font-mono text-xs text-[var(--text)]">{selectedSubmission.assignmentId}</span>
                  </div>
                </div>
              </div>

              {/* Submitted Work */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">Submitted Work</h4>
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] min-h-[100px] flex flex-col justify-center">
                  {isLink(selectedSubmission.selectedAnswer) ? (
                    <div className="text-center p-3">
                      <p className="text-xs text-[var(--text-muted)] mb-3">GitHub Link or Project Deployment URL Submitted:</p>
                      <a
                        href={formatLink(selectedSubmission.selectedAnswer)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-mst-red text-white px-5 py-2.5 text-sm font-bold hover:bg-red-700 transition-all cursor-pointer shadow-md shadow-mst-red/20"
                      >
                        <GitBranch size={16} />
                        Open Project Link
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono text-xs text-[var(--text)] max-h-[300px] overflow-auto">
                      {selectedSubmission.selectedAnswer || <span className="italic text-[var(--text-muted)]">No details submitted</span>}
                    </pre>
                  )}
                </div>
              </div>

              {/* Evaluation Score Input */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">Evaluation Score</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    value={evaluationScore}
                    onChange={(e) => setEvaluationScore(Number(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm text-[var(--text)] outline-none focus:border-mst-red transition-all"
                  />
                  <span className="text-xs text-[var(--text-muted)] font-medium">Set the score decided by the admin for this student.</span>
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="border-t border-[var(--border)] pt-4 flex justify-between gap-3 shrink-0">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                Close
              </button>

              <div className="flex gap-2">
                {!selectedSubmission.isCorrect ? (
                  <button
                    onClick={() => {
                      const item = selectedSubmission;
                      setSelectedSubmission(null);
                      handleGrade(item, true, evaluationScore);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 hover:bg-green-700 px-5 py-2.5 text-sm font-bold text-white transition-colors cursor-pointer shadow-md shadow-green-600/10"
                  >
                    <Check size={16} />
                    Approve Submission
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        const item = selectedSubmission;
                        setSelectedSubmission(null);
                        handleGrade(item, true, evaluationScore);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition-colors cursor-pointer shadow-md shadow-blue-600/10"
                    >
                      Update Score
                    </button>
                    <button
                      onClick={() => {
                        const item = selectedSubmission;
                        setSelectedSubmission(null);
                        handleGrade(item, false);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-sm font-bold text-white transition-colors cursor-pointer shadow-md shadow-red-600/10"
                    >
                      <X size={16} />
                      Reject Submission
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Quick Approve Modal */}
      {promptSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[var(--text)] mb-2">
              Approve Submission
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-4 font-semibold">
              Enter the evaluation score for <strong className="text-[var(--text)]">{promptSubmission.userName}</strong>:
            </p>
            <div className="space-y-4">
              <input
                type="number"
                min="0"
                value={promptScore}
                onChange={(e) => setPromptScore(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] text-sm text-[var(--text)] outline-none focus:border-mst-red transition-all font-bold"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setPromptSubmission(null)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs font-bold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const parsed = parseInt(promptScore, 10);
                    if (isNaN(parsed)) {
                      showToast("Please enter a valid number for the score.", "error");
                      return;
                    }
                    const item = promptSubmission;
                    setPromptSubmission(null);
                    handleGrade(item, true, parsed);
                  }}
                  className="rounded-xl bg-green-600 hover:bg-green-700 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-md shadow-green-600/10"
                >
                  Confirm Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-300 ${toast.type === "success"
            ? "border-green-500/30 bg-emerald-950/95 text-emerald-400"
            : "border-red-500/30 bg-red-950/95 text-red-400"
          }`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400" />
          )}
          <span className="text-sm font-extrabold">{toast.message}</span>
        </div>
      )}
    </DashboardShell>
  );
}
