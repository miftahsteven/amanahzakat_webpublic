"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CampaignFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy?: "terbaru" | "mendekati-target" | "paling-banyak" | string;
  onSortChange?: (sort: "terbaru" | "mendekati-target" | "paling-banyak") => void;
}

export function CampaignFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: CampaignFiltersProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle pointer-events-none" />
          <Input
            type="text"
            placeholder="Cari program, lokasi, atau kata kunci..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>

        {/* Sort selector if available */}
        {onSortChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted shrink-0 font-medium">Urutkan:</span>
            <select
              value={sortBy || "terbaru"}
              onChange={(e) =>
                onSortChange(
                  e.target.value as "terbaru" | "mendekati-target" | "paling-banyak"
                )
              }
              className="h-11 rounded-lg border border-border-strong bg-white px-3 text-xs font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="terbaru">Terbaru</option>
              <option value="mendekati-target">Mendekati Target</option>
              <option value="paling-banyak">Paling Banyak Donatur</option>
            </select>
          </div>
        )}
      </div>

      {/* Category Chips Scrollable */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all select-none cursor-pointer ${
                isSelected
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-text-muted hover:text-text border border-border-strong hover:bg-black/5"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
