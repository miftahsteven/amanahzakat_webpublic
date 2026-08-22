import { AnnualReportDoc, BeneficiaryStory, FundAllocationItem, ImpactMetric } from "@/types/impact.types";

export interface ImpactService {
  getImpactMetrics(): Promise<ImpactMetric[]>;
  getFundAllocations(): Promise<FundAllocationItem[]>;
  getBeneficiaryStories(): Promise<BeneficiaryStory[]>;
  getAnnualReports(): Promise<AnnualReportDoc[]>;
}
