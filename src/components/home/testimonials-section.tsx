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

interface PartnerItem {
  id: string;
  name: string;
  category: string;
  badgeBg: string;
  logo: React.ReactNode;
}

const partnerList: PartnerItem[] = [
  {
    id: "baznas",
    name: "BAZNAS",
    category: "Badan Amil Zakat Nasional",
    badgeBg: "bg-[#0A5736]",
    logo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="23" fill="#0A5736" stroke="#C9A050" strokeWidth="2" />
        <path d="M24 10L27 18H35L28.5 22.5L31 30.5L24 25.5L17 30.5L19.5 22.5L13 18H21L24 10Z" fill="#F4C430" />
        <path d="M24 20C21.79 20 20 21.79 20 24C20 26.21 21.79 28 24 28C26.21 28 28 26.21 28 24C28 21.79 26.21 20 24 20Z" fill="#FFFFFF" />
        <path d="M16 34C19 37 29 37 32 34" stroke="#F4C430" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "bsi",
    name: "BSI",
    category: "Bank Syariah Indonesia",
    badgeBg: "bg-[#00A39D]",
    logo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#00A39D" />
        <path d="M24 8L26.5 18.5L37 16L29.5 24L37 32L26.5 29.5L24 40L21.5 29.5L11 32L18.5 24L11 16L21.5 18.5L24 8Z" fill="#F9A825" />
        <circle cx="24" cy="24" r="7" fill="#FFFFFF" />
        <circle cx="26" cy="22" r="5" fill="#00A39D" />
      </svg>
    ),
  },
  {
    id: "mandiri-syariah",
    name: "Mandiri Syariah",
    category: "Layanan Perbankan ZIS",
    badgeBg: "bg-[#003D79]",
    logo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#003D79" />
        <path d="M12 28C16 20 24 16 36 18C34 26 26 30 12 28Z" fill="#F5A623" />
        <path d="M14 34C18 28 26 24 36 26C34 32 26 35 14 34Z" fill="#FFFFFF" opacity="0.9" />
        <circle cx="34" cy="16" r="3.5" fill="#F5A623" />
      </svg>
    ),
  },
  {
    id: "pegadaian-syariah",
    name: "Pegadaian Syariah",
    category: "Keuangan Syariah",
    badgeBg: "bg-[#0F753D]",
    logo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#0F753D" />
        <circle cx="24" cy="18" r="7" fill="#C9A050" />
        <circle cx="16" cy="30" r="6" fill="#FFFFFF" />
        <circle cx="32" cy="30" r="6" fill="#C9A050" />
        <path d="M24 18L16 30M24 18L32 30" stroke="#FFFFFF" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "sahabat-yatim",
    name: "Sahabat Yatim",
    category: "Pemberdayaan Yatim & Dhuafa",
    badgeBg: "bg-[#009688]",
    logo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#009688" />
        <path d="M24 37C24 37 12 28 12 19C12 14.5 15.5 11 20 11C22.5 11 24 12.5 24 12.5C24 12.5 25.5 11 28 11C32.5 11 36 14.5 36 19C36 28 24 37 24 37Z" fill="#FF7043" />
        <circle cx="24" cy="20" r="3.5" fill="#FFFFFF" />
        <path d="M20 27C20 24.5 22 23 24 23C26 23 28 24.5 28 27" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "global-zakat",
    name: "Global Zakat",
    category: "Aksi Kemanusiaan & Filantropi",
    badgeBg: "bg-[#2E7D32]",
    logo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#2E7D32" />
        <circle cx="24" cy="24" r="14" stroke="#81C784" strokeWidth="2" />
        <ellipse cx="24" cy="24" rx="7" ry="14" stroke="#81C784" strokeWidth="1.5" />
        <line x1="10" y1="24" x2="38" y2="24" stroke="#81C784" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="4.5" fill="#FDD835" />
      </svg>
    ),
  },
  {
    id: "izi",
    name: "IZI",
    category: "Inisiatif Zakat Indonesia",
    badgeBg: "bg-[#00838F]",
    logo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#00838F" />
        <path d="M14 16H34L26 24L34 32H14L22 24L14 16Z" fill="#43A047" opacity="0.9" />
        <circle cx="24" cy="24" r="5" fill="#FFFFFF" />
        <path d="M22 24L26 24" stroke="#00838F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "rumah-zakat",
    name: "Rumah Zakat",
    category: "Pemberdayaan Umat Berdaya",
    badgeBg: "bg-[#F47B20]",
    logo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#F47B20" />
        <path d="M24 11L13 21H17V35H31V21H35L24 11Z" fill="#FFFFFF" />
        <path d="M24 23C22 23 21 24.5 21 26.5C21 29 24 32 24 32C24 32 27 29 27 26.5C27 24.5 26 23 24 23Z" fill="#1B365D" />
      </svg>
    ),
  },
  {
    id: "kemenag",
    name: "Kemenag RI",
    category: "Regulator ZIS Nasional",
    badgeBg: "bg-[#0D6238]",
    logo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="23" fill="#0D6238" stroke="#D4AF37" strokeWidth="2" />
        <path d="M24 11V37M12 24H36" stroke="#D4AF37" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="8" fill="#FFFFFF" />
        <path d="M24 18L26 22H30L27 25L28 29L24 26.5L20 29L21 25L18 22H22L24 18Z" fill="#0D6238" />
      </svg>
    ),
  },
  {
    id: "bjb-syariah",
    name: "BJB Syariah",
    category: "Mitra Transaksi ZIS",
    badgeBg: "bg-[#0C4C8A]",
    logo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#0C4C8A" />
        <path d="M24 12L28 20L36 24L28 28L24 36L20 28L12 24L20 20L24 12Z" fill="#F9A825" />
        <circle cx="24" cy="24" r="4" fill="#FFFFFF" />
      </svg>
    ),
  },
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
    <section className="py-6 sm:py-9 overflow-hidden relative">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 mb-5 sm:mb-6 text-center">
        <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#1A1613] tracking-tight leading-none">
          Mitra Kebaikan
        </h2>
        <p className="text-xs sm:text-[15px] text-[#6D645B] mt-1.5 sm:mt-2 font-medium">
          Bersama mitra resmi &amp; perbankan terpercaya menebar manfaat ke seluruh pelosok
        </p>
      </div>

      {/* 1-Row Infinite Slider Marquee Container */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right Gradient Fade Masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#FBFAF7] via-[#FBFAF7]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#FBFAF7] via-[#FBFAF7]/80 to-transparent z-10" />

        {/* Marquee Track (Double-looped for seamless infinite 1-row scroll) */}
        <div className="animate-marquee flex items-center gap-3 sm:gap-4 py-2 select-none">
          {partnerList.concat(partnerList).map((partner, idx) => (
            <div
              key={`${partner.id}-${idx}`}
              className="flex items-center gap-3 bg-white border border-[#EAE5DC] hover:border-[#14509C] hover:shadow-md rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 transition-all duration-300 shrink-0 group cursor-default"
            >
              {/* Brand Logo / Icon */}
              <div className="transition-transform duration-300 group-hover:scale-110">
                {partner.logo}
              </div>

              {/* Text Info */}
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-extrabold text-[#1A1613] group-hover:text-[#14509C] transition-colors leading-tight">
                  {partner.name}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#8C8276] font-medium leading-tight mt-0.5 max-w-[160px] truncate">
                  {partner.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
