# AmanahZakat Peduli — Public Web Application (Phase 1)

Platform Web Fundraising Zakat, Infak, Shodaqoh, Wakaf & Layanan Pengajuan Bantuan Kemanusiaan Karyawan LAZNAS AmanahZakat.

Aplikasi ini dibangun menggunakan arsitektur modern Next.js App Router, TypeScript, dan Tailwind CSS dengan Service Abstraction Layer yang siap dihubungkan ke backend REST API / ERP pada Fase 2 tanpa perlu merombak komponen UI.

---

## 🌟 Fitur Utama (Phase 1)

1. **Beranda Interaktif (`/`)**:
   - Hero banner carousel dengan call-to-action dinamis.
   - Quick action grid: Donasi, Katalog Kampanye, Hitung Zakat, Verifikasi SBMZ, Ajukan Bantuan, dan Laporan Dampak.
   - Katalog kampanye pilihan dengan tab filter kategori.
   - Seksi dampak transparansi dengan ringkasan metrik mustahik & penyaluran dana.
   - Kabar lapangan penyaluran terkini dari garis depan.
   - Callout ajukan bantuan kemanusiaan karyawan.
   - Testimoni donatur/mustahik, partner bank/regulator, FAQ ZIS, dan komitmen akuntabilitas.

2. **Katalog & Detail Kampanye (`/kampanye` & `/kampanye/[slug]`)**:
   - Filter pencarian instan berdasarkan kategori dan kata kunci.
   - Rencana peruntukan alokasi dana program.
   - Perkembangan kabar lapangan berkala dan daftar donatur terbaru.
   - Sticky donation card pada desktop & floating action trigger pada mobile.

3. **Alur Donasi & Pembayaran (`/donasi`, `/donasi/pembayaran/[transactionId]`, `/donasi/sukses/[transactionId]`)**:
   - Pilihan kampanye atau donasi kemanusiaan umum.
   - 4 jenis dana ZIS: Zakat (Maal/Profesi/Fitrah), Infak, Shodaqoh, Wakaf Uang.
   - Preset nominal donasi & input nominal kustom.
   - Opsi Hamba Allah (anonim) dan doa donatur.
   - Kanal pembayaran lengkap: Virtual Account (BSI, Mandiri, BCA, BRI, BNI), QRIS (GoPay, OVO, ShopeePay, DANA, Livin, BCA Mobile), E-Wallet, dan Transfer Bank Manual.
   - Halaman instruksi pembayaran dengan countdown timer dan visual kode QR matrix deterministik.
   - Kontrol simulasi demo dev (`PAID`, `EXPIRED`, `FAILED`, `PENDING`) untuk pengujian alur tanpa backend payment gateway.
   - Penerbitan Surat Bukti Membayar Zakat (SBMZ) resmi / Bukti Setor ber-QR code dan tombol cetak/simpan PDF standar PSAK 109 & Ditjen Pajak.

4. **Kalkulator Zakat Terpadu (`/hitung-zakat`)**:
   - **Zakat Maal (Harta Simpanan)**: Nisab 85g emas (Rp 1.450.000/g) & haul 1 tahun dengan potongan hutang jatuh tempo.
   - **Zakat Profesi (Penghasilan)**: Nisab setara 522 kg beras per tahun dibagi 12 bulan (Rp 15.000/kg) & tarif 2,5%.
   - **Zakat Fitrah**: Perhitungan per jiwa (2,5 kg beras) untuk seluruh tanggungan keluarga.
   - Tombol instan "Bayar Zakat Sekarang" yang langsung mengisi formulir donasi.

5. **Kabar Penyaluran (`/kabar-penyaluran` & `/kabar-penyaluran/[slug]`)**:
   - Laporan berkala dan dokumentasi penyaluran lapangan ke 8 asnaf di seluruh Indonesia.

6. **Laporan Dampak & Transparansi (`/dampak`)**:
   - Metrik agregat penerima manfaat, dana tersalurkan, titik sumur air bersih, dan pohon konservasi.
   - Rasio alokasi penyaluran dana (Program 86,5%, Hak Amil 7,5%, UPZ 4,0%, Infrastruktur & Audit 2,0%).
   - Cerita transformasi mustahik menjadi mandiri.
   - Unduhan laporan keuangan tahunan beropini WTP (PSAK 109).

