import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, FileText, Phone, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pengajuan Bantuan Berhasil Terkirim",
  description: "Nomor registrasi pengajuan bantuan dan langkah verifikasi selanjutnya.",
};

export default async function SubmissionSuccessPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;

  return (
    <div className="space-y-8 pb-20">
      <PageHero
        breadcrumbs={[
          { label: "Pengajuan Bantuan", href: "/pengajuan-bantuan" },
          { label: "Pengajuan Terkirim" },
        ]}
        badge="Pengajuan Diterima"
        title="Pengajuan Bantuan Anda Telah Terkirim"
        description="Terima kasih, permohonan bantuan Anda telah terdaftar dalam sistem verifikasi amil AmanahZakat."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Success Card */}
        <div className="p-8 rounded-3xl bg-white border border-border shadow-card space-y-6 text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-2xl text-text">
              Nomor Registrasi Pengajuan Anda:
            </h3>
            <div className="inline-block p-4 rounded-2xl bg-[#FBFAF7] border-2 border-primary/20 font-mono font-extrabold text-2xl sm:text-3xl text-primary tracking-wider">
              {submissionId}
            </div>
            <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed pt-2">
              Simpan nomor registrasi di atas untuk memantau tahapan verifikasi dokumen dan status persetujuan pengajuan Anda.
            </p>
          </div>

          {/* Next Steps Box */}
          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-border text-left space-y-3 text-xs">
            <h4 className="font-extrabold text-sm text-text">Tahapan Selanjutnya:</h4>
            <ol className="list-decimal list-inside space-y-2 text-text-muted leading-relaxed">
              <li>
                Tim administrasi amil akan memeriksa kelengkapan proposal dan berkas pendukung dalam 1-3 hari kerja.
              </li>
              <li>
                Jika diperlukan klarifikasi atau dokumen tambahan, amil kami akan menghubungi Anda melalui WhatsApp atau telepon.
              </li>
              <li>
                Anda dapat memantau proses verifikasi secara berkala melalui portal cek status online.
              </li>
            </ol>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href={`/pengajuan-bantuan/cek-status?code=${encodeURIComponent(submissionId)}`} className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full justify-center">
                <Clock className="h-4 w-4 mr-2" />
                Cek Status Pengajuan Ini
              </Button>
            </Link>

            <Link href="/pengajuan-bantuan" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full justify-center">
                Kembali ke Beranda Bantuan
              </Button>
            </Link>
          </div>
        </div>

        {/* Assistance Help Contact */}
        <div className="p-4 rounded-2xl bg-white border border-border flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span>Butuh informasi mendesak seputar pengajuan?</span>
          </div>
          <a
            href={`https://wa.me/${siteConfig.support.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary hover:underline"
          >
            Hubungi Amil via WA
          </a>
        </div>
      </div>
    </div>
  );
}
