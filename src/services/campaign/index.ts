import { CampaignService } from "./campaign.service";
import { MockCampaignService } from "./mock-campaign.service";
import { RestCampaignService } from "./rest-campaign.service";

export const campaignService: CampaignService =
  process.env.NEXT_PUBLIC_DATA_MODE === "api"
    ? new RestCampaignService()
    : new MockCampaignService();

export * from "./campaign.service";
