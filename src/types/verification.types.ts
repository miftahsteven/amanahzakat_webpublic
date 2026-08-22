export interface VerificationResult {
  isValid: boolean;
  documentNumber: string;
  donorName?: string;
  fundType?: string;
  amount?: number;
  formattedAmount?: string;
  campaignTitle?: string;
  paymentMethod?: string;
  paymentDate?: string;
  glAccount?: string;
  institutionName?: string;
  institutionNpwp?: string;
  notes?: string;
  errorMessage?: string;
}
