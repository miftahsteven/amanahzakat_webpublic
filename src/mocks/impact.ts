import { AnnualReportDoc, BeneficiaryStory, FundAllocationItem, ImpactMetric } from "@/types/impact.types";

export const mockImpactMetrics: ImpactMetric[] = [
  {
    angka: "125.360",
    satuan: "jiwa",
    label: "Penerima Manfaat Terlayani",
    keterangan: "Tersalurkan ke 8 asnaf di 18 provinsi Indonesia",
    icon: "Users",
  },
  {
    angka: "Rp 52,7",
    satuan: "Miliar",
    label: "Dana ZIS Tersalurkan",
    keterangan: "Penyaluran terverifikasi sesuai prinsip syariah",
    icon: "BadgeCheck",
  },
  {
    angka: "12.480",
    satuan: "pohon",
    label: "Pohon Ditanam & Dirawat",
    keterangan: "Wakaf Pohon & Konservasi DAS Citarum",
    icon: "Trees",
  },
  {
    angka: "36",
    satuan: "titik",
    label: "Sumur Air Bersih Dibangun",
    keterangan: "Wilayah krisis air NTT, NTB, dan Sulawesi",
    icon: "Droplets",
  },
  {
    angka: "1.842",
    satuan: "anak",
    label: "Anak Yatim Kembali Sekolah",
    keterangan: "Beasiswa, seragam, dan pendampingan mentor",
    icon: "GraduationCap",
  },
  {
    angka: "418",
    satuan: "UMKM",
    label: "Usaha Mikro Ibu Dhuafa Dibina",
    keterangan: "Modal tanpa bunga & pelatihan pembukuan",
    icon: "Store",
  },
];

export const mockFundAllocations: FundAllocationItem[] = [
  {
    label: "Program Penyaluran & Penerima Manfaat",
    percentage: 86.5,
    percentageLabel: "86,5%",
    color: "#14509C",
    description: "Alokasi langsung untuk 8 asnaf mustahik dan program kemanusiaan.",
  },
  {
    label: "Hak Amil Pengelola Lembaga",
    percentage: 7.5,
    percentageLabel: "7,5%",
    color: "#C8933A",
    description: "Sesuai UU No. 23/2011 & Fatwa MUI (maks. 12,5%).",
  },
  {
    label: "Operasional UPZ & Kemitraan Lapangan",
    percentage: 4.0,
    percentageLabel: "4,0%",
    color: "#2B6F9E",
    description: "Dukungan logistik relawan dan unit pengumpul zakat kantor.",
  },
  {
    label: "Infrastruktur Digital & Transparansi",
    percentage: 2.0,
    percentageLabel: "2,0%",
    color: "#6D645B",
    description: "Sistem akuntansi PSAK 109, web verifikasi, dan audit publik.",
  },
];

export const mockBeneficiaryStories: BeneficiaryStory[] = [
  {
    nama: "Yohana Tamu",
    wilayah: "Sumba Timur, NTT",
    program: "Wakaf Sumur",
    kutipan:
      "Dulu kami berjalan dua jam mencari air di sungai keruh. Sekarang sumur mengalir deras di tengah kampung, anak-anak tidak lagi terlambat sekolah dan warga bisa berkebun sayur.",
    peran: "Ketua Pengelola Sumur Kampung Praiwitu",
  },
  {
    nama: "Marlina",
    wilayah: "Bandung Barat, Jawa Barat",
    program: "Modal Usaha Mikro",
    kutipan:
      "Modal awal lima juta dan bimbingan amil membuat warung kecil saya berkembang. Alhamdulillah sekarang sudah bisa mandiri menghidupi tiga anak dan mengajak satu tetangga bekerja.",
    peran: "Pelaku Usaha Mikro Binaan",
  },
  {
    nama: "Siti Aisyah",
    wilayah: "Bekasi, Jawa Barat",
    program: "Beasiswa Anak Yatim",
    kutipan:
      "Ketika ayah tiada, saya kira cita-cita kuliah terhenti. Terima kasih muzakki AmanahZakat, saya bisa melanjutkan studi Keperawatan hingga semester akhir.",
    peran: "Penerima Beasiswa Yatim Berprestasi",
  },
  {
    nama: "Rahmat Hidayat",
    wilayah: "Bantaran DAS Citarum",
    program: "Konservasi Lingkungan",
    kutipan:
      "Bantaran hulu yang tadinya gersang kini hijau royo-royo. Debit air kemarau tahun ini paling stabil sejak 2019 dan warga mendapat hasil buah dari pohon tegakan.",
    peran: "Ketua Kelompok Tani Hijau Lestari",
  },
];

export const mockAnnualReports: AnnualReportDoc[] = [
  {
    tahun: "2025",
    judul: "Laporan Keuangan & Dampak Tahunan 2025",
    deskripsi: "Opini Wajar Tanpa Pengecualian (WTP) berdasarkan standar PSAK 109.",
    ukuranFile: "8.4 MB (PDF)",
    tanggalTerbit: "15 Maret 2026",
    auditor: "KAP Wisnu & Rekan",
  },
  {
    tahun: "2024",
    judul: "Laporan Keuangan & Dampak Tahunan 2024",
    deskripsi: "Opini Wajar Tanpa Pengecualian (WTP) disertai laporan audit kepatuhan syariah.",
    ukuranFile: "7.1 MB (PDF)",
    tanggalTerbit: "20 Februari 2025",
    auditor: "KAP Wisnu & Rekan",
  },
  {
    tahun: "2023",
    judul: "Laporan Tahunan & Transparansi Penyaluran 2023",
    deskripsi: "Rekapitulasi penyaluran 18 provinsi dan laporan audit akuntan publik.",
    ukuranFile: "6.8 MB (PDF)",
    tanggalTerbit: "10 Februari 2024",
    auditor: "KAP Hidayat & Rekan",
  },
];
