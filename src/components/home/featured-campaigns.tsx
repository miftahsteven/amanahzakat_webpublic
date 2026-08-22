"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Campaign } from "@/types/campaign.types";
import { CampaignCard } from "@/components/campaign/campaign-card";
import { EmptyState } from "@/components/shared/empty-state";

interface FeaturedCampaignsProps {
  initialCampaigns: Campaign[];
}

const categories = [
  "Semua",
  "Wakaf Sumur",
  "Qurban",
  "Konservasi DAS Citarum",
  "Beasiswa Anak Yatim",
  "Program Infak Oksigen",
  "Modal Usaha Mikro",
  "Bantuan Kesehatan",
  "Bantuan Pangan",
];

export function FeaturedCampaigns({ initialCampaigns }: FeaturedCampaignsProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("Semua");

  const filtered = React.useMemo(() => {
    if (selectedCategory === "Semua") return initialCampaigns.slice(0, 8);
    return initialCampaigns.filter(
      (c) => c.program.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [initialCampaigns, selectedCategory]);

  return (
    <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-7 pb-12">
      {/* Section Header: Title (Single Row) on Left & Filter Pills on Right */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5 sm:gap-6 mb-5 sm:mb-7">
        <div className="shrink-0">
          <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-[#1A1613] tracking-tight whitespace-nowrap leading-none">
            Kampanye Pilihan
          </h2>
          <p className="text-sm sm:text-[15px] text-[#6D645B] mt-2 font-medium whitespace-nowrap">
            Pilih program yang ingin Anda dukung
          </p>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap sm:flex-wrap">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all select-none cursor-pointer ${
                  isSelected
                    ? "bg-[#14509C] text-white shadow-xs"
                    : "bg-white text-[#5E564E] border border-[#DDD7CD] hover:border-[#14509C] hover:text-[#14509C]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Campaign Cards Grid (8 Cards: 4 Columns x 2 Rows on Desktop) */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Belum ada kampanye pada kategori ini"
          description="Silakan pilih kategori program lainnya untuk melihat kampanye aktif."
          onActionClick={() => setSelectedCategory("Semua")}
          actionLabel="Kembali ke Semua Program"
        />
      )}

      {/* View All / Program Lainnya Button */}
      <div className="flex justify-center mt-8 sm:mt-10">
        <Link href="/kampanye">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF8F4] active:scale-98 text-[#1A1613] border border-[#DDD7CD] hover:border-[#14509C] hover:text-[#14509C] font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <span>Program Lainnya</span>
            <ChevronRight className="h-4 w-4 text-[#14509C]" />
          </button>
        </Link>
      </div>
    </section>
  );
}