7. **Verifikasi Keabsahan SBMZ (`/verifikasi-bukti`)**:
   - Form pencarian nomor tanda terima / SBMZ / nomor transaksi untuk validasi keabsahan dokumen pengurangan pajak SPT.

8. **Tanya ZIS & Konsultasi Fiqih Digital (`/tanya-zis`)**:
   - Basis pengetahuan tanya jawab ZIS lengkap terbagi dalam 7 kategori fiqih.
   - Asisten konsultasi fiqih digital interaktif dengan pencocokan rujukan fatwa resmi.

9. **Portal Pengajuan Bantuan Karyawan (`/pengajuan-bantuan`)**:
   - **Overview & Persyaratan (`/pengajuan-bantuan`)**: 4 langkah pengajuan, 6 kategori bantuan, dan checklist dokumen.
   - **Multi-Step Form (`/pengajuan-bantuan/form`)**:
     - Step 1: Identitas Pemohon (Nama, NIP, Perusahaan, Unit Kerja, Kontak).
     - Step 2: Detail Bantuan (Kategori, Judul, Uraian, Nominal, Tanggal, Hubungan Penerima).
     - Step 3: Unggah Dokumen Persyaratan (Proposal, ID Card, Dokumen Pendukung dengan validasi format & ukuran file client-side).
     - Step 4: Review Data & Pernyataan Pemohon.
     - Fitur penyimpanan draf otomatis di peramban (`localStorage`).
   - **Halaman Sukses (`/pengajuan-bantuan/sukses/[submissionId]`)**: Menampilkan nomor registrasi resmi (cth: `PMH-2026-XXXX`).
   - **Cek Status Online (`/pengajuan-bantuan/cek-status`)**: Pelacakan perkembangan verifikasi dokumen dan tahapan amil secara transparan melalui vertical timeline.

10. **Halaman Statis & Legalitas**:
    - Profil Lembaga (`/tentang`)
    - Kebijakan Privasi (`/kebijakan-privasi`)
    - Syarat & Ketentuan (`/syarat-ketentuan`)

---

## 🛠️ Arsitektur & Struktur Direktori

```
web/
├── src/
│   ├── app/                               # Next.js App Router Pages & Layouts
│   │   ├── layout.tsx                     # Root Layout (Fonts, Header, Footer)
│   │   ├── page.tsx                       # Beranda Utama
│   │   ├── globals.css                    # Tailwind CSS & Print Styles
│   │   ├── kampanye/                      # Katalog & Detail Kampanye
│   │   ├── donasi/                        # Alur Donasi, Instruksi Bayar, Sukses/SBMZ
│   │   ├── hitung-zakat/                  # Kalkulator Zakat Maal/Profesi/Fitrah
│   │   ├── kabar-penyaluran/              # Berita & Laporan Penyaluran Lapangan
│   │   ├── dampak/                        # Laporan Dampak & Unduh Audit
│   │   ├── verifikasi-bukti/              # Validasi SBMZ & Bukti Setor Publik
│   │   ├── tanya-zis/                     # Tanya Fiqih & Asisten Digital
│   │   ├── pengajuan-bantuan/             # Landing, Form Multi-Step, Tracking Status
│   │   ├── tentang/                       # Profil Lembaga & Legalitas
│   │   ├── kebijakan-privasi/             # Kebijakan Privasi
│   │   └── syarat-ketentuan/              # Syarat & Ketentuan
│   ├── components/
│   │   ├── ui/                            # Primitives (Button, Card, Badge, Input, Progress, Tabs, Accordion)
│   │   ├── layout/                        # SiteHeader, SiteFooter, MobileNav, Breadcrumbs
│   │   ├── shared/                        # SectionHeading, PageHero, StatusBadge, MoneyText, EmptyState, ShareButtons, ReceiptPreview
│   │   ├── home/                          # HeroCarousel, QuickActions, FeaturedCampaigns, ImpactOverview, LatestReports, AssistanceCallout, Testimonials, FAQ
│   │   ├── campaign/                      # CampaignCard, Grid, Filters, Updates, DonorList, DonationSidebar
│   │   ├── donation/                      # DonationForm, FundType, Presets, PaymentMethods
│   │   ├── payment/                       # PaymentInstructionScreen, DemoStatusControls
│   │   ├── zakat/                         # ZakatCalculator (Maal, Profesi, Fitrah)
│   │   ├── verification/                  # VerificationForm & Certificate Display
│   │   ├── faq/                           # FaqView & MockDigitalAssistant
│   │   └── assistance/                    # AssistanceLanding, MultiStepForm, StatusTimeline
│   ├── config/                            # Design Tokens, Site Config, Zakat, Navigation, Assistance Rules
│   ├── lib/                               # Currency, Date, Validation (Zod), Deterministic QR Generator, utils (cn)
│   ├── mocks/                             # Seed Data Fixtures (Campaigns, Reports, Impact, FAQ, Partners, Submissions)
│   ├── services/                          # Service Abstraction Layer (Campaign, Donation, Distribution, Impact, Verification, Assistance)
│   └── types/                             # TypeScript Interfaces (9 Data Models)
├── public/                                # Static Assets
├── .env.example                           # Template Environment Variables
├── .env.local                             # Local Environment Variables
├── next.config.ts                         # Next.js Configuration
├── package.json                           # Dependencies & Scripts
├── tailwind.config.ts                     # Tailwind CSS Palette & Typography
└── tsconfig.json                          # TypeScript Strict Configuration
```

