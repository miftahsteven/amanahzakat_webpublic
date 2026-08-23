import { Metadata } from "next";
import { LoginCard } from "@/components/auth/login-card";

export const metadata: Metadata = {
  title: "Masuk Akun Muzakki — AmanahZakat Peduli",
  description:
    "Masuk ke portal akun Muzakki untuk mengelola riwayat donasi zakat, auto-recurring ZIS, dan mengunduh Bukti Potong Pajak (SBMZ) resmi.",
};

export default function MasukPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <LoginCard />
    </div>
  );
}
