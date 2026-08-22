export type AssistanceCategory =
  | "HEALTH"
  | "EDUCATION"
  | "DISASTER"
  | "ECONOMIC"
  | "FAMILY_EMERGENCY"
  | "OTHER";

export type AssistanceStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "DOCUMENT_REVIEW"
  | "NEEDS_REVISION"
  | "VERIFIED"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "DISTRIBUTED"
  | "CLOSED";

export interface AssistanceApplicant {
  fullName: string;
  employeeId: string; // NIP Karyawan
  company: string;     // Perusahaan / Unit
  workUnit?: string;   // Unit kerja
  department?: string; // Divisi/Departemen
  position?: string;   // Jabatan
  email: string;
  phone: string;
  domicileCity?: string;
}

export interface AssistanceBeneficiary {
  isSelf: boolean;
  fullName?: string;
  relationship?: string;
  age?: number;
}

export interface AssistanceDocumentDraft {
  localId: string;
  documentType: string;
  fileName: string;
  mimeType: string;
  size: number;
  localPreviewUrl?: string;
}

export interface RequiredDocumentRule {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedMimeTypes: string[];
  maxSizeMb: number;
  categories?: AssistanceCategory[];
}

export interface CreateAssistanceSubmissionRequest {
  applicant: AssistanceApplicant;
  category: AssistanceCategory;
  title: string;
  description: string;
  requestedAmount?: number;
  incidentOrNeedDate?: string;
  beneficiary: AssistanceBeneficiary;
  documents: AssistanceDocumentDraft[];
  consents: {
    dataAccuracy: boolean;
    privacyProcessing: boolean;
    submissionNotApproval: boolean;
  };
}

export interface AssistanceStatusHistoryItem {
  status: AssistanceStatus;
  label: string;
  date: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface AssistanceSubmissionResponse {
  submissionId: string;
  submissionNumber: string; // e.g. PMH-2026-0801
  status: AssistanceStatus;
  statusLabel: string;
  category: AssistanceCategory;
  categoryLabel: string;
  applicantName: string;
  company: string;
  title: string;
  requestedAmount?: number;
  submittedAt: string;
  timeline: AssistanceStatusHistoryItem[];
  publicNotes?: string;
}
