import { VerificationService } from "./verification.service";
import { MockVerificationService } from "./mock-verification.service";
import { RestVerificationService } from "./rest-verification.service";

export const verificationService: VerificationService =
  process.env.NEXT_PUBLIC_DATA_MODE === "api"
    ? new RestVerificationService()
    : new MockVerificationService();

export * from "./verification.service";
