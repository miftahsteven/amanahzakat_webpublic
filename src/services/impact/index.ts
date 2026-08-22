import { ImpactService } from "./impact.service";
import { MockImpactService } from "./mock-impact.service";
import { RestImpactService } from "./rest-impact.service";

export const impactService: ImpactService =
  process.env.NEXT_PUBLIC_DATA_MODE === "api"
    ? new RestImpactService()
    : new MockImpactService();

export * from "./impact.service";
