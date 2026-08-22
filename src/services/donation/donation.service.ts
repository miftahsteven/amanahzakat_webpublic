import { CreateDonationPaymentRequest, PaymentStatus } from "@/types/donation.types";
import { PaymentInstruction, ReceiptData } from "@/types/payment.types";

export interface DonationService {
  createDonationPayment(
    payload: CreateDonationPaymentRequest
  ): Promise<PaymentInstruction>;

  getPaymentStatus(transactionId: string): Promise<PaymentInstruction | null>;

  updatePaymentStatusForDemo(
    transactionId: string,
    status: PaymentStatus,
    reason?: string
  ): Promise<PaymentInstruction | null>;

  getReceiptData(transactionId: string): Promise<ReceiptData | null>;
}
