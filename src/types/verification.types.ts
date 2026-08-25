export interface VerificationResult {
  isValid: boolean;
  documentNumber: string;
  noKwitansi?: string;
  noSbmz?: string;
  donorName?: string;
  fundType?: string;
  amount?: number;
  formattedAmount?: string;
  campaignTitle?: string;
  paymentMethod?: string;
  paymentDate?: string;
  status?: string;
  glAccount?: string;
  institutionName?: string;
  institutionNpwp?: string;
  notes?: string;
  errorMessage?: string;
}
