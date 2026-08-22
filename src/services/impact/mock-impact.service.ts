import { AnnualReportDoc, BeneficiaryStory, FundAllocationItem, ImpactMetric } from "@/types/impact.types";
import { ImpactService } from "./impact.service";
import {
  mockAnnualReports,
  mockBeneficiaryStories,
  mockFundAllocations,
  mockImpactMetrics,
} from "@/mocks/impact";

export class MockImpactService implements ImpactService {
  async getImpactMetrics(): Promise<ImpactMetric[]> {
    return [...mockImpactMetrics];
  }

  async getFundAllocations(): Promise<FundAllocationItem[]> {
    return [...mockFundAllocations];
  }

  async getBeneficiaryStories(): Promise<BeneficiaryStory[]> {
    return [...mockBeneficiaryStories];
  }

  async getAnnualReports(): Promise<AnnualReportDoc[]> {
    return [...mockAnnualReports];
  }
}
