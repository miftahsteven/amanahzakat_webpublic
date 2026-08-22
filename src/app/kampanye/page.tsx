import { Metadata } from "next";
import { campaignService } from "@/services/campaign";
import { CatalogView } from "./catalog-view";

export const metadata: Metadata = {
  title: "Kampanye Pilihan — Salurkan Donasi ZIS & Kebaikan",
  description:
    "Pilih dan salurkan donasi untuk kampanye zakat, infak, wakaf sumur, beasiswa yatim, dan program sosial berkelanjutan.",
};

export const dynamic = "force-dynamic";

export default async function KampanyePage(props: {
  searchParams?: Promise<{ category?: string; q?: string }>;
}) {
  const params = props.searchParams ? await props.searchParams : {};
  const campaigns = await campaignService.listCampaigns();

  return (
    <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-7 pb-16 animate-fadeIn">
      <CatalogView
        initialCampaigns={campaigns}
        initialCategory={params.category || "Semua"}
        initialQuery={params.q || ""}
      />
    </div>
  );
}
