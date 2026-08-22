import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Users, Calendar, Heart, ShieldCheck, Share2 } from "lucide-react";
import { campaignService } from "@/services/campaign";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CampaignDonationCard } from "@/components/campaign/campaign-donation-card";
import {
  CampaignFundBreakdown,
  CampaignUpdatesList,
  DonorActivityList,
} from "@/components/campaign/campaign-updates";
import { ShareButtons } from "@/components/shared/share-buttons";
import { Button } from "@/components/ui/button";
import { formatCompactIDR, formatIDR } from "@/lib/currency";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await campaignService.getCampaignBySlug(slug);
  if (!campaign) {
    return { title: "Kampanye Tidak Ditemukan" };
  }
  return {
    title: campaign.nama,
    description: campaign.ringkas,
    openGraph: {
      title: campaign.nama,
      description: campaign.ringkas,
      images: campaign.imageUrl ? [campaign.imageUrl] : [],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = await campaignService.getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Breadcrumbs & Header Hero */}
      <div className="bg-gradient-to-b from-[#EEF3FB] to-background border-b border-border py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs
            items={[
              { label: "Katalog Kampanye", href: "/kampanye" },
              { label: campaign.nama },
            ]}
          />

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-white">
              {campaign.program}
            </span>
            <span className="text-xs font-medium text-text-muted flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-border">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {campaign.lokasi}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-text tracking-tight leading-tight max-w-4xl">
            {campaign.nama}
          </h1>
        </div>
      </div>

      {/* Main Grid: Left Story & Updates (2 Cols) | Right Sticky Donation Card (1 Col) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (Content) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Featured Photo */}
            <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden shadow-card border border-border bg-[#EAE5DC]">
              {campaign.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={campaign.imageUrl}
                  alt={campaign.nama}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-navy flex items-center justify-center text-white font-bold">
                  AmanahZakat Peduli
                </div>
              )}
            </div>

            {/* Campaign Story */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border space-y-4">
              <h3 className="font-extrabold text-xl text-text">Cerita & Latar Belakang Program</h3>
              <div className="text-sm sm:text-base text-text-muted leading-relaxed space-y-4">
                <p>{campaign.cerita}</p>
                <p>{campaign.ringkas}</p>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#FAF8F4] border border-border text-xs text-text-muted">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>
                  Program ini dikelola resmi oleh LAZNAS AmanahZakat (SK Kemenag No. 892/2019) dan
                  disalurkan secara bertahap bersama relawan amil terpercaya.
                </span>
              </div>
            </div>

            {/* Rencana Penggunaan Dana */}
            {campaign.rincian && campaign.rincian.length > 0 && (
              <CampaignFundBreakdown rincian={campaign.rincian} />
            )}

            {/* Kabar Lapangan Terbaru */}
            <CampaignUpdatesList updates={campaign.kabar} />

            {/* Donatur Terbaru */}
            <DonorActivityList donors={campaign.donaturList} />

            {/* Share Social Links */}
            <div className="p-6 rounded-3xl bg-white border border-border">
              <ShareButtons title={campaign.nama} />
            </div>
          </div>

          {/* Right Column (Sticky Donation Card Desktop) */}
          <div className="lg:col-span-1">
            <CampaignDonationCard campaign={campaign} />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-border shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-text-subtle block">Terkumpul</span>
          <span className="font-mono font-extrabold text-base text-primary">
            {formatCompactIDR(campaign.terkumpul)}
          </span>
        </div>

        <Link
          href={`/donasi?campaign=${encodeURIComponent(campaign.slug)}`}
          className="flex-1 max-w-[200px]"
        >
          <Button variant="primary" size="md" className="w-full justify-center shadow-md">
            <Heart className="h-4 w-4 fill-white mr-1" />
            Donasi
          </Button>
        </Link>
      </div>
    </div>
  );
}
