import React from "react";
import Link from "next/link";
import { Sparkles, FileText, CheckCircle2, ShieldCheck, ArrowRight, Clock, HelpCircle, HeartPulse, GraduationCap, Flame, TrendingUp, Users } from "lucide-react";
import { assistanceCategories, assistanceDocumentRules } from "@/config/assistance";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AssistanceLanding() {
  const steps = [
    {
      num: "01",
      title: "Lengkapi Data Diri",
      desc: "Isi data pemohon, nomor induk karyawan (NIP), unit kerja, dan kontak aktif.",
    },
    {
      num: "02",
      title: "Pilih Kategori & Uraian",
      desc: "Jelaskan kebutuhan bantuan yang diajukan beserta rincian nominal perkiraan.",
    },
    {
      num: "03",
      title: "Unggah Dokumen Pendukung",
      desc: "Lampirkan proposal, ID Card, dan bukti pendukung (surat dokter/tagihan sekolah).",
    },
    {
      num: "04",
      title: "Review & Proses Amil",
      desc: "Periksa kembali pernyataan dan dapatkan nomor registrasi untuk cek status online.",
    },
  ];

  return (
    <div className="space-y-16 py-6">
      {/* Top Notice */}
      <div className="rounded-3xl bg-[#FDF6EA] border-2 border-[#EEDBBA] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#8C5D09]/10 text-[#8C5D09] border border-[#8C5D09]/20">
              Layanan Khusus
            </span>
            <span className="text-xs text-[#8C5D09] font-bold">Portal Pengajuan Bantuan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#3B2807]">
            Pengajuan Bantuan Kemanusiaan & Darurat Karyawan
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5023] leading-relaxed">
            Portal ini diperuntukkan bagi karyawan, keluarga tanggungan, dan mustahik binaan yang
            memerlukan bantuan mendesak sesuai ketentuan asnaf dan alokasi dana amil AmanahZakat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
          <Link href="/pengajuan-bantuan/cek-status">
            <Button variant="outline" className="w-full sm:w-auto bg-white border-[#D6BD96] text-[#6B5023]">
              <Clock className="h-4 w-4 mr-1.5" />
              Cek Status Pengajuan
            </Button>
          </Link>
          <Link href="/pengajuan-bantuan/form">
            <Button variant="primary" className="w-full sm:w-auto bg-[#8C5D09] text-white hover:bg-[#734A06]">
              Mulai Pengajuan
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 4-Step Process Overview */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-primary-soft text-primary">
            Alur Pengajuan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text">
            4 Langkah Mudah Mengajukan Bantuan
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="p-6 rounded-2xl bg-white border border-border shadow-subtle space-y-3 relative overflow-hidden"
            >
              <span className="font-mono font-extrabold text-3xl text-primary/30 block">
                {s.num}
              </span>
              <h3 className="font-bold text-base text-text">{s.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Kategori Bantuan */}
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-text-subtle">
            Program Bantuan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text">
            Kategori Bantuan yang Dapat Diajukan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assistanceCategories.map((cat) => (
            <Card key={cat.id} className="p-6 space-y-3 bg-white hover:shadow-card transition-all">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cat.badgeColor}`}>
                  {cat.name}
                </span>
              </div>
              <h3 className="font-bold text-base text-text">{cat.shortDesc}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{cat.longDesc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Dokumen yang Perlu Disiapkan */}
      <div className="p-8 rounded-3xl bg-white border border-border space-y-6">
        <div className="space-y-1">
          <h3 className="font-extrabold text-xl text-text">
            Dokumen yang Wajib Disiapkan Sebelum Mengisi Form
          </h3>
          <p className="text-xs text-text-muted">
            Format file yang didukung: PDF, JPG, PNG (maksimal 10 MB per berkas).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assistanceDocumentRules.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl bg-[#FAF8F4] border border-border flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-white border border-border text-primary shrink-0 mt-0.5">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-text">{doc.name}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      doc.required ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {doc.required ? "Wajib" : "Opsional"}
                  </span>
                </div>
                <p className="text-xs text-text-muted">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-primary-dark space-y-1">
          <span className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Pemberitahuan Kerahasiaan & Privasi
          </span>
          <p className="leading-relaxed">
            Seluruh data identitas dan dokumen yang Anda unggah hanya digunakan untuk keperluan
            verifikasi kelayakan bantuan oleh amil AmanahZakat dan tidak akan dipublikasikan ke pihak luar.
          </p>
        </div>
      </div>

      {/* Bottom Final CTA */}
      <div className="text-center space-y-4 pt-4">
        <Link href="/pengajuan-bantuan/form">
          <Button variant="primary" size="lg" className="px-8 shadow-md">
            <Sparkles className="h-4 w-4 mr-2" />
            Mulai Isi Formulir Pengajuan
          </Button>
        </Link>
        <p className="text-xs text-text-muted">
          Punya pertanyaan sebelum mengajukan? Hubungi amil kami di WhatsApp: 0811-2100-900
        </p>
      </div>
    </div>
  );
}
