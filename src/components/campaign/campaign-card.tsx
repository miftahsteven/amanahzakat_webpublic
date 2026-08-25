import React from "react";
import Link from "next/link";
import { Campaign } from "@/types/campaign.types";
import { formatCompactIDR } from "@/lib/currency";
import { formatTenggatDisplay } from "@/lib/campaign-date";

interface CampaignCardProps {
  campaign: Campaign;
  className?: string;
}

export function CampaignCard({ campaign, className }: CampaignCardProps) {
  const percentage = Math.min(
    100,
    Math.round((campaign.terkumpul / campaign.target) * 100)
  );
  const isReached = percentage >= 100;
  const isGreenZakat = /Pohon|Oksigen|DAS|Sumur|Agroforestry|Pertanian|Surya|Sampah|Pangan/i.test(
    campaign.program
  );
  const isUrgent = (100 - percentage) >= 55 && !isGreenZakat;

  const aksenLabel = isGreenZakat
    ? "Green Zakat"
    : isUrgent
    ? "Perlu Segera"
    : "Berjalan";

  const aksenBg = isGreenZakat
    ? "bg-[#2E7D4F]"
    : isUrgent
    ? "bg-[#C8382F]"
    : "bg-[#14509C]";

  const barBg = isReached
    ? "bg-[#0E3B74]"
    : isGreenZakat
    ? "bg-[#2E7D4F]"
    : isUrgent
    ? "bg-[#C8382F]"
    : "bg-[#14509C]";

  return (
    <div
      className={`bg-white rounded-2xl border border-[#EAE5DC] overflow-hidden flex flex-col justify-between hover:border-[#BCD3EE] hover:shadow-md transition-all duration-200 ${
        className || ""
      }`}
    >
      {/* Image Thumbnail & Badges */}
      <div className="relative h-[170px] sm:h-[175px] w-full overflow-hidden bg-[#EAE5DC]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={campaign.imageUrl}
          alt={campaign.nama}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Gradient Overlay for bottom text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Top Left: Category Badge */}
        <span className="absolute left-3.5 top-3.5 bg-white/95 backdrop-blur-xs text-[#0E3B74] font-bold text-[11px] px-3 py-1 rounded-full shadow-xs select-none">
          {campaign.program}
        </span>

        {/* Top Right: Progress Badge */}
        <span
          className={`absolute right-3.5 top-3.5 font-bold text-[11px] px-3 py-1 rounded-full shadow-xs select-none ${
            isReached
              ? "bg-[#0B1F3D] text-[#A8C8F0]"
              : "bg-black/55 text-white backdrop-blur-xs"
          }`}
        >
          {isReached ? "Target tercapai" : `${percentage}% terkumpul`}
        </span>

        {/* Bottom Left: Tag Chip & Location */}
        <div className="absolute left-3.5 bottom-3 flex flex-col gap-0.5 pointer-events-none">
          <span
            className={`self-start text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-xs ${aksenBg}`}
          >
            {aksenLabel}
          </span>
          <span className="text-white text-xs font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] leading-tight">
            {campaign.lokasi}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          <Link href={`/kampanye/${campaign.slug}`}>
            <h3 className="font-extrabold text-[15px] sm:text-[16px] text-[#1A1613] hover:text-[#14509C] transition-colors leading-snug line-clamp-2 min-h-[44px]">
              {campaign.nama}
            </h3>
          </Link>
          <p className="text-xs text-[#6D645B] leading-relaxed line-clamp-2 mt-1.5 min-h-[36px]">
            {campaign.ringkas}
          </p>
        </div>

        {/* Progress & Stats */}
        <div className="space-y-2 pt-2 border-t border-[#F0ECE4]">
          <div className="h-1.5 rounded-full bg-[#F0ECE4] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barBg}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-baseline justify-between text-xs pt-0.5">
            <span className="font-mono font-bold text-[13.5px] sm:text-sm text-[#0E3B74]">
              {formatCompactIDR(campaign.terkumpul)}
            </span>
            <span className="text-[11.5px] text-[#8B8177]">
              dari {formatCompactIDR(campaign.target)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8B8177]">
            <span>{campaign.donaturCount.toLocaleString("id-ID")} donatur</span>
            <span>s.d. {formatTenggatDisplay(campaign.tenggat)}</span>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/donasi?campaign=${encodeURIComponent(campaign.slug)}`}
            className="flex-1"
          >
            <button
              type="button"
              className="w-full bg-[#14509C] hover:bg-[#0E3B74] active:scale-98 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all cursor-pointer min-h-[38px] flex items-center justify-center"
            >
              Donasi
            </button>
          </Link>

          <Link href={`/kampanye/${campaign.slug}`}>
            <button
              type="button"
              className="bg-white hover:bg-[#FAF8F4] active:scale-98 text-[#1A1613] border border-[#DDD7CD] hover:border-[#14509C] hover:text-[#14509C] font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer whitespace-nowrap min-h-[38px] flex items-center justify-center"
            >
              Detail
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
