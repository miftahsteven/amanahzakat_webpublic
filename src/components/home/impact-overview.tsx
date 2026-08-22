import React from "react";

const dampakStats = [
  { value: "125.360", label: "Penerima Manfaat" },
  { value: "8.450", label: "Program Tersalurkan" },
  { value: "Rp 52,7 M", label: "Dana Tersalurkan" },
  { value: "1.250", label: "Lokasi Program" },
];

export function ImpactOverview() {
  return (
    <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Section Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-[#1A1613] tracking-tight leading-tight">
          Dampak Kebaikan Anda
        </h2>
        <p className="text-xs sm:text-[15px] text-[#6D645B] mt-1.5 sm:mt-2 font-medium">
          Terima kasih — kebaikan Anda telah memberikan dampak nyata
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {dampakStats.map((d) => (
          <div
            key={d.label}
            className="bg-white border border-[#EAE5DC] rounded-2xl p-4 sm:p-6 shadow-xs hover:border-[#BCD3EE] hover:shadow-sm transition-all flex flex-col justify-between min-h-[90px] sm:min-h-[110px]"
          >
            <div className="font-mono text-xl sm:text-[26px] lg:text-[28px] font-bold text-[#0E3B74] tracking-tight leading-none">
              {d.value}
            </div>
            <div className="text-[11.5px] sm:text-[13px] text-[#6D645B] mt-2 font-medium leading-tight">
              {d.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
