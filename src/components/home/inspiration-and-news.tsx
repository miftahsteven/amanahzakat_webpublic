import React from "react";
import Link from "next/link";

const beritaItems = [
  {
    title: "Amanah Zakat salurkan bantuan darurat untuk korban banjir Kalimantan Selatan",
    date: "18 Agustus 2026",
    image: "/images/berita-banjir-kalsel.jpg",
    href: "/kabar-penyaluran",
  },
  {
    title: "Pelatihan UMKM dhuafa: tingkatkan keterampilan, wujudkan kemandirian ekonomi",
    date: "16 Agustus 2026",
    image: "/images/berita-pelatihan-umkm.jpg",
    href: "/kabar-penyaluran",
  },
  {
    title: "Penyaluran zakat fitrah 1447 H capai 98% dari target nasional",
    date: "14 Agustus 2026",
    image: "/images/berita-zakat-fitrah.jpg",
    href: "/kabar-penyaluran",
  },
];

export function InspirationAndNews() {
  return (
    <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {/* Left Column: Inspirasi Kebaikan */}
        <div>
          <div className="mb-3.5 sm:mb-5">
            <h2 className="text-2xl sm:text-[28px] lg:text-[30px] font-extrabold text-[#1A1613] tracking-tight leading-none">
              Inspirasi Kebaikan
            </h2>
            <p className="text-xs sm:text-[15px] text-[#6D645B] mt-1.5 sm:mt-2 font-medium">
              Kisah nyata dari kebaikan yang menginspirasi
            </p>
          </div>

          <div className="relative rounded-2xl border border-[#EAE5DC] overflow-hidden min-h-[260px] sm:min-h-[340px] flex flex-col justify-end p-5 sm:p-8 bg-[#1A1613] shadow-xs group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/inspirasi-siti-aisyah.jpg"
              alt="Siti Aisyah - Penerima Beasiswa Yatim Berprestasi"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <p className="text-sm sm:text-base lg:text-[17px] text-white italic font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                “Berkat beasiswa dari Amanah Zakat, saya bisa melanjutkan kuliah dan membanggakan orang tua.”
              </p>
              <div className="text-xs sm:text-sm text-[#CFD9EA] font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                — Siti Aisyah, Penerima Beasiswa Yatim Berprestasi
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Berita Terbaru */}
        <div>
          <div className="flex items-end justify-between gap-4 mb-3.5 sm:mb-5">
            <div>
              <h2 className="text-2xl sm:text-[28px] lg:text-[30px] font-extrabold text-[#1A1613] tracking-tight leading-none">
                Berita Terbaru
              </h2>
              <p className="text-xs sm:text-[15px] text-[#6D645B] mt-1.5 sm:mt-2 font-medium">
                Informasi terbaru seputar kegiatan dan program
              </p>
            </div>

            <Link
              href="/kabar-penyaluran"
              className="text-xs sm:text-sm font-bold text-[#14509C] hover:text-[#0E3B74] whitespace-nowrap hover:underline pb-0.5"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:gap-3.5">
            {beritaItems.map((b) => (
              <Link
                key={b.title}
                href={b.href}
                className="flex items-center gap-3 sm:gap-4 bg-white border border-[#EAE5DC] hover:border-[#BCD3EE] hover:shadow-md transition-all rounded-2xl p-3 sm:p-3.5 group cursor-pointer"
              >
                <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#EAE5DC]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-bold text-xs sm:text-sm text-[#1A1613] group-hover:text-[#14509C] transition-colors line-clamp-2 leading-snug">
                    {b.title}
                  </h3>
                  <span className="text-[11px] sm:text-[11.5px] text-[#9A9086] block">
                    {b.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
