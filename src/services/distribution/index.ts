import { DistributionService } from "./distribution.service";
import { MockDistributionService } from "./mock-distribution.service";
import { RestDistributionService } from "./rest-distribution.service";

export const distributionService: DistributionService =
  process.env.NEXT_PUBLIC_DATA_MODE === "api"
    ? new RestDistributionService()
    : new MockDistributionService();

export * from "./distribution.service";
