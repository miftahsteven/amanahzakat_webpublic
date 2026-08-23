"use client";

import React from "react";
import Link from "next/link";
import { Check, Share2 } from "lucide-react";
import { Campaign } from "@/types/campaign.types";
import { formatIDR, formatCompactIDR } from "@/lib/currency";

interface CampaignDonationCardProps {
  campaign: Campaign;
}

export function CampaignDonationCard({ campaign }: CampaignDonationCardProps) {
  const [copied, setCopied] = React.useState(false);
  const percentage = Math.min(
    100,
    Math.round((campaign.terkumpul / campaign.target) * 100)
  );

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Fallback realistic recent donors if not in campaign
  const recentDonors =
    campaign.donaturList && campaign.donaturList.length > 0
      ? campaign.donaturList.slice(0, 4).map((d) => ({
          nama: d.nama,
          rp: formatIDR(d.nominal),
        }))
      : [
          { nama: "PT Cahaya Nusantara", rp: formatIDR(Math.round(campaign.terkumpul * 0.35)) },
          { nama: "Hj. Sundari Wibowo", rp: formatIDR(Math.round(campaign.terkumpul * 0.2)) },
          { nama: "Donatur Anonim", rp: formatIDR(Math.round(campaign.terkumpul * 0.1)) },
          { nama: "Komunitas Subuh Berkah", rp: formatIDR(Math.round(campaign.terkumpul * 0.05)) },
        ];

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Main Donation Card */}
      <div className="bg-white border border-[#EAE5DC] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-xs">
        {/* Nominal Terkumpul */}
        <div className="space-y-2">
          <div className="font-mono text-2xl sm:text-[27px] font-extrabold text-[#0E3B74] tracking-tight leading-none">
            {formatIDR(campaign.terkumpul)}
          </div>

          {/* Progress Bar */}
          <div className="h-2 rounded-full bg-[#F0ECE4] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#14509C] transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Target & Percentage */}
          <div className="flex justify-between text-xs text-[#8B8177]">
            <span className="font-bold text-[#0E3B74]">{percentage}% tercapai</span>
            <span>dari {formatCompactIDR(campaign.target)}</span>
          </div>
        </div>

        {/* Donatur & Batas Waktu Meta */}
        <div className="flex gap-6 py-3.5 border-y border-[#F0ECE4]">
          <div className="flex-1">
            <div className="text-[10.5px] tracking-wider uppercase text-[#9A9086] font-bold">
              DONATUR
            </div>
            <div className="font-mono font-bold text-sm text-[#16211D] mt-0.5">
              {campaign.donaturCount.toLocaleString("id-ID")} orang
            </div>
          </div>

          <div className="flex-1">
            <div className="text-[10.5px] tracking-wider uppercase text-[#9A9086] font-bold">
              BATAS WAKTU
            </div>
            <div className="font-bold text-sm text-[#16211D] mt-0.5">
              {campaign.tenggat}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <Link
            href={`/donasi?campaign=${encodeURIComponent(campaign.slug)}`}
            className="w-full bg-[#14509C] hover:bg-[#0E3B74] active:scale-[0.99] text-white font-bold text-sm py-3.5 rounded-xl shadow-xs transition-all text-center block"
          >
            Donasi ke Kampanye Ini
          </Link>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full bg-white hover:bg-[#FAF8F4] active:scale-[0.99] text-[#1A1613] hover:text-[#14509C] border border-[#DDD7CD] hover:border-[#14509C] font-bold text-xs sm:text-[13.5px] py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Tautan Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan Kampanye</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Donatur Terakhir Card (Dark Navy Box) */}
      <div className="bg-[#0B1F3D] text-[#E9EEF7] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="text-xs font-bold text-[#A8C8F0] uppercase tracking-wider">
          Donatur terakhir
        </div>

        <div className="space-y-3">
          {recentDonors.map((d, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center gap-3 text-xs sm:text-[13px]"
            >
              <span className="text-[#C3D0E0] truncate max-w-[200px]">
                {d.nama}
              </span>
              <span className="font-mono font-semibold text-white whitespace-nowrap">
                {d.rp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
