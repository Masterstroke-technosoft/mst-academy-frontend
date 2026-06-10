"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getAllUsers, type AuthUser, type UserRole, roleLabel } from "@/lib/auth";
import { Users, Filter, ChevronLeft, ChevronRight } from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [debugRaw, setDebugRaw] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setMounted(true);

    const fetchUsers = async () => {
      try {
        setLoading(true);
        let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(`${baseURL}/api/admin/users?page=${currentPage}&limit=10`, {
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

          return {
            ...u,
            id: u.id || u._id || `user-${index}-${Math.random()}`,
            email: u.email || "No Email",
            fullName: u.fullName || u.name || "Unknown",
            role: roleStr,
            isActive: u.isActive,
            isStudentVerified: u.isStudentVerified,
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
  }, [currentPage]);

  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerifyStudent = async (studentId: string) => {
    try {
      setVerifyingId(studentId);
      let baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
      const response = await fetch(`${baseURL}/api/auth/verify-student/${studentId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to verify student: ${response.statusText}`);
      }

      const data = await response.json();

      setUsers(prevUsers =>
        prevUsers.map(u =>
          u.id === studentId ? { ...u, isStudentVerified: true } : u
        )
      );

      alert(data.message || "Student verified successfully");
    } catch (error: any) {
      alert(error.message || "An error occurred during verification");
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (filterRole === "all") return users;
    return users.filter(u => u.role === filterRole);
  }, [users, filterRole]);

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
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--text-muted)]" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] px-3 py-2 text-sm font-medium text-[var(--text)] outline-none focus:border-mst-red"
            >
              <option value="all">All Users</option>
              <option value="student">Students</option>
              <option value="validator">Validators</option>
              <option value="non-validator">General Users</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-500 shadow-sm">
            <h3 className="font-bold text-lg mb-2">Error Fetching Users</h3>
            <pre className="whitespace-pre-wrap text-sm mb-4">{errorMsg}</pre>
            <div className="bg-white/50 dark:bg-black/20 p-3 rounded text-sm text-black dark:text-white font-mono break-all">
              <strong>Your Token:</strong> {typeof window !== "undefined" ? (localStorage.getItem("admin-token") || "NULL / MISSING (You need to logout and login again!)") : "loading..."}
            </div>
            <p className="mt-3 text-sm font-semibold">
              If your token is NULL, click your profile, sign out, and sign back in as admin.
            </p>
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
          <div>
            <table className="w-full text-left text-sm text-[var(--text-muted)]">
              <thead className="bg-[var(--bg-muted)] text-xs font-bold uppercase tracking-wider text-[var(--text)]">
                <tr>
                  <th className="px-3 py-3">ID</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3 ">Email</th>
                  <th className="pl-3 pr-1 py-3 w-0 text-center">Role</th>
                  <th className="pl-1 pr-3 py-3 w-0 text-center">Active</th>
                  <th className="px-3 py-3">Verified</th>
                  <th className="px-3 py-3">Created</th>
                  <th className="px-3 py-3">Updated</th>
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
                        <div className="h-4 w-20 rounded bg-[var(--bg-muted)]" />
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
                        {user.role === 'student' && !user.isStudentVerified ? (
                          <button
                            onClick={() => handleVerifyStudent(user.id)}
                            disabled={verifyingId === user.id}
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            {verifyingId === user.id ? 'Verifying...' : 'Verify Student'}
                          </button>
                        ) : (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${user.isStudentVerified ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'}`}>
                            {user.isStudentVerified ? 'Verified' : 'No'}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-3 py-3">
                        {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
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
    </DashboardShell>
  );
}
