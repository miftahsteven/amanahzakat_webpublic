"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { MustahikUser, PengajuanBantuanItem, DocumentUploadItem } from "@/types/auth.types";
import {
  FileText,
  Clock,
  User,
  CreditCard,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Home,
  ShieldAlert,
  Upload,
  Eye,
  Trash2,
  Calendar,
  Phone,
  MapPin,
  Landmark,
  Layers,
  ChevronRight,
  Info,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileCheck,
} from "lucide-react";

const PROGRAM_OPTIONS = [
  {
    id: "pendidikan",
    nama: "Bantuan Beasiswa & Pendidikan Dhuafa",
    icon: GraduationCap,
    asnafDefault: "Fakir / Miskin / Fisabilillah",
    color: "#14509C",
    deskripsi: "Tunggakan SPP sekolah, uang pangkal madrasah, seragam, buku, dan beasiswa santri/kuliah.",
    syaratDokumen: [
      { nama: "Surat Keterangan Tidak Mampu (SKTM) dari Kelurahan/RT/RW", wajib: true },
      { nama: "Kartu Pelajar / Kartu Tanda Mahasiswa (KTM)", wajib: true },
      { nama: "Surat Keterangan Aktif Sekolah / Madrasah", wajib: true },
      { nama: "Rincian Rincian Tunggakan SPP / Biaya Pendidikan Resmi", wajib: true },
      { nama: "Kartu Keluarga (KK) & KTP Orang Tua/Wali", wajib: true },
    ],
  },
  {
    id: "kesehatan",
    nama: "Bantuan Kesehatan & Pengobatan Medis",
    icon: HeartPulse,
    asnafDefault: "Fakir / Miskin",
    color: "#E11D48",
    deskripsi: "Biaya operasi rumah sakit, pembelian obat non-BPJS, alat bantu kesehatan, dan transportasi medis.",
    syaratDokumen: [
      { nama: "Surat Keterangan Tidak Mampu (SKTM) dari Kelurahan/RT/RW", wajib: true },
      { nama: "Surat Keterangan Sakit / Rujukan Dokter dari RS/Puskesmas", wajib: true },
      { nama: "Rincian Estimasi Biaya Medis / Kwitansi Obat", wajib: true },
      { nama: "Foto Kartu BPJS / KIS (jika ada)", wajib: false },
      { nama: "Kartu Keluarga (KK) & KTP Pasien/Keluarga", wajib: true },
    ],
  },
  {
    id: "ekonomi",
    nama: "Modal Usaha Mikro Dhuafa & Kemandirian Ekonomi",
    icon: Briefcase,
    asnafDefault: "Miskin",
    color: "#0F9D6E",
    deskripsi: "Bantuan modal alat usaha gerobak/mesin, bahan baku jualan, dan pendampingan usaha mikro.",
    syaratDokumen: [
      { nama: "Surat Keterangan Tidak Mampu (SKTM) dari Kelurahan/RT/RW", wajib: true },
      { nama: "Foto Tempat Jualan / Usaha yang Sedang Dijalankan", wajib: true },
      { nama: "Rincian Kebutuhan Alat / Modal Usaha (RAB Sederhana)", wajib: true },
      { nama: "Kartu Keluarga (KK) & KTP Pemohon", wajib: true },
    ],
  },
  {
    id: "pangan",
    nama: "Bantuan Pangan & Kebutuhan Pokok Keluarga",
    icon: Home,
    asnafDefault: "Fakir / Miskin",
    color: "#D97706",
    deskripsi: "Paket sembako bulanan, perlengkapan lansia dhuafa, dan nutrisi balita berisiko stunting.",
    syaratDokumen: [
      { nama: "Surat Keterangan Tidak Mampu (SKTM) dari Kelurahan/RT/RW", wajib: true },
      { nama: "Foto Tempat Tinggal / Kondisi Rumah Dhuafa", wajib: true },
      { nama: "Kartu Keluarga (KK) & KTP Pemohon", wajib: true },
    ],
  },
  {
    id: "darurat",
    nama: "Bantuan Darurat Bencana & Penampungan Shelter",
    icon: ShieldAlert,
    asnafDefault: "Ibnus Sabil / Gharim / Fakir",
    color: "#7C3AED",
    deskripsi: "Bantuan logistik kebakaran/banjir, biaya sewa shelter penampungan dhuafa darurat.",
    syaratDokumen: [
      { nama: "Surat Keterangan Kejadian dari RT/RW/Kepolisian", wajib: true },
      { nama: "Foto Bukti Kejadian / Bencana", wajib: true },
      { nama: "Kartu Keluarga (KK) & KTP Pemohon", wajib: true },
    ],
  },
];

