export interface MuzakkiUser {
  id: string;
  memberId: string; // e.g. MZK-2026-0819
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
