import { Campaign, CampaignQuery } from "@/types/campaign.types";
import { CampaignService } from "./campaign.service";
import { MockCampaignService } from "./mock-campaign.service";

/**
 * RestCampaignService: Communicates with backend REST API.
 * Falls back to MockCampaignService if API connection fails.
 */
export class RestCampaignService implements CampaignService {
  private fallbackMock = new MockCampaignService();
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005/api/v1/public";

  private getApiUrl(path: string) {
    const base = this.baseUrl.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  async listCampaigns(query?: CampaignQuery): Promise<Campaign[]> {
    try {
      const searchParams = new URLSearchParams();
      if (query?.category) searchParams.set("category", query.category);
      if (query?.search) searchParams.set("q", query.search);
      if (query?.sortBy) searchParams.set("sortBy", query.sortBy);

      const url = this.getApiUrl(`/campaigns?${searchParams.toString()}`);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return res.json();
    } catch {
      return this.fallbackMock.listCampaigns(query);
    }
  }

  async getCampaignBySlug(slug: string): Promise<Campaign | null> {
    try {
      const url = this.getApiUrl(`/campaigns/${slug}`);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return this.fallbackMock.getCampaignBySlug(slug);
    }
  }

  async getCampaignById(id: number): Promise<Campaign | null> {
    try {
      const all = await this.listCampaigns();
      return all.find((c) => c.id === id) || this.fallbackMock.getCampaignById(id);
    } catch {
      return this.fallbackMock.getCampaignById(id);
    }
  }

  async getFeaturedCampaigns(limit: number = 4): Promise<Campaign[]> {
    try {
      const url = this.getApiUrl(`/campaigns/featured?limit=${limit}`);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch featured campaigns");
      return res.json();
    } catch {
      return this.fallbackMock.getFeaturedCampaigns(limit);
    }
  }
}
