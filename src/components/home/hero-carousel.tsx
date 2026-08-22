"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, ShieldCheck, Droplets, Utensils, Trees, Sprout, Smile, Building2, Users, PackageCheck, Wallet, MapPin } from "lucide-react";

export function HeroCarousel() {
  const [current, setCurrent] = React.useState(0);
  const totalSlides = 3;

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrent((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrent((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-[1140px] mx-auto px-0 sm:px-4 lg:px-6 -mt-[64px] sm:-mt-[70px] relative z-10">
      {/* Hero Banner Card without border-radius */}
      <div className="relative overflow-hidden shadow-md bg-white border-b border-[#EAE5DC] sm:border sm:border-[#EAE5DC]">
        
        {/* Navigation Indicator Dots Top Right */}
        <div className="absolute top-20 right-3 sm:top-24 sm:right-6 z-30 flex items-center gap-1 sm:gap-1.5 bg-black/35 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/20">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrent(idx);
              }}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                idx === current ? "w-5 sm:w-7 bg-white" : "w-2 sm:w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows Left & Right */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Slide sebelumnya"
          className="absolute left-2 sm:left-4 top-[52%] -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-white/90 text-navy hover:bg-white hover:scale-110 shadow-lg transition-all cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Slide berikutnya"
          className="absolute right-2 sm:right-4 top-[52%] -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-white/90 text-navy hover:bg-white hover:scale-110 shadow-lg transition-all cursor-pointer"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* SLIDE 1: KEBAIKAN KITA SEMUA (Full Slide Link) */}
        {current === 0 && (
          <Link
            href="/donasi"
            className="block relative min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 flex flex-col justify-between animate-fadeIn group cursor-pointer select-none"
          >
            {/* Image Background & Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero_slide_kebaikan.jpg"
                alt="Kebaikan Anda, Harapan Mereka"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FBFAF7]/95 via-[#FBFAF7]/85 to-transparent lg:to-white/20" />
            </div>

            {/* Slide 1 Content */}
            <div className="relative z-10 px-5 pt-1 sm:px-8 lg:px-12 max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl border border-border shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-amanahzakat.png"
                  alt="Amanah Zakat"
                  height={28}
                  style={{ maxHeight: "28px", width: "auto" }}
                  className="h-6 sm:h-7 w-auto object-contain"
                />

              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[44px] font-extrabold text-[#14509C] tracking-tight leading-[1.12] group-hover:text-[#0E3B74] transition-colors">
                Kebaikan Anda,<br />
                Harapan Mereka,<br />
                <span className="text-[#C0473C]">Keberkahan Kita Semua</span>
              </h1>

              <p className="text-xs sm:text-sm lg:text-base text-[#4D453E] leading-relaxed max-w-lg font-medium line-clamp-3 sm:line-clamp-none">
                Setiap zakat, infak, dan sedekah yang Anda titipkan menjadi kekuatan untuk mengubah
                hidup mereka menjadi lebih baik dan lebih bermartabat.
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="inline-flex items-center rounded-full px-5 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold shadow-xl bg-[#14509C] group-hover:bg-[#0E3B74] text-white transition-all">
                  <Heart className="h-4 w-4 fill-white mr-1.5" />
                  DONASI SEKARANG →
                </div>

                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#14509C]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Amanah · Transparan · Profesional</span>
                </div>
              </div>
            </div>

            {/* Floating Badges Right */}
            <div className="hidden lg:block absolute right-12 top-28 z-20 space-y-3 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md text-xs font-bold text-[#14509C] flex items-center gap-2 border border-white/60">
                <Droplets className="h-4 w-4 text-[#2B6F9E]" />
                <span>Air Bersih untuk Kehidupan</span>
              </div>
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md text-xs font-bold text-[#14509C] flex items-center gap-2 border border-white/60 ml-8">
                <Utensils className="h-4 w-4 text-amber-600" />
                <span>Roti untuk Keluarga</span>
              </div>
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md text-xs font-bold text-[#14509C] flex items-center gap-2 border border-white/60 ml-4">
                <Trees className="h-4 w-4 text-emerald-600" />
                <span>Hijaukan Bumi, Lestarikan Masa Depan</span>
              </div>
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md text-xs font-bold text-[#14509C] flex items-center gap-2 border border-white/60 ml-10">
                <Sprout className="h-4 w-4 text-emerald-700" />
                <span>Zakat untuk Petani Mustahik</span>
              </div>
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md text-xs font-bold text-[#14509C] flex items-center gap-2 border border-white/60 ml-6">
                <Smile className="h-4 w-4 text-amber-500" />
                <span>Bahagia Mereka, Bahagia Kita</span>
              </div>
            </div>

            {/* Bottom Embedded Stats Bar */}
            <div className="relative z-10 bg-[#0B1F3D] text-white px-3.5 py-2.5 sm:px-6 sm:py-3.5 border-t border-white/10 flex items-center justify-between">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="p-1 sm:p-1.5 rounded-lg bg-white/10 text-primary-border shrink-0">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div>
                    <span className="font-mono font-extrabold text-xs sm:text-sm block text-white leading-tight">
                      128.750+
                    </span>
                    <span className="text-[9.5px] sm:text-[10.5px] text-white/70 block leading-tight">Penerima</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="p-1 sm:p-1.5 rounded-lg bg-white/10 text-emerald-400 shrink-0">
                    <PackageCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div>
                    <span className="font-mono font-extrabold text-xs sm:text-sm block text-white leading-tight">
                      8.450+
                    </span>
                    <span className="text-[9.5px] sm:text-[10.5px] text-white/70 block leading-tight">Program</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="p-1 sm:p-1.5 rounded-lg bg-white/10 text-amber-400 shrink-0">
                    <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div>
                    <span className="font-mono font-extrabold text-xs sm:text-sm block text-white leading-tight">
                      Rp 56,3 M+
                    </span>
                    <span className="text-[9.5px] sm:text-[10.5px] text-white/70 block leading-tight">Tersalurkan</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="p-1 sm:p-1.5 rounded-lg bg-white/10 text-blue-300 shrink-0">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div>
                    <span className="font-mono font-extrabold text-xs sm:text-sm block text-white leading-tight">
                      1.376
                    </span>
                    <span className="text-[9.5px] sm:text-[10.5px] text-white/70 block leading-tight">Lokasi</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* SLIDE 2: PALESTINA AID (Full Slide Link) */}
        {current === 1 && (
          <Link
            href="/donasi?campaign=palestina"
            className="block relative min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 flex flex-col justify-between animate-fadeIn group cursor-pointer select-none"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero_slide_palestina.jpg"
                alt="Hadirkan Air, Roti & Harapan untuk Palestina"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FBFAF7]/95 via-[#FBFAF7]/85 to-transparent lg:to-white/30" />
            </div>

            <div className="relative z-10 px-5 pt-1 sm:px-8 lg:px-12 max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl border border-border shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-amanahzakat.png"
                  alt="Amanah Zakat"
                  height={28}
                  style={{ maxHeight: "28px", width: "auto" }}
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              </div>

              <div className="inline-block px-3 py-0.5 rounded-full bg-[#C0473C] text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
                Bersama Kita
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[42px] font-extrabold text-[#14509C] tracking-tight leading-[1.12] group-hover:text-[#0E3B74] transition-colors">
                HADIRKAN AIR, ROTI & HARAPAN UNTUK <span className="text-[#C0473C]">PALESTINA</span>
              </h1>

              <p className="text-xs sm:text-sm lg:text-base text-[#4D453E] leading-relaxed max-w-lg font-medium line-clamp-3 sm:line-clamp-none">
                Ribuan saudara kita di Palestina kekurangan air bersih, pangan, dan infrastruktur dasar.
                Mari hadirkan solusi nyata melalui zakat, infak, dan sedekah terbaik Anda.
              </p>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-primary-border text-[11px] sm:text-xs font-bold text-[#14509C] shadow-xs">
                  <Droplets className="h-3.5 w-3.5 text-[#2B6F9E]" />
                  <span>Air Bersih</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-amber-300 text-[11px] sm:text-xs font-bold text-amber-900 shadow-xs">
                  <Utensils className="h-3.5 w-3.5 text-amber-600" />
                  <span>Roti</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-emerald-300 text-[11px] sm:text-xs font-bold text-emerald-900 shadow-xs">
                  <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Penyulingan Air</span>
                </div>
              </div>

              <div className="pt-1">
                <div className="inline-flex items-center rounded-full px-5 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold shadow-xl bg-[#14509C] group-hover:bg-[#0E3B74] text-white transition-all">
                  <Heart className="h-4 w-4 fill-white mr-1.5" />
                  DONASI SEKARANG →
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* SLIDE 3: GREEN ZAKAT (Full Slide Link) */}
        {current === 2 && (
          <Link
            href="/donasi?campaign=citarum-lestari"
            className="block relative min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 flex flex-col justify-between animate-fadeIn group cursor-pointer select-none"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero_slide_green_zakat.jpg"
                alt="Zakat Hijau, Lestarikan Bumi"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FBFAF7]/95 via-[#FBFAF7]/85 to-transparent lg:to-white/30" />
            </div>

            <div className="relative z-10 px-5 pt-1 sm:px-8 lg:px-12 max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl border border-border shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-amanahzakat.png"
                  alt="Amanah Zakat"
                  height={28}
                  style={{ maxHeight: "28px", width: "auto" }}
                  className="h-6 sm:h-7 w-auto object-contain"
                />

              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[42px] font-extrabold text-[#1B5E20] tracking-tight leading-[1.12] group-hover:text-[#124116] transition-colors">
                Zakat Hijau, Lestarikan Bumi, Hadirkan Kehidupan
              </h1>

              <p className="text-xs sm:text-sm lg:text-base text-[#3E4D40] leading-relaxed max-w-lg font-medium line-clamp-3 sm:line-clamp-none">
                Wujudkan masa depan yang lebih baik melalui zakat yang memberi manfaat nyata bagi
                lingkungan dan kehidupan secara berkelanjutan.
              </p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B5E20] text-white font-extrabold text-[11px] sm:text-xs shadow-md">
                <span>#GreenZakat</span>
              </div>

              <div className="pt-1">
                <div className="inline-flex items-center rounded-full px-5 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-sm font-bold shadow-xl bg-[#1B5E20] group-hover:bg-[#124116] text-white transition-all">
                  <Trees className="h-4 w-4 text-white mr-1.5" />
                  DUKUNG ZAKAT HIJAU →
                </div>
              </div>
            </div>

            <div className="hidden lg:block absolute right-12 top-32 z-20 space-y-3 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg text-xs font-bold text-[#1B5E20] flex items-center gap-2 border border-emerald-200">
                <Droplets className="h-4 w-4 text-[#2B6F9E]" />
                <div>
                  <span className="block font-extrabold text-text">Konservasi Mata Air</span>
                  <span className="text-[10px] text-text-subtle">Sumber Kehidupan Generasi</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg text-xs font-bold text-[#1B5E20] flex items-center gap-2 border border-emerald-200 ml-6">
                <Trees className="h-4 w-4 text-emerald-600" />
                <div>
                  <span className="block font-extrabold text-text">Shodaqoh Oksigen</span>
                  <span className="text-[10px] text-text-subtle">Setiap Pohon, Berharga</span>
                </div>
              </div>
            </div>
          </Link>
        )}

      </div>
    </section>
  );
}