const BANK_PRESETS = [
  "Bank Syariah Indonesia (BSI)",
  "Bank Mandiri",
  "Bank Central Asia (BCA)",
  "Bank Rakyat Indonesia (BRI)",
  "Bank Negara Indonesia (BNI)",
  "Bank Muamalat",
  "Bank Jago Syariah",
  "Bank Mega Syariah",
  "Bank BJB Syariah",
];

export default function MustahikPortalPage() {
  const router = useRouter();
  const {
    user,
    role,
    isAuthenticated,
    isLoading,
    logout,
    mustahikSubmissions,
    cooldownPolicy,
    submitAssistance,
    uploadDocument,
    updateMustahikProfile,
  } = useAuth();

  const [activeTab, setActiveTab] = React.useState<"ajukan" | "riwayat" | "profil">("ajukan");
  const [selectedProgramId, setSelectedProgramId] = React.useState("pendidikan");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submissionSuccess, setSubmissionSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Form State: Pengajuan Bantuan
  const [nominalStr, setNominalStr] = React.useState("4500000");
  const [alasanPengajuan, setAlasanPengajuan] = React.useState("");
  const [uploadedDocs, setUploadedDocs] = React.useState<DocumentUploadItem[]>([]);
  const [isUploadingDoc, setIsUploadingDoc] = React.useState(false);

  // Form State: Profile & Bank Info
  const [profNama, setProfNama] = React.useState("");
  const [profPhone, setProfPhone] = React.useState("");
  const [profNik, setProfNik] = React.useState("");
  const [profNoKk, setProfNoKk] = React.useState("");
  const [profAlamat, setProfAlamat] = React.useState("");
  const [profPekerjaan, setProfPekerjaan] = React.useState("");
  const [profPenghasilan, setProfPenghasilan] = React.useState("");
  const [profTanggungan, setProfTanggungan] = React.useState("2");
  const [profBank, setProfBank] = React.useState("Bank Syariah Indonesia (BSI)");
  const [profRekening, setProfRekening] = React.useState("");
  const [profNamaRekening, setProfNamaRekening] = React.useState("");
  const [saveProfileSuccess, setSaveProfileSuccess] = React.useState(false);

  const mustahik = (user?.role === "MUSTAHIK" ? user : null) as MustahikUser | null;

  // Sync profile form states
  React.useEffect(() => {
    if (mustahik) {
      setProfNama(mustahik.nama || "");
      setProfPhone(mustahik.phone || "");
      setProfNik(mustahik.nik || "");
      setProfNoKk(mustahik.noKk || "");
      setProfAlamat(mustahik.alamat || "");
      setProfPekerjaan(mustahik.pekerjaan || "");
      setProfPenghasilan(String(mustahik.penghasilanBulanan || ""));
      setProfTanggungan(String(mustahik.jumlahTanggungan || "2"));
      setProfBank(mustahik.namaBank || "Bank Syariah Indonesia (BSI)");
      setProfRekening(mustahik.nomorRekening || "");
      setProfNamaRekening(mustahik.namaRekeningBank || mustahik.nama || "");
    }
  }, [mustahik]);

  // Handle Document Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("Ukuran dokumen melebihi batas maksimal 50 MB.");
      return;
    }

    setIsUploadingDoc(true);
    try {
      const res = await uploadDocument(file);
      if (res.success && res.url) {
        const newDoc: DocumentUploadItem = {
          nama: docName,
          url: res.url,
          tipe: file.type,
          ukuran: file.size,
          wajib: true,
        };
        // Replace or append
        setUploadedDocs((prev) => [
          ...prev.filter((d) => d.nama !== docName),
          newDoc,
        ]);
      } else {
        alert(res.message || "Gagal mengunggah dokumen.");
      }
    } catch {
      alert("Terjadi kesalahan saat upload dokumen.");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleRemoveDoc = (docName: string) => {
    setUploadedDocs((prev) => prev.filter((d) => d.nama !== docName));
  };

  // Submit Assistance Form
  const handleSubmitAssistance = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const currentProg = PROGRAM_OPTIONS.find((p) => p.id === selectedProgramId);
    const parsedNominal = Number(nominalStr.replace(/\D/g, "")) || 0;

    if (parsedNominal <= 0) {
      setErrorMessage("Nominal pengajuan bantuan harus lebih besar dari Rp 0.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Sync profile details automatically
      await updateMustahikProfile({
        nama: profNama,
        phone: profPhone,
        nik: profNik,
        noKk: profNoKk,
        alamat: profAlamat,
        pekerjaan: profPekerjaan,
        penghasilanBulanan: Number(profPenghasilan) || 0,
        jumlahTanggungan: Number(profTanggungan) || 0,
        namaBank: profBank,
        nomorRekening: profRekening,
        namaRekeningBank: profNamaRekening,
      });

      const res = await submitAssistance({
        programBantuanDimohon: currentProg?.nama || "Bantuan Kemanusiaan",
        asnafCategory: currentProg?.asnafDefault || "Miskin",
        nominalPengajuan: parsedNominal,
        estimasiBiayaDibutuhkan: parsedNominal,
        alasanPengajuan,
        dokumenSyarat: uploadedDocs,
        nik: profNik || mustahik?.nik,
        noKk: profNoKk || mustahik?.noKk,
        namaLengkap: profNama || mustahik?.nama,
        telepon: profPhone || mustahik?.phone,
        alamatLengkap: profAlamat || mustahik?.alamat,
        pekerjaan: profPekerjaan || mustahik?.pekerjaan,
        penghasilanBulanan: Number(profPenghasilan) || mustahik?.penghasilanBulanan || 0,
        jumlahTanggungan: Number(profTanggungan) || mustahik?.jumlahTanggungan || 0,
        namaBank: profBank || mustahik?.namaBank,
        nomorRekening: profRekening || mustahik?.nomorRekening,
        namaRekening: profNamaRekening || mustahik?.namaRekeningBank,
      });

      if (res.success) {
        setSubmissionSuccess(true);
        setActiveTab("riwayat");
      } else {
        setErrorMessage(res.message || "Gagal mengajukan bantuan.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Profile Changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mustahik) return;

    await updateMustahikProfile({
      nama: profNama,
      phone: profPhone,
      nik: profNik,
      noKk: profNoKk,
      alamat: profAlamat,
      pekerjaan: profPekerjaan,
      penghasilanBulanan: Number(profPenghasilan) || 0,
      jumlahTanggungan: Number(profTanggungan) || 0,
      namaBank: profBank,
      nomorRekening: profRekening,
      namaRekeningBank: profNamaRekening,
    });

    setSaveProfileSuccess(true);
    setTimeout(() => setSaveProfileSuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="max-w-[1000px] mx-auto py-20 text-center text-[#8B8177]">
        Memuat data portal mustahik...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-[#EAE5DC] rounded-[24px] shadow-sm text-center space-y-4 font-sans animate-fadeIn">
        <AlertCircle className="h-12 w-12 text-[#C8382F] mx-auto" />
        <h2 className="text-xl font-extrabold text-[#1A1613]">Akses Terbatas</h2>
        <p className="text-xs text-[#6D645B] leading-relaxed">
          Silakan masuk ke akun Mustahik Anda terlebih dahulu untuk mengajukan bantuan atau memantau proses penyaluran ZIS.
        </p>
        <Link href="/masuk?redirect=/mustahik">
          <button
            type="button"
            className="w-full bg-[#0F9D6E] hover:bg-[#0B7D57] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Masuk Akun Mustahik
          </button>
        </Link>
      </div>
    );
  }

  if (user.role === "MUZAKKI") {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-[#EAE5DC] rounded-[24px] shadow-sm text-center space-y-4 font-sans animate-fadeIn">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EEF3FB] text-[#14509C] flex items-center justify-center font-bold text-xl">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-[#1A1613]">Portal Khusus Mustahik</h2>
        <p className="text-xs text-[#6D645B] leading-relaxed">
          Anda saat ini masuk sebagai <strong className="text-[#1A1613]">{user.nama}</strong> (Akun Muzakki / Donatur ZIS). Sesuai kebijakan, akun Mustahik dan Muzakki bersifat terpisah &amp; unik.
        </p>
        <div className="space-y-2 pt-2">
          <Link href="/muzakki">
            <button
              type="button"
              className="w-full bg-[#14509C] hover:bg-[#0E3B74] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Buka Dashboard Muzakki</span>
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

  const currentProgram = PROGRAM_OPTIONS.find((p) => p.id === selectedProgramId) || PROGRAM_OPTIONS[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans animate-fadeIn">
      {/* Top Welcome Bar */}
      <div className="bg-gradient-to-r from-[#0B1F3D] via-[#0E3B74] to-[#0B1F3D] rounded-3xl p-5 sm:p-6 text-white shadow-md mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-[#0F9D6E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#0F9D6E] text-white px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold tracking-wider uppercase">
              Portal Mustahik Binaan
            </span>
            <span className="text-[11px] text-[#A8C8F0] font-mono">
              ID: {mustahik?.memberId || "MST-2026-0819"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Assalamu’alaikum, {mustahik?.nama || "Sahabat Mustahik"}
          </h1>
          <p className="text-xs text-[#C3D0E0]">
            NIK: <strong className="text-white font-mono">{mustahik?.nik || "3201xxxxxxxxxxxx"}</strong> &bull; Rekening: <strong className="text-white">{mustahik?.namaBank || "BSI"} ({mustahik?.nomorRekening || "Belum Diisi"})</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/masuk");
            }}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/15"
          >
            Keluar Akun
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-[#EAE5DC] shadow-xs mb-6 overflow-x-auto gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("ajukan")}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "ajukan"
              ? "bg-[#14509C] text-white shadow-xs"
              : "text-[#5E564E] hover:text-[#16211D] hover:bg-[#FAF8F4]"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Mengajukan Bantuan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("riwayat")}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "riwayat"
              ? "bg-[#14509C] text-white shadow-xs"
              : "text-[#5E564E] hover:text-[#16211D] hover:bg-[#FAF8F4]"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pengajuan Saya</span>
          {mustahikSubmissions.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${activeTab === "riwayat" ? "bg-white/20 text-white" : "bg-[#EEF3FB] text-[#14509C]"}`}>
              {mustahikSubmissions.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profil")}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "profil"
              ? "bg-[#14509C] text-white shadow-xs"
              : "text-[#5E564E] hover:text-[#16211D] hover:bg-[#FAF8F4]"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profil &amp; Rekening Bank</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MENGAJUKAN BANTUAN */}
      {/* ========================================================================= */}
      {activeTab === "ajukan" && (
        <div className="space-y-6">
          {/* Cooldown 6-Month Notification Banner (Configurable Rule) */}
          {!cooldownPolicy.canApplyNew ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3.5 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
                <p className="font-extrabold text-amber-900">
                  Masa Tunggu Pengajuan Bantuan (Aturan {cooldownPolicy.minCooldownMonths} Bulan)
                </p>
                <p className="text-amber-800">
                  Berdasarkan pedoman penyaluran ZIS LAZNAS AmanahZakat, mustahik dapat mengajukan permohonan bantuan kembali minimal <strong>{cooldownPolicy.minCooldownMonths} bulan</strong> setelah pengajuan sebelumnya agar penyaluran dapat merata ke asnaf lainnya.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-200/70 text-amber-950 font-bold text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    Tersedia Kembali: {cooldownPolicy.nextAvailableDate}
                  </span>
                  <span className="text-xs text-amber-700">
                    (Sisa waktu tunggu &plusmn; {cooldownPolicy.cooldownRemainingDays} hari)
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Form Permohonan Bantuan */}
          <form onSubmit={handleSubmitAssistance} className="space-y-6">
            {/* Step 1: Pilih Program Bantuan */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE5DC] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#14509C] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-[#16211D]">
                  Pilih Program Bantuan yang Diajukan
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PROGRAM_OPTIONS.map((prog) => {
                  const Icon = prog.icon;
                  const isSelected = selectedProgramId === prog.id;
                  return (
                    <div
                      key={prog.id}
                      onClick={() => setSelectedProgramId(prog.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? "border-[#14509C] bg-[#EEF3FB] ring-2 ring-[#14509C]/20 shadow-xs"
                          : "border-[#EAE5DC] bg-white hover:border-[#B5C2B9] hover:bg-[#FAF8F4]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${prog.color}15`, color: prog.color }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#14509C]" />}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-[13px] font-extrabold text-[#16211D]">
                          {prog.nama}
                        </h3>
                        <p className="text-[11px] text-[#5E564E] mt-0.5 line-clamp-2">
                          {prog.deskripsi}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-[#14509C] uppercase tracking-wider">
                        Asnaf: {prog.asnafDefault}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Identitas Pemohon (Standar & Auto-fill) */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE5DC] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#14509C] text-white flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#16211D]">
                    Identitas Standar Pemohon
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("profil")}
                  className="text-xs text-[#14509C] hover:underline font-bold"
                >
                  Ubah di Profil &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#16211D]">Nama Lengkap (KTP)</label>
                  <input
                    type="text"
                    required
                    value={profNama}
                    onChange={(e) => setProfNama(e.target.value)}
                    className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-[#FAF8F4] text-[#16211D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#16211D]">NIK KTP (16 Digit)</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={profNik}
                    onChange={(e) => setProfNik(e.target.value)}
                    className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-[#FAF8F4] text-[#16211D] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#16211D]">No. Kartu Keluarga (KK)</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={profNoKk}
                    onChange={(e) => setProfNoKk(e.target.value)}
                    className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-[#FAF8F4] text-[#16211D] font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#16211D]">No. WhatsApp Aktif</label>
                  <input
                    type="tel"
                    required
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-[#FAF8F4] text-[#16211D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#16211D]">Pekerjaan Utama</label>
                  <input
                    type="text"
                    value={profPekerjaan}
                    onChange={(e) => setProfPekerjaan(e.target.value)}
                    className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-[#FAF8F4] text-[#16211D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#16211D]">Penghasilan Bulanan (Rp)</label>
                  <input
                    type="number"
                    value={profPenghasilan}
                    onChange={(e) => setProfPenghasilan(e.target.value)}
                    className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-[#FAF8F4] text-[#16211D]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#16211D]">Alamat Domisili Lengkap</label>
                <textarea
                  rows={2}
                  value={profAlamat}
                  onChange={(e) => setProfAlamat(e.target.value)}
                  className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-[#FAF8F4] text-[#16211D]"
                />
              </div>

              {/* Rekening Bank Penerima Bantuan */}
              <div className="p-3.5 rounded-2xl bg-[#EEF3FB] border border-[#BCD3EE] space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0E3B74]">
                  <CreditCard className="w-3.5 h-3.5 text-[#14509C]" />
                  <span>Rekening Bank Penyaluran Bantuan ZIS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#0E3B74]">Nama Bank *</label>
                    <select
                      value={profBank}
                      onChange={(e) => setProfBank(e.target.value)}
                      className="w-full border border-[#DDE3DF] rounded-xl px-2.5 py-1.5 text-xs bg-white text-[#16211D] outline-none"
                    >
                      {BANK_PRESETS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#0E3B74]">Nomor Rekening *</label>
                    <input
                      type="text"
                      required
                      value={profRekening}
                      onChange={(e) => setProfRekening(e.target.value)}
                      placeholder="Nomor Rekening Bank"
                      className="w-full border border-[#DDE3DF] rounded-xl px-2.5 py-1.5 text-xs bg-white text-[#16211D] font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#0E3B74]">Atas Nama Rekening *</label>
                    <input
                      type="text"
                      required
                      value={profNamaRekening}
                      onChange={(e) => setProfNamaRekening(e.target.value)}
                      placeholder="Sesuai buku tabungan"
                      className="w-full border border-[#DDE3DF] rounded-xl px-2.5 py-1.5 text-xs bg-white text-[#16211D] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Nominal Pengajuan & Alasan */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE5DC] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#14509C] text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-[#16211D]">
                  Jumlah Rupiah yang Diajukan &amp; Alasan Permohonan
                </h2>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#16211D]">
                    Nominal Bantuan yang Diajukan (Rupiah) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-extrabold text-[#14509C]">
                      Rp
                    </span>
                    <input
                      type="text"
                      required
                      value={Number(nominalStr).toLocaleString("id-ID")}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setNominalStr(val || "0");
                      }}
                      className="w-full pl-11 pr-4 py-2.5 border border-[#DDE3DF] rounded-xl text-base sm:text-lg font-extrabold text-[#14509C] bg-white outline-none focus:border-[#14509C] focus:ring-1 focus:ring-[#14509C]"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["1000000", "2500000", "4500000", "7500000", "10000000"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNominalStr(preset)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          nominalStr === preset
                            ? "bg-[#14509C] text-white"
                            : "bg-[#F4F6F4] text-[#5E564E] hover:bg-[#EAE5DC]"
                        }`}
                      >
                        Rp {Number(preset).toLocaleString("id-ID")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#16211D]">
                    Alasan &amp; Rincian Kebutuhan Bantuan *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={alasanPengajuan}
                    onChange={(e) => setAlasanPengajuan(e.target.value)}
                    placeholder="Jelaskan secara detail kondisi keluarga, tujuan bantuan, dan urgensi kebutuhan yang diajukan..."
                    className="w-full border border-[#DDE3DF] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#16211D] bg-white outline-none focus:border-[#14509C]"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Persyaratan Dokumen Khusus & Upload Langsung */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE5DC] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#14509C] text-white flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-[#16211D]">
                      Upload Persyaratan Dokumen ({currentProgram.nama})
                    </h2>
                    <p className="text-xs text-[#5E564E]">
                      Maksimal ukuran file 50 MB per dokumen (Format: PDF, JPG, PNG).
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Document Checklist */}
              <div className="space-y-3">
                {currentProgram.syaratDokumen.map((syarat, idx) => {
                  const uploaded = uploadedDocs.find((d) => d.nama === syarat.nama);
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-[#EAE5DC] bg-[#FAF8F4] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${uploaded ? "bg-emerald-100 text-emerald-700" : "bg-[#EEF3FB] text-[#14509C]"}`}>
                          {uploaded ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-[#16211D]">
                            {syarat.nama} {syarat.wajib && <span className="text-red-500">*</span>}
                          </p>
                          {uploaded ? (
                            <p className="text-[11px] text-emerald-700 font-medium">
                              &bull; Berkas terunggah: {uploaded.url.split("/").pop()} ({uploaded.ukuran ? (uploaded.ukuran / (1024 * 1024)).toFixed(2) + " MB" : "OK"})
                            </p>
                          ) : (
                            <p className="text-[11px] text-[#7D938A]">
                              {syarat.wajib ? "Wajib dilampirkan" : "Opsional jika tersedia"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {uploaded ? (
                          <>
                            <a
                              href={uploaded.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-white border border-[#DDE3DF] text-xs font-bold text-[#14509C] hover:bg-[#EEF3FB] flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Lihat</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(syarat.nama)}
                              className="p-1.5 rounded-xl text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <label className="px-3.5 py-1.5 rounded-xl bg-[#14509C] hover:bg-[#0E3B74] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Pilih / Foto File</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, syarat.nama)}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !cooldownPolicy.canApplyNew}
                className="w-full bg-[#0F9D6E] hover:bg-[#0B7D57] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base py-3.5 rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Mengirimkan Permohonan Bantuan...</span>
                ) : (
                  <>
                    <span>Kirimkan Pengajuan Permohonan Bantuan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-[#7D938A] mt-2">
                Dengan menekan tombol di atas, Anda menyatakan bahwa data yang diisi adalah benar dan sah sesuai syariat.
              </p>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PENGAJUAN SAYA (TRACKING 5 TAHAPAN LENGKAP) */}
      {/* ========================================================================= */}
      {activeTab === "riwayat" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-[#16211D]">
                Daftar Permohonan Bantuan Saya
              </h2>
              <p className="text-xs text-[#5E564E]">
                Pelacakan transparan 5 tahapan verifikasi &amp; approval penyaluran dana ZIS.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("ajukan")}
              className="px-3.5 py-1.5 rounded-xl bg-[#14509C] text-white text-xs font-bold flex items-center gap-1.5 self-start cursor-pointer hover:bg-[#0E3B74]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Ajukan Bantuan Baru</span>
            </button>
          </div>

          {mustahikSubmissions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-[#EAE5DC] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F4] text-[#8B8177] mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#16211D]">Belum Ada Pengajuan Bantuan</h3>
              <p className="text-xs text-[#5E564E] max-w-sm mx-auto">
                Anda belum pernah mengajukan permohonan bantuan ZIS. Klik tombol di bawah untuk memulai.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("ajukan")}
                className="px-4 py-2 rounded-xl bg-[#0F9D6E] text-white text-xs font-bold hover:bg-[#0B7D57]"
              >
                Mulai Mengajukan Bantuan
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {mustahikSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl border border-[#EAE5DC] shadow-sm overflow-hidden animate-fadeIn"
                >
                  {/* Header Card */}
                  <div className="p-5 sm:p-6 bg-[#FAF8F4] border-b border-[#EAE5DC] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF3FB] text-[#14509C] font-mono">
                          {sub.submissionNumber}
                        </span>
                        <span className="text-xs text-[#7D938A]">&bull; {sub.createdAt}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-[#16211D]">
                        {sub.programBantuanDimohon}
                      </h3>
                      <p className="text-xs text-[#5E564E]">
                        Penerima: <strong>{sub.namaLengkap}</strong> ({sub.nik}) &bull; Rekening:{" "}
                        <strong>{sub.namaBank} - {sub.nomorRekening}</strong>
                      </p>
                    </div>

                    <div className="text-left md:text-right shrink-0">
                      <p className="text-[11px] text-[#7D938A]">Nominal Pengajuan</p>
                      <p className="text-lg sm:text-xl font-extrabold text-[#0F9D6E]">
                        Rp {sub.nominalPengajuan.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Body: 5-Stage Process Details */}
                  <div className="p-5 sm:p-6 space-y-6">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#7D938A] mb-3">
                        Status Alur 5 Tahapan:
                      </h4>

                      {/* 5-Step Stepper Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                        {/* Step a: Proses Pengajuan */}
                        <div className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex flex-col justify-between space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-bold text-emerald-800">1. Pengajuan</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <p className="text-xs font-extrabold text-emerald-950">Form &amp; Berkas Masuk</p>
                          <span className="text-[10px] text-emerald-700">Status: Selesai</span>
                        </div>

                        {/* Step b: Approval Dewan ZIS */}
                        <div className="p-3 rounded-2xl border border-[#BCD3EE] bg-[#EEF3FB] flex flex-col justify-between space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-bold text-[#14509C]">2. Dewan ZIS</span>
                            <span className="w-2 h-2 rounded-full bg-[#14509C] animate-ping" />
                          </div>
                          <p className="text-xs font-extrabold text-[#0E3B74]">3 Langkah Approval</p>
                          <span className="text-[10px] text-[#14509C] font-semibold">Proses Approval</span>
                        </div>

                        {/* Step c: Approval Direktur Keuangan */}
                        <div className="p-3 rounded-2xl border border-[#DDE3DF] bg-white flex flex-col justify-between space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-bold text-[#5E564E]">3. Dir. Keuangan</span>
                            <Clock className="w-3 h-3 text-[#7D938A]" />
                          </div>
                          <p className="text-xs font-bold text-[#16211D]">Finalisasi Nilai</p>
                          <span className="text-[10px] text-[#7D938A]">Proses Approval</span>
                        </div>

                        {/* Step d: Proses Pembayaran */}
                        <div className="p-3 rounded-2xl border border-[#DDE3DF] bg-white flex flex-col justify-between space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-bold text-[#5E564E]">4. Pembayaran</span>
                            <Clock className="w-3 h-3 text-[#7D938A]" />
                          </div>
                          <p className="text-xs font-bold text-[#16211D]">Antrean Kasir</p>
                          <span className="text-[10px] text-[#7D938A]">Proses Penyaluran</span>
                        </div>

                        {/* Step e: Sudah Disalurkan */}
                        <div className="p-3 rounded-2xl border border-[#DDE3DF] bg-white flex flex-col justify-between space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-bold text-[#5E564E]">5. Disalurkan</span>
                            <CheckCircle2 className="w-3 h-3 text-[#7D938A]" />
                          </div>
                          <p className="text-xs font-bold text-[#16211D]">Dana Diterima</p>
                          <span className="text-[10px] text-[#7D938A]">Sudah di Salurkan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PROFIL & INFORMASI REKENING BANK */}
      {/* ========================================================================= */}
      {activeTab === "profil" && (
        <div className="space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EAE5DC] shadow-xs space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#16211D]">
                Profil Mustahik &amp; Pengaturan Rekening Bank
              </h2>
              <p className="text-xs text-[#5E564E]">
                Pastikan nama rekening sesuai dengan identitas KTP untuk kelancaran penyaluran bantuan dana ZIS.
              </p>
            </div>

            {saveProfileSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Perubahan data profil dan rekening bank berhasil disimpan!</span>
              </div>
            )}

            {/* Section A: Rekening Bank Penyaluran */}
            <div className="p-4 rounded-2xl bg-[#EEF3FB] border border-[#BCD3EE] space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#0E3B74]">
                <CreditCard className="w-4 h-4 text-[#14509C]" />
                <span>Informasi Rekening Bank Penerima Bantuan (Penyaluran ZIS)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#0E3B74]">Nama Bank *</label>
                  <select
                    value={profBank}
                    onChange={(e) => setProfBank(e.target.value)}
                    className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-white text-[#16211D] outline-none"
                  >
                    {BANK_PRESETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#0E3B74]">Nomor Rekening Bank *</label>
                  <input
                    type="text"
                    required
                    value={profRekening}
                    onChange={(e) => setProfRekening(e.target.value)}
                    placeholder="cth. 7128934501"
                    className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-white text-[#16211D] font-mono outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#0E3B74]">Atas Nama Rekening *</label>
                  <input
                    type="text"
                    required
                    value={profNamaRekening}
                    onChange={(e) => setProfNamaRekening(e.target.value)}
                    placeholder="Nama di buku tabungan"
                    className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-white text-[#16211D] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Identitas Pribadi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#16211D]">Nama Lengkap (KTP)</label>
                <input
                  type="text"
                  required
                  value={profNama}
                  onChange={(e) => setProfNama(e.target.value)}
                  className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-white text-[#16211D]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#16211D]">NIK KTP (16 Digit)</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={profNik}
                  onChange={(e) => setProfNik(e.target.value)}
                  className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-white text-[#16211D] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#16211D]">No. Kartu Keluarga (KK)</label>
                <input
                  type="text"
                  maxLength={16}
                  value={profNoKk}
                  onChange={(e) => setProfNoKk(e.target.value)}
                  className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-white text-[#16211D] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#16211D]">No. WhatsApp Aktif</label>
                <input
                  type="tel"
                  required
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-white text-[#16211D]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#16211D]">Pekerjaan</label>
                <input
                  type="text"
                  value={profPekerjaan}
                  onChange={(e) => setProfPekerjaan(e.target.value)}
                  className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-white text-[#16211D]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#16211D]">Jumlah Tanggungan Keluarga</label>
                <input
                  type="number"
                  value={profTanggungan}
                  onChange={(e) => setProfTanggungan(e.target.value)}
                  className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-white text-[#16211D]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#16211D]">Alamat Domisili</label>
              <textarea
                rows={2}
                value={profAlamat}
                onChange={(e) => setProfAlamat(e.target.value)}
                className="w-full border border-[#DDE3DF] rounded-xl px-3 py-2 text-xs bg-white text-[#16211D]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#14509C] hover:bg-[#0E3B74] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                Simpan Perubahan Profil &amp; Rekening
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
