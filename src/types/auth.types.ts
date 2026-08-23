export type UserRole = "MUZAKKI" | "MUSTAHIK";

export interface MuzakkiUser {
  id: string;
  memberId: string; // e.g. MZK-2026-0819
  role: "MUZAKKI";
  nama: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  alamat?: string;
  pekerjaan?: string;
  
  // Tax / SPT Info
  npwp?: string; // 16 digit NPWP
  nik?: string; // 16 digit NIK
  namaNpwp?: string;
  alamatKpp?: string;
  isNpwpVerified: boolean;

  createdAt: string;
}

export interface MustahikUser {
  id: string;
  memberId: string; // e.g. MST-2026-0819
  role: "MUSTAHIK";
  nama: string;
  email: string;
  phone: string;
  nik: string; // 16 digit NIK
  noKk?: string; // 16 digit No KK
  tempatLahir?: string;
  tanggalLahir?: string;
  statusPernikahan?: string;
  jumlahTanggungan: number;
  pekerjaan?: string;
  penghasilanBulanan: number;
  alamat?: string;
  provinsi?: string;
  kotaKabupaten?: string;
  asnafCategory: string; // Fakir, Miskin, Fisabilillah, Gharim, Ibnus Sabil

  // Banking Info
  namaBank: string; // e.g. "Bank Syariah Indonesia (BSI)"
  nomorRekening: string;
  namaRekeningBank: string;

  createdAt: string;
}

export type AuthUser = MuzakkiUser | MustahikUser;

export type ZisCategory =
  | "Zakat Maal"
  | "Zakat Profesi"
  | "Zakat Fitrah"
  | "Infak & Shodaqoh"
  | "Wakaf"
  | "Qurban";

export interface ZakatHistoryItem {
  id: string;
  transactionCode: string; // e.g. ZIS-20260726-014
  sbmzNumber?: string; // e.g. SBMZ/2026/07/ASK004182
  category: ZisCategory;
  programTitle: string;
  nominal: number;
  paymentDate: string;
  paymentMethod: string;
  status: "Berhasil" | "Menunggu" | "Gagal";
  hasSbmz: boolean;
  notes?: string;
}

export interface SbmzDocument {
  id: string;
  sbmzNumber: string;
  transactionCode: string;
  tahunPajak: number;
  category: ZisCategory;
  programTitle: string;
  nominal: number;
  terbilang: string;
  tanggalTerbit: string;
  muzakkiNama: string;
  muzakkiNpwp: string;
  muzakkiNik?: string;
  muzakkiAlamat: string;
  lembagaNama: string;
  lembagaIzin: string;
  lembagaNpwp: string;
  legalBasis: string;
}

export interface RecurringZisPlan {
  id: string;
  title: string;
  category: ZisCategory;
  nominal: number;
  frequency: "Bulanan" | "Mingguan" | "Harian";
  deductDay: number; // e.g. tanggal 25 setiap bulan
  paymentMethod: string; // e.g. "BSI Autodebet" | "QRIS Rutin" | "Kartu Syariah"
  status: "Aktif" | "Dijeda" | "Dibatalkan";
  nextDeductionDate: string;
  totalDonated: number;
  createdAt: string;
}

// ==========================================
// MUSTAHIK ASSISTANCE & 5-STAGE APPROVAL
// ==========================================
export type AssistanceStage =
  | "PROSES_PENGAJUAN"
  | "APPROVAL_DEWAN_ZIS"
  | "APPROVAL_DIREKTUR_KEUANGAN"
  | "PROSES_PENYALURAN"
  | "SUDAH_DISALURKAN";

export interface DocumentUploadItem {
  id?: string;
  nama: string;
  url: string;
  tipe: string;
  ukuran?: number;
  wajib?: boolean;
}

export interface DewanApprovalItem {
  memberId: string;
  memberName: string;
  role: string;
  status: "Disetujui Rekomendasi" | "Dalam Penelaahan" | "Perlu Survei Ulang";
  nominalDisetujui: number;
  catatan: string;
  approvedAt: string;
}

export interface DirekturApprovalItem {
  approvedBy: string;
  selectedDewanMemberId?: string;
  finalApprovedNominal: number;
  catatan: string;
  approvedAt: string;
}

export interface PembayaranDetailItem {
  noReferensi: string;
  bankTujuan: string;
  rekeningTujuan: string;
  namaPenerima: string;
  nominalDitransfer: number;
  transferDate: string;
  buktiTransferUrl?: string;
  keterangan: string;
}

export interface TimelineTahapanItem {
  tahap: string;
  status: "Selesai" | "Sedang Berjalan" | "Menunggu";
  tanggal: string;
  deskripsi: string;
}

export interface PengajuanBantuanItem {
  id: string;
  submissionNumber: string; // e.g. PB-2026-0819-001
  mustahikAuthId?: string;
  nik: string;
  noKk?: string;
  namaLengkap: string;
  telepon: string;
  email?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  statusPernikahan?: string;
  alamatLengkap: string;
  provinsi?: string;
  kotaKabupaten?: string;
  pekerjaan?: string;
  penghasilanBulanan: number;
  jumlahTanggungan: number;
  asnafCategory: string;
  programBantuanDimohon: string;
  nominalPengajuan: number;
  estimasiBiayaDibutuhkan: number;
  alasanPengajuan?: string;
  dokumenSyarat: DocumentUploadItem[];
  
  // Bank Account
  namaBank?: string;
  nomorRekening?: string;
  namaRekening?: string;

  // 5-Stage Status
  stageStatus: AssistanceStage;
  status: string; // "Proses Pengajuan" | "Proses Approval" | "Proses Penyaluran" | "Sudah Disalurkan"

  // Approvals & Payment Details
  dewanZisApprovals?: DewanApprovalItem[];
  direkturKeuanganApproval?: DirekturApprovalItem | null;
  pembayaranDetail?: PembayaranDetailItem | null;
  tahapanProses: TimelineTahapanItem[];

  createdAt: string;
}

export interface CooldownPolicy {
  minCooldownMonths: number;
  canApplyNew: boolean;
  nextAvailableDate: string | null;
  cooldownRemainingDays: number;
}
