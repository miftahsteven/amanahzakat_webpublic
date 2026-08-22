import { AssistanceCategory, RequiredDocumentRule } from "@/types/assistance.types";

export interface AssistanceCategoryConfig {
  id: AssistanceCategory;
  name: string;
  shortDesc: string;
  longDesc: string;
  icon: string;
  badgeColor: string;
}

export const assistanceCategories: AssistanceCategoryConfig[] = [
  {
    id: "HEALTH",
    name: "Bantuan Kesehatan",
    shortDesc: "Biaya tindakan medis darurat, pengobatan kronis, atau alat bantu kesehatan",
    longDesc: "Dukungan biaya pengobatan, rawat inap darurat, operasi, tebus obat, atau pengadaan alat kesehatan bagi karyawan atau anggota keluarga tanggungan.",
    icon: "HeartPulse",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
  },
  {
    id: "EDUCATION",
    name: "Bantuan Pendidikan",
    shortDesc: "Biaya SPP, uang gedung, atau perlengkapan sekolah anak terancam putus sekolah",
    longDesc: "Bantuan pembiayaan tunggakan sekolah, biaya masuk jenjang baru, maupun beasiswa bagi putra-putri karyawan yang membutuhkan.",
    icon: "GraduationCap",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "DISASTER",
    name: "Bantuan Musibah & Bencana",
    shortDesc: "Renovasi kerusakan rumah akibat kebakaran, banjir, longsor, atau gempa",
    longDesc: "Bantuan perbaikan tempat tinggal dan kebutuhan darurat pangan/logistik pasca bencana alam atau kebakaran rumah tinggal.",
    icon: "Flame",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "ECONOMIC",
    name: "Bantuan Ekonomi Darurat",
    shortDesc: "Penyelesaian kondisi darurat keuangan yang mengancam kebutuhan dasar",
    longDesc: "Bantuan darurat untuk mencegah kerentanan sosial dan ekonomi keluarga yang tidak terduga.",
    icon: "TrendingUp",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "FAMILY_EMERGENCY",
    name: "Bantuan Darurat Keluarga",
    shortDesc: "Santunan duka cita, kepulangan jenazah, atau kondisi krisis keluarga mendesak",
    longDesc: "Dukungan moril dan materiil bagi keluarga yang mengalami kedukaan mendadak atau krisis keluarga yang perlu penanganan segera.",
    icon: "Users",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: "OTHER",
    name: "Bantuan Kemanusiaan Lainnya",
    shortDesc: "Kebutuhan sosial mendesak lainnya yang memenuhi kriteria mustahik amil",
    longDesc: "Pengajuan bantuan kasus khusus yang akan ditelaah lebih lanjut oleh komite amil AmanahZakat.",
    icon: "HelpCircle",
    badgeColor: "bg-gray-50 text-gray-700 border-gray-200",
  },
];

export const assistanceDocumentRules: RequiredDocumentRule[] = [
  {
    id: "proposal",
    name: "Proposal & Uraian Kebutuhan",
    description: "Surat permohonan atau proposal penjelasan latar belakang kebutuhan bantuan.",
    required: true,
    acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMb: 10,
  },
  {
    id: "employee_id",
    name: "Identitas Karyawan (ID Card)",
    description: "Foto atau scan ID Card Karyawan / Surat Keterangan Karyawan Aktif.",
    required: true,
    acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMb: 5,
  },
  {
    id: "main_supporting_doc",
    name: "Dokumen Pendukung Utama",
    description:
      "Surat dokter / rincian biaya RS (Kesehatan), Tagihan sekolah resmi (Pendidikan), Foto musibah & surat RT (Bencana).",
    required: true,
    acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMb: 10,
  },
  {
    id: "additional_doc",
    name: "Dokumen Tambahan (Opsional)",
    description: "Kartu Keluarga (jika penerima adalah tanggungan), kwitansi, atau bukti pendukung lainnya.",
    required: false,
    acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxSizeMb: 10,
  },
];
