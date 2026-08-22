"use client";

import React from "react";
import Link from "next/link";
import { Users, Calendar, Heart, Share2, Check } from "lucide-react";
import { Campaign } from "@/types/campaign.types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
  const isReached = percentage >= 100;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="sticky top-24 p-6 space-y-6 shadow-dropdown border-border bg-white rounded-2xl">
      {/* Financials Target & Progress */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs text-text-subtle block">Dana Terkumpul</span>
            <span className="font-mono font-extrabold text-2xl text-primary">
              {formatIDR(campaign.terkumpul)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-text-subtle block">Target Program</span>
            <span className="font-mono font-bold text-text-muted text-sm">
              {formatIDR(campaign.target)}
            </span>
          </div>
        </div>

        <Progress
          value={percentage}
          indicatorColor={isReached ? "bg-navy" : "bg-primary"}
          className="h-2.5"
        />

        <div className="flex items-center justify-between text-xs text-text-muted">
          <span className="font-bold text-primary">{percentage}% Terpenuhi</span>
          <span>Sisa target: {formatCompactIDR(Math.max(0, campaign.target - campaign.terkumpul))}</span>
        </div>
      </div>

      {/* Meta Statistics */}
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/80 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary-soft text-primary">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-text block">
              {campaign.donaturCount.toLocaleString("id-ID")}
            </span>
            <span className="text-text-subtle text-[11px]">Donatur Tergabung</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-text block">s.d. {campaign.tenggat}</span>
            <span className="text-text-subtle text-[11px]">Batas Program</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="space-y-2.5">
        <Link href={`/donasi?campaign=${encodeURIComponent(campaign.slug)}`} className="block w-full">
          <Button variant="primary" size="lg" className="w-full justify-center text-base shadow-md">
            <Heart className="h-5 w-5 fill-white mr-1.5" />
            Donasi Sekarang
          </Button>
        </Link>

        <Button
          variant="outline"
          size="md"
          onClick={handleCopy}
          className="w-full justify-center text-xs font-bold"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600 mr-1.5" /> : <Share2 className="h-4 w-4 mr-1.5" />}
          <span>{copied ? "Tautan Kampanye Tersalin!" : "Bagikan Kampanye"}</span>
        </Button>
      </div>

      <div className="text-[11px] text-text-subtle text-center leading-relaxed">
        Donasi disalurkan 100% transparan sesuai akad syariah dan peruntukan program.
      </div>
    </Card>
  );
}
