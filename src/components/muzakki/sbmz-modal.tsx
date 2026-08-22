"use client";

import * as React from "react";
import { SbmzDocument } from "@/types/auth.types";
import { generateQrMatrix } from "@/lib/qr";
import { formatIDR } from "@/lib/currency";
import { X, Printer, Download, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";

interface SbmzModalProps {
  document: SbmzDocument | null;
  onClose: () => void;
}

export function SbmzModal({ document, onClose }: SbmzModalProps) {
  if (!document) return null;

  const qrCells = generateQrMatrix(document.sbmzNumber, 21);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Container Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#EAE5DC] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0B1F3D] text-white border-b border-[#1A3152] shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#A8C8F0]" />
            <span className="font-bold text-sm tracking-tight">
              Surat Bukti Membayar Zakat (SBMZ) Resmi
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Printable Certificate Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-[#1A1613] bg-white print:p-0 print:m-0">
          {/* Header Kop Lembaga */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b-2 border-[#0B1F3D]">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-amanahzakat.png"
                alt="Amanah Zakat"
                className="h-11 sm:h-13 w-auto object-contain"
              />
              <div>
                <div className="font-extrabold text-sm sm:text-base text-[#0B1F3D] tracking-tight">
                  LEMBAGA AMIL ZAKAT NASIONAL
                </div>
                <div className="font-bold text-xs text-[#14509C]">
                  AMANAH ZAKAT PEDULI
                </div>
                <div className="text-[10px] text-[#6D645B] mt-0.5">
                  SK Menteri Agama RI No. 892 Tahun 2019 · NPWP: 02.456.789.1-012.000
                </div>
              </div>
            </div>

            <div className="text-right sm:text-right text-[10.5px] text-[#6D645B] hidden sm:block">
              <div>Gedung Menara Amanah Lt. 8</div>
              <div>Jl. Rasuna Said Kav. 10, Jakarta Selatan</div>
              <div>www.amanahzakat.org · (021) 7890-1234</div>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center space-y-1 py-1">
            <h3 className="font-extrabold text-base sm:text-lg text-[#0B1F3D] tracking-wider uppercase m-0 underline underline-offset-4">
              SURAT BUKTI MEMBAYAR ZAKAT (SBMZ)
            </h3>
            <div className="font-mono font-bold text-xs text-[#14509C]">
              Nomor: {document.sbmzNumber}
            </div>
            <div className="text-[10.5px] text-[#6D645B] max-w-md mx-auto leading-tight">
              Sah sebagai dokumen pengurang penghasilan bruto pada SPT Tahunan PPh Orang Pribadi / Badan sesuai UU No. 23/2011 &amp; UU No. 36/2008 Pasal 9 ayat (1) huruf g.
            </div>
          </div>

          {/* Data Table */}
          <div className="border border-[#DDD7CD] rounded-xl overflow-hidden text-xs">
            <div className="bg-[#FAF8F4] px-4 py-2 font-bold text-[#0B1F3D] border-b border-[#DDD7CD]">
              A. IDENTITAS MUZAKKI (WAJIB PAJAK)
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-[#6D645B]">Nama Lengkap</span>
                <span className="col-span-2 font-bold text-[#1A1613]">{document.muzakkiNama}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-[#6D645B]">Nomor NPWP</span>
                <span className="col-span-2 font-mono font-bold text-[#0E3B74]">
                  {document.muzakkiNpwp || "Terlampir pada SPT"}
                </span>
              </div>
              {document.muzakkiNik && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-[#6D645B]">NIK (KTP)</span>
                  <span className="col-span-2 font-mono text-[#1A1613]">{document.muzakkiNik}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <span className="text-[#6D645B]">Alamat Domisili</span>
                <span className="col-span-2 text-[#1A1613]">{document.muzakkiAlamat}</span>
              </div>
            </div>

            <div className="bg-[#FAF8F4] px-4 py-2 font-bold text-[#0B1F3D] border-t border-b border-[#DDD7CD]">
              B. RINCIAN PEMBAYARAN ZAKAT
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-[#6D645B]">Jenis Zakat</span>
                <span className="col-span-2 font-bold text-[#1A1613]">{document.category}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-[#6D645B]">Peruntukan / Program</span>
                <span className="col-span-2 text-[#1A1613]">{document.programTitle}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-[#6D645B]">Tahun Pajak</span>
                <span className="col-span-2 font-bold text-[#1A1613]">{document.tahunPajak}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-[#6D645B]">Tanggal Pembayaran</span>
                <span className="col-span-2 text-[#1A1613]">{document.tanggalTerbit}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#F0ECE4]">
                <span className="text-[#0B1F3D] font-bold">Nominal Zakat Disetor</span>
                <span className="col-span-2 font-mono font-extrabold text-sm sm:text-base text-[#14509C]">
                  {formatIDR(document.nominal)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-[#6D645B]">Terbilang</span>
                <span className="col-span-2 italic text-[#4A443C]">{document.terbilang}</span>
              </div>
            </div>
          </div>

          {/* Bottom QR & Signatures */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            {/* Digital QR Code */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F4] border border-[#DDD7CD]">
              <div className="w-20 h-20 bg-white p-1.5 rounded-lg border border-[#DDD7CD] shrink-0">
                <div className="w-full h-full grid grid-cols-[repeat(21,minmax(0,1fr))] gap-0">
                  {qrCells.map((isDark, idx) => (
                    <div
                      key={idx}
                      className={isDark ? "bg-[#0B1F3D]" : "bg-transparent"}
                      style={{ aspectRatio: "1" }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col text-[10.5px] text-[#6D645B]">
                <span className="font-bold text-[#0B1F3D]">Validasi Digital</span>
                <span>Pindai QR untuk memeriksa keaslian dokumen pada sistem BAZNAS &amp; DJP.</span>
                <span className="font-mono text-[9px] text-[#14509C] mt-0.5">
                  ID: {document.transactionCode}
                </span>
              </div>
            </div>

            {/* Official Signature Stamp */}
            <div className="text-center space-y-1">
              <div className="text-[11px] text-[#6D645B]">
                Jakarta, {document.tanggalTerbit}
              </div>
              <div className="text-[11px] font-bold text-[#0B1F3D]">
                LAZNAS AMANAHZAKAT PEDULI
              </div>
              <div className="relative py-2 flex items-center justify-center">
                {/* Stamp visual */}
                <div className="w-20 h-10 border-2 border-emerald-600 rounded-lg text-emerald-700 font-extrabold text-[9px] flex items-center justify-center rotate-[-6deg] select-none uppercase">
                  ✓ SAH &amp; TERVERIFIKASI
                </div>
              </div>
              <div className="text-xs font-bold text-[#1A1613] underline underline-offset-2">
                Dr. Irfan Syauqi, M.E.Sy.
              </div>
              <div className="text-[10px] text-[#8B8177]">Direktur Eksekutif</div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#FAF8F4] border-t border-[#EAE5DC] shrink-0 print:hidden">
          <a
            href={`/verifikasi-bukti?code=${encodeURIComponent(document.sbmzNumber)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#14509C] hover:underline flex items-center gap-1.5"
          >
            <span>Verifikasi Online di Portal</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-white border border-[#DDD7CD] text-[#5E564E] hover:text-[#1A1613] text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="bg-[#14509C] hover:bg-[#0E3B74] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak / Unduh PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
