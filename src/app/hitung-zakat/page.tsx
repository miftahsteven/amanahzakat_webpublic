import { Metadata } from "next";
import { ZakatCalculator } from "@/components/zakat/zakat-calculator";

export const metadata: Metadata = {
  title: "Hitung Zakat Anda — Kalkulator Zakat Maal, Profesi & Fitrah",
  description:
    "Hitung kewajiban zakat maal, zakat profesi (gaji), dan zakat fitrah Anda secara akurat sesuai nisab emas Rp 1.450.000/gram dan harga beras Rp 15.000/kg.",
};

export default function HitungZakatPage() {
  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-16 animate-fadeIn">
      <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-[-0.8px] text-[#1A1613] m-0">
        Hitung zakat Anda
      </h1>
      <p className="text-xs sm:text-[14px] text-[#6D645B] mt-1.5 leading-relaxed">
        Nisab mengikuti harga emas Rp 1.450.000/gram dan harga beras Rp 15.000/kg
      </p>

      <ZakatCalculator />
    </div>
  );
}
