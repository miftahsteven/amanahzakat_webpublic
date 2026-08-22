import { Metadata } from "next";
import { FaqView } from "@/components/faq/faq-view";

export const metadata: Metadata = {
  title: "Tanya Soal Zakat, Infak & Shodaqoh — Ustaz Digital AmanahZakat",
  description:
    "Dijawab seketika oleh asisten kami dengan rujukan Fatwa MUI, ketentuan BAZNAS, dan kebijakan lembaga.",
};

export default function TanyaZisPage() {
  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-20 animate-fadeIn">
      {/* Badge */}
      <span className="inline-block bg-[#EEF3FB] text-[#0E3B74] rounded-full px-4 py-1.5 text-xs font-bold select-none">
        Konsultasi ZIS
      </span>

      {/* Heading */}
      <h1 className="text-2xl sm:text-[32px] font-extrabold tracking-[-1.1px] text-[#1A1613] mt-4 m-0 leading-tight">
        Tanya soal zakat, infak, dan shodaqoh
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-[15px] text-[#6D645B] mt-3 leading-relaxed max-w-[620px]">
        Dijawab seketika oleh asisten kami dengan rujukan Fatwa MUI, ketentuan BAZNAS, dan
        kebijakan lembaga. Untuk kasus yang rumit, amil kami siap melanjutkan lewat konsultasi langsung.
      </p>

      {/* Main Content Component */}
      <div className="mt-6">
        <FaqView />
      </div>
    </div>
  );
}
