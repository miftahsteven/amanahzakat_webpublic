import { DistributionReport } from "@/types/distribution.types";

export interface DistributionService {
  listReports(category?: string): Promise<DistributionReport[]>;
  getReportBySlug(slug: string): Promise<DistributionReport | null>;
  getLatestReports(limit?: number): Promise<DistributionReport[]>;
  getAggregateStats(): Promise<{
    totalReports: number;
    totalAmount: number;
    totalBeneficiaries: number;
  }>;
}
