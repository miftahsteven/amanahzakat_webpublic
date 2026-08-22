import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="bg-gradient-to-r from-[#14509C] via-[#0E3B74] to-[#2E7D4F] text-white">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-11 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
        {/* Left: Heading & Subtitle */}
        <div className="max-w-md text-center lg:text-left">
          <h2 className="text-2xl sm:text-[26px] font-extrabold text-white tracking-tight leading-none">
            Siap Menebar Kebaikan?
          </h2>
          <p className="text-xs sm:text-[14.5px] text-white/90 leading-relaxed mt-2 sm:mt-2.5 font-medium">
            Bersama Amanah Zakat, wujudkan kebaikan yang berkelanjutan untuk negeri.
          </p>
        </div>

        {/* Center: CTA Button */}
        <div className="shrink-0 flex justify-center">
          <Link href="/donasi" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#EEF3FB] active:scale-98 text-[#0E3B74] font-bold text-sm sm:text-base px-7 py-3 sm:py-3.5 rounded-full sm:rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <span>Donasi Sekarang</span>
              <ArrowRight className="h-4 w-4 text-[#0E3B74]" />
            </button>
          </Link>
        </div>

        {/* Right: Value Props / Trust Indicators */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 text-center lg:text-left pt-2 lg:pt-0 border-t border-white/15 lg:border-t-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs sm:text-sm font-bold text-white leading-tight">100% Aman</span>
            <span className="text-[10px] sm:text-xs text-white/80 leading-tight">Dana terlindungi</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-xs sm:text-sm font-bold text-white leading-tight">Transparan</span>
            <span className="text-[10px] sm:text-xs text-white/80 leading-tight">Laporan terbuka</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-xs sm:text-sm font-bold text-white leading-tight">Sesuai Syariah</span>
            <span className="text-[10px] sm:text-xs text-white/80 leading-tight">Tuntas & tepat</span>
          </div>
        </div>
      </div>
    </section>
  );
}
