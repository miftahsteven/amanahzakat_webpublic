import { FundType, PaymentChannelOption } from "@/types/donation.types";

export const fundTypeOptions: { type: FundType; label: string; description: string; isTaxDeductible: boolean }[] = [
  {
    type: "ZAKAT",
    label: "Zakat",
    description: "Kewajiban syariat bagi muslim yang hartanya mencapai nisab. Menerbitkan SBMZ untuk pengurang pajak SPT.",
    isTaxDeductible: true,
  },
  {
    type: "INFAQ",
    label: "Infak",
    description: "Donasi kebaikan untuk kemaslahatan umum, operasional program, dan pembangunan sarana sosial.",
    isTaxDeductible: false,
  },
  {
    type: "SHODAQOH",
    label: "Shodaqoh",
    description: "Sedekah sukarela tanpa batasan untuk membantu dhuafa dan sesama yang membutuhkan.",
    isTaxDeductible: false,
  },
  {
    type: "WAQF_CASH",
    label: "Wakaf Uang",
    description: "Wakaf produktif abadi yang manfaat pokoknya dialokasikan berkelanjutan bagi umat.",
    isTaxDeductible: false,
  },
];

export const donationPresets = [
  25000,
  50000,
  100000,
  250000,
  500000,
  1000000,
];

export const minDonationAmount = 10000;

export const paymentChannelOptions: PaymentChannelOption[] = [
  {
    id: "QRIS",
    name: "QRIS (Semua Pembayaran)",
    providerLabel: "QRIS — BCA, Mandiri, GoPay, OVO, DANA, ShopeePay",
    category: "QRIS",
    expiryHours: 1,
    icon: "QrCode",
    description: "Pindai instan dari semua m-Banking dan e-Wallet berlogo QRIS.",
  },
  {
    id: "VIRTUAL_ACCOUNT",
    name: "Virtual Account Syariah",
    providerLabel: "Bank Syariah Indonesia (BSI)",
    category: "VIRTUAL_ACCOUNT",
    expiryHours: 24,
    icon: "CreditCard",
    description: "Nomor rekening otomatis verifikasi instan 24 jam.",
  },
  {
    id: "EWALLET",
    name: "E-Wallet",
    providerLabel: "GoPay / OVO / DANA / ShopeePay",
    category: "EWALLET",
    expiryHours: 2,
    icon: "Wallet",
    description: "Buka langsung aplikasi e-wallet atau bayar via notifikasi.",
  },
  {
    id: "BANK_TRANSFER",
    name: "Transfer Bank Manual",
    providerLabel: "Bank Mandiri / BCA / BNI",
    category: "BANK_TRANSFER",
    expiryHours: 24,
    icon: "Building2",
    description: "Transfer antarbank ke rekening resmi yayasan.",
  },
];
