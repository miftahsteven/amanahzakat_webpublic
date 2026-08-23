"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { SbmzDocument, ZakatHistoryItem, RecurringZisPlan, ZisCategory } from "@/types/auth.types";
import { SbmzModal } from "./sbmz-modal";
import { RecurringModal } from "./recurring-modal";
import { formatIDR, formatCompactIDR } from "@/lib/currency";
import {
  User,
  FileText,
  History,
  Repeat,
  ShieldCheck,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Play,
  Pause,
  Trash2,
  ExternalLink,
  LogOut,
  ChevronRight,
  Edit3,
  Calendar,
  CreditCard,
  Building,
} from "lucide-react";

export function MuzakkiDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "ringkasan";

  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    updateProfile,
    zakatHistory,
    sbmzDocuments,
    recurringPlans,
    addRecurringPlan,
    toggleRecurringPlanStatus,
    deleteRecurringPlan,
  } = useAuth();

  const [activeTab, setActiveTab] = React.useState<string>(initialTab);
  const [selectedSbmz, setSelectedSbmz] = React.useState<SbmzDocument | null>(null);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = React.useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = React.useState<string>("");

  // Profile Form States
  const [nama, setNama] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [alamat, setAlamat] = React.useState("");
  const [pekerjaan, setPekerjaan] = React.useState("");
  const [npwp, setNpwp] = React.useState("");
  const [nik, setNik] = React.useState("");
  const [namaNpwp, setNamaNpwp] = React.useState("");
  const [alamatKpp, setAlamatKpp] = React.useState("");

  // History Filter
  const [historyYear, setHistoryYear] = React.useState<string>("Semua");
  const [historyCategory, setHistoryCategory] = React.useState<string>("Semua");

  // Sync profile state when user loads
  React.useEffect(() => {
    if (user) {
      const mzk = user as any;
      setNama(mzk.nama || "");
      setEmail(mzk.email || "");
      setPhone(mzk.phone || "");
      setAlamat(mzk.alamat || "");
      setPekerjaan(mzk.pekerjaan || "");
      setNpwp(mzk.npwp || "");
      setNik(mzk.nik || "");
      setNamaNpwp(mzk.namaNpwp || mzk.nama || "");
      setAlamatKpp(mzk.alamatKpp || "KPP Pratama Terdaftar");
    }
  }, [user]);

  React.useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="max-w-[1000px] mx-auto py-20 text-center text-[#8B8177]">
        Memuat data akun muzakki...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-[#EAE5DC] rounded-[24px] shadow-sm text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-[#C8382F] mx-auto" />
        <h2 className="text-xl font-extrabold text-[#1A1613]">Akses Terbatas</h2>
        <p className="text-xs text-[#6D645B]">
          Silakan masuk ke akun Muzakki Anda terlebih dahulu untuk melihat dashboard dan bukti setor.
        </p>
        <Link href="/masuk?redirect=/muzakki">
          <button
            type="button"
            className="w-full bg-[#14509C] hover:bg-[#0E3B74] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Masuk Akun Sekarang
          </button>
        </Link>
      </div>
    );
  }

  if (user.role === "MUSTAHIK") {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-[#EAE5DC] rounded-[24px] shadow-sm text-center space-y-4 font-sans animate-fadeIn">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E8F5E9] text-[#0F9D6E] flex items-center justify-center font-bold text-xl">
          <Building className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-[#1A1613]">Portal Khusus Muzakki</h2>
        <p className="text-xs text-[#6D645B] leading-relaxed">
          Anda saat ini masuk sebagai <strong className="text-[#1A1613]">{user.nama}</strong> (Akun Mustahik / Penerima Manfaat). Sesuai kebijakan, akun Mustahik dan Muzakki bersifat terpisah &amp; unik.
        </p>
        <div className="space-y-2 pt-2">
          <Link href="/mustahik">
            <button
              type="button"
              className="w-full bg-[#0F9D6E] hover:bg-[#0B7D57] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Buka Portal Mustahik</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/masuk");
            }}
            className="w-full bg-[#FAF8F4] hover:bg-[#EAE5DC] text-[#5E564E] font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Keluar &amp; Ganti Akun
          </button>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalDisalurkan = zakatHistory.reduce((acc, curr) => acc + curr.nominal, 0);
  const totalZakatPajak = zakatHistory
    .filter((h) => h.category.startsWith("Zakat"))
    .reduce((acc, curr) => acc + curr.nominal, 0);
  const activeRecurringCount = recurringPlans.filter((p) => p.status === "Aktif").length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      nama,
      email,
      phone,
      alamat,
      pekerjaan,
      npwp,
      nik,
      namaNpwp,
      alamatKpp,
    });
    setSaveSuccessMsg("Profil dan informasi NPWP berhasil diperbarui!");
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun Muzakki?")) {
      logout();
      router.push("/");
    }
  };

  // Filtered History
  const filteredHistory = zakatHistory.filter((item) => {
    if (historyYear !== "Semua" && !item.paymentDate.includes(historyYear)) return false;
    if (historyCategory !== "Semua" && item.category !== historyCategory) return false;
    return true;
  });

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-fadeIn">
      {/* Top Profile Banner */}
      <div className="bg-[#0B1F3D] text-white rounded-[24px] p-6 sm:p-8 shadow-md border border-[#162E52] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#14509C] border-2 border-[#A8C8F0]/40 flex items-center justify-center text-xl sm:text-2xl font-extrabold text-white shrink-0 shadow-sm">
            {user.nama
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#14509C] text-[#A8C8F0] border border-[#1A3F70]">
                {user.memberId}
              </span>
              {(user as any).isNpwpVerified ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>NPWP Terverifikasi</span>
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-400" />
                  <span>Lengkapi NPWP</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight m-0">
              Assalamu’alaikum, {user.nama}
            </h1>
            <p className="text-xs sm:text-[13px] text-[#A8C8F0]">
              {user.email} · Anggota sejak {user.createdAt}
            </p>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 self-end md:self-center">
          <Link href="/hitung-zakat">
            <button
              type="button"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 sm:px-4 py-2.5 rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              Hitung Zakat
            </button>
          </Link>
          <Link href="/donasi">
            <button
              type="button"
              className="bg-[#14509C] hover:bg-[#0E3B74] text-white text-xs font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Tunaikan ZIS
            </button>
          </Link>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE5DC] shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-[#8B8177] uppercase tracking-wider">
            Total ZIS Disalurkan
          </span>
          <div className="text-lg sm:text-xl font-extrabold text-[#1A1613] font-mono">
            {formatIDR(totalDisalurkan)}
          </div>
          <span className="text-[10.5px] text-[#2E7D4F] font-semibold block">
            {zakatHistory.length} Kali Transaksi Sah
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE5DC] shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-[#8B8177] uppercase tracking-wider">
            Bukti Potong SBMZ
          </span>
          <div className="text-lg sm:text-xl font-extrabold text-[#0E3B74]">
            {sbmzDocuments.length} Dokumen
          </div>
          <span className="text-[10.5px] text-[#14509C] font-semibold block">
            Siap Unduh untuk SPT
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE5DC] shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-[#8B8177] uppercase tracking-wider">
            Auto Recurring ZIS
          </span>
          <div className="text-lg sm:text-xl font-extrabold text-[#1A1613]">
            {activeRecurringCount} Program
          </div>
          <span className="text-[10.5px] text-[#8B8177] font-semibold block">
            Autodebet Aktif
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE5DC] shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-[#8B8177] uppercase tracking-wider">
            Pengurang SPT Pajak
          </span>
          <div className="text-lg sm:text-xl font-extrabold text-[#2E7D4F] font-mono">
            {formatCompactIDR(totalZakatPajak)}
          </div>
          <span className="text-[10.5px] text-[#6D645B] font-semibold block">
            PPh 21 / 25 / 29
          </span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-[#EAE5DC] flex gap-1 sm:gap-2 overflow-x-auto scrollbar-none pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTab("ringkasan")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "ringkasan"
              ? "border-[#14509C] text-[#14509C] bg-white rounded-t-xl"
              : "border-transparent text-[#6D645B] hover:text-[#1A1613]"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profil &amp; NPWP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("riwayat")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "riwayat"
              ? "border-[#14509C] text-[#14509C] bg-white rounded-t-xl"
              : "border-transparent text-[#6D645B] hover:text-[#1A1613]"
          }`}
        >
          <History className="h-4 w-4" />
          <span>Riwayat Zakat</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sbmz")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "sbmz"
              ? "border-[#14509C] text-[#14509C] bg-white rounded-t-xl"
              : "border-transparent text-[#6D645B] hover:text-[#1A1613]"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Bukti Potong Pajak (SBMZ)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("recurring")}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "recurring"
              ? "border-[#14509C] text-[#14509C] bg-white rounded-t-xl"
              : "border-transparent text-[#6D645B] hover:text-[#1A1613]"
          }`}
        >
          <Repeat className="h-4 w-4" />
          <span>Auto Recurring ZIS</span>
        </button>
      </div>

      {/* TAB CONTENT 1: PROFIL & NPWP */}
      {activeTab === "ringkasan" && (
        <div className="space-y-6 animate-fadeIn">
          {saveSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-bold animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Section 1: Data Diri */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EAE5DC] shadow-xs space-y-4">
              <div className="border-b border-[#F0ECE4] pb-3">
                <h3 className="text-base font-extrabold text-[#1A1613] m-0">
                  Data Pribadi Muzakki
                </h3>
                <p className="text-xs text-[#6D645B] mt-0.5">
                  Informasi ini digunakan pada tanda terima resmi dan laporan penyaluran.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1613]">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1613]">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1613]">No. WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1613]">Pekerjaan / Instansi</label>
                  <input
                    type="text"
                    value={pekerjaan}
                    onChange={(e) => setPekerjaan(e.target.value)}
                    placeholder="cth. Karyawan Swasta / Pengusaha"
                    className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1613]">Alamat Domisili</label>
                  <textarea
                    rows={2}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: NPWP & Informasi Pajak */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EAE5DC] shadow-xs space-y-4">
              <div className="border-b border-[#F0ECE4] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#1A1613] m-0">
                    Informasi NPWP &amp; Bukti Potong Pajak (SPT)
                  </h3>
                  <p className="text-xs text-[#6D645B] mt-0.5">
                    Wajib diisi agar Surat Bukti Membayar Zakat (SBMZ) sah sebagai pengurang penghasilan bruto di SPT Tahunan.
                  </p>
                </div>
                <ShieldCheck className="h-6 w-6 text-[#14509C] hidden sm:block" />
              </div>

              <div className="p-3.5 rounded-xl bg-[#EEF3FB] border border-[#BCD3EE] text-xs text-[#0E3B74] leading-relaxed">
                ⚖️ <strong>Dasar Regulasi:</strong> Sesuai UU No. 23/2011 &amp; UU No. 36/2008 Pasal 9 ayat (1) huruf g, zakat yang dibayarkan ke LAZNAS resmi diakui mengurangi Penghasilan Bruto Wajib Pajak Orang Pribadi atau Badan.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1613]">Nomor NPWP (16 Digit)</label>
                  <input
                    type="text"
                    value={npwp}
                    onChange={(e) => setNpwp(e.target.value)}
                    placeholder="01.234.567.8-012.000"
                    className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1613]">NIK (KTP)</label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="3171021405800003"
                    className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1613]">Nama Sesuai NPWP</label>
                  <input
                    type="text"
                    value={namaNpwp}
                    onChange={(e) => setNamaNpwp(e.target.value)}
                    placeholder="AHMAD DAHLAN"
                    className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1613]">KPP Pratama Terdaftar</label>
                  <input
                    type="text"
                    value={alamatKpp}
                    onChange={(e) => setAlamatKpp(e.target.value)}
                    placeholder="cth. KPP Pratama Jakarta Menteng Satu"
                    className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C]"
                  />
                </div>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="bg-transparent hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar dari Akun</span>
              </button>

              <button
                type="submit"
                className="bg-[#14509C] hover:bg-[#0E3B74] text-white text-xs sm:text-sm font-bold px-6 py-2.5 sm:py-3 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Simpan Perubahan Profil</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT 2: RIWAYAT ZAKAT */}
      {activeTab === "riwayat" && (
        <div className="space-y-5 animate-fadeIn">
          {/* Filter Row */}
          <div className="bg-white p-4 rounded-2xl border border-[#EAE5DC] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#6D645B]">Tahun:</span>
              {["Semua", "2026", "2025"].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setHistoryYear(yr)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    historyYear === yr
                      ? "bg-[#14509C] text-white"
                      : "bg-[#FAF8F4] text-[#5E564E] hover:bg-[#EAE5DC]"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#6D645B]">Kategori:</span>
              {["Semua", "Zakat Maal", "Zakat Profesi", "Infak & Shodaqoh", "Wakaf"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setHistoryCategory(cat)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    historyCategory === cat
                      ? "bg-[#14509C] text-white"
                      : "bg-[#FAF8F4] text-[#5E564E] hover:bg-[#EAE5DC]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => {
                const sbmzItem = sbmzDocuments.find((s) => s.transactionCode === item.transactionCode);

                return (
                  <div
                    key={item.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE5DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#BCD3EE] transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#EEF3FB] text-[#0E3B74] border border-[#BCD3EE]">
                          {item.category}
                        </span>
                        <span className="text-[11px] font-mono text-[#8B8177]">
                          {item.transactionCode}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {item.status}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm sm:text-base text-[#1A1613] m-0">
                        {item.programTitle}
                      </h4>
                      <p className="text-xs text-[#6D645B] m-0">
                        {item.paymentDate} · Kanal: {item.paymentMethod}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F0ECE4]">
                      <div className="font-mono font-extrabold text-base sm:text-lg text-[#14509C]">
                        {formatIDR(item.nominal)}
                      </div>

                      {item.hasSbmz && sbmzItem ? (
                        <button
                          type="button"
                          onClick={() => setSelectedSbmz(sbmzItem)}
                          className="text-xs font-bold text-[#0E3B74] hover:text-[#14509C] bg-[#EEF3FB] hover:bg-[#DCE8F7] px-3 py-1.5 rounded-xl border border-[#BCD3EE] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>Unduh SBMZ</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#8B8177]">Tanda Terima Sah</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#EAE5DC] text-[#8B8177] text-xs">
                Tidak ada transaksi pada filter ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: BUKTI POTONG ZAKAT (SBMZ) */}
      {activeTab === "sbmz" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Tax Help Banner */}
          <div className="bg-[#FAF8F4] border border-[#EAE5DC] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#14509C]" />
                <h3 className="font-extrabold text-sm sm:text-base text-[#1A1613] m-0">
                  Surat Bukti Membayar Zakat (SBMZ) Resmi
                </h3>
              </div>
              <p className="text-xs text-[#6D645B] leading-relaxed m-0">
                Gunakan nomor SBMZ dan lampiran PDF ini saat mengisi <strong>SPT Tahunan PPh 21 / 1770 S</strong> di DJP Online pada kolom <em>Zakat/Sumbangan Keagamaan Sifat Wajib</em>.
              </p>
            </div>
            <a
              href="/verifikasi-bukti"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#DDD7CD] text-[#14509C] hover:border-[#14509C] text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Verifikasi Keaslian Dokumen</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* SBMZ List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sbmzDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-2xl border border-[#EAE5DC] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#BCD3EE] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Tahun Pajak {doc.tahunPajak}
                    </span>
                    <span className="text-[10px] text-[#8B8177] font-mono">
                      {doc.tanggalTerbit}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono font-bold text-xs text-[#14509C] block">
                      {doc.sbmzNumber}
                    </span>
                    <h4 className="font-extrabold text-sm text-[#1A1613] mt-1 m-0">
                      {doc.programTitle}
                    </h4>
                  </div>

                  <div className="text-xs text-[#6D645B]">
                    Muzakki: <strong>{doc.muzakkiNama}</strong> (NPWP: {doc.muzakkiNpwp})
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                  <div className="font-mono font-extrabold text-base text-[#0E3B74]">
                    {formatIDR(doc.nominal)}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSbmz(doc)}
                    className="bg-[#14509C] hover:bg-[#0E3B74] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Lihat &amp; Unduh</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: AUTO RECURRING ZIS */}
      {activeTab === "recurring" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-[#1A1613] m-0">
                Jadwal Auto Recurring ZIS
              </h3>
              <p className="text-xs text-[#6D645B] mt-0.5">
                Otomatisasi pengeluaran zakat profesi dan sedekah rutin tanpa khawatir lupa.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsRecurringModalOpen(true)}
              className="bg-[#14509C] hover:bg-[#0E3B74] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Program Rutin</span>
            </button>
          </div>

          {/* Recurring List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recurringPlans.length > 0 ? (
              recurringPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white p-5 rounded-2xl border border-[#EAE5DC] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#BCD3EE] transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#EEF3FB] text-[#0E3B74]">
                        {plan.category} · {plan.frequency}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          plan.status === "Aktif"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-[#1A1613] m-0">{plan.title}</h4>

                    <div className="space-y-1 text-xs text-[#6D645B]">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[#8B8177]" />
                        <span>Debet: Tanggal {plan.deductDay} setiap bulan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-3.5 w-3.5 text-[#8B8177]" />
                        <span>Metode: {plan.paymentMethod}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-[#8B8177]" />
                        <span>Jadwal berikutnya: {plan.nextDeductionDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8B8177] block">Nominal per Periode</span>
                      <span className="font-mono font-extrabold text-base text-[#14509C]">
                        {formatIDR(plan.nominal)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleRecurringPlanStatus(plan.id)}
                        className="p-2 rounded-xl border border-[#DDD7CD] hover:bg-[#FAF8F4] text-[#5E564E] text-xs font-bold transition-colors cursor-pointer"
                        title={plan.status === "Aktif" ? "Jeda program" : "Aktifkan program"}
                      >
                        {plan.status === "Aktif" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4 text-emerald-600" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Hapus jadwal program rutin ini?")) {
                            deleteRecurringPlan(plan.id);
                          }
                        }}
                        className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold transition-colors cursor-pointer"
                        title="Hapus jadwal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#EAE5DC] text-[#8B8177] text-xs md:col-span-2">
                Belum ada jadwal auto recurring aktif. Klik tombol di atas untuk membuat jadwal baru.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SBMZ Modal for Official Preview / Download */}
      <SbmzModal document={selectedSbmz} onClose={() => setSelectedSbmz(null)} />

      {/* Add Recurring Plan Modal */}
      <RecurringModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        onSave={(newPlan) => addRecurringPlan(newPlan)}
      />
    </div>
  );
}
