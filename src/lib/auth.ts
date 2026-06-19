"use client";

export type UserRole = "student" | "validator" | "non-validator" | "admin" | "COURSE_ONLY" | "ADMIN" | "STUDENT" | "VALIDATOR" | "WORKING_PROFESSIONAL" | "working-professional";

export type BlockchainLevel = "Beginner" | "Intermediate" | "Expert";

export interface AuthUser {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  college?: string;
  collegeOther?: string;
  blockchainLevel?: BlockchainLevel;
  linkedin?: string;
  github?: string;
  walletAddress?: string;
  portfolio?: string;
  profilePhoto?: string;
  registeredAt?: string;
  isActive?: boolean;
  isStudentVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  cvFile?: string;
  cvFileName?: string;
  transactionId?: string;
}

export interface RegisterStudentInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  college: string;
  collegeOther?: string;
  idCardFile: File;
  referralCode?: string;
  transactionId?: string;
}

export interface RegisterValidatorInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  organization?: string;
  idCardFile: File;
  referralCode?: string;
  transactionId?: string;
}

export interface RegisterNonValidatorInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  blockchainLevel?: BlockchainLevel;
  referralCode?: string;
  transactionId?: string;
}

const SESSION_KEY = "mst-academy-session";
const USERS_KEY = "mst-academy-users";

export const DEMO_ADMIN_EMAIL = "abc@gmail.com";
export const DEMO_ADMIN_PASSWORD = "ABC123";

export const COLLEGES = [
  "MIT WPU",
  "DY Patil University",
  "PCCOE",
  "VIIT",
  "Sinhgad College",
  "MIT ADT University",
  "Other",
] as const;

export const BLOCKCHAIN_LEVELS: BlockchainLevel[] = [
  "Beginner",
  "Intermediate",
  "Expert",
];

export const DEMO_FEES = {
  // Fellowship track pricing
  validator: 9999,
  student: 14999,
  normal: 19999,
  // Course-only plan (no fraction / no internship)
  courseOnly: 4999,
} as const;

function loadUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as AuthUser[]) : [];
  } catch {
    return [];
  }
}

export function getAllUsers(): AuthUser[] {
  return loadUsers();
}

function saveUsers(users: AuthUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isAdminCredentials(email: string, password: string): boolean {
  return email === "admin4@gmail.com";
}

export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setSession(user: AuthUser | null) {
  if (user) {
    const { password: _pw, ...safe } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
    document.cookie = `mst-session=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    localStorage.removeItem(SESSION_KEY);
    document.cookie = "mst-session=; path=/; max-age=0";
  }
}

export function isAdminUser(user?: AuthUser | null): boolean {
  const u = user ?? getSession();
  return u?.role === "admin" || u?.role === "ADMIN";
}

export async function login(
  email: string,
  password: string,
  requestedRole?: UserRole
): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  if (isAdminCredentials(email, password)) {
    try {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        return { ok: false, error: "Incorrect admin credentials or server error." };
      }

      const data = await response.json();

      const token = data.accessToken || data.token || (data.data && data.data.token) || (data.data && data.data.accessToken);
      if (token) {
        localStorage.setItem("admin-token", token);
      }

      const admin: AuthUser = {
        id: "admin-live",
        email: email,
        password: password,
        fullName: "Admin",
        role: "admin",
        registeredAt: new Date().toISOString(),
      };
      setSession(admin);
      return { ok: true, user: admin };
    } catch (err) {
      return { ok: false, error: "Failed to connect to admin API." };
    }
  }

  const users = loadUsers();
  const found = users.find((u) => normalizeEmail(u.email) === normalizeEmail(email));
  if (!found) {
    return { ok: false, error: "No account found. Please register first." };
  }

  if (found.password !== password) {
    return { ok: false, error: "Incorrect password." };
  }

  setSession(found);
  return { ok: true, user: found };
}

export function logout() {
  setSession(null);
}

export async function registerStudent(
  input: RegisterStudentInput
): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("mobileNumber", input.phone);
    formData.append("collegeName", input.college);
    formData.append("idCardImage", input.idCardFile);
    if (input.referralCode) {
      formData.append("referralCode", input.referralCode);
    }
    if (input.transactionId) {
      formData.append("transactionId", input.transactionId);
    }

    const response = await fetch(`${baseURL}/api/auth/register-student`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || "Student registration failed" };
    }

    const studentData = data.student || data.user || data;
    const authUser: AuthUser = {
      id: studentData.id || studentData._id || `user-${Date.now()}`,
      email: studentData.email || input.email,
      fullName: studentData.name || input.fullName,
      role: studentData.role || "STUDENT",
      phone: studentData.mobileNumber || input.phone,
      college: studentData.collegeName || input.college,
      registeredAt: new Date().toISOString(),
      transactionId: studentData.transactionId || input.transactionId,
    };

    setSession(authUser);

    if (typeof window !== "undefined") {
      try {
        const { addCoins } = await import("./coins");
        addCoins(25);
      } catch (e) {
        console.error("Failed to add coins", e);
      }
    }

    return { ok: true, user: authUser };
  } catch (err: any) {
    return { ok: false, error: err.message || "Failed to connect to student registration API." };
  }
}

export async function registerValidator(
  input: RegisterValidatorInput
): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
    const formData = new FormData();
    formData.append("name", input.fullName);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("mobileNumber", input.phone);
    formData.append("idCardImage", input.idCardFile);
    if (input.referralCode) {
      formData.append("referralCode", input.referralCode);
    }
    if (input.transactionId) {
      formData.append("transactionId", input.transactionId);
    }

    const response = await fetch(`${baseURL}/api/auth/register-validator`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || "Validator registration failed" };
    }

    const validatorData = data.admin || data.validator || data.user || data;
    const authUser: AuthUser = {
      id: validatorData.id || validatorData._id || `user-${Date.now()}`,
      email: validatorData.email || input.email,
      fullName: validatorData.name || input.fullName,
      role: validatorData.role || "VALIDATOR",
      phone: input.phone,
      registeredAt: new Date().toISOString(),
      transactionId: validatorData.transactionId || input.transactionId,
    };

    setSession(authUser);

    if (typeof window !== "undefined") {
      try {
        const { addCoins } = await import("./coins");
        addCoins(25);
      } catch (e) {
        console.error("Failed to add coins", e);
      }
    }

    return { ok: true, user: authUser };
  } catch (err: any) {
    return { ok: false, error: err.message || "Failed to connect to validator registration API." };
  }
}

export async function registerNonValidator(
  input: RegisterNonValidatorInput
): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
    const response = await fetch(`${baseURL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.fullName,
        email: input.email,
        password: input.password,
        referralCode: input.referralCode,
        transactionId: input.transactionId,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || "Registration failed" };
    }

    const registeredUser = data.user || data;
    const authUser: AuthUser = {
      id: registeredUser.id || registeredUser._id || `user-${Date.now()}`,
      email: registeredUser.email || input.email,
      fullName: registeredUser.name || input.fullName,
      role: registeredUser.role || "COURSE_ONLY",
      phone: input.phone,
      registeredAt: new Date().toISOString(),
      transactionId: registeredUser.transactionId || input.transactionId,
    };

    setSession(authUser);

    if (typeof window !== "undefined") {
      try {
        const { addCoins } = await import("./coins");
        addCoins(25);
      } catch (e) {
        console.error("Failed to add coins", e);
      }
    }

    return { ok: true, user: authUser };
  } catch (err: any) {
    return { ok: false, error: err.message || "Failed to connect to registration API." };
  }
}

