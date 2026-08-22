import { DistributionReport } from "@/types/distribution.types";
import { DistributionService } from "./distribution.service";
import { initialDistributions } from "@/mocks/distributions";

export class MockDistributionService implements DistributionService {
  private reports: DistributionReport[] = [...initialDistributions];

  async listReports(category?: string): Promise<DistributionReport[]> {
    if (!category || category === "Semua" || category === "all") {
      return [...this.reports];
    }
    return this.reports.filter((r) => r.program.toLowerCase() === category.toLowerCase());
  }

  async getReportBySlug(slug: string): Promise<DistributionReport | null> {
    const found = this.reports.find((r) => r.slug === slug);
    return found ? { ...found } : null;
  }

  async getLatestReports(limit = 3): Promise<DistributionReport[]> {
    return this.reports.slice(0, limit);
  }

  async getAggregateStats() {
    const totalReports = this.reports.length;
    const totalAmount = this.reports.reduce((sum, r) => sum + r.nominal, 0);
    const totalBeneficiaries = this.reports.reduce((sum, r) => sum + r.penerima, 0);
    return { totalReports, totalAmount, totalBeneficiaries };
  }
}
