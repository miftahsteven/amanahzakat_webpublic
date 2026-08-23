"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
} from "lucide-react";

export interface HeroSlideItem {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl: string;
  badge?: string;
  badgeColor?: string;
  isActive: boolean;
  order: number;
}

const FALLBACK_SLIDES: HeroSlideItem[] = [
  {
    id: 1,
    title: "Wujudkan Ekosistem Berkelanjutan Lewat Green Zakat",
    subtitle: "Salurkan zakat dan wakaf untuk pemulihan daerah aliran sungai, lumbung pangan dhuafa, dan air bersih pelosok nusantara.",
    tag: "ZAKAT BERDAYA LINGKUNGAN",
    ctaText: "Tunaikan Zakat",
    ctaLink: "/donasi",
    imageUrl: "/images/hero_slide_green_zakat.jpg",
    badge: "Program Unggulan",
    badgeColor: "#0F9D6E",
    isActive: true,
    order: 5,
  },
  {
    id: 2,
    title: "Kebaikan Anda, Harapan Mereka, Keberkahan Kita Semua",
    subtitle: "Tiap rupiah zakat Anda disalurkan secara amanah, profesional, dan dapat diverifikasi langsung melalui sistem bukti setor sah SBMZ.",
    tag: "AMANAH & TRANSPARAN",
    ctaText: "Donasi Sekarang",
    ctaLink: "/donasi",
    imageUrl: "/images/hero_slide_kebaikan.jpg",
    badge: "Audit WTP 2025",
    badgeColor: "#14509C",
    isActive: true,
    order: 4,
  },
  {
    id: 3,
    title: "Darurat Kemanusiaan: Hadirkan Air, Roti & Harapan",
    subtitle: "Bantu saudara kita yang membutuhkan pangan pokok, pemenuhan gizi balita cegah stunting, dan beasiswa yatim dhuafa.",
    tag: "RESPON KEMANUSIAAN CEPAT",
    ctaText: "Bantu Sekarang",
    ctaLink: "/donasi?campaign=palestina",
    imageUrl: "/images/hero_slide_palestina.jpg",
    badge: "Tanggap Bencana",
    badgeColor: "#C0473C",
    isActive: true,
    order: 3,
  },
  {
    id: 4,
    title: "Pemberdayaan Ekonomi Mustahik & Pelatihan UMKM",
    subtitle: "Modal usaha bergulir tanpa bunga untuk mengubah mustahik menjadi muzakki berdaya mandiri.",
    tag: "EKONOMI BERDIKARI",
    ctaText: "Dukung Usaha Mikro",
    ctaLink: "/kampanye",
    imageUrl: "/images/berita-pelatihan-umkm.jpg",
    badge: "Kemandirian Umat",
    badgeColor: "#0F9D6E",
    isActive: true,
    order: 2,
  },
  {
    id: 5,
    title: "Inspirasi & Keteladanan: Jejak Kebaikan Tiada Henti",
    subtitle: "Kisah inspiratif para pejuang kebaikan dan penerima manfaat yang bangkit dari keterbatasan.",
    tag: "KISAH INSPIRATIF",
    ctaText: "Baca Kisah Nyata",
    ctaLink: "/dampak",
    imageUrl: "/images/inspirasi-siti-aisyah.jpg",
    badge: "Kisah Teladan",
    badgeColor: "#14509C",
    isActive: true,
    order: 1,
  },
];

export function HeroCarousel() {
  const [slides, setSlides] = React.useState<HeroSlideItem[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    const fetchHeroSliders = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005/api/v1/public";
        const res = await fetch(`${baseUrl}/hero-sliders`, { cache: "no-store" });
        if (res.ok) {
          const data: HeroSlideItem[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const sorted = data
              .filter((item) => item.isActive)
              .sort((a, b) => (b.order ?? 0) - (a.order ?? 0) || b.id - a.id)
              .slice(0, 5);

            if (sorted.length > 0) {
              setSlides(sorted);
            }
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchHeroSliders();
  }, []);

  const totalSlides = slides.length;

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
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const activeSlide = slides[current] || slides[0] || FALLBACK_SLIDES[0];

  return (
    <section className="max-w-[1050px] mx-auto px-0 sm:px-3 lg:px-0 -mt-[64px] sm:-mt-[70px] relative z-10 font-sans">
      {/* Hero Banner Card with exact 1717 / 916 aspect-ratio match */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative overflow-hidden shadow-md bg-slate-900 border-b border-[#EAE5DC] sm:border sm:border-[#EAE5DC] sm:rounded-2xl w-full aspect-[1717/916] min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col justify-end select-none"
      >
        {/* Background Images */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? "opacity-100 z-0 pointer-events-auto" : "opacity-0 -z-10 pointer-events-none"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.dataset.triedFallback) {
                  target.dataset.triedFallback = "1";
                  target.src = "/images/hero_slide_green_zakat.jpg";
                }
              }}
            />

            {/* Bottom-Up & Left Subtle Shadow Gradient (Image remains bright & clear across the middle and right) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent sm:from-black/75 sm:via-black/25 sm:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent hidden sm:block" />
          </div>
        ))}

        {/* Text Content Overlay Placed Inside Image */}
        <div className="relative z-10 w-full px-5 sm:px-8 lg:px-10 pb-16 sm:pb-18 lg:pb-20 max-w-2xl lg:max-w-3xl space-y-2.5 sm:space-y-3">
          {/* Top Tag & Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0F9D6E] text-white shadow-xs">
              <Sparkles className="w-3 h-3 text-[#A5E4CB]" />
              {activeSlide.tag || "PROGRAM UTAMA"}
            </span>

            {activeSlide.badge && (
              <span
                className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white shadow-xs backdrop-blur-xs"
                style={{ backgroundColor: activeSlide.badgeColor || "#14509C" }}
              >
                {activeSlide.badge}
              </span>
            )}
          </div>

          {/* Title (Text Berwarna Berbeda & Pop Out) */}
          <h1 className="text-xl sm:text-2xl lg:text-[34px] font-extrabold text-white tracking-tight leading-[1.2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span className="text-[#A5E4CB]">{activeSlide.title.split(",")[0] || activeSlide.title}</span>
            {activeSlide.title.includes(",") && (
              <span className="text-white">,{activeSlide.title.slice(activeSlide.title.indexOf(",") + 1)}</span>
            )}
          </h1>

          {/* Deskripsi Singkat Maksimal 2 Baris */}
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal line-clamp-2 max-w-xl drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            {activeSlide.subtitle}
          </p>

          {/* Single Primary Green CTA Button */}
          <div className="pt-1.5 sm:pt-2">
            <Link
              href={activeSlide.ctaLink || "/donasi"}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold shadow-xl bg-[#0F9D6E] hover:bg-[#0B7C56] text-white transition-all transform active:scale-95 cursor-pointer"
            >
              <Heart className="h-4 w-4 fill-white shrink-0" />
              <span>{activeSlide.ctaText || "Tunaikan Zakat"}</span>
            </Link>
          </div>
        </div>

        {/* Navigation Indicator Dots Top Right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrent(idx);
              }}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === current
                  ? "w-6 sm:w-8 bg-[#A5E4CB] shadow-sm"
                  : "w-2 sm:w-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows Left & Right */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Slide sebelumnya"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-md hover:scale-110 shadow-lg transition-all cursor-pointer border border-white/20"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Slide berikutnya"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-md hover:scale-110 shadow-lg transition-all cursor-pointer border border-white/20"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </section>
  );
}
