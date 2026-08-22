import { z } from "zod";

export const donationFormSchema = z.object({
  campaignId: z.number().optional(),
  campaignTitle: z.string().optional(),
  fundType: z.enum(["ZAKAT", "INFAQ", "SHODAQOH", "WAQF_CASH"], {
    required_error: "Pilih jenis dana ZIS",
  }),
  amount: z
    .number({ invalid_type_error: "Nominal donasi harus berupa angka" })
    .min(10000, "Nominal donasi minimal Rp 10.000"),
  fullName: z.string().min(1, "Nama donatur wajib diisi"),
  contact: z
    .string()
    .min(5, "Nomor WhatsApp atau Email wajib diisi")
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
        /^[0-9+-\s]{8,16}$/.test(val),
      "Masukkan alamat email atau nomor WhatsApp yang valid"
    ),
  isAnonymous: z.boolean().default(false),
  message: z.string().max(500, "Doa atau pesan maksimal 500 karakter").optional(),
  channel: z.enum(["VIRTUAL_ACCOUNT", "QRIS", "EWALLET", "BANK_TRANSFER"], {
    required_error: "Pilih metode pembayaran",
  }),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "Anda harus menyetujui kebijakan privasi dan kebenaran data" }),
  }),
});

export type DonationFormSchemaValues = z.infer<typeof donationFormSchema>;

export const applicantStepSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  employeeId: z.string().min(3, "Nomor Induk Karyawan / NIP wajib diisi"),
  company: z.string().min(2, "Nama Perusahaan / Unit Kerja wajib diisi"),
  department: z.string().optional(),
  position: z.string().optional(),
  email: z.string().email("Alamat email tidak valid"),
  phone: z
    .string()
    .min(9, "Nomor WhatsApp minimal 9 digit")
    .regex(/^[0-9+-\s]+$/, "Nomor WhatsApp hanya boleh angka dan tanda +"),
  domicileCity: z.string().min(2, "Kota / Kabupaten domisili wajib diisi"),
});

export const assistanceDetailStepSchema = z.object({
  category: z.enum(
    ["HEALTH", "EDUCATION", "DISASTER", "ECONOMIC", "FAMILY_EMERGENCY", "OTHER"],
    { required_error: "Pilih kategori bantuan" }
  ),
  title: z.string().min(5, "Judul pengajuan minimal 5 karakter"),
  description: z.string().min(20, "Uraikan kebutuhan bantuan minimal 20 karakter"),
  requestedAmount: z
    .number({ invalid_type_error: "Nominal harus berupa angka" })
    .min(100000, "Nominal bantuan yang diajukan minimal Rp 100.000")
    .optional(),
  incidentOrNeedDate: z.string().optional(),
  isSelf: z.boolean().default(true),
  beneficiaryName: z.string().optional(),
  beneficiaryRelationship: z.string().optional(),
  beneficiaryAge: z.number().optional(),
});

export const assistanceConsentsSchema = z.object({
  dataAccuracy: z.literal(true, {
    errorMap: () => ({ message: "Wajib menyetujui pernyataan kebenaran data" }),
  }),
  privacyProcessing: z.literal(true, {
    errorMap: () => ({ message: "Wajib menyetujui pemrosesan data untuk verifikasi" }),
  }),
  submissionNotApproval: z.literal(true, {
    errorMap: () => ({ message: "Wajib memahami bahwa pengajuan tidak otomatis disetujui" }),
  }),
});
