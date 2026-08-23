import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { campaignService } from "@/services/campaign";
import { CampaignDonationCard } from "@/components/campaign/campaign-donation-card";
import { formatIDR } from "@/lib/currency";

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
    title: `${campaign.nama} | AmanahZakat Peduli`,
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

  // Fallback rincian penggunaan dana if not provided
  const rincianList =
    campaign.rincian && campaign.rincian.length > 0
      ? campaign.rincian
      : [
          {
            item: `Pengadaan logistik & penyaluran ${campaign.program.toLowerCase()}`,
            nilai: formatIDR(Math.round(campaign.target * 0.7)),
          },
          {
            item: "Operasional distribusi relawan lapangan",
            nilai: formatIDR(Math.round(campaign.target * 0.2)),
          },
          {
            item: "Monitoring, asesmen & pelaporan asnaf",
            nilai: formatIDR(Math.round(campaign.target * 0.1)),
          },
        ];

  return (
    <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 font-sans">
      {/* Back Button */}
      <Link
        href="/kampanye"
        className="inline-flex items-center text-[#14509C] hover:text-[#0E3B74] font-bold text-[13.5px] mb-5 transition-colors"
      >
        ← Semua kampanye
      </Link>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Content - 7 Cols / 60%) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Hero Banner Image */}
          <div className="relative h-[260px] sm:h-[340px] w-full rounded-2xl overflow-hidden bg-[#EAE5DC] shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={campaign.imageUrl || "/images/campaigns/sumur-sumba.jpg"}
              alt={campaign.nama}
              className="w-full h-full object-cover"
            />


            {/* Gradient Overlay for bottom text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Top Left: Category Badge */}
            <span className="absolute left-4 top-4 bg-white/95 backdrop-blur-xs text-[#0E3B74] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-xs select-none">
              {campaign.program}
            </span>

            {/* Bottom Left: Location Text */}
            <span className="absolute left-4 bottom-4 text-white text-sm sm:text-[15px] font-semibold drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)] select-none">
              {campaign.lokasi}
            </span>
          </div>

          {/* Title & Story */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#16211D] tracking-tight leading-snug">
              {campaign.nama}
            </h1>
            <p className="text-[14.5px] sm:text-base text-[#4F473F] leading-relaxed text-pretty">
              {campaign.cerita || campaign.ringkas}
            </p>
          </div>

          {/* Rincian Penggunaan Dana */}
          <div className="bg-white border border-[#EAE5DC] rounded-2xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 sm:px-6 border-b border-[#F0ECE4] text-[15px] sm:text-base font-bold text-[#16211D]">
              Rincian penggunaan dana
            </div>
            <div className="divide-y divide-[#F5F2EC]">
              {rincianList.map((r, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-6 text-xs sm:text-sm"
                >
                  <span className="text-[#4F473F] leading-snug">{r.item}</span>
                  <span className="font-mono font-bold text-[#16211D] whitespace-nowrap">
                    {r.nilai}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kabar Terbaru dari Lapangan (Jika Ada) */}
          {campaign.kabar && campaign.kabar.length > 0 && (
            <div className="bg-white border border-[#EAE5DC] rounded-2xl overflow-hidden shadow-xs">
              <div className="px-5 py-4 sm:px-6 border-b border-[#F0ECE4] text-[15px] sm:text-base font-bold text-[#16211D]">
                Kabar terbaru dari lapangan
              </div>
              <div className="divide-y divide-[#F5F2EC]">
                {campaign.kabar.map((k, idx) => (
                  <div key={idx} className="p-5 sm:p-6 space-y-1.5">
                    <div className="text-[11.5px] font-mono text-[#9A9086] font-semibold">
                      {k.tgl}
                    </div>
                    <h4 className="text-sm sm:text-[15px] font-bold text-[#16211D]">
                      {k.judul}
                    </h4>
                    <p className="text-xs sm:text-[13.5px] text-[#6D645B] leading-relaxed text-pretty">
                      {k.isi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Sticky Donation Card & Recent Donors - 5 Cols / 40%) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <CampaignDonationCard campaign={campaign} />
        </div>
      </div>
    </div>
  );
}
