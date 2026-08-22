import {
  AssistanceCategory,
  CreateAssistanceSubmissionRequest,
  AssistanceSubmissionResponse,
} from "@/types/assistance.types";
import { AssistanceService } from "./assistance.service";
import { MockAssistanceService } from "./mock-assistance.service";

export class RestAssistanceService implements AssistanceService {
  private fallbackMock = new MockAssistanceService();
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005/api/v1/public";

  private getApiUrl(path: string) {
    const base = this.baseUrl.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  async createSubmission(
    payload: CreateAssistanceSubmissionRequest
  ): Promise<AssistanceSubmissionResponse> {
    try {
      const res = await fetch(this.getApiUrl("/assistance/submit"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create submission");
      return res.json();
    } catch {
      return this.fallbackMock.createSubmission(payload);
    }
  }

  async getSubmissionStatus(
    submissionNumber: string
  ): Promise<AssistanceSubmissionResponse | null> {
    try {
      const res = await fetch(
        this.getApiUrl(`/assistance/check/${encodeURIComponent(submissionNumber)}`),
        { cache: "no-store" }
      );
      if (!res.ok) return null;
      return res.json();
    } catch {
      return this.fallbackMock.getSubmissionStatus(submissionNumber);
    }
  }

  async getCategories(): Promise<AssistanceCategory[]> {
    return this.fallbackMock.getCategories();
  }
}
