import { VerificationResult } from "@/types/verification.types";
import { VerificationService } from "./verification.service";
import { donationService } from "../donation";
import { formatIDR } from "@/lib/currency";
import { formatDateIndonesian } from "@/lib/date";

export class MockVerificationService implements VerificationService {
  async verifyDocument(documentNumberOrTxId: string): Promise<VerificationResult> {
    const query = String(documentNumberOrTxId || "").trim().toUpperCase().replace(/\s+/g, "");
    if (!query) {
      return {
        isValid: false,
        documentNumber: query,
        errorMessage: "Nomor bukti setor atau SBMZ tidak boleh kosong.",
      };
    }

    // 1. Try to find in local donation storage / mock donations
    const tx = await donationService.getPaymentStatus(query);
    if (tx && tx.status === "PAID") {
      const receipt = await donationService.getReceiptData(tx.transactionId);
      return {
        isValid: true,
        documentNumber: receipt?.documentNumber || tx.transactionId,
        donorName: tx.donorName,
        fundType: tx.fundType === "ZAKAT" ? "Zakat Maal & Profesi" : tx.fundType,
        amount: tx.amount,
        formattedAmount: formatIDR(tx.amount),
        campaignTitle: tx.campaignTitle,
        paymentMethod: tx.channelLabel,
        paymentDate: formatDateIndonesian(tx.paidAt || tx.createdAt),
        glAccount: receipt?.glAccount,
        institutionName: "AmanahZakat — LAZNAS Berizin Kementerian Agama RI",
        institutionNpwp: "01.234.567.8-041.000",
        notes: receipt?.notes,
      };
    }

    // 2. Known seed records from UI Reference
    interface SeedDocRecord {
      documentNumber: string;
      donorName: string;
      fundType: string;
      amount: number;
      campaignTitle: string;
      paymentMethod: string;
      paymentDate: string;
      glAccount: string;
    }

    const seedRecords: Record<string, SeedDocRecord> = {
      "ZIS-260726-014": {
        documentNumber: "SBMZ/2026/07/260726014",
        donorName: "Hj. Sundari Wibowo",
        fundType: "Zakat Maal",
        amount: 25000000,
        campaignTitle: "Penerimaan Konter & Layanan Muzakki",
        paymentMethod: "Transfer Bank Mandiri Syariah",
        paymentDate: "26 Juli 2026",
        glAccount: "4011000030 — Penerimaan Zakat Maal",
      },
      "SBMZ/2026/07/ASK004182": {
        documentNumber: "SBMZ/2026/07/ASK004182",
        donorName: "Fitria Handayani",
        fundType: "Zakat Profesi (Payroll UPZ Karyawan)",
        amount: 712500,
        campaignTitle: "Payroll Potong Gaji UPZ Mitra",
        paymentMethod: "Payroll Amil Terpadu",
        paymentDate: "25 Juli 2026",
        glAccount: "4011000010 — Penerimaan Zakat Profesi Potong Gaji",
      },
      "SBMZ-2026-07-ASK004182": {
        documentNumber: "SBMZ/2026/07/ASK004182",
        donorName: "Fitria Handayani",
        fundType: "Zakat Profesi (Payroll UPZ Karyawan)",
        amount: 712500,
        campaignTitle: "Payroll Potong Gaji UPZ Mitra",
        paymentMethod: "Payroll Amil Terpadu",
        paymentDate: "25 Juli 2026",
        glAccount: "4011000010 — Penerimaan Zakat Profesi Potong Gaji",
      },
    };

    if (seedRecords[query]) {
      const rec = seedRecords[query];
      return {
        isValid: true,
        documentNumber: rec.documentNumber,
        donorName: rec.donorName,
        fundType: rec.fundType,
        amount: rec.amount,
        formattedAmount: formatIDR(rec.amount),
        campaignTitle: rec.campaignTitle,
        paymentMethod: rec.paymentMethod,
        paymentDate: rec.paymentDate,
        glAccount: rec.glAccount,
        institutionName: "AmanahZakat — LAZNAS Berizin Kementerian Agama RI",
        institutionNpwp: "01.234.567.8-041.000",
        notes:
          "Dokumen ini sah dan tercatat dalam pembukuan resmi AmanahZakat. Sesuai PP No. 60 Tahun 2010 dan PMK No. 254/PMK.03/2010, dokumen ini dapat dilampirkan pada SPT Tahunan sebagai pengurang Penghasilan Bruto.",
      };
    }

    return {
      isValid: false,
      documentNumber: query,
      errorMessage:
        "Dokumen tidak ditemukan dalam database publik AmanahZakat. Pastikan nomor bukti setor atau SBMZ yang Anda masukkan sudah benar.",
    };
  }

  async verifyBszSigned(ref: string, _sig: string): Promise<VerificationResult> {
    // Mock mode: ignore HMAC and resolve by document number for local demos.
    const result = await this.verifyDocument(ref);
    if (result.isValid) {
      return {
        ...result,
        noKwitansi: result.noKwitansi || result.documentNumber,
        noSbmz: result.noSbmz || result.documentNumber,
        status: result.status || "Terverifikasi",
        notes:
          result.notes ||
          "Bukti setor ini sah tanpa tanda tangan basah dan dapat digunakan sebagai pengurang penghasilan kena pajak sesuai PP No. 60 Tahun 2010.",
      };
    }
    return {
      isValid: false,
      documentNumber: ref,
      errorMessage:
        "Tautan verifikasi tidak cocok dengan data mock. Aktifkan NEXT_PUBLIC_DATA_MODE=api untuk uji signed URL nyata.",
    };
  }
}
