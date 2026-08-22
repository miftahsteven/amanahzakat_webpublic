"use client";

import React from "react";
import Link from "next/link";
import { initialFaqList } from "@/mocks/faq";
import { ChevronDown, ChevronUp } from "lucide-react";

export function HomeFaq() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const topFaqs = initialFaqList.slice(0, 6);

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* FAQ Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="inline-block bg-[#EEF3FB] text-[#0E3B74] font-bold text-xs px-3.5 py-1.5 rounded-full mb-2.5">
            Tanya Jawab ZIS
          </span>
          <h2 className="text-2xl sm:text-[28px] lg:text-[30px] font-extrabold text-[#1A1613] tracking-tight leading-tight">
            Masih ragu sebelum menunaikan?
          </h2>
          <p className="text-sm sm:text-[15px] text-[#6D645B] mt-2 font-medium max-w-xl">
            Enam pertanyaan yang paling sering masuk ke amil kami — selebihnya bisa Anda tanyakan langsung ke asisten.
          </p>
        </div>

        <Link href="/tanya-zakat">
          <button
            type="button"
            className="bg-white hover:bg-[#FAF8F4] active:scale-98 text-[#1A1613] border border-[#DDD7CD] hover:border-[#14509C] hover:text-[#14509C] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            Tanya Zakat (AI)
          </button>
        </Link>
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-2.5">
        {topFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.id}
              className="bg-white border border-[#EAE5DC] hover:border-[#BCD3EE] rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[#1A1613] cursor-pointer gap-4"
              >
                <span>{faq.question}</span>
                <span className="text-[#14509C] font-bold text-lg shrink-0">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-[#4D453E] leading-relaxed border-t border-[#F0ECE4] space-y-2">
                  <p className="pt-3">{faq.answer.replace(/\|/g, " ")}</p>
                  <div className="text-[11.5px] font-semibold text-[#8C827A] pt-2">
                    Rujukan: {faq.sourceReference}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function TrustSection() {
  const jaminan = [
    {
      kode: "01",
      judul: "Tercatat di sistem yang diaudit",
      isi: "Donasi Anda masuk ke pembukuan PSAK 109 yang sama dengan yang diperiksa akuntan publik.",
    },
    {
      kode: "02",
      judul: "Bukti setor & SBMZ resmi",
      isi: "Setiap donasi menerbitkan bukti setor berkode QR yang bisa dipakai sebagai pengurang pajak.",
    },
    {
      kode: "03",
      judul: "Laporan lapangan berkala",
      isi: "Kabar dari lokasi program diperbarui, bukan hanya laporan angka di akhir tahun.",
    },
  ];

  return (
    <section className="bg-white border-y border-[#EAE5DC] py-10 sm:py-12">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#1A1613] tracking-tight leading-none">
            Kenapa amanah Anda aman di sini
          </h2>
          <p className="text-sm sm:text-[15px] text-[#6D645B] mt-2.5 font-medium max-w-xl">
            Setiap donasi masuk ke sistem pencatatan yang sama dengan yang diaudit akuntan publik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {jaminan.map((j) => (
            <div key={j.kode} className="flex flex-col gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#EEF3FB] text-[#0E3B74] flex items-center justify-center font-mono font-bold text-sm">
                {j.kode}
              </span>
              <h3 className="font-extrabold text-base text-[#1A1613] tracking-tight leading-snug">
                {j.judul}
              </h3>
              <p className="text-xs sm:text-[13.5px] text-[#6D645B] leading-relaxed">
                {j.isi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
