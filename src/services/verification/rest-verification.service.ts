import { VerificationResult } from "@/types/verification.types";
import { VerificationService } from "./verification.service";
import { MockVerificationService } from "./mock-verification.service";

export class RestVerificationService implements VerificationService {
  private fallbackMock = new MockVerificationService();
  private baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005/api/v1/public";

  private getApiUrl(path: string) {
    const base = this.baseUrl.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  async verifyDocument(documentNumberOrTxId: string): Promise<VerificationResult> {
    try {
      const url = this.getApiUrl(
        `/verification?code=${encodeURIComponent(documentNumberOrTxId)}`
      );
      const res = await fetch(url, { cache: "no-store" });
      const data = (await res.json()) as VerificationResult;
      if (res.ok && data.isValid) return data;
      if (data && typeof data.isValid === "boolean") return data;
      return this.fallbackMock.verifyDocument(documentNumberOrTxId);
    } catch {
      return this.fallbackMock.verifyDocument(documentNumberOrTxId);
    }
  }

  async verifyBszSigned(ref: string, sig: string): Promise<VerificationResult> {
    const qs = new URLSearchParams({ ref, sig });
    const url = this.getApiUrl(`/verification/bsz?${qs.toString()}`);
    const res = await fetch(url, { cache: "no-store" });
    const data = (await res.json()) as VerificationResult;
    if (data && typeof data.isValid === "boolean") return data;
    return {
      isValid: false,
      documentNumber: ref,
      errorMessage: "Gagal memverifikasi tautan bukti setor.",
    };
  }
}
