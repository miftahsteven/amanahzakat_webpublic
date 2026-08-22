"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

const HARGA_EMAS = 1450000;
const HARGA_BERAS = 15000;
const NISAB_EMAS = 85 * HARGA_EMAS; // Rp 123.250.000

const RP = (n: number) => "Rp " + Math.round(n || 0).toLocaleString("id-ID");
const NUM = (v: any) =>
  Number(String(v === undefined || v === null ? "" : v).replace(/[^0-9.]/g, "")) || 0;

type TabType = "maal" | "profesi" | "fitrah";

interface CalcField {
  label: string;
  key: string;
  satuan: string;
}

export function ZakatCalculator() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabType>("maal");
  const [calcForm, setCalcForm] = React.useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    setCalcForm({});
  };

  const handleChange = (key: string, rawInput: string) => {
    // Strip non-digits for currency / number formatting
    const cleaned = rawInput.replace(/[^0-9]/g, "");
    setCalcForm((prev) => ({
      ...prev,
      [key]: cleaned,
    }));
  };

  // Fields and Calculation
  let calcFields: CalcField[] = [];
  let calcHasil = {
    zakat: "Rp 0",
    dasar: "Rp 0",
    nisab: "Rp 0",
    nilai: 0,
    catatan: "",
  };

  if (activeTab === "maal") {
    calcFields = [
      { label: "Uang tunai & tabungan", key: "kas", satuan: "Rp" },
      { label: "Emas, perak & logam mulia", key: "emas", satuan: "Rp" },
      { label: "Deposito & investasi", key: "invest", satuan: "Rp" },
      { label: "Utang jatuh tempo (pengurang)", key: "utang", satuan: "Rp" },
    ];
    const netto =
      NUM(calcForm.kas) +
      NUM(calcForm.emas) +
      NUM(calcForm.invest) -
      NUM(calcForm.utang);
    const wajib = netto >= NISAB_EMAS;
    calcHasil = {
      zakat: wajib ? RP(netto * 0.025) : RP(0),
      dasar: RP(netto),
      nisab: RP(NISAB_EMAS),
      nilai: wajib ? netto * 0.025 : 0,
      catatan: wajib
        ? "Harta Anda melebihi nisab 85 gram emas — zakat 2,5% wajib dikeluarkan."
        : "Harta belum mencapai nisab 85 gram emas, belum wajib zakat maal.",
    };
  } else if (activeTab === "profesi") {
    calcFields = [
      { label: "Penghasilan bruto per bulan", key: "gaji", satuan: "Rp" },
      { label: "Bonus / honorarium lain", key: "bonus", satuan: "Rp" },
      { label: "Kebutuhan pokok per bulan (opsional)", key: "pokok", satuan: "Rp" },
    ];
    const bruto = NUM(calcForm.gaji) + NUM(calcForm.bonus);
    const netto = NUM(calcForm.pokok) > 0 ? bruto - NUM(calcForm.pokok) : bruto;
    const nisabBulan = (522 * HARGA_BERAS) / 12; // Rp 652.500
    const wajib = netto >= nisabBulan;
    calcHasil = {
      zakat: wajib ? RP(netto * 0.025) : RP(0),
      dasar: RP(netto),
      nisab: RP(nisabBulan),
      nilai: wajib ? netto * 0.025 : 0,
      catatan: wajib
        ? "Penghasilan Anda di atas nisab bulanan — zakat profesi 2,5%."
        : "Penghasilan di bawah nisab bulanan (setara 522 kg beras per tahun).",
    };
  } else {
    calcFields = [
      { label: "Jumlah jiwa dalam tanggungan", key: "jiwa", satuan: "jiwa" },
      { label: "Harga beras per kg", key: "beras", satuan: "Rp" },
    ];
    const jiwa = NUM(calcForm.jiwa);
    const beras = NUM(calcForm.beras) || HARGA_BERAS;
    calcHasil = {
      zakat: RP(jiwa * 2.5 * beras),
      dasar: (jiwa * 2.5).toLocaleString("id-ID") + " kg beras",
      nisab: "Tanpa nisab",
      nilai: jiwa * 2.5 * beras,
      catatan:
        jiwa > 0
          ? "Setara " +
            (jiwa * 2.5).toLocaleString("id-ID") +
            " kg beras untuk " +
            jiwa +
            " jiwa."
          : "Masukkan jumlah jiwa dalam tanggungan keluarga.",
    };
  }

  const handleBayar = () => {
    if (!calcHasil.nilai || calcHasil.nilai <= 0) {
      setToastMessage("Lengkapi perhitungan terlebih dahulu");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    router.push(`/donasi?fundType=ZAKAT&amount=${Math.round(calcHasil.nilai)}`);
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "maal", label: "Zakat Maal" },
    { id: "profesi", label: "Zakat Profesi" },
    { id: "fitrah", label: "Zakat Fitrah" },
  ];

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0B1F3D] text-[#E9EEF7] rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-2xl animate-fadeIn border border-white/10">
          {toastMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mt-4 sm:mt-5">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => switchTab(t.id)}
              className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-bold tracking-tight whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-[#14509C] border border-[#14509C] text-white shadow-xs"
                  : "bg-white border border-[#DDD7CD] text-[#4F473F] hover:border-[#14509C] hover:text-[#14509C]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Grid Layout - Compact & Slim */}
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4 sm:gap-5 items-start mt-4 sm:mt-5">
        {/* Left Form Card */}
        <div className="bg-white border border-[#EAE5DC] rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-xs">
          {calcFields.map((f) => {
            const rawVal = calcForm[f.key];
            const displayVal =
              rawVal !== undefined && rawVal !== ""
                ? f.satuan === "Rp"
                  ? Number(rawVal).toLocaleString("id-ID")
                  : rawVal
                : "";

            const placeholderVal =
              f.key === "beras" && !calcForm.beras ? "15.000" : "0";

            return (
              <div key={f.key} className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-[12.5px] font-bold text-[#4F473F]">
                  {f.label}
                </label>
                <div className="flex items-center border border-[#DDD7CD] rounded-xl overflow-hidden focus-within:border-[#14509C] focus-within:ring-1 focus-within:ring-[#14509C] transition-all bg-white">
                  <span className="py-2.5 px-3 text-xs sm:text-[12.5px] font-bold text-[#8B8177] bg-[#F7F4EE] border-r border-[#EAE5DC] min-w-[48px] text-center select-none">
                    {f.satuan}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={placeholderVal}
                    value={displayVal}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    className="border-0 outline-none py-2.5 px-3 text-sm sm:text-[14px] font-mono w-full text-[#1A1613] bg-transparent"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Result Card - Compact & Clean */}
        <div className="bg-[#0B1F3D] text-[#E9EEF7] rounded-2xl p-5 sm:p-6 flex flex-col gap-3.5 sticky top-20 shadow-md border border-[#162E52]">
          <div className="text-[10.5px] sm:text-[11px] tracking-[1.2px] uppercase text-[#7D90AD] font-bold">
            Zakat yang wajib dibayar
          </div>
          <div className="font-mono text-2xl sm:text-[28px] font-bold tracking-tight text-white leading-tight">
            {calcHasil.zakat}
          </div>
          <div className="h-px bg-white/10 my-0.5" />
          <div className="flex justify-between items-center text-xs sm:text-[12.5px]">
            <span className="text-[#8FA6C4]">Dasar perhitungan</span>
            <span className="font-mono font-semibold text-white">
              {calcHasil.dasar}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs sm:text-[12.5px]">
            <span className="text-[#8FA6C4]">Nisab</span>
            <span className="font-mono font-semibold text-white">
              {calcHasil.nisab}
            </span>
          </div>
          <p className="m-0 text-[11.5px] sm:text-[12px] text-[#A9C6BA] leading-[1.6] text-pretty">
            {calcHasil.catatan}
          </p>
          <button
            type="button"
            onClick={handleBayar}
            className="w-full bg-[#14509C] hover:bg-[#0E3B74] active:scale-[0.99] text-white border-0 rounded-xl py-3 px-4 text-xs sm:text-[13px] font-bold transition-all duration-150 cursor-pointer shadow-sm text-center mt-1"
          >
            Bayar Zakat Ini Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
