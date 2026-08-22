import { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { distributionService } from "@/services/distribution";
import { PageHero } from "@/components/shared/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { formatCompactIDR } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Kabar Penyaluran & Transparansi Lapangan",
  description:
    "Laporan penyaluran ZIS terkini, dokumentasi lapangan, dan jumlah penerima manfaat dari program AmanahZakat.",
};

export const dynamic = "force-dynamic";

export default async function KabarPenyaluranPage() {
  const [reports, stats] = await Promise.all([
    distributionService.listReports(),
    distributionService.getAggregateStats(),
  ]);

  return (
    <div className="space-y-8 pb-20">
      <PageHero
        breadcrumbs={[{ label: "Kabar Penyaluran" }]}
        badge="Transparansi Lapangan"
        title="Laporan & Berita Penyaluran Amanah"
        description="Membuktikan bahwa setiap amanah yang Anda titipkan benar-benar sampai kepada mereka yang paling membutuhkan di seluruh pelosok negeri."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-white/70 border border-border shadow-subtle">
            <span className="text-xs text-text-subtle block">Total Laporan</span>
            <span className="font-mono font-extrabold text-xl text-primary">
              {stats.totalReports} Kabar Terbit
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 border border-border shadow-subtle">
            <span className="text-xs text-text-subtle block">Dana Disalurkan</span>
            <span className="font-mono font-extrabold text-xl text-emerald-700">
              {formatCompactIDR(stats.totalAmount)}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 border border-border shadow-subtle">
            <span className="text-xs text-text-subtle block">Penerima Manfaat</span>
            <span className="font-mono font-extrabold text-xl text-text">
              {stats.totalBeneficiaries.toLocaleString("id-ID")} Jiwa
            </span>
          </div>
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((rep) => (
            <Card key={rep.id} className="group overflow-hidden hover:shadow-card transition-all flex flex-col bg-white">
              <div className="relative h-48 w-full overflow-hidden bg-[#EAE5DC]">
                {rep.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={rep.imageUrl}
                    alt={rep.judul}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-navy flex items-center justify-center text-white/50 font-bold text-xs">
                    Kabar Penyaluran
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-black/60 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  {rep.program}
                </div>
              </div>

              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-text-subtle">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{rep.tgl}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[130px]">{rep.lokasi}</span>
                    </div>
                  </div>

                  <Link href={`/kabar-penyaluran/${rep.slug}`}>
                    <h3 className="font-extrabold text-base text-text group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {rep.judul}
                    </h3>
                  </Link>

                  <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                    {rep.ringkas}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-text-subtle block">Dana Disalurkan</span>
                    <span className="font-mono font-bold text-primary text-sm">
                      {formatCompactIDR(rep.nominal)}
                    </span>
                  </div>
                  <Link
                    href={`/kabar-penyaluran/${rep.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-primary hover:underline text-xs"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
