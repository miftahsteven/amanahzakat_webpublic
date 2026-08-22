import { Metadata } from "next";
import { LoginCard } from "@/components/auth/login-card";

export const metadata: Metadata = {
  title: "Masuk Akun Muzakki — AmanahZakat Peduli",
  description:
    "Masuk ke portal akun Muzakki untuk mengelola riwayat donasi zakat, auto-recurring ZIS, dan mengunduh Bukti Potong Pajak (SBMZ) resmi.",
};

export default function MasukPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
        <span className="inline-block bg-[#EEF3FB] text-[#0E3B74] rounded-full px-4 py-1.5 text-xs font-bold select-none">
          Portal Muzakki AmanahZakat
        </span>
        <h1 className="text-2xl sm:text-[32px] font-extrabold tracking-[-1.1px] text-[#1A1613] m-0">
          Area Khusus Muzakki
        </h1>
        <p className="text-xs sm:text-[14.5px] text-[#6D645B] leading-relaxed">
          Kelola kewajiban zakat, pantau laporan penyaluran, dan dapatkan Surat Bukti Membayar Zakat (SBMZ) sebagai pengurang pajak SPT Anda.
        </p>
      </div>

      {/* Login Card */}
      <LoginCard />
    </div>
  );
}
