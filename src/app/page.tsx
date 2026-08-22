import { campaignService } from "@/services/campaign";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { QuickActionGrid } from "@/components/home/quick-action-grid";
import { FeaturedCampaigns } from "@/components/home/featured-campaigns";
import { ImpactOverview } from "@/components/home/impact-overview";
import { InspirationAndNews } from "@/components/home/inspiration-and-news";
import { TestimonialsSection, PartnerChips } from "@/components/home/testimonials-section";
import { HomeFaq, TrustSection } from "@/components/home/home-faq";
import { CtaBanner } from "@/components/home/cta-banner";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const campaigns = await campaignService.listCampaigns();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Hero & Submenu Overlapping Group */}
      <div>
        <HeroCarousel />
        <QuickActionGrid />
      </div>

      {/* 2. Kampanye Pilihan */}
      <FeaturedCampaigns initialCampaigns={campaigns} />

      {/* 3. Dampak Kebaikan Anda */}
      <ImpactOverview />

      {/* 4. Inspirasi Kebaikan & Berita Terbaru */}
      <InspirationAndNews />

      {/* 5. Apa Kata Mereka? */}
      <TestimonialsSection />

      {/* 6. Mitra Kebaikan */}
      <PartnerChips />

      {/* 7. Tanya Jawab ZIS */}
      <HomeFaq />

      {/* 8. Trust Section & Legalitas */}
      <TrustSection />

      {/* 9. Banner Siap Menebar Kebaikan? */}
      <CtaBanner />
    </div>
  );
}