---

## 🚀 Cara Menjalankan Secara Lokal

1. **Masuk ke folder web**:
   ```bash
   cd web
   ```

2. **Instalasi Dependencies (jika belum)**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

4. **Buka di Peramban**:
   Akses [http://localhost:3000](http://localhost:3000) di browser Anda.

5. **Build untuk Produksi**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔌 Panduan Integrasi Backend (Phase 2)

Aplikasi ini menggunakan **Service Layer Pattern**. Seluruh pengambilan data dan mutasi dilakukan melalui service interface di `src/services/`.

Untuk menghubungkan ke backend REST API / ERP AmanahZakat:

1. **Ubah Konfigurasi Environment (`.env.local`)**:
   ```env
   NEXT_PUBLIC_DATA_MODE=api
   NEXT_PUBLIC_API_BASE_URL=https://api.amanahzakat.id/api/v1
   NEXT_PUBLIC_ENABLE_DEMO_PAYMENT_CONTROLS=false
   ```

2. **Endpoints yang Diharapkan Backend**:
   - `GET /campaigns` & `GET /campaigns/:slug`: Mengembalikan katalog dan detail program kampanye.
   - `POST /donations/payment-intent`: Membuat transaksi baru dan mengembalikan instruksi pembayaran (No. VA, QRIS string, waktu kedaluwarsa).
   - `GET /donations/payment-status/:transactionId`: Memeriksa status transaksi (`PENDING`, `PAID`, `EXPIRED`, `FAILED`).
   - `GET /donations/receipt/:transactionId`: Mengambil metadata Surat Bukti Membayar Zakat (SBMZ) atau Bukti Setor resmi.
   - `GET /distributions/reports` & `GET /distributions/reports/:slug`: Mengambil kabar lapangan penyaluran ZIS.
   - `GET /impact/metrics`, `/impact/allocations`, `/impact/stories`, `/impact/reports`: Mengambil data laporan dampak publik.
   - `GET /verification/document?code=XXX`: Memvalidasi nomor bukti setor / SBMZ resmi.
   - `POST /assistance/submissions`: Menerima permohonan bantuan karyawan (multipart/form-data untuk proposal dan lampiran).
   - `GET /assistance/submissions/:submissionNumber/status`: Mengambil status dan riwayat tahapan verifikasi pengajuan bantuan.

Semua REST Service implementation telah disediakan di folder `src/services/` dengan error handling dan fallback ke mock data jika endpoint API belum aktif.
