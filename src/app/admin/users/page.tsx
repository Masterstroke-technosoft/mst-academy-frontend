"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getAllUsers, type AuthUser, type UserRole, roleLabel } from "@/lib/auth";
import { Users, Filter, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Search } from "lucide-react";

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
        const response = await fetch(`${baseURL}/api/admin/users?page=${currentPage}&limit=10&search=${encodeURIComponent(debouncedSearch)}`, {
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
          if (roleStr === "working-professional" || roleStr === "working professional" || roleStr === "workingprofessional") {
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
            role: roleStr,
            isActive: u.isActive,
            isStudentVerified: u.studentRejectionNote ? false : u.isStudentVerified,
            studentVerificationStatus: u.studentVerificationStatus,
            studentRejectionNote: u.studentRejectionNote,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            registeredAt: u.registeredAt || u.createdAt || new Date().toISOString(),
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
  }, [currentPage, debouncedSearch]);

  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifyUserModal, setVerifyUserModal] = useState<AuthUser | null>(null);
  const [togglingActiveId, setTogglingActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<{ userId: string; currentStatus: boolean; userName: string } | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
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
      result = result.filter(u => u.role === filterRole);
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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const siblingCount = 1;

    pages.push(1);

    const startRange = Math.max(2, currentPage - siblingCount);
    const endRange = Math.min(totalPages - 1, currentPage + siblingCount);

    if (startRange > 2) {
      pages.push("...");
    }

    for (let i = startRange; i <= endRange; i++) {
      pages.push(i);
    }

    if (endRange < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (!mounted) return null;

  return (
    <DashboardShell role="admin" title="User Management">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-mst-red/10 p-2.5">
              <Users size={22} className="text-mst-red" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">Manage Users</h2>
              <p className="text-sm text-[var(--text-muted)]">View and filter all registered users</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search by name, email, ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-64 rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] pl-9 pr-3 py-2 text-sm font-medium text-[var(--text)] outline-none focus:border-mst-red transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[var(--text-muted)]" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-sm font-medium text-[var(--text)] outline-none focus:border-mst-red"
              >
                <option value="all">All Users</option>
                <option value="student">Students</option>
                {/* <option value="validator">Validators</option> */}
                <option value="course_only">Course Only</option>
                <option value="working_professional">Working Professional</option>
                <option value="admin">Admin</option>
              </select>
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

        {debugRaw && users.length === 0 && !errorMsg && !loading && (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-yellow-600 shadow-sm overflow-hidden">
            <h3 className="font-bold text-lg mb-2">Debug Info (API responded, but 0 users extracted)</h3>
            <p className="text-sm mb-2">The API returned the following data, but we couldn't find an array of users inside it:</p>
            <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-60 bg-black/5 p-3 rounded">{debugRaw}</pre>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm text-[var(--text-muted)]">
              <thead className="bg-[var(--bg-muted)] text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                <tr>
                  <th className="px-3 py-3">ID</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3 ">Email</th>
                  <th className="pl-3 pr-1 py-3 w-0 text-center">Role</th>
                  <th className="pl-1 pr-3 py-3 w-0 text-center">Active</th>
                  <th className="px-3 py-3">Verified</th>
                  <th className="px-3 py-3">Created</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="animate-pulse">
                      <td className="px-3 py-4">
                        <div className="h-4 w-16 rounded bg-[var(--bg-muted)]" />
                      </td>
                      <td className="px-3 py-4">
                        <div className="h-4 w-28 rounded bg-[var(--bg-muted)]" />
                      </td>
                      <td className="px-3 py-4">
                        <div className="h-4 w-40 rounded bg-[var(--bg-muted)]" />
                      </td>
                      <td className="pl-3 pr-1 py-4 text-center">
                        <div className="mx-auto h-5 w-16 rounded-full bg-[var(--bg-muted)]" />
                      </td>
                      <td className="pl-1 pr-3 py-4 text-center">
                        <div className="mx-auto h-5 w-12 rounded-full bg-[var(--bg-muted)]" />
                      </td>
                      <td className="px-3 py-4">
                        <div className="h-5 w-16 rounded-full bg-[var(--bg-muted)]" />
                      </td>
                      <td className="px-3 py-4">
                        <div className="h-4 w-20 rounded bg-[var(--bg-muted)]" />
                      </td>
                      <td className="px-3 py-4">
                        <div className="h-5 w-16 rounded bg-[var(--bg-muted)]" />
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-8 text-center text-sm font-medium">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-[var(--bg-muted)]/50">
                      <td className="px-3 py-3 font-mono text-xs">{String(user.id).substring(0, 12)}</td>
                      <td className="px-3 py-3 font-bold text-[var(--text)]">
                        {user.fullName || (user as any).name || "Unknown"}
                      </td>
                      <td className="px-3 py-3 break-all">{user.email}</td>
                      <td className="pl-3 pr-1 py-3 w-0 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${user.role === 'student' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                          user.role === 'validator' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                            user.role === 'admin' ? 'bg-mst-red/10 text-mst-red border border-mst-red/20' :
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
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-2 items-start">
                          {user.isStudentVerified && !user.studentRejectionNote ? (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 whitespace-nowrap">
                              Verified
                            </span>
                          ) : user.studentRejectionNote ? (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 whitespace-nowrap">
                              Rejected
                            </span>
                          ) : (user.role === 'student' || user.role === 'validator') ? (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap">
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-gray-500/10 text-gray-500 border border-gray-500/20 whitespace-nowrap">
                              No
                            </span>
                          )}

                          {((user.role === 'student' /* || user.role === 'validator' */) && (!user.isStudentVerified || !!user.studentRejectionNote)) && (
                            <button
                              onClick={() => {
                                setRejectionNote("");
                                setIsRejecting(false);
                                setVerifyUserModal(user);
                              }}
                              disabled={verifyingId === user.id}
                              className="rounded-lg bg-amber-600 hover:bg-amber-700 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50 shadow-sm whitespace-nowrap"
                            >
                              {verifyingId === user.id ? 'Verifying...' : (
                                user.studentRejectionNote ? (
                                  user.role === 'validator' ? 'Reverify Validator' : 'Reverify Student'
                                ) : (
                                  user.role === 'validator' ? 'Verify Validator' : 'Verify Student'
                                )
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4">
            <div className="text-sm text-[var(--text-muted)]">
              Page <span className="font-semibold text-[var(--text)]">{currentPage}</span> of{" "}
              <span className="font-semibold text-[var(--text)]">{totalPages}</span>
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
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
