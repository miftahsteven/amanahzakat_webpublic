import { VerificationResult } from "@/types/verification.types";

export interface VerificationService {
  verifyDocument(documentNumberOrTxId: string): Promise<VerificationResult>;
}
