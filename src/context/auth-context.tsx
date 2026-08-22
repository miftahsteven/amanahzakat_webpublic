"use client";

import * as React from "react";
import {
  MuzakkiUser,
  ZakatHistoryItem,
  SbmzDocument,
  RecurringZisPlan,
} from "@/types/auth.types";
import {
  defaultMuzakkiUser,
  initialZakatHistory,
  initialSbmzDocuments,
  initialRecurringPlans,
} from "@/mocks/muzakki";

interface AuthContextType {
  user: MuzakkiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    pass: string,
    captchaToken: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    data: {
      nama: string;
      email: string;
      phone: string;
      npwp?: string;
      nik?: string;
      alamat?: string;
    },
    pass: string,
    captchaToken: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<MuzakkiUser>) => Promise<void>;
  zakatHistory: ZakatHistoryItem[];
  sbmzDocuments: SbmzDocument[];
  recurringPlans: RecurringZisPlan[];
  addRecurringPlan: (
    plan: Omit<RecurringZisPlan, "id" | "createdAt" | "totalDonated">
  ) => Promise<void>;
  toggleRecurringPlanStatus: (id: string) => Promise<void>;
  deleteRecurringPlan: (id: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const STORAGE_USER_KEY = "amanahzakat_muzakki_user";
const STORAGE_HISTORY_KEY = "amanahzakat_muzakki_history";
const STORAGE_SBMZ_KEY = "amanahzakat_muzakki_sbmz";
const STORAGE_RECURRING_KEY = "amanahzakat_muzakki_recurring";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005/api/v1/public";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<MuzakkiUser | null>(null);
  const [zakatHistory, setZakatHistory] = React.useState<ZakatHistoryItem[]>(initialZakatHistory);
  const [sbmzDocuments, setSbmzDocuments] = React.useState<SbmzDocument[]>(initialSbmzDocuments);
  const [recurringPlans, setRecurringPlans] = React.useState<RecurringZisPlan[]>(initialRecurringPlans);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load from localStorage & backend on mount
  React.useEffect(() => {
    async function loadData() {
      try {
        const storedUser = localStorage.getItem(STORAGE_USER_KEY);
        let currentUser = defaultMuzakkiUser;
        if (storedUser) {
          currentUser = JSON.parse(storedUser);
          setUser(currentUser);
        } else {
          setUser(defaultMuzakkiUser);
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(defaultMuzakkiUser));
        }

        const storedHistory = localStorage.getItem(STORAGE_HISTORY_KEY);
        if (storedHistory) {
          setZakatHistory(JSON.parse(storedHistory));
        }

        // Try to fetch live SBMZ docs from backend if in API mode
        try {
          const sbmzRes = await fetch(`${API_BASE}/muzakki/sbmz`, { cache: "no-store" });
          if (sbmzRes.ok) {
            const liveSbmz = await sbmzRes.json();
            if (Array.isArray(liveSbmz) && liveSbmz.length > 0) {
              setSbmzDocuments(liveSbmz);
              localStorage.setItem(STORAGE_SBMZ_KEY, JSON.stringify(liveSbmz));
            }
          }
        } catch {
          const storedSbmz = localStorage.getItem(STORAGE_SBMZ_KEY);
          if (storedSbmz) setSbmzDocuments(JSON.parse(storedSbmz));
        }

        // Try to fetch live recurring plans
        try {
          const recRes = await fetch(`${API_BASE}/muzakki/recurring`, { cache: "no-store" });
          if (recRes.ok) {
            const liveRec = await recRes.json();
            if (Array.isArray(liveRec) && liveRec.length > 0) {
              setRecurringPlans(liveRec);
              localStorage.setItem(STORAGE_RECURRING_KEY, JSON.stringify(liveRec));
            }
          }
        } catch {
          const storedRecurring = localStorage.getItem(STORAGE_RECURRING_KEY);
          if (storedRecurring) setRecurringPlans(JSON.parse(storedRecurring));
        }
      } catch (e) {
        console.error("Failed to load auth data:", e);
        setUser(defaultMuzakkiUser);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const login = async (
    email: string,
    pass: string,
    captchaToken: string
  ): Promise<{ success: boolean; message?: string }> => {
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

    try {
      // 1. Verify captcha with local API route
      await fetch("/api/auth/verify-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaToken }),
      }).catch((e) => console.warn("Captcha verification call skipped:", e));

      // 2. Call backend login endpoint
      const res = await fetch(`${API_BASE}/muzakki/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
          return { success: true };
        }
      }
    } catch (err) {
      console.warn("Backend auth failed, using fallback:", err);
    }

    // Fallback authentication
    const loggedUser: MuzakkiUser = {
      ...defaultMuzakkiUser,
      email: email,
      nama:
        email === defaultMuzakkiUser.email
          ? defaultMuzakkiUser.nama
          : email.split("@")[0].replace(/[._]/g, " ").toUpperCase(),
    };

    setUser(loggedUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(loggedUser));

    return { success: true };
  };

  const register = async (
    data: {
      nama: string;
      email: string;
      phone: string;
      npwp?: string;
      nik?: string;
      alamat?: string;
    },
    pass: string,
    captchaToken: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!captchaToken) {
      return {
        success: false,
        message: "Harap selesaikan verifikasi reCAPTCHA terlebih dahulu.",
      };
    }

    if (!data.nama || !data.email || !pass) {
      return {
        success: false,
        message: "Nama, email, dan kata sandi wajib diisi.",
      };
    }

    try {
      const res = await fetch(`${API_BASE}/muzakki/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, password: pass }),
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.user) {
          setUser(resData.user);
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(resData.user));
          return { success: true };
        }
      }
    } catch (e) {
      console.warn("Backend register fallback:", e);
    }

    const newUser: MuzakkiUser = {
      id: `usr-${Date.now()}`,
      memberId: `MZK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      nama: data.nama,
      email: data.email,
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

    setUser(newUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  const updateProfile = async (updated: Partial<MuzakkiUser>) => {
    if (!user) return;
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
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        zakatHistory,
        sbmzDocuments,
        recurringPlans,
        addRecurringPlan,
        toggleRecurringPlanStatus,
        deleteRecurringPlan,
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
