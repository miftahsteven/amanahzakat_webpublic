import { Campaign, CampaignQuery } from "@/types/campaign.types";

export interface CampaignService {
  listCampaigns(query?: CampaignQuery): Promise<Campaign[]>;
  getCampaignBySlug(slug: string): Promise<Campaign | null>;
  getCampaignById(id: number): Promise<Campaign | null>;
  getFeaturedCampaigns(limit?: number): Promise<Campaign[]>;
}
