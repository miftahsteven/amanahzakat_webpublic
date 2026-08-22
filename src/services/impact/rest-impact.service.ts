import { AnnualReportDoc, BeneficiaryStory, FundAllocationItem, ImpactMetric } from "@/types/impact.types";
import { ImpactService } from "./impact.service";
import { MockImpactService } from "./mock-impact.service";

export class RestImpactService implements ImpactService {
  private fallbackMock = new MockImpactService();
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005/api/v1/public";

  private getApiUrl(path: string) {
    const base = this.baseUrl.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  private async fetchImpactData() {
    try {
      const res = await fetch(this.getApiUrl("/impact/summary"), { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async getImpactMetrics(): Promise<ImpactMetric[]> {
    const data = await this.fetchImpactData();
    if (data?.metrics) return data.metrics;
    return this.fallbackMock.getImpactMetrics();
  }

  async getFundAllocations(): Promise<FundAllocationItem[]> {
    const data = await this.fetchImpactData();
    if (data?.fundAllocations) return data.fundAllocations;
    return this.fallbackMock.getFundAllocations();
  }

  async getBeneficiaryStories(): Promise<BeneficiaryStory[]> {
    const data = await this.fetchImpactData();
    if (data?.beneficiaryStories) return data.beneficiaryStories;
    return this.fallbackMock.getBeneficiaryStories();
  }

  async getAnnualReports(): Promise<AnnualReportDoc[]> {
    const data = await this.fetchImpactData();
    if (data?.annualReports) return data.annualReports;
    return this.fallbackMock.getAnnualReports();
  }
}
