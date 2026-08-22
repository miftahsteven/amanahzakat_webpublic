import { AssistanceService } from "./assistance.service";
import { MockAssistanceService } from "./mock-assistance.service";
import { RestAssistanceService } from "./rest-assistance.service";

export const assistanceService: AssistanceService =
  process.env.NEXT_PUBLIC_DATA_MODE === "api"
    ? new RestAssistanceService()
    : new MockAssistanceService();

export * from "./assistance.service";
