"use client";

import React from "react";

const testimonials = [
  {
    quote:
      "Amanah Zakat sangat transparan dan amanah dalam menyalurkan dana zakat. Laporannya jelas dan mudah diakses.",
    name: "Ahmad Fauzi",
    role: "Donatur",
    initials: "AF",
    avatarBg: "bg-[#14509C]",
  },
  {
    quote:
      "Program beasiswa ini sangat membantu saya melanjutkan pendidikan. Terima kasih Amanah Zakat.",
    name: "Maya Sari",
    role: "Penerima Manfaat",
    initials: "MS",
    avatarBg: "bg-[#C98B2F]",
  },
  {
    quote:
      "Pelayanan cepat, responsif, dan profesional. Saya merasa tenang menyalurkan zakat lewat sini.",
    name: "Rizky Pratama",
    role: "Donatur",
    initials: "RP",
    avatarBg: "bg-[#2B6F9E]",
  },
  {
    quote:
      "Bantuan modal usaha dari Amanah Zakat membantu saya mengembangkan usaha dan menghidupi keluarga.",
    name: "Nurhayati",
    role: "Penerima Manfaat",
    initials: "N",
    avatarBg: "bg-[#8B5CB8]",
  },
];

const partners = [
  "BAZNAS",
  "BSI",
  "Mandiri Syariah",
  "Pegadaian Syariah",
  "Sahabat Yatim",
  "Global Zakat",
  "IZI",
  "Rumah Zakat",
];

export function TestimonialsSection() {
  const [data, setData] = React.useState<{
    quote: string;
    name: string;
    role: string;
    initials: string;
    avatarBg?: string;
    avatarUrl?: string;
  }[]>(testimonials);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005/api/v1/public";
        const res = await fetch(`${baseUrl}/testimonials`);
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            setData(
              list.map((t: { quote: string; name: string; role: string; location?: string; avatarUrl?: string }) => ({
                quote: t.quote,
                name: t.name,
                role: `${t.role}${t.location ? ` • ${t.location}` : ""}`,
                initials: t.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase(),
                avatarBg: "bg-[#0B9D6D]",
                avatarUrl: t.avatarUrl,
              }))
            );
          }
        }
      } catch {
        // Fallback to static items
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Section Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-[#1A1613] tracking-tight leading-none">
          Apa Kata Mereka?
        </h2>
        <p className="text-xs sm:text-[15px] text-[#6D645B] mt-1.5 sm:mt-2 font-medium">
          Testimoni dari para penerima manfaat, muzakki, dan tokoh masyarakat
        </p>
      </div>

      {/* 4 Testimonial Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#EAE5DC] rounded-2xl p-4 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#0B9D6D]/40 hover:shadow-sm transition-all min-h-[180px] sm:min-h-[210px]"
          >
            <p className="text-[13px] sm:text-sm text-[#4A443C] italic leading-relaxed flex-1">
              “{item.quote}”
            </p>

            <div className="flex items-center gap-3 pt-2 border-t border-[#F0ECE4]/70">
              {item.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.avatarUrl}
                  alt={item.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 border border-border"
                />
              ) : (
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${item.avatarBg || "bg-[#0B9D6D]"} text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-xs`}
                >
                  {item.initials}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs sm:text-sm text-[#1A1613] truncate">
                  {item.name}
                </span>
                <span className="text-[10.5px] sm:text-[11.5px] text-[#9A9086] truncate">
                  {item.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PartnerChips() {
  return (
    <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#1A1613] tracking-tight leading-none">
          Mitra Kebaikan
        </h2>
        <p className="text-xs sm:text-[15px] text-[#6D645B] mt-1.5 sm:mt-2 font-medium">
          Bersama mitra terpercaya menebar manfaat
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
        {partners.map((partner) => (
          <div
            key={partner}
            className="bg-white border border-[#EAE5DC] hover:border-[#14509C] hover:text-[#14509C] rounded-2xl px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold text-[#5E564E] shadow-xs transition-all select-none"
          >
            {partner}
          </div>
        ))}
      </div>
    </section>
  );
}
