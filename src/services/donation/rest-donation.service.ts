import { CreateDonationPaymentRequest, PaymentStatus } from "@/types/donation.types";
import { PaymentInstruction, ReceiptData } from "@/types/payment.types";
import { DonationService } from "./donation.service";
import { MockDonationService } from "./mock-donation.service";

export class RestDonationService implements DonationService {
  private fallbackMock = new MockDonationService();
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005/api/v1/public";

  private getApiUrl(path: string) {
    const base = this.baseUrl.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  async createDonationPayment(
    payload: CreateDonationPaymentRequest
  ): Promise<PaymentInstruction> {
    try {
      const res = await fetch(this.getApiUrl("/donations/payments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create payment");
      return res.json();
    } catch {
      return this.fallbackMock.createDonationPayment(payload);
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentInstruction | null> {
    try {
      const res = await fetch(this.getApiUrl(`/donations/${transactionId}`), {
        cache: "no-store",
      });
      if (!res.ok) return this.fallbackMock.getPaymentStatus(transactionId);
      return res.json();
    } catch {
      return this.fallbackMock.getPaymentStatus(transactionId);
    }
  }

  async updatePaymentStatusForDemo(
    transactionId: string,
    status: PaymentStatus,
    reason?: string
  ): Promise<PaymentInstruction | null> {
    try {
      const res = await fetch(this.getApiUrl(`/donations/${transactionId}/pay`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status.toUpperCase(), reason }),
      });
      if (!res.ok) throw new Error("Failed to update status on server");
      return res.json();
    } catch {
      return this.fallbackMock.updatePaymentStatusForDemo(transactionId, status, reason);
    }
  }

  async getReceiptData(transactionId: string): Promise<ReceiptData | null> {
    try {
      const res = await fetch(this.getApiUrl(`/donations/${transactionId}/receipt`), {
        cache: "no-store",
      });
      if (!res.ok) return this.fallbackMock.getReceiptData(transactionId);
      return res.json();
    } catch {
      return this.fallbackMock.getReceiptData(transactionId);
    }
  }
}
