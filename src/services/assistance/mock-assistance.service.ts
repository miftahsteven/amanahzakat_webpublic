import {
  AssistanceCategory,
  CreateAssistanceSubmissionRequest,
  AssistanceSubmissionResponse,
} from "@/types/assistance.types";
import { AssistanceService } from "./assistance.service";
import { initialAssistanceSubmissions } from "@/mocks/assistance-submissions";
import { assistanceCategories } from "@/config/assistance";
import { formatDateTimeIndonesian } from "@/lib/date";

const LOCAL_STORAGE_ASSISTANCE_KEY = "az_assistance_submissions_v1";

export class MockAssistanceService implements AssistanceService {
  private submissions: AssistanceSubmissionResponse[] = [...initialAssistanceSubmissions];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_ASSISTANCE_KEY);
        if (stored) {
          const parsed: AssistanceSubmissionResponse[] = JSON.parse(stored);
          const map = new Map<string, AssistanceSubmissionResponse>();
          [...this.submissions, ...parsed].forEach((s) => map.set(s.submissionNumber, s));
          this.submissions = Array.from(map.values());
        }
      } catch {
        // ignore
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_ASSISTANCE_KEY, JSON.stringify(this.submissions.slice(0, 30)));
      } catch {
        // ignore
      }
    }
  }

  async createSubmission(
    payload: CreateAssistanceSubmissionRequest
  ): Promise<AssistanceSubmissionResponse> {
    this.loadFromStorage();
    const seq = Math.floor(1000 + Math.random() * 9000);
    const submissionId = `sub-${Date.now()}`;
    const submissionNumber = `PMH-2026-${seq}`;
    const nowIso = new Date().toISOString();

    const categoryObj = assistanceCategories.find((c) => c.id === payload.category);
    const categoryLabel = categoryObj ? categoryObj.name : payload.category;

    const response: AssistanceSubmissionResponse = {
      submissionId,
      submissionNumber,
      status: "SUBMITTED",
      statusLabel: "Pengajuan Diterima",
      category: payload.category,
      categoryLabel,
      applicantName: payload.applicant.fullName,
      company: payload.applicant.company,
      title: payload.title,
      requestedAmount: payload.requestedAmount,
      submittedAt: nowIso,
      publicNotes:
        "Pengajuan baru telah tercatat dan masuk ke antrean verifikasi kelengkapan dokumen amil AmanahZakat.",
      timeline: [
        {
          status: "SUBMITTED",
          label: "Pengajuan Diterima",
          date: formatDateTimeIndonesian(nowIso),
          description: "Pengajuan online berhasil didaftarkan ke sistem penerimaan AmanahZakat.",
          isCompleted: true,
          isCurrent: true,
        },
        {
          status: "DOCUMENT_REVIEW",
          label: "Pemeriksaan Dokumen",
          date: "Estimasi 1-2 hari kerja",
          description: "Tim amil memeriksa kelengkapan proposal dan dokumen pendukung.",
          isCompleted: false,
          isCurrent: false,
        },
        {
          status: "VERIFIED",
          label: "Verifikasi Kelayakan",
          date: "Tahap berikutnya",
          description: "Verifikasi data dan konfirmasi kelayakan mustahik.",
          isCompleted: false,
          isCurrent: false,
        },
        {
          status: "APPROVED",
          label: "Keputusan Komite",
          date: "Tahap akhir",
          description: "Penetapan persetujuan dan nominal penyaluran bantuan.",
          isCompleted: false,
          isCurrent: false,
        },
      ],
    };

    this.submissions.unshift(response);
    this.saveToStorage();
    return response;
  }

  async getSubmissionStatus(submissionNumber: string): Promise<AssistanceSubmissionResponse | null> {
    this.loadFromStorage();
    const cleanNo = String(submissionNumber || "").trim().toUpperCase().replace(/\s+/g, "");
    const found = this.submissions.find(
      (s) =>
        s.submissionNumber.toUpperCase() === cleanNo ||
        s.submissionId.toUpperCase() === cleanNo
    );
    return found ? { ...found } : null;
  }

  async getCategories(): Promise<AssistanceCategory[]> {
    return assistanceCategories.map((c) => c.id);
  }
}
