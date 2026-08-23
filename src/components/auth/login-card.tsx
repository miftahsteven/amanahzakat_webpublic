"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { GoogleReCaptcha } from "./recaptcha";
import { UserRole } from "@/types/auth.types";
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Receipt,
  BarChart3,
  Repeat,
  HeartHandshake,
  Landmark,
  CheckCircle2,
  GraduationCap,
  HeartPulse,
  Info,
  Clock,
  KeyRound,
  RotateCcw,
} from "lucide-react";

export function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const { login, register, sendRegisterOtp, verifyRegisterOtp, resendRegisterOtp, isAuthenticated, user } = useAuth();

  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [registerRole, setRegisterRole] = React.useState<UserRole>("MUZAKKI");
  const [captchaToken, setCaptchaToken] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  // Form states (Login)
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Register form states (Simple & Standard: Nama, Phone, Email, Password)
  const [regNama, setRegNama] = React.useState("");
  const [regPhone, setRegPhone] = React.useState("");
  const [regEmail, setRegEmail] = React.useState("");
  const [regPassword, setRegPassword] = React.useState("");

  // OTP Verification States
  const [regStep, setRegStep] = React.useState<"form" | "otp">("form");
  const [otpCode, setOtpCode] = React.useState<string>("");
  const [otpTimer, setOtpTimer] = React.useState<number>(180);
  const [canResend, setCanResend] = React.useState<boolean>(false);
  const [resendLoading, setResendLoading] = React.useState<boolean>(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = React.useState<string>("");

  // OTP Countdown Timer
  React.useEffect(() => {
    let interval: any = null;
    if (regStep === "otp" && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [regStep, otpTimer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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
    setOtpSuccessMsg("");

    if (!captchaToken) {
      setErrorMessage("Harap selesaikan verifikasi reCAPTCHA terlebih dahulu.");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "login") {
        const res = await login(email, password, captchaToken);
        if (res.success) {
          const targetUrl = redirectParam || (res.role === "MUSTAHIK" ? "/mustahik" : "/muzakki");
          router.push(targetUrl);
        } else {
          setErrorMessage(res.message || "Gagal masuk. Periksa kembali email dan kata sandi.");
        }
      } else {
        const payload = {
          nama: regNama,
          email: regEmail,
          phone: regPhone,
        };

        // Send OTP to email via Gmail SMTP
        const res = await sendRegisterOtp(payload, regPassword, captchaToken, registerRole);
        if (res.success) {
          setRegStep("otp");
          setOtpTimer(180);
          setCanResend(false);
          setOtpSuccessMsg(
            res.message || `Kode OTP 6 digit telah dikirimkan ke email ${regEmail}.`
          );
        } else {
          setErrorMessage(res.message || "Gagal mengirimkan kode OTP ke email.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses autentikasi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!otpCode || otpCode.length < 5) {
      setErrorMessage("Masukkan 6 digit kode OTP yang telah dikirimkan ke email Anda.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyRegisterOtp(regEmail, otpCode, registerRole);
      if (res.success) {
        const targetUrl =
          redirectParam || (registerRole === "MUSTAHIK" ? "/mustahik" : "/muzakki");
        router.push(targetUrl);
      } else {
        setErrorMessage(res.message || "Kode OTP tidak valid atau telah kedaluwarsa.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat verifikasi OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || resendLoading) return;
    setResendLoading(true);
    setErrorMessage("");
    try {
      const res = await resendRegisterOtp(regEmail);
      if (res.success) {
        setOtpTimer(180);
        setCanResend(false);
        setOtpSuccessMsg(res.message || "Kode OTP baru telah berhasil dikirim ke email Anda.");
      } else {
        setErrorMessage(res.message || "Gagal mengirim ulang kode OTP.");
      }
    } catch (err: any) {
      setErrorMessage("Terjadi kesalahan saat mengirim ulang kode OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  if (isAuthenticated && user) {
    const isMustahik = user.role === "MUSTAHIK";
    return (
      <div className="max-w-md mx-auto p-6 sm:p-8 bg-white border border-[#EAE5DC] rounded-3xl shadow-sm text-center space-y-5 animate-fadeIn font-sans">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EEF3FB] text-[#14509C] flex items-center justify-center font-bold text-xl">
          ✓
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[#1A1613]">Anda Sedang Masuk</h2>
          <p className="text-xs text-[#6D645B] mt-1">
            Masuk sebagai <strong className="text-[#1A1613]">{user.nama}</strong> ({user.email})
          </p>
          <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F5E9] text-[#1B5E20]">
            {isMustahik ? "Akun Mustahik (Penerima Manfaat)" : "Akun Muzakki (Donatur ZIS)"}
          </span>
        </div>
        <div className="pt-2">
          <Link href={isMustahik ? "/mustahik" : "/muzakki"}>
            <button
              type="button"
              className="w-full bg-[#14509C] hover:bg-[#0E3B74] text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isMustahik ? "Buka Portal Mustahik" : "Buka Dashboard Muzakki"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const isRegisterMustahik = mode === "register" && registerRole === "MUSTAHIK";

  return (
    <div className="bg-white border border-[#EAE5DC] rounded-3xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12 max-w-4xl w-full mx-auto font-sans animate-fadeIn">
      {/* LEFT COLUMN: Compact Branded Side Panel (5 Cols) */}
      <div className="md:col-span-5 bg-gradient-to-br from-[#0B1F3D] via-[#0E3B74] to-[#0B1F3D] p-6 sm:p-7 text-white flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#0F9D6E]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-white/10 text-[#A8C8F0] border border-white/15 backdrop-blur-xs">
            <Sparkles className="w-3 h-3 text-[#A8C8F0]" />
            {isRegisterMustahik ? "Portal Mustahik Binaan" : "Portal Muzakki AmanahZakat"}
          </span>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
            {isRegisterMustahik
              ? "Bantuan Tepat Sasaran, Transparan & Berkelanjutan"
              : "Kelola ZIS Anda Lebih Mudah & Transparan"}
          </h2>

          <p className="text-xs text-[#C3D0E0] leading-relaxed">
            {isRegisterMustahik
              ? "Daftar akun cepat, ajukan permohonan bantuan secara online, dan pantau proses verifikasi 5 tahapan secara transparan."
              : "Pantau rekap donasi, auto-recurring ZIS, dan unduh Bukti Potong Pajak (SBMZ) resmi pengurang SPT."}
          </p>
        </div>

        {/* Key Features Bullet List */}
        <div className="space-y-3 py-4 my-auto relative z-10">
          {isRegisterMustahik ? (
            <>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white/10 text-[#A8C8F0] flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Beasiswa &amp; Kebutuhan Medis</p>
                  <p className="text-[11px] text-[#A8C8F0] leading-tight">Bantuan pendidikan dhuafa &amp; biaya pengobatan RS.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white/10 text-[#A8C8F0] flex items-center justify-center shrink-0 mt-0.5">
                  <HeartPulse className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Modal Usaha Produktif</p>
                  <p className="text-[11px] text-[#A8C8F0] leading-tight">Pendampingan kemandirian ekonomi keluarga dhuafa.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white/10 text-[#A8C8F0] flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Tracking 5 Tahapan Terbuka</p>
                  <p className="text-[11px] text-[#A8C8F0] leading-tight">Pantau proses asesmen, dewan zis, hingga pencairan.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white/10 text-[#A8C8F0] flex items-center justify-center shrink-0 mt-0.5">
                  <Receipt className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Bukti Potong SBMZ Resmi</p>
                  <p className="text-[11px] text-[#A8C8F0] leading-tight">Pengurang penghasilan kena pajak SPT Tahunan.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white/10 text-[#A8C8F0] flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Laporan Penyaluran 8 Asnaf</p>
                  <p className="text-[11px] text-[#A8C8F0] leading-tight">Transparansi real-time foto &amp; kabar lapangan.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white/10 text-[#A8C8F0] flex items-center justify-center shrink-0 mt-0.5">
                  <Repeat className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Auto-Recurring ZIS</p>
                  <p className="text-[11px] text-[#A8C8F0] leading-tight">Jadwal sedekah subuh &amp; zakat bulanan otomatis.</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Legal SK Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[10.5px] text-[#A8C8F0] relative z-10">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Izin Resmi Kemenag RI No. 892/2019</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Streamlined Form (7 Cols) */}
      <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-3.5">
        {/* Toggle Mode Tabs */}
        {regStep === "form" && (
          <div className="flex rounded-xl bg-[#F4F6F4] p-1 border border-[#E3E8E4]">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage("");
                setOtpSuccessMsg("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white text-[#14509C] shadow-xs"
                  : "text-[#7D938A] hover:text-[#16211D]"
              }`}
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMessage("");
                setOtpSuccessMsg("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-white text-[#14509C] shadow-xs"
                  : "text-[#7D938A] hover:text-[#16211D]"
              }`}
            >
              Daftar Baru
            </button>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION VIEW */}
        {mode === "register" && regStep === "otp" ? (
          <div className="space-y-4 animate-fadeIn">
            {/* Header Box */}
            <div className="text-center space-y-1">
              <div
                className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center font-bold text-xl mb-1 ${
                  isRegisterMustahik
                    ? "bg-[#E8F5E9] text-[#0F9D6E]"
                    : "bg-[#EEF3FB] text-[#14509C]"
                }`}
              >
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#16211D]">
                Verifikasi Kode OTP Email
              </h3>
              <p className="text-[11.5px] text-[#7D938A]">
                Kode 6 digit telah dikirimkan melalui sistem resmi AmanahZakat ke:
              </p>
            </div>

            {/* Email Box with Edit Action */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F6F4] border border-[#E3E8E4]">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-[#14509C] shrink-0" />
                <span className="text-xs font-bold text-[#16211D] truncate font-mono">
                  {regEmail}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRegStep("form");
                  setErrorMessage("");
                  setOtpSuccessMsg("");
                }}
                className="text-[11px] font-bold text-[#14509C] hover:underline cursor-pointer shrink-0 ml-2"
              >
                Ubah Data
              </button>
            </div>

            {/* Success Notification Alert */}
            {otpSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 leading-relaxed animate-fadeIn flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{otpSuccessMsg}</span>
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed animate-fadeIn flex items-start gap-2">
                <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-3.5">
              <div className="space-y-1.5 text-center">
                <label className="text-xs font-bold text-[#16211D]">
                  Masukkan 6 Digit Kode OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••••"
                  className="w-full text-center text-2xl sm:text-3xl font-mono font-black tracking-[0.4em] py-3 px-4 rounded-xl border border-[#DDE3DF] focus:border-[#14509C] outline-none bg-white text-[#16211D] shadow-inner"
                  autoFocus
                />
              </div>

              {/* Timer & Resend Button */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-[#7D938A] flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-[#7D938A]" />
                  {otpTimer > 0 ? (
                    <span>
                      Berlaku:{" "}
                      <strong className="text-[#16211D] font-mono">
                        {formatTimer(otpTimer)}
                      </strong>
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">Kode kedaluwarsa</span>
                  )}
                </span>
                <button
                  type="button"
                  disabled={!canResend || resendLoading}
                  onClick={handleResendOtp}
                  className="font-bold text-[11px] text-[#14509C] hover:underline disabled:text-[#A0AFA7] disabled:no-underline disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className={`w-3 h-3 ${resendLoading ? "animate-spin" : ""}`} />
                  <span>{resendLoading ? "Mengirim..." : "Kirim Ulang OTP"}</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || otpCode.length < 5}
                className={`w-full text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  isRegisterMustahik
                    ? "bg-[#0F9D6E] hover:bg-[#0B7D57]"
                    : "bg-[#14509C] hover:bg-[#0E3B74]"
                }`}
              >
                {isLoading ? (
                  <span>Memverifikasi Akun...</span>
                ) : (
                  <>
                    <span>
                      Verifikasi &amp; Masuk{" "}
                      {isRegisterMustahik ? "Mustahik" : "Muzakki"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Back to Form Button */}
              <button
                type="button"
                onClick={() => {
                  setRegStep("form");
                  setErrorMessage("");
                  setOtpSuccessMsg("");
                  setOtpCode("");
                }}
                className="w-full text-center text-xs font-bold text-[#7D938A] hover:text-[#16211D] py-1 cursor-pointer"
              >
                &larr; Kembali ke Formulir Pendaftaran
              </button>
            </form>
          </div>
        ) : (
          /* STEP 1: NORMAL FORM (LOGIN OR REGISTRATION FORM) */
          <>
            {/* Registration Role Choice Cards (Muzakki vs Mustahik) */}
            {mode === "register" && (
              <div className="space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="text-[11.5px] font-bold text-[#16211D]">
                    Pilih Kategori Pendaftaran Akun:
                  </label>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    1 Akun = 1 Kategori
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Option 1: Muzakki */}
                  <div
                    onClick={() => {
                      setRegisterRole("MUZAKKI");
                      setErrorMessage("");
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      registerRole === "MUZAKKI"
                        ? "border-[#14509C] bg-[#EEF3FB] ring-1 ring-[#14509C]"
                        : "border-[#DDE3DF] bg-white hover:border-[#B5C2B9]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#14509C] flex items-center gap-1.5">
                        <HeartHandshake className="w-3.5 h-3.5" />
                        Muzakki (Donatur)
                      </span>
                      {registerRole === "MUZAKKI" && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#14509C]" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#556960] mt-1 leading-snug">
                      <strong>Pemberi Zakat/Infak.</strong> Bayar ZIS, pantau riwayat donasi, &amp; dapatkan SBMZ pengurang pajak.
                    </p>
                  </div>

                  {/* Option 2: Mustahik */}
                  <div
                    onClick={() => {
                      setRegisterRole("MUSTAHIK");
                      setErrorMessage("");
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      registerRole === "MUSTAHIK"
                        ? "border-[#0F9D6E] bg-[#E8F5E9] ring-1 ring-[#0F9D6E]"
                        : "border-[#DDE3DF] bg-white hover:border-[#B5C2B9]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#0F9D6E] flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5" />
                        Mustahik (Penerima)
                      </span>
                      {registerRole === "MUSTAHIK" && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9D6E]" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#4A6B56] mt-1 leading-snug">
                      <strong>Penerima Manfaat.</strong> Ajukan permohonan bantuan &amp; pantau alur proses bantuan secara transparan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Heading */}
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#16211D]">
                {mode === "login"
                  ? "Masuk ke Akun Anda"
                  : registerRole === "MUSTAHIK"
                  ? "Pendaftaran Akun Mustahik"
                  : "Pendaftaran Akun Muzakki"}
              </h3>
              <p className="text-[11.5px] text-[#7D938A] mt-0.5">
                {mode === "login"
                  ? "Satu pintu masuk — Sistem otomatis mengarahkan ke Portal Mustahik atau Dashboard Muzakki."
                  : registerRole === "MUSTAHIK"
                  ? "Daftar akun penerima manfaat. Kode OTP verifikasi akan dikirimkan ke email Anda."
                  : "Daftar akun donatur ZIS. Kode OTP verifikasi akan dikirimkan ke email Anda."}
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed animate-fadeIn flex items-start gap-2">
                <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form: Standard & Fast Registration */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {mode === "register" && (
                <>
                  {/* Nama Lengkap */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#16211D] flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#7D938A]" />
                      <span>Nama Lengkap *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regNama}
                      onChange={(e) => setRegNama(e.target.value)}
                      placeholder="cth. Siti Aminah / Ahmad Dahlan"
                      className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs outline-none bg-white text-[#16211D] focus:border-[#14509C] transition-all"
                    />
                  </div>

                  {/* No. WhatsApp / HP */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#16211D] flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#7D938A]" />
                      <span>No. HP / WhatsApp Aktif *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs outline-none bg-white text-[#16211D] focus:border-[#14509C] transition-all"
                    />
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#16211D] flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#7D938A]" />
                  <span>Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={mode === "login" ? email : regEmail}
                  onChange={(e) =>
                    mode === "login" ? setEmail(e.target.value) : setRegEmail(e.target.value)
                  }
                  placeholder="nama@email.com"
                  className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs outline-none bg-white text-[#16211D] focus:border-[#14509C] transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#16211D] flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-[#7D938A]" />
                    <span>Kata Sandi *</span>
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => alert("Silakan hubungi layanan amil untuk reset kata sandi.")}
                      className="text-[10.5px] text-[#14509C] hover:underline font-semibold"
                    >
                      Lupa Sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={mode === "login" ? password : regPassword}
                    onChange={(e) =>
                      mode === "login" ? setPassword(e.target.value) : setRegPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="w-full border border-[#DDE3DF] rounded-xl pl-3 pr-9 py-2 text-xs outline-none bg-white text-[#16211D] focus:border-[#14509C] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-[#7D938A] hover:text-[#16211D] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Compact reCAPTCHA */}
              <div className="py-0.5">
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
                className={`w-full text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  isRegisterMustahik
                    ? "bg-[#0F9D6E] hover:bg-[#0B7D57]"
                    : "bg-[#14509C] hover:bg-[#0E3B74]"
                }`}
              >
                {isLoading ? (
                  <span>Mengirim Kode OTP...</span>
                ) : mode === "login" ? (
                  <>
                    <span>Masuk ke Akun</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : isRegisterMustahik ? (
                  <>
                    <span>Daftar &amp; Kirim OTP Mustahik</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Daftar &amp; Kirim OTP Muzakki</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Educational Note After Registration */}
              {mode === "register" && (
                <p className="text-[10.5px] text-[#7D938A] leading-relaxed text-center pt-1">
                  {registerRole === "MUSTAHIK"
                    ? "Kode OTP 6 digit akan dikirimkan ke email untuk memverifikasi akun Anda sebelum masuk ke Portal Mustahik."
                    : "Kode OTP 6 digit akan dikirimkan ke email untuk memverifikasi akun Anda sebelum masuk ke Dashboard Muzakki."}
                </p>
              )}
            </form>
          </>
        )}

        {/* Security Notice */}
        <div className="pt-1 text-center text-[10px] text-[#7D938A] flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-[#14509C]" />
          <span>Keamanan data dilindungi enkripsi SSL 256-bit &amp; Google reCAPTCHA</span>
        </div>
      </div>
    </div>
  );
}
