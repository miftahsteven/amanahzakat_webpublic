import { DonationService } from "./donation.service";
import { MockDonationService } from "./mock-donation.service";
import { RestDonationService } from "./rest-donation.service";

export const donationService: DonationService =
  process.env.NEXT_PUBLIC_DATA_MODE === "api"
    ? new RestDonationService()
    : new MockDonationService();

export * from "./donation.service";
