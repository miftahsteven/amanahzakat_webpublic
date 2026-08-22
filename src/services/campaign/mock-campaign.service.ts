import { Campaign, CampaignQuery } from "@/types/campaign.types";
import { CampaignService } from "./campaign.service";
import { initialCampaigns } from "@/mocks/campaigns";

export class MockCampaignService implements CampaignService {
  private campaigns: Campaign[] = [...initialCampaigns];

  async listCampaigns(query?: CampaignQuery): Promise<Campaign[]> {
    let result = [...this.campaigns];

    if (query?.category && query.category !== "Semua" && query.category !== "all") {
      const catLower = query.category.toLowerCase();
      result = result.filter((c) => {
        if (catLower === "zakat") return /zakat/i.test(c.program) || /zakat/i.test(c.nama);
        if (catLower === "infak" || catLower === "infaq") return /infak/i.test(c.program) || /infak/i.test(c.nama);
        if (catLower === "wakaf") return /wakaf/i.test(c.program) || /wakaf/i.test(c.nama);
        return c.program.toLowerCase() === catLower;
      });
    }

    if (query?.search) {
      const q = query.search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.nama.toLowerCase().includes(q) ||
          c.program.toLowerCase().includes(q) ||
          c.lokasi.toLowerCase().includes(q) ||
          c.ringkas.toLowerCase().includes(q)
      );
    }

    if (query?.sortBy) {
      if (query.sortBy === "mendekati-target") {
        result.sort((a, b) => b.terkumpul / b.target - a.terkumpul / a.target);
      } else if (query.sortBy === "paling-banyak") {
        result.sort((a, b) => b.donaturCount - a.donaturCount);
      } else {
        result.sort((a, b) => b.id - a.id);
      }
    }

    return result;
  }

  async getCampaignBySlug(slug: string): Promise<Campaign | null> {
    const found = this.campaigns.find((c) => c.slug === slug);
    return found ? { ...found } : null;
  }

  async getCampaignById(id: number): Promise<Campaign | null> {
    const found = this.campaigns.find((c) => c.id === id);
    return found ? { ...found } : null;
  }

  async getFeaturedCampaigns(limit = 4): Promise<Campaign[]> {
    return this.campaigns.slice(0, limit);
  }
}
