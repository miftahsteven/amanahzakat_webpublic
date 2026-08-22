import { Metadata } from "next";
import Link from "next/link";
import { Users, BadgeCheck, Trees, Droplets, GraduationCap, Store, Download, FileText, CheckCircle2, Heart, ArrowRight } from "lucide-react";
import { impactService } from "@/services/impact";
import { PageHero } from "@/components/shared/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Laporan Dampak & Transparansi Akuntabilitas",
  description:
    "Transparansi pengelolaan dana zakat, infak, wakaf, rasio alokasi program, cerita mustahik, dan unduh laporan audit PSAK 109 resmi.",
};

export const dynamic = "force-dynamic";

export default async function DampakPage() {
  const [metrics, allocations, stories, reports] = await Promise.all([
    impactService.getImpactMetrics(),
    impactService.getFundAllocations(),
    impactService.getBeneficiaryStories(),
    impactService.getAnnualReports(),
  ]);

  const getMetricIcon = (iconName?: string) => {
    switch (iconName) {
      case "Users":
        return <Users className="h-6 w-6 text-primary" />;
      case "BadgeCheck":
        return <BadgeCheck className="h-6 w-6 text-emerald-600" />;
      case "Trees":
        return <Trees className="h-6 w-6 text-emerald-700" />;
      case "Droplets":
        return <Droplets className="h-6 w-6 text-[#2B6F9E]" />;
      case "GraduationCap":
        return <GraduationCap className="h-6 w-6 text-purple-600" />;
      case "Store":
        return <Store className="h-6 w-6 text-amber-600" />;
      default:
        return <Users className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <PageHero
        breadcrumbs={[{ label: "Laporan Dampak" }]}
        badge="Transparansi & Akuntabilitas"
        title="Jejak Kebaikan & Dampak Nyata ZIS"
        description="AmanahZakat mengedepankan keterbukaan dan tata kelola akuntabel. Setiap dana zakat, infak, dan wakaf Anda dipertanggungjawabkan melalui audit independen dan dilaporkan berkala."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 1. Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((m, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-border shadow-subtle space-y-2">
              <div className="p-3 rounded-2xl bg-[#FBFAF7] border border-border w-fit">
                {getMetricIcon(m.icon)}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono font-extrabold text-3xl text-text">
                  {m.angka}
                </span>
                <span className="text-sm font-bold text-primary">
                  {m.satuan}
                </span>
              </div>
              <h3 className="font-bold text-sm text-text">{m.label}</h3>
              <p className="text-xs text-text-muted">{m.keterangan}</p>
            </div>
          ))}
        </div>

        {/* 2. Fund Allocation Breakdown */}
        <div className="p-8 sm:p-10 rounded-3xl bg-navy text-white shadow-card space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-border">
              Alokasi Penggunaan Dana
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              Rasio Transparansi Penyaluran Dana ZIS
            </h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
              Sesuai dengan ketentuan syariat dan regulasi Keputusan Menteri Agama RI, dana yang dihimpun
              dialokasikan secara efisien dengan porsi terbesar langsung kepada program kemaslahatan mustahik.
            </p>
          </div>

          {/* Allocation Bar */}
          <div className="space-y-4 pt-2">
            <div className="h-4 w-full rounded-full bg-white/10 overflow-hidden flex">
              {allocations.map((item) => (
                <div
                  key={item.label}
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  className="h-full"
                  title={`${item.label}: ${item.percentageLabel}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {allocations.map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-xs text-white truncate">{item.label}</span>
                  </div>
                  <div className="font-mono font-extrabold text-2xl text-primary-border">
                    {item.percentageLabel}
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Beneficiary Transformation Stories */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-text-subtle">
              Kisah Transformasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text">
              Dari Mustahik Menuju Kemandirian Hidup
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((story, idx) => (
              <Card key={idx} className="p-6 bg-white flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-soft text-primary border border-primary-border">
                      {story.program}
                    </span>
                    <span className="text-xs text-text-subtle font-medium">{story.wilayah}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed italic">
                    &ldquo;{story.kutipan}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60">
                  <h4 className="font-extrabold text-sm text-text">{story.nama}</h4>
                  <span className="text-xs text-text-subtle">{story.peran}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 4. Annual Reports & Audit Downloads */}
        <div className="p-8 rounded-3xl bg-white border border-border space-y-6">
          <div className="space-y-1">
            <h3 className="font-extrabold text-xl text-text">Unduh Laporan Keuangan & Audit Tahunan</h3>
            <p className="text-xs text-text-muted">
              Laporan resmi yang telah diaudit oleh Akuntan Publik Independen dengan opini Wajar Tanpa Pengecualian (WTP).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {reports.map((rep) => (
              <div
                key={rep.tahun}
                className="p-5 rounded-2xl bg-[#FBFAF7] border border-border flex flex-col justify-between space-y-4 hover:border-primary transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-mono font-extrabold text-lg text-text">Tahun {rep.tahun}</span>
                  </div>
                  <h4 className="font-bold text-xs text-text leading-snug">{rep.judul}</h4>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 pt-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{rep.deskripsi}</span>
                  </div>
                  <span className="text-[11px] text-text-subtle block">KAP: {rep.auditor}</span>
                </div>

                <a
                  href={`/documents/annual-report-${rep.tahun}.pdf`}
                  download
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-border text-xs font-bold text-primary hover:bg-primary-soft transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh PDF ({rep.ukuranFile})</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-3xl bg-[#FDF6EA] border border-[#EEDBBA] text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#3B2807]">
            Mari Bergabung Melipatgandakan Dampak Kebaikan
          </h3>
          <p className="text-xs sm:text-sm text-[#6B5023] max-w-xl mx-auto">
            Setiap rupiah zakat, infak, dan wakaf yang Anda tunaikan menjadi lentera bagi ribuan keluarga dhuafa.
          </p>
          <Link href="/donasi">
            <Button variant="primary" size="lg" className="bg-[#8C5D09] text-white hover:bg-[#734A06]">
              <Heart className="h-4 w-4 fill-white mr-1.5" />
              Tunaikan Donasi Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
