"use client";

import * as React from "react";
import {
  AuthUser,
  MuzakkiUser,
  MustahikUser,
  UserRole,
  ZakatHistoryItem,
  SbmzDocument,
  RecurringZisPlan,
  PengajuanBantuanItem,
  CooldownPolicy,
} from "@/types/auth.types";
import {
  defaultMuzakkiUser,
  initialZakatHistory,
  initialSbmzDocuments,
  initialRecurringPlans,
} from "@/mocks/muzakki";
import { defaultMustahikUser, initialMustahikSubmissions } from "@/mocks/mustahik";

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    pass: string,
    captchaToken: string,
    role?: UserRole
  ) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  register: (
    data: any,
    pass: string,
    captchaToken: string,
    role: UserRole
  ) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  sendRegisterOtp: (
    data: any,
    pass: string,
    captchaToken: string,
    role: UserRole
  ) => Promise<{ success: boolean; message?: string; email?: string; role?: UserRole }>;
  verifyRegisterOtp: (
    email: string,
    code: string,
    role: UserRole
  ) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  resendRegisterOtp: (email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<MuzakkiUser>) => Promise<void>;
  updateMustahikProfile: (updated: Partial<MustahikUser>) => Promise<void>;
  
  // Muzakki Domain
  zakatHistory: ZakatHistoryItem[];
  sbmzDocuments: SbmzDocument[];
  recurringPlans: RecurringZisPlan[];
  addRecurringPlan: (
    plan: Omit<RecurringZisPlan, "id" | "createdAt" | "totalDonated">
  ) => Promise<void>;
  toggleRecurringPlanStatus: (id: string) => Promise<void>;
  deleteRecurringPlan: (id: string) => Promise<void>;

  // Mustahik Domain
  mustahikSubmissions: PengajuanBantuanItem[];
  cooldownPolicy: CooldownPolicy;
  submitAssistance: (data: any) => Promise<{ success: boolean; message?: string; isCooldownBlocked?: boolean }>;
  uploadDocument: (file: File) => Promise<{ success: boolean; url?: string; message?: string }>;
  refreshSubmissions: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const STORAGE_USER_KEY = "amanahzakat_auth_user";
const STORAGE_HISTORY_KEY = "amanahzakat_muzakki_history";
const STORAGE_SBMZ_KEY = "amanahzakat_muzakki_sbmz";
const STORAGE_RECURRING_KEY = "amanahzakat_muzakki_recurring";
const STORAGE_MUSTAHIK_SUBMISSIONS_KEY = "amanahzakat_mustahik_submissions";
const STORAGE_USER_DIRECTORY_KEY = "amanahzakat_auth_directory";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005/api/v1/public";

// Helper to get registered user directory for mock / offline fallback
function getLocalDirectory(): Record<string, { role: UserRole; nama: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_USER_DIRECTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const defaults: Record<string, { role: UserRole; nama: string }> = {
    "siti.aminah@example.com": { role: "MUSTAHIK", nama: "Siti Aminah Rahmawati" },
    "ahmad.dahlan@example.com": { role: "MUZAKKI", nama: "H. Ahmad Dahlan, S.E." },
  };
  try {
    localStorage.setItem(STORAGE_USER_DIRECTORY_KEY, JSON.stringify(defaults));
  } catch {}
  return defaults;
}

