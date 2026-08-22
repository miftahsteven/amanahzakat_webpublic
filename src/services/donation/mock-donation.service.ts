import { CreateDonationPaymentRequest, PaymentStatus } from "@/types/donation.types";
import { PaymentInstruction, ReceiptData } from "@/types/payment.types";
import { DonationService } from "./donation.service";
import { initialDonationTransactions } from "@/mocks/donations";
import { formatDateIndonesian } from "@/lib/date";

const LOCAL_STORAGE_KEY = "az_public_donations_v1";

export class MockDonationService implements DonationService {
  private transactions: PaymentInstruction[] = [...initialDonationTransactions];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed: PaymentInstruction[] = JSON.parse(stored);
          const map = new Map<string, PaymentInstruction>();
          [...this.transactions, ...parsed].forEach((t) => map.set(t.transactionId, t));
          this.transactions = Array.from(map.values());
        }
      } catch {
        // ignore storage errors
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.transactions.slice(0, 50)));
      } catch {
        // ignore storage errors
      }
    }
  }

  async createDonationPayment(
    payload: CreateDonationPaymentRequest
  ): Promise<PaymentInstruction> {
    this.loadFromStorage();
    const seq = Date.now().toString().slice(-8);
    const transactionId = `DON-2608-${seq}`;

    let uniqueCode = 0;
    if (payload.channel === "BANK_TRANSFER") {
      uniqueCode = 100 + ((payload.donor.fullName.length * 37) % 800);
    }

    const totalAmount = payload.amount + uniqueCode;
    const now = new Date();
    const expiryHours = payload.channel === "QRIS" ? 1 : payload.channel === "EWALLET" ? 2 : 24;
    const expiresAt = new Date(now.getTime() + expiryHours * 3600 * 1000).toISOString();

    let vaNumber: string | undefined;
    let providerLabel = "Bank Syariah Indonesia (BSI)";
    let channelLabel = "Virtual Account";

    if (payload.channel === "VIRTUAL_ACCOUNT") {
      vaNumber = `8907${seq}`;
      providerLabel = "Bank Syariah Indonesia (BSI)";
      channelLabel = "Virtual Account Syariah";
    } else if (payload.channel === "QRIS") {
      providerLabel = "QRIS (Semua Pembayaran)";
      channelLabel = "QRIS Instan";
    } else if (payload.channel === "EWALLET") {
      providerLabel = "GoPay / OVO / DANA";
      channelLabel = "E-Wallet";
    } else if (payload.channel === "BANK_TRANSFER") {
      providerLabel = "Bank Syariah Indonesia (BSI)";
      channelLabel = "Transfer Bank Manual";
    }

    const newInstruction: PaymentInstruction = {
      transactionId,
      campaignId: payload.campaignId,
      campaignTitle: payload.campaignTitle || "Donasi Kemanusiaan Umum",
      fundType: payload.fundType,
      amount: payload.amount,
      uniqueCode,
      totalAmount,
      donorName: payload.donor.anonymous ? "Donatur Anonim (Hamba Allah)" : payload.donor.fullName,
      donorContact: payload.donor.contact,
      isAnonymous: payload.donor.anonymous,
      channel: payload.channel,
      providerLabel,
      channelLabel,
      virtualAccountNumber: vaNumber,
      qrString: payload.channel === "QRIS" ? `00020101021226600016ID.CO.AMANAHZAKAT0115${transactionId}520458125303360540${totalAmount}5802ID5916AMANAHZAKAT6007JAKARTA` : undefined,
      deeplinkUrl: payload.channel === "EWALLET" ? `https://peduli.amanahzakat.id/donasi/pembayaran/${transactionId}` : undefined,
      status: "PENDING",
      createdAt: now.toISOString(),
      expiresAt,
      message: payload.message,
    };

    this.transactions.unshift(newInstruction);
    this.saveToStorage();
    return newInstruction;
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentInstruction | null> {
    this.loadFromStorage();
    const found = this.transactions.find((t) => t.transactionId.toUpperCase() === transactionId.toUpperCase());
    if (!found) return null;

    // Check expiry
    if (found.status === "PENDING" && new Date(found.expiresAt).getTime() < Date.now()) {
      found.status = "EXPIRED";
      this.saveToStorage();
    }

    return { ...found };
  }

  async updatePaymentStatusForDemo(
    transactionId: string,
    status: PaymentStatus,
    reason?: string
  ): Promise<PaymentInstruction | null> {
    this.loadFromStorage();
    const index = this.transactions.findIndex(
      (t) => t.transactionId.toUpperCase() === transactionId.toUpperCase()
    );
    if (index === -1) return null;

    const tx = this.transactions[index];
    tx.status = status;
    if (status === "PAID") {
      tx.paidAt = new Date().toISOString();
    } else if (status === "FAILED") {
      tx.failureReason = reason || "Transaksi dibatalkan atau pembayaran ditolak oleh bank.";
    }

    this.transactions[index] = { ...tx };
    this.saveToStorage();
    return { ...tx };
  }

  async getReceiptData(transactionId: string): Promise<ReceiptData | null> {
    const tx = await this.getPaymentStatus(transactionId);
    if (!tx) return null;

    const isZakat = tx.fundType === "ZAKAT";
    const seq = tx.transactionId.replace(/[^0-9]/g, "");
    const documentNumber = isZakat ? `SBMZ/2026/08/${seq}` : `BSI/2026/08/${seq}`;
    const documentTitle = isZakat ? "Surat Bukti Membayar Zakat (SBMZ)" : "Bukti Setor Infak & Shodaqoh";
    const paidAt = tx.paidAt ? formatDateIndonesian(tx.paidAt) : formatDateIndonesian(tx.createdAt);

    const glAccount =
      tx.fundType === "ZAKAT"
        ? "4011000030 — Penerimaan Zakat Maal & Profesi"
        : tx.fundType === "WAQF_CASH"
        ? "4013000010 — Penerimaan Wakaf Uang"
        : "4012000020 — Penerimaan Infak & Shodaqoh Umum";

    const notes = isZakat
      ? "Dokumen ini sah dan diterbitkan resmi oleh sistem LAZNAS AmanahZakat (SK Menag RI No. 892/2019). Sesuai UU No. 36/2008 Pasal 9, PP No. 60/2010, dan PMK No. 254/PMK.03/2010, SBMZ ini dapat dilampirkan pada SPT Tahunan sebagai pengurang Penghasilan Bruto."
      : "Bukti setor ini menyatakan dana telah diterima di rekening resmi AmanahZakat dan disalurkan sesuai akad peruntukan program.";

    return {
      documentNumber,
      transactionId: tx.transactionId,
      isZakat,
      documentTitle,
      donorName: tx.donorName,
      fundType: tx.fundType,
      campaignTitle: tx.campaignTitle || "Donasi Kemanusiaan",
      amount: tx.amount,
      paymentMethod: `${tx.channelLabel} (${tx.providerLabel})`,
      paidAt,
      glAccount,
      qrPayload: `${tx.transactionId}|${tx.donorName}|${tx.amount}|${documentNumber}`,
      qrUrl: `https://peduli.amanahzakat.id/verifikasi-bukti?code=${encodeURIComponent(tx.transactionId)}`,
      notes,
    };
  }
}
