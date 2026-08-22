import { DistributionReport } from "@/types/distribution.types";
import { DistributionService } from "./distribution.service";
import { MockDistributionService } from "./mock-distribution.service";

export class RestDistributionService implements DistributionService {
  private fallbackMock = new MockDistributionService();
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005/api/v1/public";

  private getApiUrl(path: string) {
    const base = this.baseUrl.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  async listReports(category?: string): Promise<DistributionReport[]> {
    try {
      const url = category && category !== "Semua"
        ? this.getApiUrl(`/distributions?program=${encodeURIComponent(category)}`)
        : this.getApiUrl("/distributions");
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch distributions");
      return res.json();
    } catch {
      return this.fallbackMock.listReports(category);
    }
  }

  async getReportBySlug(slug: string): Promise<DistributionReport | null> {
    try {
      const res = await fetch(this.getApiUrl(`/distributions/${slug}`), { cache: "no-store" });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return this.fallbackMock.getReportBySlug(slug);
    }
  }

  async getLatestReports(limit: number = 4): Promise<DistributionReport[]> {
    try {
      const reports = await this.listReports();
      return reports.slice(0, limit);
    } catch {
      return this.fallbackMock.getLatestReports(limit);
    }
  }

  async getAggregateStats() {
    return this.fallbackMock.getAggregateStats();
  }
}
