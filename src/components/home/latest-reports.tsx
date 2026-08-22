import React from "react";
import Link from "next/link";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { DistributionReport } from "@/types/distribution.types";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { formatCompactIDR } from "@/lib/currency";

export function LatestReports({ reports }: { reports: DistributionReport[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <SectionHeading
        badge="Kabar Lapangan"
        title="Kabar Penyaluran dari Garis Depan"
        description="Laporan berkala dan dokumentasi penyaluran langsung dari titik-titik program kemanusiaan di pelosok Indonesia."
        actionHref="/kabar-penyaluran"
        actionLabel="Lihat Semua Kabar"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.slice(0, 3).map((rep) => (
          <Card key={rep.id} className="group overflow-hidden hover:shadow-card transition-all flex flex-col">
            {/* Image */}
            <div className="relative h-44 w-full overflow-hidden bg-[#EAE5DC]">
              {rep.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={rep.imageUrl}
                  alt={rep.judul}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-tr from-primary to-navy flex items-center justify-center text-white/40 text-xs font-bold">
                  Kabar Penyaluran
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black/60 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                {rep.program}
              </div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 text-xs text-text-subtle">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{rep.tgl}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-[120px]">{rep.lokasi}</span>
                  </div>
                </div>

                <Link href={`/kabar-penyaluran/${rep.slug}`}>
                  <h3 className="font-extrabold text-base text-text group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {rep.judul}
                  </h3>
                </Link>

                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {rep.ringkas}
                </p>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-text-subtle block">Dana Disalurkan</span>
                  <span className="font-mono font-bold text-primary">
                    {formatCompactIDR(rep.nominal)}
                  </span>
                </div>
                <Link
                  href={`/kabar-penyaluran/${rep.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-primary hover:underline text-xs"
                >
                  <span>Baca</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
