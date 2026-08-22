import { Metadata } from "next";
import { MuzakkiDashboard } from "@/components/muzakki/muzakki-dashboard";

export const metadata: Metadata = {
  title: "Dashboard Muzakki — Kelola Zakat & Bukti Potong SBMZ",
  description:
    "Portal akun Muzakki: kelola data NPWP, riwayat pembayaran zakat, auto-recurring ZIS, dan unduh bukti setor zakat resmi pengurang pajak.",
};

export default function MuzakkiPage() {
  return (
    <div className="min-h-[80vh] bg-[#FAF8F4]/50 pb-16">
      <MuzakkiDashboard />
    </div>
  );
}
