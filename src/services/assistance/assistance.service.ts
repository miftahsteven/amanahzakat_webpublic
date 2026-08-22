import {
  AssistanceCategory,
  CreateAssistanceSubmissionRequest,
  AssistanceSubmissionResponse,
} from "@/types/assistance.types";

export interface AssistanceService {
  createSubmission(
    payload: CreateAssistanceSubmissionRequest
  ): Promise<AssistanceSubmissionResponse>;

  getSubmissionStatus(
    submissionNumber: string
  ): Promise<AssistanceSubmissionResponse | null>;

  getCategories(): Promise<AssistanceCategory[]>;
}
