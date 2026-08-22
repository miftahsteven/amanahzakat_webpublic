"use client";

import * as React from "react";
import { ZisCategory } from "@/types/auth.types";
import { formatIDR, parseIDR } from "@/lib/currency";
import { X, Calendar, DollarSign, CreditCard, Sparkles, CheckCircle2 } from "lucide-react";

interface RecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: {
    title: string;
    category: ZisCategory;
    nominal: number;
    frequency: "Bulanan" | "Mingguan" | "Harian";
    deductDay: number;
    paymentMethod: string;
    status: "Aktif";
    nextDeductionDate: string;
  }) => void;
}

export function RecurringModal({ isOpen, onClose, onSave }: RecurringModalProps) {
  const [category, setCategory] = React.useState<ZisCategory>("Zakat Profesi");
  const [title, setTitle] = React.useState("Zakat Penghasilan Rutin");
  const [nominalStr, setNominalStr] = React.useState("2.500.000");
  const [frequency, setFrequency] = React.useState<"Bulanan" | "Mingguan" | "Harian">("Bulanan");
  const [deductDay, setDeductDay] = React.useState(25);
  const [paymentMethod, setPaymentMethod] = React.useState("BSI Autodebet");

  if (!isOpen) return null;

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (!raw) {
      setNominalStr("0");
      return;
    }
    const num = Number(raw);
    setNominalStr(num.toLocaleString("id-ID"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = parseIDR(nominalStr);
    if (nominal <= 0) return;

    onSave({
      title,
      category,
      nominal,
      frequency,
      deductDay,
      paymentMethod,
      status: "Aktif",
      nextDeductionDate: `${deductDay} September 2026`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#EAE5DC] overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0B1F3D] text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#A8C8F0]" />
            <span className="font-bold text-sm sm:text-base">
              Atur Jadwal Auto Recurring ZIS
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[#1A1613]">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1A1613]">Jenis ZIS</label>
            <select
              value={category}
              onChange={(e) => {
                const c = e.target.value as ZisCategory;
                setCategory(c);
                if (c === "Zakat Profesi") setTitle("Zakat Penghasilan Rutin");
                else if (c === "Infak & Shodaqoh") setTitle("Infak Subuh / Kebaikan Rutin");
                else if (c === "Wakaf") setTitle("Wakaf Produktif Berkelanjutan");
                else setTitle(`Donasi Rutin ${c}`);
              }}
              className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C]"
            >
              <option value="Zakat Profesi">Zakat Profesi (Penghasilan Bulanan)</option>
              <option value="Zakat Maal">Zakat Maal (Tabungan &amp; Emas)</option>
              <option value="Infak & Shodaqoh">Infak &amp; Shodaqoh Rutin</option>
              <option value="Wakaf">Wakaf Produktif</option>
            </select>
          </div>

          {/* Program Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1A1613]">Nama Jadwal / Program</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C]"
            />
          </div>

          {/* Nominal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1A1613]">Nominal per Periode</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-[#8B8177]">
                Rp
              </span>
              <input
                type="text"
                required
                value={nominalStr}
                onChange={handleNominalChange}
                className="w-full border border-[#DDD7CD] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold text-[#0E3B74] outline-none bg-white focus:border-[#14509C]"
              />
            </div>
          </div>

          {/* Frequency & Deduct Day */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A1613]">Frekuensi</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full border border-[#DDD7CD] rounded-xl px-3 py-2.5 text-xs outline-none bg-white text-[#1A1613] focus:border-[#14509C]"
              >
                <option value="Bulanan">Bulanan</option>
                <option value="Mingguan">Mingguan</option>
                <option value="Harian">Harian</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A1613]">Tanggal Debet</label>
              <select
                value={deductDay}
                onChange={(e) => setDeductDay(Number(e.target.value))}
                className="w-full border border-[#DDD7CD] rounded-xl px-3 py-2.5 text-xs outline-none bg-white text-[#1A1613] focus:border-[#14509C]"
              >
                {[1, 5, 10, 15, 20, 25, 28, 30].map((d) => (
                  <option key={d} value={d}>
                    Setiap tanggal {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1A1613]">Metode Pembayaran</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-[#DDD7CD] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none bg-white text-[#1A1613] focus:border-[#14509C]"
            >
              <option value="BSI Autodebet">BSI Autodebet Syariah</option>
              <option value="BCA Virtual Account Rutin">BCA Virtual Account Rutin</option>
              <option value="Mandiri Autodebit">Mandiri Autodebit</option>
              <option value="QRIS Rutin E-Wallet">QRIS Rutin (GoPay / ShopeePay / OVO)</option>
              <option value="Kartu Debit Syariah">Kartu Debit Syariah</option>
            </select>
          </div>

          {/* Notice */}
          <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#DDD7CD] text-[11px] text-[#6D645B] leading-relaxed">
            💡 Sistem akan mengirimkan notifikasi konfirmasi dan menerbitkan SBMZ otomatis pada setiap penarikan dana yang berhasil. Anda dapat menjeda atau membatalkan jadwal kapan pun.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F0ECE4]">
            <button
              type="button"
              onClick={onClose}
              className="bg-white border border-[#DDD7CD] text-[#5E564E] hover:text-[#1A1613] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#14509C] hover:bg-[#0E3B74] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Simpan Jadwal Rutin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
