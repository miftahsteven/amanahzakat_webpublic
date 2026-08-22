import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Users, Heart, ArrowRight, ShieldCheck } from "lucide-react";
import { distributionService } from "@/services/distribution";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ShareButtons } from "@/components/shared/share-buttons";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/currency";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = await distributionService.getReportBySlug(slug);
  if (!report) return { title: "Laporan Tidak Ditemukan" };

  return {
    title: report.judul,
    description: report.ringkas,
    openGraph: {
      title: report.judul,
      description: report.ringkas,
      images: report.imageUrl ? [report.imageUrl] : [],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function DistributionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = await distributionService.getReportBySlug(slug);

  if (!report) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#EEF3FB] to-background border-b border-border py-6 md:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs
            items={[
              { label: "Kabar Penyaluran", href: "/kabar-penyaluran" },
              { label: report.judul },
            ]}
          />

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-white">
              {report.program}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-border">
              <Calendar className="h-3.5 w-3.5" />
              {report.tgl}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-border">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {report.lokasi}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-text tracking-tight leading-tight">
            {report.judul}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Photo */}
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden shadow-card border border-border bg-[#EAE5DC]">
          {report.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={report.imageUrl}
              alt={report.judul}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-navy flex items-center justify-center text-white font-bold">
              Kabar Penyaluran AmanahZakat
            </div>
          )}
        </div>

        {/* Financials & Beneficiary Highlight Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-3xl bg-white border border-border shadow-subtle">
          <div className="space-y-1">
            <span className="text-xs text-text-subtle block">Nominal Dana Disalurkan</span>
            <span className="font-mono font-extrabold text-2xl text-primary">
              {formatIDR(report.nominal)}
            </span>
          </div>

          {report.penerima && (
            <div className="space-y-1 sm:border-l sm:border-border sm:pl-6">
              <span className="text-xs text-text-subtle block">Total Penerima Manfaat</span>
              <span className="font-mono font-extrabold text-2xl text-text">
                {report.penerima.toLocaleString("id-ID")} Jiwa
              </span>
            </div>
          )}
        </div>

        {/* Story Body */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border space-y-4">
          <h3 className="font-extrabold text-xl text-text">Laporan Lengkap & Dokumentasi</h3>
          <div className="text-sm sm:text-base text-text-muted leading-relaxed space-y-4">
            <p>{report.isi || report.ringkas}</p>
            <p>
              Program penyaluran ini terlaksana atas dukungan para muzakki dan donatur yang telah
              menunaikan zakat, infak, dan shodaqoh melalui LAZNAS AmanahZakat. Tim lapangan
              memastikan bahwa seluruh bantuan diterima secara langsung dan diverifikasi oleh tokoh
              masyarakat setempat.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary-soft border border-primary-border text-xs text-primary-dark">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <span>
              Penyaluran ini telah dicatat dalam laporan keuangan berkala standar PSAK 109 dan
              terbuka untuk diaudit.
            </span>
          </div>
        </div>

        {/* Share Section */}
        <div className="p-6 rounded-3xl bg-white border border-border">
          <ShareButtons title={report.judul} />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-[#FAF8F4] border border-border">
          <div>
            <h4 className="font-extrabold text-base text-text">Tertarik Mendukung Program Serupa?</h4>
            <p className="text-xs text-text-muted">
              Mari luaskan jangkauan manfaat untuk ribuan saudara kita yang membutuhkan lainnya.
            </p>
          </div>

          <Link href="/donasi">
            <Button variant="primary" size="md">
              <Heart className="h-4 w-4 fill-white mr-1.5" />
              Tunaikan Donasi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
