import { VerificationResult } from "@/types/verification.types";
import { VerificationService } from "./verification.service";
import { MockVerificationService } from "./mock-verification.service";

export class RestVerificationService implements VerificationService {
  private fallbackMock = new MockVerificationService();
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005/api/v1/public";

  private getApiUrl(path: string) {
    const base = this.baseUrl.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  async verifyDocument(documentNumberOrTxId: string): Promise<VerificationResult> {
    try {
      const url = this.getApiUrl(`/verification?code=${encodeURIComponent(documentNumberOrTxId)}`);
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        return await res.json();
      }
      return this.fallbackMock.verifyDocument(documentNumberOrTxId);
    } catch {
      return this.fallbackMock.verifyDocument(documentNumberOrTxId);
    }
  }
}
