"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { GoogleReCaptcha } from "./recaptcha";
import { Lock, Mail, User, Phone, FileText, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/muzakki";

  const { login, register, isAuthenticated, user } = useAuth();

  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [captchaToken, setCaptchaToken] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Form states
  const [email, setEmail] = React.useState("ahmad.dahlan@example.com");
  const [password, setPassword] = React.useState("password123");

  // Register form states
  const [regNama, setRegNama] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  const [regPhone, setRegPhone] = React.useState("");
  const [regPassword, setRegPassword] = React.useState("");
  const [regNpwp, setRegNpwp] = React.useState("");

  const handleCaptchaVerify = React.useCallback((token: string) => {
    setCaptchaToken(token);
    setErrorMessage("");
  }, []);

  const handleCaptchaExpire = React.useCallback(() => {
    setCaptchaToken("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!captchaToken) {
      setErrorMessage("Harap selesaikan verifikasi reCAPTCHA terlebih dahulu.");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "login") {
        const res = await login(email, password, captchaToken);
        if (res.success) {
          router.push(redirectUrl);
        } else {
          setErrorMessage(res.message || "Gagal masuk. Periksa kembali email dan kata sandi.");
        }
      } else {
        const res = await register(
          {
            nama: regNama,
            email: regEmail,
            phone: regPhone,
            npwp: regNpwp,
          },
          regPassword,
          captchaToken
        );
        if (res.success) {
          router.push(redirectUrl);
        } else {
          setErrorMessage(res.message || "Gagal mendaftar. Silakan coba kembali.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses autentikasi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword("password123");
    setCaptchaToken("mock-quick-login-token");
  };

  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto p-6 sm:p-8 bg-white border border-[#EAE5DC] rounded-[24px] shadow-sm text-center space-y-5 animate-fadeIn">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EEF3FB] text-[#14509C] flex items-center justify-center font-bold text-xl">
          ✓
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[#1A1613]">Anda Sedang Masuk</h2>
          <p className="text-sm text-[#6D645B] mt-1">
            Masuk sebagai <strong className="text-[#1A1613]">{user.nama}</strong> ({user.email})
          </p>
        </div>
        <div className="pt-2">
          <Link href="/muzakki">
            <button
              type="button"
              className="w-full bg-[#14509C] hover:bg-[#0E3B74] text-white font-bold text-sm py-3.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Buka Dashboard Muzakki</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-[#EAE5DC] rounded-[24px] shadow-sm overflow-hidden flex flex-col animate-fadeIn">
      {/* Header Tabs */}
      <div className="flex border-b border-[#F0ECE4] bg-[#FAF8F4]">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrorMessage("");
          }}
          className={`flex-1 py-3.5 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors cursor-pointer ${
            mode === "login"
              ? "border-[#14509C] text-[#14509C] bg-white"
              : "border-transparent text-[#8B8177] hover:text-[#1A1613]"
          }`}
        >
          Masuk Akun Muzakki
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setErrorMessage("");
          }}
          className={`flex-1 py-3.5 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors cursor-pointer ${
            mode === "register"
              ? "border-[#14509C] text-[#14509C] bg-white"
              : "border-transparent text-[#8B8177] hover:text-[#1A1613]"
          }`}
        >
          Daftar Baru
        </button>
      </div>

      {/* Card Content */}
      <div className="p-6 sm:p-7 space-y-5">
        <div className="space-y-1 text-center">
          <h2 className="text-xl sm:text-[22px] font-extrabold text-[#1A1613] tracking-tight m-0">
            {mode === "login" ? "Selamat Datang Kembali" : "Buat Akun Muzakki"}
          </h2>
          <p className="text-xs sm:text-[13px] text-[#6D645B]">
            {mode === "login"
              ? "Akses riwayat zakat, auto-recurring ZIS, dan bukti potong SBMZ resmi."
              : "Lengkapi data untuk kemudahan kelola zakat dan penerbitan SBMZ pengurang pajak."}
          </p>
        </div>

        {/* Quick Demo Preset Button */}
        {mode === "login" && (
          <div className="p-3 rounded-xl bg-[#EEF3FB] border border-[#BCD3EE] text-xs text-[#0E3B74] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14509C]" />
              <span className="font-semibold">Akun Demo Terdaftar</span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickLogin("ahmad.dahlan@example.com")}
              className="bg-[#14509C] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg hover:bg-[#0E3B74] transition-colors cursor-pointer"
            >
              Isi Otomatis
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed animate-fadeIn">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A1613] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#8B8177]" />
                  <span>Nama Lengkap (sesuai KTP / NPWP)</span>
                </label>
                <input
                  type="text"
                  required
                  value={regNama}
                  onChange={(e) => setRegNama(e.target.value)}
                  placeholder="cth. H. Ahmad Dahlan, S.E."
                  className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C] transition-colors"
                />
              </div>

              {/* No. WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A1613] flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#8B8177]" />
                  <span>No. WhatsApp / Ponsel</span>
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C] transition-colors"
                />
              </div>

              {/* NPWP (Opsional) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1A1613] flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-[#8B8177]" />
                    <span>NPWP 16 Digit (Opsional)</span>
                  </label>
                  <span className="text-[10px] text-[#8B8177]">Pengurang Pajak SPT</span>
                </div>
                <input
                  type="text"
                  value={regNpwp}
                  onChange={(e) => setRegNpwp(e.target.value)}
                  placeholder="01.234.567.8-012.000"
                  className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C] transition-colors font-mono"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1A1613] flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-[#8B8177]" />
              <span>Email Muzakki</span>
            </label>
            <input
              type="email"
              required
              value={mode === "login" ? email : regEmail}
              onChange={(e) =>
                mode === "login" ? setEmail(e.target.value) : setRegEmail(e.target.value)
              }
              placeholder="nama@email.com"
              className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C] transition-colors"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1A1613] flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#8B8177]" />
              <span>Kata Sandi</span>
            </label>
            <input
              type="password"
              required
              value={mode === "login" ? password : regPassword}
              onChange={(e) =>
                mode === "login" ? setPassword(e.target.value) : setRegPassword(e.target.value)
              }
              placeholder="••••••••"
              className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C] transition-colors"
            />
          </div>

          {/* Google reCAPTCHA Widget */}
          <div className="pt-1">
            <GoogleReCaptcha
              onVerify={handleCaptchaVerify}
              onExpire={handleCaptchaExpire}
              siteKey="6Lfqx5ItAAAAAGPHM0jkvN3xwiCc_MW0pJlSG4tn"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !captchaToken}
            className="w-full bg-[#14509C] hover:bg-[#0E3B74] active:scale-[0.98] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Memproses...</span>
            ) : mode === "login" ? (
              <>
                <span>Masuk ke Area Muzakki</span>
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>Daftar Akun Muzakki</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Security & Legal Footer */}
        <div className="pt-2 text-center text-[11px] text-[#8B8177] flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#14509C]" />
          <span>Keamanan dilindungi enkripsi SSL 256-bit &amp; Google reCAPTCHA</span>
        </div>
      </div>
    </div>
  );
}
