"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getAllUsers, type AuthUser, type UserRole, roleLabel, setSession, parseJwt, normalizeRole, dashboardPath } from "@/lib/auth";
import { Users, Filter, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Search, ChevronDown, Pencil, Check, X, BookOpen, Trophy, Calendar, Loader2 } from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [debugRaw, setDebugRaw] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setMounted(true);

    const fetchUsers = async () => {
      try {
        setLoading(true);
        let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        
        let roleParam = "";
        if (filterRole !== "all") {
          if (filterRole === "course_only") roleParam = "COURSE_ONLY";
          else if (filterRole === "validator") roleParam = "VALIDATOR";
          else if (filterRole === "student") roleParam = "STUDENT";
          else if (filterRole === "working_professional") roleParam = "WORKING_PROFESSIONAL";
        }

        const url = `${baseURL}/api/admin/users?page=${currentPage}&limit=10&search=${encodeURIComponent(debouncedSearch)}${roleParam ? `&role=${roleParam}` : ""}`;
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) {
          throw new Error(`Response Status : ${response.status}`);
        }

        const result = await response.json();
        console.log("Raw API Response:", result);
        setDebugRaw(JSON.stringify(result, null, 2));

        if (result?.pagination) {
          setTotalPages(result.pagination.totalPages || 1);
        }

        const rawUsers = Array.isArray(result) ? result : (result?.data?.users || result?.users || result?.data || []);

        const mappedUsers = rawUsers.map((u: any, index: number) => {
          let roleStr = String(u.role || "student").toLowerCase().trim();
          if (roleStr === "user") roleStr = "non-validator";
          if (roleStr === "working-professional" || roleStr === "Web3 Enthusiast" || roleStr === "workingprofessional") {
            roleStr = "working_professional";
          }
          if (roleStr === "course-only" || roleStr === "course only" || roleStr === "courseonly") {
            roleStr = "course_only";
          }

          return {
            ...u,
            id: u.id || u._id || `user-${index}-${Math.random()}`,
            email: u.email || "No Email",
            fullName: u.fullName || u.name || "Unknown",
            phone: u.mobileNumber || u.phone || "N/A",
            role: roleStr,
            isActive: u.isActive,
            isStudentVerified: u.studentRejectionNote ? false : u.isStudentVerified,
            studentVerificationStatus: u.studentVerificationStatus,
            studentRejectionNote: u.studentRejectionNote,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            registeredAt: u.registeredAt || u.createdAt || new Date().toISOString(),
            referralPercentage: u.referralPercentage,
            courseDiscounts: Array.isArray(u.courseDiscounts) ? u.courseDiscounts : [],
            isPaymentVerified: !!u.isPaymentVerified,
          };
        });

        console.log("Mapped users state:", mappedUsers);
        setUsers(mappedUsers);
      } catch (error: any) {
        setErrorMsg(error?.message ?? String(error));
        console.error("Error fetching users:", error?.message ?? error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, debouncedSearch, filterRole]);

  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifyUserModal, setVerifyUserModal] = useState<AuthUser | null>(null);
  const [togglingActiveId, setTogglingActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<{ userId: string; currentStatus: boolean; userName: string } | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [updatingReferralId, setUpdatingReferralId] = useState<string | null>(null);
  const [confirmReferralUpdate, setConfirmReferralUpdate] = useState<{ userId: string; userName: string; percentage: number } | null>(null);

  const DISCOUNT_ROLES: UserRole[] = ["student", "validator", "working_professional", "course_only"];

  const [editingDiscountUserId, setEditingDiscountUserId] = useState<string | null>(null);
  const [editDiscountRole, setEditDiscountRole] = useState<UserRole>("student");
  const [editDiscountValue, setEditDiscountValue] = useState<number>(0);
  const [updatingDiscountId, setUpdatingDiscountId] = useState<string | null>(null);
  const [confirmDiscountUpdate, setConfirmDiscountUpdate] = useState<{ userId: string; userName: string; role: UserRole; discount: number } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);

  const handleImpersonate = async (targetUser: AuthUser) => {
    try {
      setImpersonatingId(targetUser.id);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const token = typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseURL}/api/auth/impersonate/${targetUser.id}`, {
        method: "POST",
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to impersonate user");
      }

      const data = await response.json();
      const newToken = data?.accessToken || data?.token || (data?.data && data.data.token) || (data?.data && data.data.accessToken) || data?.data?.accessToken;
      
      let impersonatedUser: AuthUser;
      
      if (newToken) {
        localStorage.setItem("admin-token", newToken);
        const payload = parseJwt(newToken);
        impersonatedUser = {
          id: payload?.sub || targetUser.id,
          email: payload?.email || targetUser.email,
          fullName: targetUser.fullName || payload?.email?.split("@")[0] || "Unknown",
          role: normalizeRole(payload?.role || targetUser.role),
          backendRole: payload?.role || targetUser.role,
          isImpersonating: true,
          impersonatedBy: payload?.impersonatedBy,
          impersonatedByRole: payload?.impersonatedByRole,
          registeredAt: targetUser.registeredAt || new Date().toISOString(),
        };
      } else {
        // Fallback: If no token returned in response body, use the data body directly or fallback to targetUser details
        const payload = data || {};
        impersonatedUser = {
          id: payload.sub || targetUser.id,
          email: payload.email || targetUser.email,
          fullName: targetUser.fullName || payload.email?.split("@")[0] || "Unknown",
          role: normalizeRole(payload.role || targetUser.role),
          backendRole: payload.role || targetUser.role,
          isImpersonating: true,
          impersonatedBy: payload.impersonatedBy,
          impersonatedByRole: payload.impersonatedByRole,
          registeredAt: targetUser.registeredAt || new Date().toISOString(),
        };
      }

      setSession(impersonatedUser);
      showToast("Impersonation started successfully", "success");
      
      // Redirect to user's dashboard in same page
      window.location.href = dashboardPath(impersonatedUser.role);
    } catch (err: any) {
      showToast(err.message || "Error starting impersonation", "error");
    } finally {
      setImpersonatingId(null);
    }
  };

  // State for user progress modal
  const [viewingProgressUser, setViewingProgressUser] = useState<AuthUser | null>(null);
  const [userProgressData, setUserProgressData] = useState<any | null>(null);
  const [curriculumData, setCurriculumData] = useState<any[] | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);

  const handleViewProgress = async (user: AuthUser) => {
    setViewingProgressUser(user);
    setLoadingProgress(true);
    setProgressError(null);
    setUserProgressData(null);
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      
      // 1. Fetch curriculum if not already loaded
      let currentCurriculum = curriculumData;
      if (!currentCurriculum) {
        const courseId = "6a2934912b48a13769669f8e";
        const curriculumRes = await fetch(`${baseURL}/api/phases/course/${courseId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        if (curriculumRes.ok) {
          const resData = await curriculumRes.json();
          const rawPhases = resData.data || resData || [];
          currentCurriculum = await Promise.all(
            rawPhases.map(async (phase: any) => {
              try {
                const fullRes = await fetch(`${baseURL}/api/phases/full/${phase._id || phase.id}`, {
                  method: "GET",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" }
                });
                if (fullRes.ok) {
                  const fullData = await fullRes.json();
                  return fullData.data || fullData;
                }
              } catch (e) {
                console.error(e);
              }
              return phase;
            })
          );
          setCurriculumData(currentCurriculum);
        }
      }

      // 2. Fetch User Progress
      const progressRes = await fetch(`${baseURL}/api/dashboard/admin/user-progress/${user.id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      if (!progressRes.ok) {
        throw new Error(`Failed to fetch progress: ${progressRes.statusText}`);
      }

      const progressJson = await progressRes.json();
      setUserProgressData(progressJson.data || progressJson);
    } catch (err: any) {
      setProgressError(err.message || "Failed to load progress data");
    } finally {
      setLoadingProgress(false);
    }
  };

  const stats = useMemo(() => {
    if (!curriculumData || !userProgressData) return null;
    let totalModules = 0;
    let totalSubmodules = 0;
    
    curriculumData.forEach((phase: any) => {
      const modules = phase.modules || [];
      totalModules += modules.length;
      modules.forEach((mod: any) => {
        totalSubmodules += (mod.submodules || []).length;
      });
    });

    const completedModulesCount = userProgressData.completedModules?.length || 0;
    const completedSubmodulesCount = userProgressData.completedSubmodules?.length || 0;

    return {
      totalModules,
      totalSubmodules,
      completedModulesCount,
      completedSubmodulesCount,
    };
  }, [curriculumData, userProgressData]);

  const handleUpdateReferralPercentage = async (userId: string, percentage: number) => {
    try {
      setUpdatingReferralId(userId);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const response = await fetch(`${baseURL}/api/admin/users/${userId}/referral-percentage`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referralPercentage: percentage })
      });

      if (!response.ok) {
        throw new Error(`Failed to update referral percentage: ${response.statusText}`);
      }

      const data = await response.json();

      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === userId ? { ...u, referralPercentage: percentage } : u
        )
      );

      showToast(data.message || "Referral percentage updated successfully", "success");
      setEditingUserId(null);
    } catch (error: any) {
      showToast(error.message || "An error occurred while updating referral percentage", "error");
    } finally {
      setUpdatingReferralId(null);
    }
  };

  const handleUpdateDiscount = async (userId: string, role: UserRole, discount: number) => {
    try {
      setUpdatingDiscountId(userId);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const response = await fetch(`${baseURL}/api/admin/users/${userId}/discount`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, discount })
      });

      if (!response.ok) {
        throw new Error(`Failed to update discount: ${response.statusText}`);
      }

      const data = await response.json();

      setUsers(prevUsers =>
        prevUsers.map(u => {
          if (u.id !== userId) return u;
          const existing = Array.isArray(u.courseDiscounts) ? u.courseDiscounts : [];
          const withoutRole = existing.filter(cd => cd.role !== role);
          return { ...u, courseDiscounts: [...withoutRole, { role, discount }] };
        })
      );

      showToast(data.message || "Discount updated successfully", "success");
      setEditingDiscountUserId(null);
    } catch (error: any) {
      showToast(error.message || "An error occurred while updating discount", "error");
    } finally {
      setUpdatingDiscountId(null);
    }
  };

  const handleVerifyStudent = async (studentId: string, status: string = "Completed", studentRejectionNote?: string) => {
    try {
      setVerifyingId(studentId);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const response = await fetch(`${baseURL}/api/auth/verify-student/${studentId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          ...(studentRejectionNote ? { studentRejectionNote } : {})
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to verify student: ${response.statusText}`);
      }

      const data = await response.json();
      const updatedStudent = data.student || data.user || data.data;

      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === studentId ? {
            ...u,
            isStudentVerified: studentRejectionNote ? false : (updatedStudent ? updatedStudent.isStudentVerified : (status === "Completed" && !studentRejectionNote)),
            studentVerificationStatus: updatedStudent ? updatedStudent.studentVerificationStatus : status,
            studentRejectionNote: updatedStudent ? updatedStudent.studentRejectionNote : studentRejectionNote
          } : u
        )
      );

      showToast(data.message || "Student status updated successfully", "success");
    } catch (error: any) {
      showToast(error.message || "An error occurred during verification", "error");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleVerifyValidator = async (validatorId: string, status: string = "Completed", studentRejectionNote?: string) => {
    try {
      setVerifyingId(validatorId);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const response = await fetch(`${baseURL}/api/auth/verify-validator/${validatorId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          ...(studentRejectionNote ? { studentRejectionNote } : {})
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to verify validator: ${response.statusText}`);
      }

      const data = await response.json();
      const updatedValidator = data.student || data.user || data.data;

      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === validatorId ? {
            ...u,
            isStudentVerified: studentRejectionNote ? false : (updatedValidator ? updatedValidator.isStudentVerified : (status === "Completed" && !studentRejectionNote)),
            studentVerificationStatus: updatedValidator ? updatedValidator.studentVerificationStatus : status,
            studentRejectionNote: updatedValidator ? updatedValidator.studentRejectionNote : studentRejectionNote
          } : u
        )
      );

      showToast(data.message || "Validator status updated successfully", "success");
    } catch (error: any) {
      showToast(error.message || "An error occurred during verification", "error");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      setTogglingActiveId(userId);
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const response = await fetch(`${baseURL}/api/admin/users/${userId}/deactive`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle user status: ${response.statusText}`);
      }

      const data = await response.json();

      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === userId ? { ...u, isActive: !currentStatus } : u
        )
      );

      showToast(data.message || "User status updated successfully", "success");
    } catch (error: any) {
      showToast(error.message || "An error occurred while updating status", "error");
    } finally {
      setTogglingActiveId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    let result = users;
    if (filterRole !== "all") {
      result = result.filter(u => {
        if (filterRole === "working_professional") {
          return u.role === "working_professional" || u.role === "non-validator" || u.role === "working-professional";
        }
        return u.role === filterRole;
      });
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        (u.fullName || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.id || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, filterRole, searchQuery]);

  const displayedTotalPages = useMemo(() => {
    return totalPages;
  }, [totalPages]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const siblingCount = 1;

    pages.push(1);

    const startRange = Math.max(2, currentPage - siblingCount);
    const endRange = Math.min(displayedTotalPages - 1, currentPage + siblingCount);

    if (startRange > 2) {
      pages.push("...");
    }

    for (let i = startRange; i <= endRange; i++) {
      pages.push(i);
    }

    if (endRange < displayedTotalPages - 1) {
      pages.push("...");
    }

    if (displayedTotalPages > 1) {
      pages.push(displayedTotalPages);
    }

    return pages;
  };

  if (!mounted) return null;

  const showCollege = filterRole === "student" || filterRole === "all";
  const showVerified = filterRole === "student" || filterRole === "all";

  return (
    <DashboardShell role="admin" title="User Management">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-mst-red/10 p-2.5">
              <Users size={22} className="text-mst-red" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">Manage Users</h2>
              <p className="text-sm text-[var(--text-muted)]">View and filter all registered users</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-initial w-full lg:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search by name, email, ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] pl-9 pr-3 py-2 text-sm font-medium text-[var(--text)] outline-none focus:border-mst-red transition-all"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 lg:flex-initial w-full lg:w-auto min-w-[150px]">
              <Filter size={16} className="text-[var(--text-muted)] shrink-0" />
              <div className="relative flex-1 lg:w-48">
                <select
                  value={filterRole}
                  onChange={(e) => {
                    setFilterRole(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] pl-3 pr-10 py-2 text-sm font-medium text-[var(--text)] outline-none focus:border-mst-red transition-all cursor-pointer"
                >
                  <option value="all">All Users</option>
                  <option value="course_only">OJT</option>
                  <option value="validator">Validator</option>
                  <option value="student">Student</option>
                  <option value="working_professional">Web3 Enthusiast</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-500 shadow-sm">
            <h3 className="font-bold text-lg mb-2">Error Fetching Users</h3>
            <pre className="whitespace-pre-wrap text-sm mb-4">{errorMsg}</pre>
            {/* <div className="bg-white/50 dark:bg-black/20 p-3 rounded text-sm text-black dark:text-white font-mono break-all">
              <strong>Your Token:</strong> {typeof window !== "undefined" ? (localStorage.getItem("admin-token") || "NULL / MISSING (You need to logout and login again!)") : "loading..."}
            </div> */}
            {/* <p className="mt-3 text-sm font-semibold">
              If your token is NULL, click your profile, sign out, and sign back in as admin.
            </p> */}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm text-[var(--text-muted)]">
              <thead className="bg-[var(--bg-muted)] text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                <tr>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Mobile</th>
                  {showCollege && <th className="px-3 py-3">College</th>}
                  <th className="pl-3 pr-1 py-3 w-0 text-center">Role</th>
                  <th className="pl-1 pr-3 py-3 w-0 text-center">Active</th>
                  {showVerified && <th className="px-3 py-3">Verified</th>}
                  <th className="px-3 py-3 text-center">Paid</th>
                  <th className="px-3 py-3">Created</th>
                  <th className="px-3 py-3 text-center">Referral Percentage</th>
                  <th className="px-3 py-3 text-center">Discount</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 text-center">Impersonate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="animate-pulse">
                      <td className="px-3 py-4">
                        <div className="h-4 w-28 rounded bg-[var(--bg-muted)]" />
                      </td>
                      <td className="px-3 py-4">
                        <div className="h-4 w-40 rounded bg-[var(--bg-muted)]" />
                      </td>
                      <td className="px-3 py-4">
                        <div className="h-4 w-28 rounded bg-[var(--bg-muted)]" />
                      </td>
                      {showCollege && (
                        <td className="px-3 py-4">
                          <div className="h-4 w-32 rounded bg-[var(--bg-muted)]" />
                        </td>
                      )}
                      <td className="pl-3 pr-1 py-4 text-center">
                        <div className="mx-auto h-5 w-16 rounded-full bg-[var(--bg-muted)]" />
                      </td>
                      <td className="pl-1 pr-3 py-4 text-center">
                        <div className="mx-auto h-5 w-12 rounded-full bg-[var(--bg-muted)]" />
                      </td>
                      {showVerified && (
                        <td className="px-3 py-4">
                          <div className="h-5 w-16 rounded-full bg-[var(--bg-muted)]" />
                        </td>
                      )}
                      <td className="px-3 py-4 text-center">
                        <div className="mx-auto h-5 w-12 rounded bg-[var(--bg-muted)]" />
                      </td>
                      <td className="px-3 py-4">
                        <div className="h-4 w-20 rounded bg-[var(--bg-muted)]" />
                      </td>
                      <td className="px-3 py-4">
                        <div className="h-4 w-12 rounded bg-[var(--bg-muted)]" />
                      </td>
                      <td className="px-3 py-4">
                        <div className="h-4 w-12 rounded bg-[var(--bg-muted)]" />
                      </td>
                      <td className="px-3 py-4">
                        <div className="h-5 w-16 rounded-full bg-[var(--bg-muted)]" />
                      </td>
                      <td className="px-3 py-4">
                        <div className="h-5 w-16 rounded-full bg-[var(--bg-muted)]" />
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={11 + (showCollege ? 1 : 0) + (showVerified ? 1 : 0)} className="px-3 py-8 text-center text-sm font-medium">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-[var(--bg-muted)]/50">
                      <td className="px-3 py-3 font-bold text-[var(--text)]">
                        <button
                          onClick={() => handleViewProgress(user)}
                          className="hover:underline text-left font-bold cursor-pointer text-[var(--text)]"
                        >
                          {user.fullName || (user as any).name || "Unknown"}
                        </button>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">{user.email}</td>
                      <td className="px-3 py-3 whitespace-nowrap">{(user as any).phone || "N/A"}</td>
                      {showCollege && (
                        <td className="px-3 py-3">{(user as any).collegeName || user.college || "N/A"}</td>
                      )}
                      <td className="pl-3 pr-1 py-3 w-0 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${user.role === 'student' || user.role === 'STUDENT' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          user.role === 'validator' || user.role === 'VALIDATOR' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                            (() => {
                              const r = user.role?.toLowerCase();
                              return r === 'admin' || r === 's_admin' || r === 'superadmin' || r === 'super_admin' || r === 'super-admin' || r === 'super admin';
                            })() ? 'bg-mst-red/10 text-mst-red border border-mst-red/20' :
                              'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          }`}>
                          {roleLabel(user.role)}
                        </span>
                      </td>
                      <td className="pl-1 pr-3 py-3 w-0 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${user.isActive === false ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                          {user.isActive === false ? 'No' : 'Yes'}
                        </span>
                      </td>
                      {showVerified && (
                        <td className="px-3 py-3">
                          {user.role === 'student' ? (
                            <div className="flex flex-col gap-2 items-start">
                              {user.isStudentVerified && !user.studentRejectionNote ? (
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 whitespace-nowrap">
                                  Verified
                                </span>
                              ) : user.studentRejectionNote ? (
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 whitespace-nowrap">
                                  Rejected
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap">
                                  Pending
                                </span>
                              )}
                              {(!user.isStudentVerified || !!user.studentRejectionNote) && (
                                <button
                                  onClick={() => {
                                    setRejectionNote("");
                                    setIsRejecting(false);
                                    setVerifyUserModal(user);
                                  }}
                                  disabled={verifyingId === user.id}
                                  className="rounded-lg bg-amber-600 hover:bg-amber-700 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50 shadow-sm whitespace-nowrap"
                                >
                                  {verifyingId === user.id ? 'Verifying...' : (user.studentRejectionNote ? 'Reverify Student' : 'Verify Student')}
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-[var(--text-muted)]">N/A</span>
                          )}
                        </td>
                      )}
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${user.isPaymentVerified ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                          {user.isPaymentVerified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center font-semibold">
                        {editingUserId === user.id ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editValue}
                              onChange={(e) => setEditValue(Number(e.target.value))}
                              className="w-16 rounded border border-[var(--border)] bg-[var(--bg-muted)] px-1.5 py-1 text-xs text-[var(--text)] outline-none focus:border-mst-red transition-all"
                              disabled={updatingReferralId === user.id}
                            />
                            <button
                              onClick={() => setConfirmReferralUpdate({
                                userId: user.id,
                                userName: user.fullName || (user as any).name || "this user",
                                percentage: editValue
                              })}
                              disabled={updatingReferralId === user.id}
                              className="rounded bg-green-600 hover:bg-green-700 p-1 text-white transition-colors cursor-pointer disabled:opacity-50"
                              title="Save"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              disabled={updatingReferralId === user.id}
                              className="rounded bg-red-600 hover:bg-red-700 p-1 text-white transition-colors cursor-pointer disabled:opacity-50"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 group min-h-[28px]">
                            <span>{user.referralPercentage !== undefined ? `${user.referralPercentage}%` : "0%"}</span>
                            <button
                              onClick={() => {
                                setEditingUserId(user.id);
                                setEditValue(user.referralPercentage || 0);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                              title="Edit Referral Percentage"
                            >
                              <Pencil size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center font-semibold">
                        {editingDiscountUserId === user.id ? (
                           <div className="flex flex-col items-center justify-center gap-1.5">
                             <div className="flex items-center justify-center gap-1.5">
                               <select
                                 value={editDiscountRole}
                                 onChange={(e) => {
                                   const role = e.target.value as UserRole;
                                   setEditDiscountRole(role);
                                   const existing = (user.courseDiscounts || []).find(cd => cd.role === role);
                                   setEditDiscountValue(existing?.discount || 0);
                                 }}
                                 disabled={updatingDiscountId === user.id}
                                 className="rounded border border-[var(--border)] bg-[var(--bg-muted)] px-1.5 py-1 text-xs text-[var(--text)] outline-none focus:border-mst-red transition-all cursor-pointer"
                               >
                                 {DISCOUNT_ROLES.map((role) => (
                                   <option key={role} value={role}>{roleLabel(role)}</option>
                                 ))}
                               </select>
                               <input
                                 type="number"
                                 min="0"
                                 max="100"
                                 value={editDiscountValue}
                                 onChange={(e) => setEditDiscountValue(Number(e.target.value))}
                                 className="w-16 rounded border border-[var(--border)] bg-[var(--bg-muted)] px-1.5 py-1 text-xs text-[var(--text)] outline-none focus:border-mst-red transition-all"
                                 disabled={updatingDiscountId === user.id}
                               />
                               <button
                                 onClick={() => setConfirmDiscountUpdate({
                                   userId: user.id,
                                   userName: user.fullName || (user as any).name || "this user",
                                   role: editDiscountRole,
                                   discount: editDiscountValue
                                 })}
                                 disabled={updatingDiscountId === user.id}
                                 className="rounded bg-green-600 hover:bg-green-700 p-1 text-white transition-colors cursor-pointer disabled:opacity-50"
                                 title="Save"
                               >
                                 <Check size={14} />
                               </button>
                               <button
                                 onClick={() => setEditingDiscountUserId(null)}
                                 disabled={updatingDiscountId === user.id}
                                 className="rounded bg-red-600 hover:bg-red-700 p-1 text-white transition-colors cursor-pointer disabled:opacity-50"
                                 title="Cancel"
                               >
                                 <X size={14} />
                               </button>
                             </div>
                           </div>
                        ) : (
                           <div className="flex flex-col items-center justify-center gap-1 group min-h-[28px]">
                             <div className="flex flex-wrap items-center justify-center gap-1">
                               {(user.courseDiscounts && user.courseDiscounts.length > 0) ? (
                                 user.courseDiscounts.map((cd) => (
                                   <span
                                     key={cd.role}
                                     className="inline-flex items-center rounded-full bg-[var(--bg-muted)] border border-[var(--border)] px-2 py-0.5 text-[10px] font-bold text-[var(--text)]"
                                     title={roleLabel(cd.role)}
                                   >
                                     {roleLabel(cd.role)}: {cd.discount}%
                                   </span>
                                 ))
                               ) : (
                                 <span className="text-[var(--text-muted)]">No discounts set</span>
                               )}
                             </div>
                             <button
                               onClick={() => {
                                 setEditingDiscountUserId(user.id);
                                 const defaultRole = DISCOUNT_ROLES.includes(user.role as UserRole) ? (user.role as UserRole) : "student";
                                 setEditDiscountRole(defaultRole);
                                 const existing = (user.courseDiscounts || []).find(cd => cd.role === defaultRole);
                                 setEditDiscountValue(existing?.discount || 0);
                               }}
                               className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                               title="Edit Discount"
                             >
                               <Pencil size={14} />
                             </button>
                           </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => setConfirmToggle({ userId: user.id, currentStatus: user.isActive !== false, userName: user.fullName || "this user" })}
                          disabled={togglingActiveId === user.id}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50 shadow-sm whitespace-nowrap ${user.isActive === false ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                          {togglingActiveId === user.id ? '...' : (user.isActive === false ? 'Unblock' : 'Block')}
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => handleImpersonate(user)}
                          disabled={impersonatingId !== null}
                          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50 shadow-sm whitespace-nowrap"
                        >
                          {impersonatingId === user.id ? 'Starting...' : 'Start'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4">
            <div className="text-sm text-[var(--text-muted)]">
              Page <span className="font-semibold text-[var(--text)]">{currentPage}</span> of{" "}
              <span className="font-semibold text-[var(--text)]">{displayedTotalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--text)] disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers().map((pageNum, index) => {
                if (pageNum === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="inline-flex h-9 w-9 items-center justify-center text-sm font-semibold text-[var(--text-muted)]"
                    >
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum as number)}
                    disabled={loading}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${currentPage === pageNum
                      ? "border-mst-red bg-mst-red text-white"
                      : "border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, displayedTotalPages))}
                disabled={currentPage === displayedTotalPages || loading}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-muted)] hover:text-[var(--text)] disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {confirmToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[var(--text)] mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Do you really want to {confirmToggle.currentStatus ? "block" : "unblock"} the user <span className="font-bold text-[var(--text)]">{confirmToggle.userName}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmToggle(null)}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                No
              </button>
              <button
                onClick={() => {
                  handleToggleActive(confirmToggle.userId, confirmToggle.currentStatus);
                  setConfirmToggle(null);
                }}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer ${confirmToggle.currentStatus ? "bg-mst-red hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmReferralUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[var(--text)] mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Do you really want to update the referral percentage to <span className="font-bold text-[var(--text)]">{confirmReferralUpdate.percentage}%</span> for user <span className="font-bold text-[var(--text)]">{confirmReferralUpdate.userName}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmReferralUpdate(null)}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                No
              </button>
              <button
                onClick={() => {
                  handleUpdateReferralPercentage(confirmReferralUpdate.userId, confirmReferralUpdate.percentage);
                  setConfirmReferralUpdate(null);
                }}
                className="rounded-xl bg-mst-red hover:bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDiscountUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[var(--text)] mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Do you really want to set the <span className="font-bold text-[var(--text)]">{roleLabel(confirmDiscountUpdate.role)}</span> discount to <span className="font-bold text-[var(--text)]">{confirmDiscountUpdate.discount}%</span> for user <span className="font-bold text-[var(--text)]">{confirmDiscountUpdate.userName}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDiscountUpdate(null)}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                No
              </button>
              <button
                onClick={() => {
                  handleUpdateDiscount(confirmDiscountUpdate.userId, confirmDiscountUpdate.role, confirmDiscountUpdate.discount);
                  setConfirmDiscountUpdate(null);
                }}
                className="rounded-xl bg-mst-red hover:bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {verifyUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <h3 className="text-lg font-bold text-[var(--text)] mb-2">
              Verify {verifyUserModal.role?.toLowerCase() === 'validator' ? 'Validator' : 'Student'} ID Card
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Please review the uploaded ID card for <span className="font-bold text-[var(--text)]">{verifyUserModal.fullName}</span> ({verifyUserModal.email}).
            </p>

            <div className="flex-1 overflow-auto rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] min-h-[300px] flex items-center justify-center p-2 relative mb-6">
              {(() => {
                const idCardUrl = (verifyUserModal as any).idCardImage || (verifyUserModal as any).idCardImageUrl || (verifyUserModal as any).idCard || (verifyUserModal as any).idCardPath;
                if (!idCardUrl) {
                  return (
                    <div className="text-center p-4">
                      <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-2" />
                      <p className="text-sm font-semibold text-[var(--text)]">No ID Card Found</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">No ID card was uploaded or returned from the API for this user.</p>
                    </div>
                  );
                }

                const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
                const fullIdCardUrl = idCardUrl.startsWith('http') ? idCardUrl : `${baseURL}${idCardUrl.startsWith('/') ? '' : '/'}${idCardUrl}`;
                const isPdf = idCardUrl.toLowerCase().endsWith('.pdf');

                if (isPdf) {
                  return (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <iframe src={fullIdCardUrl} className="w-full h-[350px] border-0 rounded-lg mb-3 bg-white" />
                      <a
                        href={fullIdCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-mst-red/10 text-mst-red border border-mst-red/20 px-4 py-2 text-xs font-bold hover:bg-mst-red/20 transition-colors cursor-pointer"
                      >
                        Open PDF in New Tab
                      </a>
                    </div>
                  );
                }

                return (
                  <div className="relative w-full h-full min-h-[350px] flex flex-col items-center justify-center">
                    <img
                      src={fullIdCardUrl}
                      alt="ID Card"
                      className="max-w-full max-h-[400px] object-contain rounded-lg shadow-sm"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                        if (sibling) sibling.style.display = 'block';
                      }}
                    />
                    <div className="hidden text-center p-4">
                      <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-2" />
                      <p className="text-sm font-semibold text-[var(--text)]">Failed to load ID card image</p>
                      <a
                        href={fullIdCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 rounded-lg bg-mst-red/10 text-mst-red border border-mst-red/20 px-4 py-2 text-xs font-bold hover:bg-mst-red/20 transition-colors cursor-pointer"
                      >
                        Open Link directly
                      </a>
                    </div>
                  </div>
                );
              })()}
            </div>

            {isRejecting && (
              <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <label className="mb-1.5 block text-xs font-bold text-[var(--text)]">
                  Student Rejection Note
                </label>
                <textarea
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="The uploaded student ID is blurred. Please upload a clear image showing your name and college."
                  rows={3}
                  className="w-full rounded-xl border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-red-500 transition-all placeholder:text-[var(--text-muted)]/40"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-3 shrink-0">
              {isRejecting ? (
                <>
                  <button
                    onClick={() => setIsRejecting(false)}
                    className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={async () => {
                      const userId = verifyUserModal.id;
                      const role = verifyUserModal.role?.toLowerCase();
                      setVerifyUserModal(null);
                      if (role === "validator") {
                        await handleVerifyValidator(userId, "Rejected", rejectionNote);
                      } else {
                        await handleVerifyStudent(userId, "Rejected", rejectionNote);
                      }
                      setRejectionNote("");
                      setIsRejecting(false);
                    }}
                    disabled={verifyingId === verifyUserModal.id || !rejectionNote.trim()}
                    className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {verifyingId === verifyUserModal.id ? 'Submitting...' : 'Submit Rejection'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setVerifyUserModal(null)}
                    className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsRejecting(true)}
                    className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={async () => {
                      const userId = verifyUserModal.id;
                      const role = verifyUserModal.role?.toLowerCase();
                      setVerifyUserModal(null);
                      if (role === "validator") {
                        await handleVerifyValidator(userId, "Completed");
                      } else {
                        await handleVerifyStudent(userId, "Completed");
                      }
                    }}
                    disabled={verifyingId === verifyUserModal.id}
                    className="rounded-xl bg-green-600 hover:bg-green-700 px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {verifyingId === verifyUserModal.id ? 'Approving...' : 'Approve'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {viewingProgressUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-4 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-[var(--text)]">
                  User Progress Roadmap
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Viewing progress for <span className="font-semibold text-[var(--text)]">{viewingProgressUser.fullName || (viewingProgressUser as any).name || "Unknown"}</span> ({viewingProgressUser.email})
                </p>
              </div>
              <button
                onClick={() => setViewingProgressUser(null)}
                className="rounded-lg p-1.5 hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {loadingProgress ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 text-mst-red animate-spin mb-3" />
                <p className="text-sm text-[var(--text-muted)]">Loading user progress & course details...</p>
              </div>
            ) : progressError ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-4">
                <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                <p className="text-sm font-semibold text-[var(--text)]">Error Loading Progress</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-md">{progressError}</p>
                <button
                  onClick={() => handleViewProgress(viewingProgressUser)}
                  className="mt-4 rounded-xl bg-mst-red hover:bg-red-700 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : userProgressData && curriculumData ? (
              <div className="flex-1 overflow-y-auto pr-1">
                {/* Stats Summary */}
                {stats && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]/50 p-4 flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                        <BookOpen size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Submodules Completed</div>
                        <div className="text-2xl font-black text-[var(--text)] mt-1">
                          {stats.completedSubmodulesCount} <span className="text-sm font-medium text-[var(--text-muted)]">/ {stats.totalSubmodules}</span>
                        </div>
                        <div className="w-full bg-[var(--border)] h-2 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${stats.totalSubmodules > 0 ? (stats.completedSubmodulesCount / stats.totalSubmodules) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]/50 p-4 flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Trophy size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Modules Completed</div>
                        <div className="text-2xl font-black text-[var(--text)] mt-1">
                          {stats.completedModulesCount} <span className="text-sm font-medium text-[var(--text-muted)]">/ {stats.totalModules}</span>
                        </div>
                        <div className="w-full bg-[var(--border)] h-2 rounded-full mt-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${stats.totalModules > 0 ? (stats.completedModulesCount / stats.totalModules) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Tree */}
                <div className="space-y-6">
                  {curriculumData.map((phase: any, pIdx: number) => {
                    const phaseModules = phase.modules || [];
                    
                    // Compute phase completed counts
                    let completedSubInPhase = 0;
                    let totalSubInPhase = 0;
                    phaseModules.forEach((mod: any) => {
                      const subs = mod.submodules || [];
                      totalSubInPhase += subs.length;
                      subs.forEach((sub: any) => {
                        const subId = sub.id || sub._id;
                        const isCompleted = userProgressData.completedSubmodules?.some((cs: any) => String(cs.submoduleId) === String(subId));
                        if (isCompleted) completedSubInPhase++;
                      });
                    });

                    return (
                      <div key={phase._id || phase.id || pIdx} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                        <div className="bg-[var(--bg-muted)]/30 px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[var(--text)] flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-mst-red/10 text-mst-red flex items-center justify-center text-xs font-bold">
                              {pIdx + 1}
                            </span>
                            {phase.title}
                          </h4>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            {completedSubInPhase} / {totalSubInPhase} Completed
                          </span>
                        </div>

                        <div className="p-4 space-y-4">
                          {phaseModules.map((mod: any, mIdx: number) => {
                            const modId = mod._id || mod.id;
                            const isModCompleted = userProgressData.completedModules?.some((cm: any) => String(cm.moduleId) === String(modId));
                            const completionModuleObj = userProgressData.completedModules?.find((cm: any) => String(cm.moduleId) === String(modId));
                            const submodulesList = mod.submodules || [];

                            return (
                              <div key={modId || mIdx} className="border border-[var(--border)]/60 rounded-lg p-3 hover:bg-[var(--bg-muted)]/10 transition-colors">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div>
                                    <h5 className="font-bold text-xs text-[var(--text)] flex items-center gap-1.5">
                                      Module {mod.index || (mIdx + 1)}: {mod.title}
                                    </h5>
                                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{mod.description || 'No description'}</p>
                                  </div>
                                  {isModCompleted ? (
                                    <div className="flex flex-col items-end gap-0.5">
                                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                                        <CheckCircle2 size={10} /> Completed
                                      </span>
                                      {completionModuleObj?.completedAt && (
                                        <span className="text-[9px] text-[var(--text-muted)] flex items-center gap-0.5">
                                          <Calendar size={8} /> {new Date(completionModuleObj.completedAt).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border)]">
                                      In Progress
                                    </span>
                                  )}
                                </div>

                                {/* Submodules */}
                                {submodulesList.length > 0 && (
                                  <div className="pl-3 border-l-2 border-[var(--border)] space-y-2 mt-2">
                                    {submodulesList.map((sub: any, sIdx: number) => {
                                      const subId = sub.id || sub._id;
                                      const isSubCompleted = userProgressData.completedSubmodules?.some((cs: any) => String(cs.submoduleId) === String(subId));
                                      const completionSubObj = userProgressData.completedSubmodules?.find((cs: any) => String(cs.submoduleId) === String(subId));

                                      return (
                                        <div key={subId || sIdx} className="flex items-center justify-between text-xs gap-3">
                                          <span className="text-[var(--text-muted)] font-medium truncate max-w-[80%]">
                                            {sub.index || `${mod.index || (mIdx + 1)}.${sIdx + 1}`} - {sub.title}
                                          </span>
                                          {isSubCompleted ? (
                                            <div className="flex items-center gap-1.5 shrink-0">
                                              <span className="text-emerald-500 font-bold text-[10px] flex items-center gap-0.5">
                                                <CheckCircle2 size={10} /> Yes
                                              </span>
                                              {completionSubObj?.completedAt && (
                                                <span className="text-[9px] text-[var(--text-muted)] hidden sm:inline">
                                                  ({new Date(completionSubObj.completedAt).toLocaleDateString()})
                                                </span>
                                              )}
                                            </div>
                                          ) : (
                                            <span className="text-[var(--text-muted)]/50 text-[10px] font-medium shrink-0">
                                              Pending
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-amber-500 mb-2" />
                <p className="text-sm font-semibold text-[var(--text)]">No Data Available</p>
              </div>
            )}
            
            <div className="border-t border-[var(--border)] pt-4 mt-4 flex justify-end shrink-0">
              <button
                onClick={() => setViewingProgressUser(null)}
                className="rounded-xl border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
