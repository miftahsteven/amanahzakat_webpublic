export interface NavItem {
  title: string;
  href: string;
  badge?: string;
  highlight?: boolean;
}

export const mainNavItems: NavItem[] = [
  { title: "Beranda", href: "/" },
  { title: "Kabar Penyaluran", href: "/kabar-penyaluran" },
  { title: "Laporan Dampak", href: "/dampak" },
  { title: "Hitung Zakat", href: "/hitung-zakat" },
  { title: "Tanya Zakat", href: "/tanya-zis" },
  { title: "Verifikasi Bukti", href: "/verifikasi-bukti" },
];

export const assistanceNavItem: NavItem = {
  title: "Ajukan Bantuan",
  href: "/pengajuan-bantuan",
  highlight: true,
};

export const footerNavSections = [
  {
    title: "Program Kebaikan",
    items: [
      { title: "Zakat Maal & Profesi", href: "/kampanye?category=zakat" },
      { title: "Infak & Shodaqoh", href: "/kampanye?category=infak" },
      { title: "Wakaf Sumur & Produktif", href: "/kampanye?category=wakaf" },
      { title: "Semua Kampanye", href: "/kampanye" },
      { title: "Hitung Zakat", href: "/hitung-zakat" },
    ],
  },
  {
    title: "Transparansi & Dampak",
    items: [
      { title: "Kabar Penyaluran Lapangan", href: "/kabar-penyaluran" },
      { title: "Laporan Dampak Kebaikan", href: "/dampak" },
      { title: "Verifikasi SBMZ & Bukti Setor", href: "/verifikasi-bukti" },
      { title: "Laporan Keuangan Diaudit", href: "/dampak#laporan-tahunan" },
    ],
  },
  {
    title: "Layanan Bantuan",
    items: [
      { title: "Informasi & Persyaratan", href: "/pengajuan-bantuan" },
      { title: "Form Pengajuan Bantuan", href: "/pengajuan-bantuan/form" },
      { title: "Cek Status Pengajuan", href: "/pengajuan-bantuan/cek-status" },
      { title: "Pusat Bantuan & Tanya ZIS", href: "/tanya-zis" },
    ],
  },
  {
    title: "Tentang & Legal",
    items: [
      { title: "Tentang AmanahZakat", href: "/tentang" },
      { title: "Kebijakan Privasi", href: "/kebijakan-privasi" },
      { title: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
      { title: "Hubungi Kami", href: "/tentang#kontak" },
    ],
  },
];
