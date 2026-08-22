import React from "react";
import { Campaign } from "@/types/campaign.types";
import { CampaignCard } from "./campaign-card";
import { EmptyState } from "@/components/shared/empty-state";

interface CampaignGridProps {
  campaigns: Campaign[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function CampaignGrid({
  campaigns,
  emptyTitle = "Belum ada kampanye ditemukan",
  emptyDescription = "Coba pilih kategori program lain atau ubah kata kunci pencarian Anda.",
}: CampaignGridProps) {
  if (campaigns.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
