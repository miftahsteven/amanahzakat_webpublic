import React from "react";
import Link from "next/link";
import { Heart, Compass, Calculator, CheckSquare, HelpCircle, PieChart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
}

const actions: QuickAction[] = [
  {
    title: "Donasi Sekarang",
    subtitle: "Mudah & Aman",
    href: "/donasi",
    icon: <Heart className="h-4 w-4 text-[#14509C] fill-[#14509C]" />,
  },
  {
    title: "Kampanye",
    subtitle: "Program Terbaru",
    href: "/",
    icon: <Compass className="h-4 w-4 text-[#14509C]" />,
  },
  {
    title: "Kalkulator Zakat",
    subtitle: "Hitung Kewajiban",
    href: "/hitung-zakat",
    icon: <Calculator className="h-4 w-4 text-[#14509C]" />,
  },
  {
    title: "Verifikasi Bukti",
    subtitle: "Transparansi",
    href: "/verifikasi-bukti",
    icon: <CheckSquare className="h-4 w-4 text-[#14509C]" />,
  },
  {
    title: "Tanya Jawab",
    subtitle: "Pusat Bantuan",
    href: "/tanya-zis",
    icon: <HelpCircle className="h-4 w-4 text-[#14509C]" />,
  },
  {
    title: "Dampak",
    subtitle: "Laporan Terbuka",
    href: "/dampak",
    icon: <PieChart className="h-4 w-4 text-[#14509C]" />,
  },
];

export function QuickActionGrid() {
  return (
    <>
      {/* Submenu Box Wider than Hero Slider (3 Cols on Mobile, 6 Cols on Desktop) */}
      <div className="max-w-[1180px] mx-auto px-3 sm:px-4 lg:px-6 -mt-8 sm:-mt-12 lg:-mt-14 relative z-30">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EAE5DC] shadow-[0_12px_32px_rgba(15,23,42,0.09)] grid grid-cols-3 lg:grid-cols-6 overflow-hidden">
          {actions.map((act, index) => {
            const hasLeftBorderMobile = index % 3 !== 0;
            const hasTopBorderMobile = index >= 3;
            const hasLeftBorderDesktop = index !== 0;

            return (
              <Link
                key={act.title}
                href={act.href}
                className={cn(
                  "flex flex-col items-center justify-center text-center py-3.5 px-1.5 sm:py-4 sm:px-2 transition-all duration-200 hover:bg-[#FAF8F4] group",
                  hasLeftBorderMobile ? "border-l border-[#EAE5DC]" : "",
                  hasTopBorderMobile ? "border-t border-[#EAE5DC]" : "",
                  "lg:border-t-0",
                  hasLeftBorderDesktop ? "lg:border-l lg:border-[#EAE5DC]" : "lg:border-l-0"
                )}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EEF3FB] group-hover:bg-[#14509C] group-hover:text-white flex items-center justify-center transition-all duration-200 mb-1.5 sm:mb-2 shadow-sm">
                  <span className="group-hover:brightness-200 transition-all">
                    {act.icon}
                  </span>
                </div>
                <span className="font-extrabold text-[11px] sm:text-xs lg:text-[13px] text-[#1A1613] group-hover:text-[#14509C] transition-colors leading-tight">
                  {act.title}
                </span>
                <span className="text-[9.5px] sm:text-[10.5px] lg:text-[11px] text-[#8C827A] mt-0.5 font-medium leading-tight">
                  {act.subtitle}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Right Button: UD Tanya Zakat */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40">
        <Link href="/tanya-zis">
          <button
            type="button"
            className="flex items-center gap-2 bg-[#0B1F3D] hover:bg-[#14509C] text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl border border-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <div className="p-1 rounded-full bg-white/10">
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-300" />
            </div>
            <span className="font-extrabold text-[11px] sm:text-xs tracking-wider uppercase">
              Tanya Zakat
            </span>
          </button>
        </Link>
      </div>
    </>
  );
}
