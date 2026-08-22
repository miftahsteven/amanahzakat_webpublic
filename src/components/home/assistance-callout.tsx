import React from "react";
import Link from "next/link";
import { Sparkles, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssistanceCallout() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#FDF6EA] via-[#FAF1DF] to-[#FCECD0] border-2 border-[#EEDBBA] p-8 sm:p-10 shadow-sm overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8C5D09]/10 text-[#8C5D09] border border-[#8C5D09]/20 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-amber-700" />
              <span>Layanan Bantuan Mustahik & Karyawan</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B2807] tracking-tight leading-tight">
              Butuh Mengajukan Bantuan Kemanusiaan?
            </h2>

            <p className="text-sm sm:text-base text-[#6B5023] leading-relaxed">
              Karyawan dan mitra kerja yang memenuhi ketentuan asnaf dapat mengirimkan proposal
              permohonan bantuan kesehatan, pendidikan, atau musibah serta dokumen pendukung secara online.
            </p>

            <div className="flex items-center gap-4 text-xs text-[#8C5D09] pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                Data Rahasia & Terlindungi
              </span>
              <span>•</span>
              <span>Verifikasi Resmi Tim Amil</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link href="/pengajuan-bantuan" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white border-[#D6BD96] text-[#6B5023] hover:bg-[#FDF9F2] justify-center"
              >
                <FileText className="h-4 w-4 mr-1.5" />
                Lihat Persyaratan
              </Button>
            </Link>

            <Link href="/pengajuan-bantuan/form" className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="w-full sm:w-auto bg-[#8C5D09] text-white hover:bg-[#734A06] shadow-sm justify-center"
              >
                Mulai Pengajuan
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
