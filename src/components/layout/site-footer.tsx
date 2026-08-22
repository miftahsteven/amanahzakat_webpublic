import React from "react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#0B1F3D] text-[#8FA6C4]">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-8">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 md:gap-12">
          {/* Left Column: Brand Box & Brief */}
          <div className="max-w-xs sm:max-w-sm space-y-3.5">
            <Link href="/" className="inline-block">
              <div className="bg-white px-3.5 py-2 rounded-xl shadow-xs inline-flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-amanahzakat.png"
                  alt="Amanah Zakat"
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-[12.5px] leading-relaxed text-[#8FA6C4] font-normal">
              Lembaga Amil Zakat Nasional berizin Kementerian Agama RI. Laporan keuangan
              diaudit akuntan publik independen setiap tahun.
            </p>
          </div>

          {/* Right Columns: Program & Transparansi */}
          <div className="flex gap-12 sm:gap-16 flex-wrap">
            {/* PROGRAM */}
            <div className="flex flex-col gap-2.5">
              <div className="text-[11px] font-bold uppercase tracking-[1.2px] text-[#5F7391]">
                Program
              </div>
              <Link
                href="/donasi"
                className="text-[12.5px] text-[#8FA6C4] hover:text-[#A8C8F0] transition-colors"
              >
                Zakat & Infak
              </Link>
              <Link
                href="/kampanye?category=Wakaf+Sumur"
                className="text-[12.5px] text-[#8FA6C4] hover:text-[#A8C8F0] transition-colors"
              >
                Wakaf Produktif
              </Link>
              <Link
                href="/kampanye?category=Qurban"
                className="text-[12.5px] text-[#8FA6C4] hover:text-[#A8C8F0] transition-colors"
              >
                Qurban
              </Link>
            </div>

            {/* TRANSPARANSI */}
            <div className="flex flex-col gap-2.5">
              <div className="text-[11px] font-bold uppercase tracking-[1.2px] text-[#5F7391]">
                Transparansi
              </div>
              <Link
                href="/kabar-penyaluran"
                className="text-[12.5px] text-[#8FA6C4] hover:text-[#A8C8F0] transition-colors"
              >
                Kabar Penyaluran
              </Link>
              <Link
                href="/laporan-dampak"
                className="text-[12.5px] text-[#8FA6C4] hover:text-[#A8C8F0] transition-colors"
              >
                Laporan Keuangan
              </Link>
              <Link
                href="/tanya-zakat"
                className="text-[12.5px] text-[#8FA6C4] hover:text-[#A8C8F0] transition-colors"
              >
                Tanya Zakat (AI)
              </Link>
              <Link
                href="/verifikasi-bukti"
                className="text-[12.5px] text-[#8FA6C4] hover:text-[#A8C8F0] transition-colors"
              >
                Verifikasi Bukti Setor
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 mt-8 pt-5 text-xs text-[#8FA6C4]">
          <p>© 2026 AmanahZakat · Rekening zakat BSI 7015.738.876</p>
        </div>
      </div>
    </footer>
  );
}
