import { Metadata } from "next";
import { ShieldCheck, HeartHandshake, Award, FileCheck, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { siteConfig } from "@/config/site";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Tentang Kami — LAZNAS AmanahZakat",
  description:
    "Mengenal visi, misi, legalitas SK Kemenag RI, dan Dewan Pengawas Syariah LAZNAS AmanahZakat Peduli.",
};

export default function TentangPage() {
  const values = [
    {
      title: "Amanah & Terpercaya",
      desc: "Menjaga setiap rupiah amanah muzakki dan menyalurkannya sesuai peruntukan syariat dan undang-undang.",
    },
    {
      title: "Transparan & Akuntabel",
      desc: "Laporan keuangan diaudit berkala oleh Kantor Akuntan Publik independen dengan opini Wajar Tanpa Pengecualian (WTP).",
    },
    {
      title: "Profesional & Berdaya",
      desc: "Dikelola oleh amil bersertifikasi BNSP dengan sistem informasi manajemen zakat berbasis digital terintegrasi.",
    },
    {
      title: "Berdampak Berkelanjutan",
      desc: "Berorientasi pada pengentasan kemiskinan dan kemandirian mustahik menjadi muzakki baru.",
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      <PageHero
        breadcrumbs={[{ label: "Tentang Kami" }]}
        badge="Profil Lembaga"
        title="Membangun Kemandirian Umat Bersama AmanahZakat"
        description="Lembaga Amil Zakat Nasional (LAZNAS) yang berkhidmat menghimpun, mengelola, dan mendistribusikan ZISWAF secara profesional, amanah, dan berdampak luas."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Visi & Misi */}
        <div className="p-8 rounded-3xl bg-white border border-border shadow-subtle space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Visi Lembaga</span>
            <h2 className="text-2xl font-extrabold text-text">
              Menjadi Lembaga Amil Zakat Terdepan dalam Menyejahterakan Umat dan Membangun Kemandirian Mustahik.
            </h2>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-text-subtle">Misi Utama</span>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Mengoptimalkan penghimpunan zakat, infak, shodaqoh, dan wakaf melalui kemudahan teknologi digital.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Menyelenggarakan program pendistribusian dan pendayagunaan yang terukur, transparan, dan berdampak jangka panjang.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Menerapkan tata kelola kelembagaan yang amanah, akuntabel, serta patuh pada syariat Islam dan regulasi negara.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Nilai Utama */}
        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-text">Nilai-Nilai Utama Lembaga</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v) => (
              <Card key={v.title} className="p-6 bg-white space-y-2">
                <h4 className="font-extrabold text-base text-text">{v.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">{v.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Legalitas & Pengawasan */}
        <div className="p-8 rounded-3xl bg-navy text-white shadow-card space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-border">
              Legalitas & Izin Operasional
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              Landasan Hukum & Dewan Pengawas
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-white/60 block">Izin Operasional LAZNAS</span>
              <span className="font-bold text-white text-sm">{siteConfig.legal.licenseLabel}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-white/60 block">NPWP Resmi</span>
              <span className="font-mono font-bold text-white text-sm">{siteConfig.legal.npwp}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-white/60 block">Standar Akuntansi</span>
              <span className="font-bold text-white text-sm">Audit PSAK 109 WTP</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-white/60 block">Rekomendasi Regulator</span>
              <span className="font-bold text-white text-sm">BAZNAS RI & Kementerian Agama</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
