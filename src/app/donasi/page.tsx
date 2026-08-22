import { Metadata } from "next";
import { campaignService } from "@/services/campaign";
import { DonationForm } from "@/components/donation/donation-form";
import { FundType } from "@/types/donation.types";

export const metadata: Metadata = {
  title: "Salurkan Donasi Zakat & Kebaikan Anda — AmanahZakat Peduli",
  description:
    "Formulir donasi online resmi AmanahZakat. Tunaikan Zakat, Infak, Shodaqoh, dan Wakaf dengan mudah, aman, dan berizin resmi.",
};

export const dynamic = "force-dynamic";

export default async function DonasiPage(props: {
  searchParams?: Promise<{ campaign?: string; fundType?: string; amount?: string }>;
}) {
  const params = props.searchParams ? await props.searchParams : {};
  const campaigns = await campaignService.listCampaigns();

  const validFundTypes: FundType[] = ["ZAKAT", "INFAQ", "SHODAQOH", "WAQF_CASH"];
  const parsedFundType = validFundTypes.includes(params.fundType as FundType)
    ? (params.fundType as FundType)
    : "ZAKAT";

  const parsedAmount = params.amount ? Number(params.amount) : 100000;

  return (
    <main className="min-h-screen bg-[#FBFAF7] text-[#1A1613]">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <DonationForm
          campaigns={campaigns}
          initialCampaignSlug={params.campaign}
          initialFundType={parsedFundType}
          initialAmount={parsedAmount}
        />
      </div>
    </main>
  );
}
