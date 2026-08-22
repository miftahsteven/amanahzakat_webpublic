export type FaqCategory =
  | "Semua"
  | "Dasar ZIS"
  | "Zakat Maal"
  | "Zakat Profesi"
  | "Pertanian & Tambang"
  | "Infak & Shodaqoh"
  | "Pajak & Bukti"
  | "Teknis Donasi";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string; // May contain | for paragraph breaks
  sourceReference: string;
}

export interface ZisAssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
  timestamp: string;
}