export async function registerWorkingProfessional(input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  referralCode?: string;
  transactionId?: string;
}): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
    const response = await fetch(`${baseURL}/api/auth/register-working-professional`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.fullName,
        email: input.email,
        password: input.password,
        referralCode: input.referralCode,
        transactionId: input.transactionId,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || "Registration failed" };
    }

    const registeredUser = data.user || data;
    const authUser: AuthUser = {
      id: registeredUser.id || registeredUser._id || `user-${Date.now()}`,
      email: registeredUser.email || input.email,
      fullName: registeredUser.name || input.fullName,
      role: registeredUser.role || "WORKING_PROFESSIONAL",
      phone: input.phone,
      registeredAt: new Date().toISOString(),
      transactionId: registeredUser.transactionId || input.transactionId,
    };

    setSession(authUser);

    if (typeof window !== "undefined") {
      try {
        const { addCoins } = await import("./coins");
        addCoins(25);
      } catch (e) {
        console.error("Failed to add coins", e);
      }
    }

    return { ok: true, user: authUser };
  } catch (err: any) {
    return { ok: false, error: err.message || "Failed to connect to registration API." };
  }
}

export async function registerAdmin(input: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  referralCode?: string;
}): Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
    const response = await fetch(`${baseURL}/api/auth/register-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.fullName,
        email: input.email,
        password: input.password,
        referralCode: input.referralCode,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || "Admin registration failed" };
    }

    const adminData = data.admin || data.user || data;
    const authUser: AuthUser = {
      id: adminData.id || adminData._id || `user-${Date.now()}`,
      email: adminData.email || input.email,
      fullName: adminData.name || input.fullName,
      role: adminData.role || "ADMIN",
      phone: input.phone,
      registeredAt: new Date().toISOString(),
    };

    setSession(authUser);
    return { ok: true, user: authUser };
  } catch (err: any) {
    return { ok: false, error: err.message || "Failed to connect to admin registration API." };
  }
}

export function roleLabel(role: UserRole | string): string {
  switch (role) {
    case "student":
    case "STUDENT":
      return "Student";
    case "validator":
    case "VALIDATOR":
      return "Validator";
    case "non-validator":
    case "COURSE_ONLY":
      return "Web3 Enthusiast";
    case "working-professional":
    case "WORKING_PROFESSIONAL":
      return "Working Professional";
    case "admin":
    case "ADMIN":
      return "Admin";
    default:
      return String(role).charAt(0).toUpperCase() + String(role).slice(1).toLowerCase();
  }
}

export function dashboardPath(role: UserRole | string | undefined): string {
  if (!role) return "/dashboard/non-validator";
  switch (role) {
    case "student":
    case "STUDENT":
      return "/dashboard/student";
    case "validator":
    case "VALIDATOR":
      return "/dashboard/validator";
    case "non-validator":
    case "COURSE_ONLY":
      return "/dashboard/non-validator";
    case "working-professional":
    case "WORKING_PROFESSIONAL":
      return "/dashboard/working-professional";
    case "admin":
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/dashboard/non-validator";
  }
}

export function canAccessDashboard(role: UserRole | string): boolean {
  const user = getSession();
  if (!user) return false;
  if (user.role === "admin" || user.role === "ADMIN") return true;
  return user.role.toLowerCase() === role.toLowerCase();
}

export function updateUser(id: string, updates: Partial<AuthUser>) {
  const users = loadUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    const session = getSession();
    if (session?.id === id) {
      setSession(users[index]);
    }
  }
}

