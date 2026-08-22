"use client";

import * as React from "react";
import Link from "next/link";
import { initialFaqList } from "@/mocks/faq";
import { FaqCategory, FaqItem } from "@/types/faq.types";

const categories: FaqCategory[] = [
  "Semua",
  "Dasar ZIS",
  "Zakat Maal",
  "Zakat Profesi",
  "Pertanian & Tambang",
  "Infak & Shodaqoh",
  "Pajak & Bukti",
  "Teknis Donasi",
];

const saranPertanyaan = [
  "Berapa zakat dari gaji Rp 12 juta per bulan?",
  "Apakah tabungan saya sudah wajib zakat?",
  "Apakah zakat bisa mengurangi pajak?",
  "Apa beda infak dan shodaqoh?",
  "Zakat panen padi 2 ton, berapa yang harus saya keluarkan?",
];

interface ChatMessage {
  role: "user" | "ai";
  teks: string;
  sumber?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5005/api/v1/public";

export function FaqView() {
  const [selectedCategory, setSelectedCategory] = React.useState<FaqCategory>("Semua");
  const [openFaqId, setOpenFaqId] = React.useState<string | null>(null);
  const [faqList, setFaqList] = React.useState<FaqItem[]>(initialFaqList);

  // AI Assistant State
  const [query, setQuery] = React.useState("");
  const [chatList, setChatList] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const chatBottomRef = React.useRef<HTMLDivElement>(null);
  const assistantBoxRef = React.useRef<HTMLDivElement>(null);

  // Fetch live FAQs on mount
  React.useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch(`${API_BASE}/faqs`, { cache: "no-store" });
        if (res.ok) {
          const liveFaqs = await res.json();
          if (Array.isArray(liveFaqs) && liveFaqs.length > 0) {
            setFaqList(liveFaqs);
          }
        }
      } catch (e) {
        console.warn("Using local fallback FAQs:", e);
      }
    }
    loadFaqs();
  }, []);

  const handleAjukan = async (pertanyaan?: string) => {
    const teks = (pertanyaan || query).trim();
    if (!teks || isLoading) return;

    setChatList((prev) => [...prev, { role: "user", teks }]);
    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/faqs/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: teks }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatList((prev) => [
          ...prev,
          { role: "ai", teks: data.answer, sumber: data.source },
        ]);
        setIsLoading(false);
        return;
      }
    } catch {
      // Fallback
    }

    // Local fallback matching
    const kata = teks
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3);

    let terbaik: FaqItem | null = null;
    let skor = 0;

    faqList.forEach((f) => {
      const fullText = (f.question + " " + f.answer + " " + f.category).toLowerCase();
      const n = kata.filter((w) => fullText.indexOf(w) >= 0).length;
      if (n > skor) {
        skor = n;
        terbaik = f;
      }
    });

    setTimeout(() => {
      if (terbaik && skor >= 2) {
        setChatList((prev) => [
          ...prev,
          {
            role: "ai",
            teks: (terbaik as FaqItem).answer,
            sumber: (terbaik as FaqItem).sourceReference + " · basis data AmanahZakat",
          },
        ]);
      } else {
        setChatList((prev) => [
          ...prev,
          {
            role: "ai",
            teks: "Mohon maaf, pertanyaan Anda belum tercakup dalam basis pengetahuan kami.|Anda bisa mencoba menuliskannya dengan kata lain, membuka daftar pertanyaan umum di bawah, atau menghubungi amil kami untuk konsultasi langsung.",
            sumber: "Konsultasi amil: 0811-2100-900",
          },
        ]);
      }
      setIsLoading(false);
    }, 300);
  };

  const handleTanyaLebihLanjut = (q: string) => {
    assistantBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    handleAjukan(q);
  };

  const handleResetChat = () => {
    setChatList([]);
    setQuery("");
    setIsLoading(false);
  };

  const filteredFaqs = React.useMemo(() => {
    if (selectedCategory === "Semua") return faqList;
    return faqList.filter((f) => f.category === selectedCategory);
  }, [faqList, selectedCategory]);

  return (
    <div className="w-full space-y-10">
      {/* Ustaz Digital Assistant Card */}
      <div
        ref={assistantBoxRef}
        className="bg-white border border-[#EAE5DC] rounded-[20px] overflow-hidden shadow-xs flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-[#F0ECE4]">
          <span className="w-[38px] h-[38px] shrink-0 rounded-xl bg-[#0B1F3D] text-[#A8C8F0] flex items-center justify-center text-[15px] font-extrabold select-none">
            UD
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[14.5px] font-bold text-[#1A1613]">
              Ustaz Digital AmanahZakat
            </div>
            <div className="text-[11.5px] text-[#8B8177] mt-0.5">
              Terkoneksi basis data syariah live
            </div>
          </div>
          {chatList.length > 0 && (
            <button
              type="button"
              onClick={handleResetChat}
              className="bg-transparent border-0 text-[#8B8177] hover:text-[#14509C] text-xs font-bold cursor-pointer p-1.5 transition-colors"
            >
              Mulai ulang
            </button>
          )}
        </div>

        {/* Chat Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-3.5 min-h-[240px]">
          {chatList.length === 0 ? (
            <div className="flex flex-col gap-3.5">
              <p className="m-0 text-xs sm:text-[14px] text-[#6D645B] leading-relaxed">
                Tuliskan pertanyaan Anda, atau mulai dari salah satu berikut:
              </p>
              <div className="flex flex-col gap-2">
                {saranPertanyaan.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAjukan(sug)}
                    className="bg-[#FAF8F4] border border-[#EAE5DC] hover:border-[#14509C] hover:text-[#0E3B74] rounded-xl p-3 sm:py-3.5 sm:px-4 text-xs sm:text-[13.5px] font-semibold text-[#3D372F] cursor-pointer text-left leading-normal transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {chatList.map((c, idx) => {
                const isUser = c.role === "user";
                const paras = c.teks.split("|");

                return (
                  <div
                    key={idx}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
                  >
                    <div
                      className={`text-xs sm:text-[14.5px] max-w-[85%] sm:max-w-[82%] leading-relaxed ${
                        isUser
                          ? "bg-[#14509C] text-white rounded-[16px_16px_4px_16px] px-4 py-3 shadow-xs"
                          : "bg-white border border-[#EAE5DC] rounded-[16px_16px_16px_4px] p-4 sm:p-5 flex flex-col gap-2.5 shadow-xs text-[#1A1613]"
                      }`}
                    >
                      {isUser ? (
                        <span>{c.teks}</span>
                      ) : (
                        <>
                          <div className="flex flex-col gap-2">
                            {paras.map((p, pIdx) => (
                              <p key={pIdx} className="m-0 leading-relaxed text-pretty">
                                {p}
                              </p>
                            ))}
                          </div>
                          {c.sumber && (
                            <div className="text-[11px] sm:text-[11.5px] text-[#9A9086] font-semibold pt-2 border-t border-[#F0ECE4]">
                              {c.sumber}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-white border border-[#EAE5DC] rounded-[16px_16px_16px_4px] px-4 py-3 text-xs sm:text-sm text-[#8B8177] shadow-xs flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#14509C] animate-ping" />
                    <span>Sedang menyusun jawaban…</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          )}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAjukan();
          }}
          className="flex gap-2.5 p-3.5 sm:p-4 border-t border-[#F0ECE4] bg-[#FAF8F4] items-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tulis pertanyaan Anda…"
            className="flex-1 min-w-[200px] border border-[#DDD7CD] rounded-xl px-4 py-3 text-xs sm:text-[14.5px] outline-none bg-white text-[#1A1613] focus:border-[#14509C] transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-[#14509C] hover:bg-[#0E3B74] active:scale-[0.98] text-white border-0 rounded-xl px-5 sm:px-6 py-3 text-xs sm:text-[14.5px] font-bold cursor-pointer transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            Tanyakan
          </button>
        </form>
      </div>

      {/* Yellow Disclaimer Alert */}
      <div className="bg-[#FDF7EA] border border-[#F0E3C6] rounded-xl p-3.5 sm:p-4 flex gap-3 items-start">
        <span className="text-xs sm:text-[13px] text-[#7A6528] leading-relaxed">
          Jawaban asisten bersifat panduan umum, bukan fatwa perorangan. Untuk kasus khusus — warisan,
          utang piutang usaha, atau harta bersama — silakan lanjutkan ke konsultasi dengan amil kami.
        </span>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-xl sm:text-[26px] font-extrabold tracking-[-0.9px] text-[#1A1613] m-0">
            Pertanyaan yang sering diajukan
          </h2>
          <p className="text-xs sm:text-[14.5px] text-[#6D645B] mt-2">
            Dua puluh jawaban baku yang sudah ditinjau amil — sekaligus menjadi rujukan asisten di atas.
          </p>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 flex-wrap pt-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenFaqId(null);
                }}
                className={`rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#14509C] border border-[#14509C] text-white shadow-xs"
                    : "bg-white border border-[#DDD7CD] text-[#5E564E] hover:border-[#14509C] hover:text-[#14509C]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-2.5 pt-2">
          {filteredFaqs.map((f) => {
            const isOpen = openFaqId === f.id;
            const paras = f.answer.split("|");

            return (
              <div
                key={f.id}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-150 ${
                  isOpen ? "border-[#BCD3EE] shadow-xs" : "border-[#EAE5DC]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : f.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-transparent border-0 cursor-pointer text-left gap-3"
                >
                  <span
                    className={`text-xs sm:text-[14.5px] font-bold leading-snug flex-1 ${
                      isOpen ? "text-[#0E3B74]" : "text-[#1A1613]"
                    }`}
                  >
                    {f.question}
                  </span>
                  <span className="text-lg sm:text-[19px] font-bold text-[#14509C] shrink-0 w-6 text-center select-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 flex flex-col gap-3 animate-fadeIn">
                    <div className="flex flex-col gap-2">
                      {paras.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          className="m-0 text-xs sm:text-[14px] text-[#4A443C] leading-relaxed text-pretty"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2.5 pt-2.5 border-t border-[#F0ECE4]">
                      <span className="text-[11px] sm:text-[11.5px] text-[#9A9086] font-semibold flex-1 min-w-[160px]">
                        {f.sourceReference}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTanyaLebihLanjut(f.question)}
                        className="bg-white text-[#1A1613] hover:text-[#14509C] hover:border-[#14509C] border border-[#DDD7CD] rounded-xl px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-[12.5px] font-bold whitespace-nowrap cursor-pointer transition-colors shadow-xs"
                      >
                        Tanya lebih lanjut
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Dark CTA Banner */}
      <div className="bg-[#0B1F3D] text-[#E9EEF7] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-md border border-[#162E52]">
        <div className="flex-1 min-w-0">
          <div className="text-base sm:text-[19px] font-extrabold tracking-tight text-white">
            Sudah menemukan jawabannya?
          </div>
          <p className="m-0 text-xs sm:text-[14px] text-[#8FA6C4] mt-1.5 leading-relaxed text-pretty">
            Hitung kewajiban Anda dengan kalkulator, lalu tunaikan lewat program yang paling dekat
            dengan hati Anda.
          </p>
        </div>
        <div className="flex gap-2.5 flex-wrap shrink-0">
          <Link href="/hitung-zakat">
            <button
              type="button"
              className="bg-transparent text-[#A8C8F0] hover:text-white hover:border-[#A8C8F0] border border-[#2D3F5C] rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-[14px] font-bold cursor-pointer transition-colors"
            >
              Hitung Zakat
            </button>
          </Link>
          <Link href="/donasi">
            <button
              type="button"
              className="bg-[#14509C] hover:bg-[#0E3B74] active:scale-[0.98] text-white border-0 rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-[14px] font-bold cursor-pointer transition-colors shadow-xs"
            >
              Tunaikan Sekarang
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