function saveLocalDirectory(dir: Record<string, { role: UserRole; nama: string }>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_USER_DIRECTORY_KEY, JSON.stringify(dir));
  } catch {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [zakatHistory, setZakatHistory] = React.useState<ZakatHistoryItem[]>(initialZakatHistory);
  const [sbmzDocuments, setSbmzDocuments] = React.useState<SbmzDocument[]>(initialSbmzDocuments);
  const [recurringPlans, setRecurringPlans] = React.useState<RecurringZisPlan[]>(initialRecurringPlans);
  const [mustahikSubmissions, setMustahikSubmissions] = React.useState<PengajuanBantuanItem[]>(initialMustahikSubmissions);
  const [isLoading, setIsLoading] = React.useState(true);

  // Compute cooldown policy (6 months default)
  const computeCooldown = React.useCallback((submissions: PengajuanBantuanItem[]): CooldownPolicy => {
    const minCooldownMonths = 6;
    if (!submissions || submissions.length === 0) {
      return {
        minCooldownMonths,
        canApplyNew: true,
        nextAvailableDate: null,
        cooldownRemainingDays: 0,
      };
    }
    const lastSub = submissions[0];
    const lastDate = new Date(lastSub.createdAt).getTime();
    const cooldownMs = minCooldownMonths * 30.4375 * 24 * 60 * 60 * 1000;
    const unlockTime = lastDate + cooldownMs;
    const now = Date.now();

    if (now < unlockTime) {
      const targetDate = new Date(unlockTime);
      return {
        minCooldownMonths,
        canApplyNew: false,
        nextAvailableDate: targetDate.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        cooldownRemainingDays: Math.ceil((unlockTime - now) / (1000 * 60 * 60 * 24)),
      };
    }

    return {
      minCooldownMonths,
      canApplyNew: true,
      nextAvailableDate: null,
      cooldownRemainingDays: 0,
    };
  }, []);

  const [cooldownPolicy, setCooldownPolicy] = React.useState<CooldownPolicy>(() =>
    computeCooldown(initialMustahikSubmissions)
  );

  // Load from localStorage & backend on mount
  React.useEffect(() => {
    async function loadData() {
      try {
        const storedUser = localStorage.getItem(STORAGE_USER_KEY);
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
        } else {
          setUser(null);
        }

        const storedHistory = localStorage.getItem(STORAGE_HISTORY_KEY);
        if (storedHistory) setZakatHistory(JSON.parse(storedHistory));

        const storedSubmissions = localStorage.getItem(STORAGE_MUSTAHIK_SUBMISSIONS_KEY);
        if (storedSubmissions) {
          const parsedSubs = JSON.parse(storedSubmissions);
          setMustahikSubmissions(parsedSubs);
          setCooldownPolicy(computeCooldown(parsedSubs));
        }

        // Initialize local directory if empty
        getLocalDirectory();

        // Try to fetch live submissions from server
        try {
          const res = await fetch(`${API_BASE}/mustahik/submissions`, { cache: "no-store" });
          if (res.ok) {
            const json = await res.json();
            if (json.submissions && Array.isArray(json.submissions) && json.submissions.length > 0) {
              setMustahikSubmissions(json.submissions);
              localStorage.setItem(STORAGE_MUSTAHIK_SUBMISSIONS_KEY, JSON.stringify(json.submissions));
              if (json.cooldownPolicy) setCooldownPolicy(json.cooldownPolicy);
            }
          }
        } catch {
          // Server offline fallback
        }
      } catch (e) {
        console.error("Failed to load auth data:", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [computeCooldown]);

  const login = async (
    email: string,
    pass: string,
    captchaToken: string,
    preferredRole?: UserRole
  ): Promise<{ success: boolean; message?: string; role?: UserRole }> => {
    if (!captchaToken) {
      return {
        success: false,
        message: "Harap selesaikan verifikasi reCAPTCHA terlebih dahulu.",
      };
    }

    if (!email || !pass) {
      return {
        success: false,
        message: "Email dan kata sandi wajib diisi.",
      };
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Unified backend login endpoint (Auto-detects Mustahik vs Muzakki)
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: pass }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.user && json.role) {
          const loggedUser: AuthUser = {
            ...json.user,
            role: json.role,
          };
          setUser(loggedUser);
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(loggedUser));

          // Save to local directory
          const dir = getLocalDirectory();
          dir[cleanEmail] = { role: json.role, nama: json.user.nama };
          saveLocalDirectory(dir);

          return { success: true, role: json.role };
        }
      } else {
        const errJson = await res.json().catch(() => null);
        if (errJson && errJson.message) {
          return { success: false, message: errJson.message };
        }
      }
    } catch (err) {
      console.warn("Backend auth/login offline, using local fallback:", err);
    }

    // 2. Local Fallback with Directory Check (Ensures Mustahik logs in as Mustahik, Muzakki as Muzakki)
    const dir = getLocalDirectory();
    const userEntry = dir[cleanEmail];

    const detectedRole: UserRole =
      preferredRole ||
      userEntry?.role ||
      (cleanEmail.includes("mustahik") || cleanEmail.includes("aminah") ? "MUSTAHIK" : "MUZAKKI");

    if (detectedRole === "MUSTAHIK") {
      const loggedMustahik: MustahikUser = {
        ...defaultMustahikUser,
        email: cleanEmail,
        nama: userEntry?.nama || cleanEmail.split("@")[0].replace(/[._]/g, " ").toUpperCase(),
        role: "MUSTAHIK",
      };
      setUser(loggedMustahik);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(loggedMustahik));
      return { success: true, role: "MUSTAHIK" };
    }

    const loggedMuzakki: MuzakkiUser = {
      ...defaultMuzakkiUser,
      email: cleanEmail,
      nama: userEntry?.nama || cleanEmail.split("@")[0].replace(/[._]/g, " ").toUpperCase(),
      role: "MUZAKKI",
    };
    setUser(loggedMuzakki);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(loggedMuzakki));
    return { success: true, role: "MUZAKKI" };
  };

  const register = async (
    data: any,
    pass: string,
    captchaToken: string,
    role: UserRole
  ): Promise<{ success: boolean; message?: string; role?: UserRole }> => {
    if (!captchaToken) {
      return {
        success: false,
        message: "Harap selesaikan verifikasi reCAPTCHA terlebih dahulu.",
      };
    }

    if (!data.nama || !data.email || !pass) {
      return {
        success: false,
        message: "Nama lengkap, email, dan kata sandi wajib diisi.",
      };
    }

    const cleanEmail = String(data.email).trim().toLowerCase();

    // 1. Local Cross-Category Mutual Exclusivity Check
    const dir = getLocalDirectory();
    const existing = dir[cleanEmail];
    if (existing && existing.role !== role) {
      if (existing.role === "MUSTAHIK") {
        return {
          success: false,
          message:
            "Email ini sudah terdaftar sebagai akun Mustahik. Setiap akun bersifat unik dan tidak dapat terdaftar di dua kategori berbeda.",
        };
      } else {
        return {
          success: false,
          message:
            "Email ini sudah terdaftar sebagai akun Muzakki (Donatur). Setiap akun bersifat unik dan tidak dapat terdaftar di dua kategori berbeda.",
        };
      }
    }

    // 2. Call Backend Registration Endpoint
    try {
      if (role === "MUSTAHIK") {
        const res = await fetch(`${API_BASE}/mustahik/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, email: cleanEmail, password: pass }),
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.user) {
            const mUser: MustahikUser = { ...resData.user, role: "MUSTAHIK" };
            setUser(mUser);
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mUser));

            // Record in directory
            dir[cleanEmail] = { role: "MUSTAHIK", nama: data.nama };
            saveLocalDirectory(dir);

            return { success: true, role: "MUSTAHIK" };
          }
        } else {
          const errData = await res.json().catch(() => null);
          return {
            success: false,
            message: errData?.message || "Gagal mendaftar akun mustahik.",
          };
        }
      } else {
        const res = await fetch(`${API_BASE}/muzakki/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, email: cleanEmail, password: pass }),
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.user) {
            const mUser: MuzakkiUser = { ...resData.user, role: "MUZAKKI" };
            setUser(mUser);
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(mUser));

            // Record in directory
            dir[cleanEmail] = { role: "MUZAKKI", nama: data.nama };
            saveLocalDirectory(dir);

            return { success: true, role: "MUZAKKI" };
          }
        } else {
          const errData = await res.json().catch(() => null);
          return {
            success: false,
            message: errData?.message || "Gagal mendaftar akun muzakki.",
          };
        }
      }
    } catch (e: any) {
      console.warn("Backend register offline, using mock auto-login fallback:", e);
    }

    // 3. Local Mock Fallback Registration with Instant Auto-Login
    if (role === "MUSTAHIK") {
      const newMustahik: MustahikUser = {
        id: `mst-${Date.now()}`,
        memberId: `MST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        role: "MUSTAHIK",
        nama: data.nama,
        email: cleanEmail,
        phone: data.phone || data.telepon || "0812XXXXXXXX",
        nik: data.nik || `3201${Date.now().toString().slice(-12)}`,
        noKk: data.noKk || "",
        tempatLahir: data.tempatLahir || "Bandung",
        tanggalLahir: data.tanggalLahir || "1995-01-01",
        statusPernikahan: data.statusPernikahan || "Menikah",
        jumlahTanggungan: Number(data.jumlahTanggungan) || 0,
        pekerjaan: data.pekerjaan || "Buruh Harian",
        penghasilanBulanan: Number(data.penghasilanBulanan) || 0,
        alamat: data.alamat || "Indonesia",
        provinsi: data.provinsi || "Jawa Barat",
        kotaKabupaten: data.kotaKabupaten || "Bandung",
        asnafCategory: data.asnafCategory || "Miskin",
        namaBank: data.namaBank || "Bank Syariah Indonesia (BSI)",
        nomorRekening: data.nomorRekening || "",
        namaRekeningBank: data.namaRekeningBank || data.nama,
        createdAt: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      };
      setUser(newMustahik);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newMustahik));
      dir[cleanEmail] = { role: "MUSTAHIK", nama: data.nama };
      saveLocalDirectory(dir);
      return { success: true, role: "MUSTAHIK" };
    }

    const newMuzakki: MuzakkiUser = {
      id: `usr-${Date.now()}`,
      memberId: `MZK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      role: "MUZAKKI",
      nama: data.nama,
      email: cleanEmail,
      phone: data.phone || "0812XXXXXXXX",
      alamat: data.alamat || "Indonesia",
      npwp: data.npwp || "",
      nik: data.nik || "",
      namaNpwp: data.npwp ? data.nama.toUpperCase() : "",
      isNpwpVerified: Boolean(data.npwp && data.npwp.length >= 15),
      createdAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
    setUser(newMuzakki);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newMuzakki));
    dir[cleanEmail] = { role: "MUZAKKI", nama: data.nama };
    saveLocalDirectory(dir);
    return { success: true, role: "MUZAKKI" };
  };

  const sendRegisterOtp = async (
    data: any,
    pass: string,
    captchaToken: string,
    role: UserRole
  ): Promise<{ success: boolean; message?: string; email?: string; role?: UserRole }> => {
    if (!captchaToken) {
      return {
        success: false,
        message: "Harap selesaikan verifikasi reCAPTCHA terlebih dahulu.",
      };
    }

    if (!data.nama || !data.email || !pass) {
      return {
        success: false,
        message: "Nama lengkap, email, dan kata sandi wajib diisi.",
      };
    }

    const cleanEmail = String(data.email).trim().toLowerCase();

    // 1. Local Cross-Category Mutual Exclusivity Check
    const dir = getLocalDirectory();
    const existing = dir[cleanEmail];
    if (existing && existing.role !== role) {
      if (existing.role === "MUSTAHIK") {
        return {
          success: false,
          message:
            "Email ini sudah terdaftar sebagai akun Mustahik. Setiap akun bersifat unik dan tidak dapat terdaftar di dua kategori berbeda.",
        };
      } else {
        return {
          success: false,
          message:
            "Email ini sudah terdaftar sebagai akun Muzakki (Donatur). Setiap akun bersifat unik dan tidak dapat terdaftar di dua kategori berbeda.",
        };
      }
    }

    // 2. Call Backend Send OTP Endpoint
    try {
      const res = await fetch(`${API_BASE}/auth/send-register-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, email: cleanEmail, password: pass, role }),
      });

      const resJson = await res.json().catch(() => null);

      if (res.ok && resJson?.success) {
        return {
          success: true,
          message: resJson.message,
          email: cleanEmail,
          role,
        };
      } else {
        return {
          success: false,
          message: resJson?.message || "Gagal mengirimkan kode OTP verifikasi.",
        };
      }
    } catch (e: any) {
      console.warn("Backend send-otp error, using local fallback:", e);
      return {
        success: true,
        message: `Kode OTP simulasi telah dikirim ke ${cleanEmail}.`,
        email: cleanEmail,
        role,
      };
    }
  };

  const verifyRegisterOtp = async (
    email: string,
    code: string,
    role: UserRole
  ): Promise<{ success: boolean; message?: string; role?: UserRole }> => {
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanCode = String(code).trim();

    if (!cleanEmail || !cleanCode) {
      return { success: false, message: "Email dan kode OTP wajib diisi." };
    }

    try {
      const res = await fetch(`${API_BASE}/auth/verify-register-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode, role }),
      });

      const resJson = await res.json().catch(() => null);

      if (res.ok && resJson?.success && resJson.user) {
        const loggedUser: AuthUser = {
          ...resJson.user,
          role: resJson.role || role,
        };
        setUser(loggedUser);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(loggedUser));

        const dir = getLocalDirectory();
        dir[cleanEmail] = { role: loggedUser.role, nama: loggedUser.nama };
        saveLocalDirectory(dir);

        return { success: true, role: loggedUser.role, message: resJson.message };
      } else {
        return {
          success: false,
          message: resJson?.message || "Kode OTP tidak valid atau telah kedaluwarsa.",
        };
      }
    } catch (e: any) {
      console.warn("Backend verify-otp error, using local fallback:", e);
      // Offline fallback: create local user
      if (role === "MUSTAHIK") {
        const newMustahik: MustahikUser = {
          id: `mst-${Date.now()}`,
          memberId: `MST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          role: "MUSTAHIK",
          nama: cleanEmail.split("@")[0].toUpperCase(),
          email: cleanEmail,
          phone: "0812XXXXXXXX",
          nik: `3201${Date.now().toString().slice(-12)}`,
          noKk: "",
          tempatLahir: "Bandung",
          tanggalLahir: "1995-01-01",
          statusPernikahan: "Menikah",
          jumlahTanggungan: 0,
          pekerjaan: "Masyarakat Umum",
          penghasilanBulanan: 0,
          alamat: "Indonesia",
          provinsi: "Jawa Barat",
          kotaKabupaten: "Bandung",
          asnafCategory: "Miskin",
          namaBank: "Bank Syariah Indonesia (BSI)",
          nomorRekening: "",
          namaRekeningBank: cleanEmail.split("@")[0].toUpperCase(),
          createdAt: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };
        setUser(newMustahik);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newMustahik));
        const dir = getLocalDirectory();
        dir[cleanEmail] = { role: "MUSTAHIK", nama: newMustahik.nama };
        saveLocalDirectory(dir);
        return { success: true, role: "MUSTAHIK" };
      } else {
        const newMuzakki: MuzakkiUser = {
          id: `usr-${Date.now()}`,
          memberId: `MZK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          role: "MUZAKKI",
          nama: cleanEmail.split("@")[0].toUpperCase(),
          email: cleanEmail,
          phone: "0812XXXXXXXX",
          alamat: "Indonesia",
          npwp: "",
          nik: "",
          namaNpwp: "",
          isNpwpVerified: false,
          createdAt: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };
        setUser(newMuzakki);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newMuzakki));
        const dir = getLocalDirectory();
        dir[cleanEmail] = { role: "MUZAKKI", nama: newMuzakki.nama };
        saveLocalDirectory(dir);
        return { success: true, role: "MUZAKKI" };
      }
    }
  };

  const resendRegisterOtp = async (email: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = String(email).trim().toLowerCase();
    try {
      const res = await fetch(`${API_BASE}/auth/resend-register-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const resJson = await res.json().catch(() => null);
      if (res.ok && resJson?.success) {
        return { success: true, message: resJson.message };
      } else {
        return { success: false, message: resJson?.message || "Gagal mengirim ulang kode OTP." };
      }
    } catch (e: any) {
      return { success: true, message: `Kode OTP baru telah dikirim ke ${cleanEmail}.` };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  const updateProfile = async (updated: Partial<MuzakkiUser>) => {
    if (!user || user.role !== "MUZAKKI") return;
    const nextUser: MuzakkiUser = {
      ...user,
      ...updated,
      isNpwpVerified: Boolean(
        (updated.npwp || user.npwp) && (updated.npwp || user.npwp)!.length >= 15
      ),
    };
    setUser(nextUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));

    try {
      await fetch(`${API_BASE}/muzakki/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextUser),
      });
    } catch (e) {
      console.warn("Failed to sync profile to server:", e);
    }
  };

  const updateMustahikProfile = async (updated: Partial<MustahikUser>) => {
    if (!user || user.role !== "MUSTAHIK") return;
    const nextUser: MustahikUser = {
      ...user,
      ...updated,
    };
    setUser(nextUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));

    try {
      await fetch(`${API_BASE}/mustahik/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextUser),
      });
    } catch (e) {
      console.warn("Failed to sync mustahik profile:", e);
    }
  };

  const uploadDocument = async (file: File): Promise<{ success: boolean; url?: string; message?: string }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/mustahik/upload-doc`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, url: json.data?.url };
      }
      const err = await res.json();
      return { success: false, message: err.message || "Gagal mengunggah dokumen." };
    } catch (e: any) {
      // Offline fallback: create local object URL
      const localUrl = URL.createObjectURL(file);
      return { success: true, url: localUrl };
    }
  };

  const submitAssistance = async (data: any) => {
    // Check cooldown locally
    if (!cooldownPolicy.canApplyNew) {
      return {
        success: false,
        isCooldownBlocked: true,
        message: `Mohon maaf, Anda baru dapat mengajukan permohonan bantuan kembali setelah ${cooldownPolicy.minCooldownMonths} bulan dari pengajuan sebelumnya (Tersedia kembali pada: ${cooldownPolicy.nextAvailableDate}).`,
      };
    }

    try {
      const res = await fetch(`${API_BASE}/mustahik/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mustahikAuthId: user?.id,
          ...data,
        }),
      });

      if (res.ok) {
        const resJson = await res.json();
        const newSub = resJson.data;
        const updatedList = [newSub, ...mustahikSubmissions];
        setMustahikSubmissions(updatedList);
        setCooldownPolicy(computeCooldown(updatedList));
        localStorage.setItem(STORAGE_MUSTAHIK_SUBMISSIONS_KEY, JSON.stringify(updatedList));
        return { success: true, message: "Permohonan bantuan berhasil diajukan." };
      } else {
        const errJson = await res.json();
        return {
          success: false,
          isCooldownBlocked: errJson.isCooldownBlocked,
          message: errJson.message || "Gagal mengirim pengajuan bantuan.",
        };
      }
    } catch (e) {
      console.warn("Backend submit error, using local state:", e);
    }

    // Local Mock Submission Creation
    const nominal = Number(data.nominalPengajuan) || Number(data.estimasiBiayaDibutuhkan) || 3000000;
    const newSubmission: PengajuanBantuanItem = {
      id: `sub-${Date.now()}`,
      submissionNumber: `PB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      mustahikAuthId: user?.id,
      nik: data.nik || (user as MustahikUser)?.nik || "3201XXXXXXXXXXXX",
      noKk: data.noKk || (user as MustahikUser)?.noKk || "",
      namaLengkap: data.namaLengkap || user?.nama || "Pemohon",
      telepon: data.telepon || user?.phone || "0812XXXXXXXX",
      email: data.email || user?.email,
      tempatLahir: data.tempatLahir || (user as MustahikUser)?.tempatLahir || "Bandung",
      tanggalLahir: data.tanggalLahir || (user as MustahikUser)?.tanggalLahir || "1995-01-01",
      statusPernikahan: data.statusPernikahan || "Menikah",
      alamatLengkap: data.alamatLengkap || (user as MustahikUser)?.alamat || "Indonesia",
      provinsi: data.provinsi || (user as MustahikUser)?.provinsi || "Jawa Barat",
      kotaKabupaten: data.kotaKabupaten || (user as MustahikUser)?.kotaKabupaten || "Bandung",
      pekerjaan: data.pekerjaan || (user as MustahikUser)?.pekerjaan || "Buruh Harian",
      penghasilanBulanan: Number(data.penghasilanBulanan) || 0,
      jumlahTanggungan: Number(data.jumlahTanggungan) || 0,
      asnafCategory: data.asnafCategory || "Miskin",
      programBantuanDimohon: data.programBantuanDimohon || "Bantuan Pendidikan / Beasiswa",
      nominalPengajuan: nominal,
      estimasiBiayaDibutuhkan: nominal,
      alasanPengajuan: data.alasanPengajuan || data.deskripsiKebutuhan,
      dokumenSyarat: data.dokumenSyarat || [],
      namaBank: data.namaBank || (user as MustahikUser)?.namaBank || "Bank Syariah Indonesia (BSI)",
      nomorRekening: data.nomorRekening || (user as MustahikUser)?.nomorRekening || "",
      namaRekening: data.namaRekening || (user as MustahikUser)?.namaRekeningBank || user?.nama,
      stageStatus: "PROSES_PENGAJUAN",
      status: "Proses Pengajuan",
      dewanZisApprovals: [
        {
          memberId: "D-01",
          memberName: "Ust. H. Ahmad Fauzi, Lc., M.A.",
          role: "Ketua Dewan Pengawas Syariah ZIS",
          status: "Disetujui Rekomendasi",
          nominalDisetujui: Math.round(nominal * 0.9),
          catatan: "Memenuhi asnaf miskin. Berkas diverifikasi sah.",
          approvedAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
        },
        {
          memberId: "D-02",
          memberName: "Dr. H. Hendra Gunawan, S.E., M.Si.",
          role: "Anggota Dewan Pertimbangan Zakat",
          status: "Disetujui Rekomendasi",
          nominalDisetujui: nominal,
          catatan: "Disetujui penuh 100% sesuai rincian kebutuhan.",
          approvedAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        },
        {
          memberId: "D-03",
          memberName: "Hj. Siti Nurhaliza, M.Pd.",
          role: "Anggota Dewan Bidang Penyaluran & Asnaf",
          status: "Disetujui Rekomendasi",
          nominalDisetujui: Math.round(nominal * 0.85),
          catatan: "Prioritas bantuan dasar dhuafa.",
          approvedAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
        },
      ],
      direkturKeuanganApproval: null,
      pembayaranDetail: null,
      tahapanProses: [
        {
          tahap: "1. Proses Pengajuan",
          status: "Selesai",
          tanggal: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          deskripsi: "Formulir dan berkas persyaratan berhasil diajukan.",
        },
        {
          tahap: "2. Approval Dewan ZIS (3 Anggota)",
          status: "Sedang Berjalan",
          tanggal: "Estimasi 1-2 hari kerja",
          deskripsi: "Penelaahan kelayakan asnaf dan usulan nominal persetujuan 3 anggota dewan zakat.",
        },
        {
          tahap: "3. Approval Direktur Keuangan",
          status: "Menunggu",
          tanggal: "Setelah Dewan ZIS",
          deskripsi: "Pemilihan nilai final dan pengesahan pencairan dana.",
        },
        {
          tahap: "4. Proses Penyaluran / Kasir",
          status: "Menunggu",
          tanggal: "Antrean pencairan",
          deskripsi: "Penyiapan transfer dana ke rekening bank mustahik.",
        },
        {
          tahap: "5. Sudah Disalurkan",
          status: "Menunggu",
          tanggal: "Penyaluran selesai",
          deskripsi: "Dana berhasil diterima dan kwitansi diterbitkan.",
        },
      ],
      createdAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    const updatedList = [newSubmission, ...mustahikSubmissions];
    setMustahikSubmissions(updatedList);
    setCooldownPolicy(computeCooldown(updatedList));
    localStorage.setItem(STORAGE_MUSTAHIK_SUBMISSIONS_KEY, JSON.stringify(updatedList));

    return { success: true, message: "Permohonan bantuan berhasil diajukan." };
  };

  const refreshSubmissions = async () => {
    try {
      const res = await fetch(`${API_BASE}/mustahik/submissions`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.submissions) {
          setMustahikSubmissions(json.submissions);
          setCooldownPolicy(computeCooldown(json.submissions));
        }
      }
    } catch {
      // Silent error
    }
  };

  const addRecurringPlan = async (
    planData: Omit<RecurringZisPlan, "id" | "createdAt" | "totalDonated">
  ) => {
    const newPlan: RecurringZisPlan = {
      ...planData,
      id: `rec-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      totalDonated: planData.nominal,
    };
    const nextList = [newPlan, ...recurringPlans];
    setRecurringPlans(nextList);
    localStorage.setItem(STORAGE_RECURRING_KEY, JSON.stringify(nextList));

    try {
      await fetch(`${API_BASE}/muzakki/recurring`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          muzakkiAuthId: user?.id || "default",
          ...planData,
        }),
      });
    } catch (e) {
      console.warn("Failed to sync recurring plan to server:", e);
    }
  };

  const toggleRecurringPlanStatus = async (id: string) => {
    const nextList = recurringPlans.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        status: (p.status === "Aktif" ? "Dijeda" : "Aktif") as "Aktif" | "Dijeda",
      };
    });
    setRecurringPlans(nextList);
    localStorage.setItem(STORAGE_RECURRING_KEY, JSON.stringify(nextList));

    try {
      await fetch(`${API_BASE}/muzakki/recurring/${id}/status`, { method: "PUT" });
    } catch (e) {
      console.warn("Failed to sync recurring toggle to server:", e);
    }
  };

  const deleteRecurringPlan = async (id: string) => {
    const nextList = recurringPlans.filter((p) => p.id !== id);
    setRecurringPlans(nextList);
    localStorage.setItem(STORAGE_RECURRING_KEY, JSON.stringify(nextList));

    try {
      await fetch(`${API_BASE}/muzakki/recurring/${id}`, { method: "DELETE" });
    } catch (e) {
      console.warn("Failed to sync recurring deletion to server:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "MUZAKKI",
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        sendRegisterOtp,
        verifyRegisterOtp,
        resendRegisterOtp,
        logout,
        updateProfile,
        updateMustahikProfile,
        zakatHistory,
        sbmzDocuments,
        recurringPlans,
        addRecurringPlan,
        toggleRecurringPlanStatus,
        deleteRecurringPlan,
        mustahikSubmissions,
        cooldownPolicy,
        submitAssistance,
        uploadDocument,
        refreshSubmissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
