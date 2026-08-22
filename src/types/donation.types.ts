export type FundType = "ZAKAT" | "INFAQ" | "SHODAQOH" | "WAQF_CASH";

export type PaymentChannel =
  | "VIRTUAL_ACCOUNT"
  | "QRIS"
  | "EWALLET"
  | "BANK_TRANSFER";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "EXPIRED"
  | "FAILED"
  | "CANCELLED";

export interface DonorInfo {
  fullName: string;
  contact: string; // Email or WhatsApp
  anonymous: boolean;
  npwp?: string;
}

export interface CreateDonationPaymentRequest {
  campaignId?: number;
  campaignTitle?: string;
  fundType: FundType;
  amount: number;
  donor: DonorInfo;
  message?: string;
  channel: PaymentChannel;
}

export interface PaymentChannelOption {
  id: PaymentChannel;
  name: string;
  providerLabel: string;
  category: "QRIS" | "VIRTUAL_ACCOUNT" | "EWALLET" | "BANK_TRANSFER";
  expiryHours: number;
  icon: string;
  description: string;
}
