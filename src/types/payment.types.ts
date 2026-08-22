import { FundType, PaymentChannel, PaymentStatus } from "./donation.types";

export interface PaymentInstruction {
  transactionId: string;
  campaignId?: number;
  campaignTitle?: string;
  fundType: FundType;
  amount: number;
  uniqueCode: number;
  totalAmount: number;
  donorName: string;
  donorContact: string;
  isAnonymous: boolean;
  channel: PaymentChannel;
  providerLabel: string;
  channelLabel: string;
  virtualAccountNumber?: string;
  qrString?: string;
  deeplinkUrl?: string;
  status: PaymentStatus;
  createdAt: string;
  expiresAt: string;
  paidAt?: string;
  failureReason?: string;
  message?: string;
}

export interface ReceiptData {
  documentNumber: string;
  transactionId: string;
  isZakat: boolean;
  documentTitle: string;
  donorName: string;
  fundType: string;
  campaignTitle: string;
  amount: number;
  paymentMethod: string;
  paidAt: string;
  glAccount: string;
  qrPayload: string;
  qrUrl: string;
  notes: string;
}
