"use client";

import * as React from "react";
import { Campaign } from "@/types/campaign.types";
import { CampaignCard } from "@/components/campaign/campaign-card";
import { EmptyState } from "@/components/shared/empty-state";

interface CatalogViewProps {
  initialCampaigns: Campaign[];
  initialCategory?: string;
  initialQuery?: string;
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

export function CatalogView({
  initialCampaigns,
  initialCategory = "Semua",
  initialQuery = "",
}: CatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);

  const filteredCampaigns = React.useMemo(() => {
    let result = [...initialCampaigns];

    // Filter by Category
    if (selectedCategory !== "Semua") {
      const catLower = selectedCategory.toLowerCase();
      result = result.filter((c) => {
        if (catLower === "zakat") return /zakat/i.test(c.program) || /zakat/i.test(c.nama);
        if (catLower === "infak" || catLower === "infaq")
          return /infak/i.test(c.program) || /infak/i.test(c.nama);
        if (catLower === "wakaf") return /wakaf/i.test(c.program) || /wakaf/i.test(c.nama);
        return c.program.toLowerCase() === catLower;
      });
    }

    // Filter by Search query if passed
    if (initialQuery.trim() !== "") {
      const q = initialQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.nama.toLowerCase().includes(q) ||
          c.program.toLowerCase().includes(q) ||
          c.lokasi.toLowerCase().includes(q) ||
          c.ringkas.toLowerCase().includes(q)
      );
    }

    return result;
  }, [initialCampaigns, selectedCategory, initialQuery]);

  return (
    <div className="space-y-6">
      {/* Header: Title on Left, Category Filter Pills on Right */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5 sm:gap-6 mb-5 sm:mb-7">
        <div className="shrink-0">
          <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-[#1A1613] tracking-tight whitespace-nowrap leading-none m-0">
            Kampanye Pilihan
          </h1>
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

      {/* Campaign Cards Grid (4 Columns on Desktop matching Beranda) */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredCampaigns.map((campaign) => (
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
    </div>
  );
}
