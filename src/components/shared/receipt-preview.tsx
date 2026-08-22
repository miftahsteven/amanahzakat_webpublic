"use client";

import * as React from "react";
import { Download, Printer, ShieldCheck, CheckCircle2 } from "lucide-react";
import { ReceiptData } from "@/types/payment.types";
import { formatIDR } from "@/lib/currency";
import { generateQrMatrix } from "@/lib/qr";
import { Button } from "@/components/ui/button";

export function ReceiptPreview({
  receipt,
  className,
}: {
  receipt: ReceiptData;
  className?: string;
}) {
  const qrCells = React.useMemo(() => {
    return generateQrMatrix(receipt.qrPayload, 21);
  }, [receipt.qrPayload]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-4">
      {/* Visual SBMZ Card */}
      <div
        id="receipt-print-area"
        className="rounded-2xl border-2 border-primary/20 bg-white p-6 sm:p-8 shadow-card space-y-6 relative overflow-hidden"
      >
        {/* Certificate Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-primary text-white uppercase tracking-wider">
                {receipt.isZakat ? "SBMZ RESMI" : "BUKTI PENERIMAAN"}
              </span>
              <span className="text-xs text-text-muted">Kemenag RI SK No. 892/2019</span>
            </div>
            <h3 className="font-extrabold text-xl text-text leading-tight">
              {receipt.documentTitle}
            </h3>
            <p className="text-xs text-text-muted font-mono">{receipt.documentNumber}</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shrink-0">
            <CheckCircle2 className="h-4 w-4" />
            <span>TERVERIFIKASI SAH</span>
          </div>
        </div>

        {/* Certificate Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Details Table */}
          <div className="md:col-span-2 space-y-3 text-sm">
            <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
              <span className="text-text-muted">No. Transaksi</span>
              <span className="col-span-2 font-mono font-bold text-text">{receipt.transactionId}</span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
              <span className="text-text-muted">{receipt.isZakat ? "Nama Muzakki" : "Nama Donatur"}</span>
              <span className="col-span-2 font-bold text-text">{receipt.donorName}</span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
              <span className="text-text-muted">Jenis Dana ZIS</span>
              <span className="col-span-2 font-bold text-text">{receipt.fundType}</span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
              <span className="text-text-muted">Peruntukan Program</span>
              <span className="col-span-2 font-semibold text-text">{receipt.campaignTitle}</span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
              <span className="text-text-muted">Tanggal Bayar</span>
              <span className="col-span-2 font-medium text-text">{receipt.paidAt}</span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
              <span className="text-text-muted">Metode Bayar</span>
              <span className="col-span-2 font-medium text-text">{receipt.paymentMethod}</span>
            </div>
            <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
              <span className="text-text-muted">Akun Pembukuan</span>
              <span className="col-span-2 text-xs font-mono text-text-muted">{receipt.glAccount}</span>
            </div>
          </div>

          {/* QR Code Verification Box */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAF8F4] border border-border space-y-2 text-center">
            <div className="w-28 h-28 bg-white p-2 rounded-lg border border-border shadow-sm">
              <div className="w-full h-full grid grid-cols-[repeat(21,minmax(0,1fr))] gap-0">
                {qrCells.map((isDark, idx) => (
                  <div
                    key={idx}
                    className={isDark ? "bg-navy" : "bg-transparent"}
                    style={{ aspectRatio: "1" }}
                  />
                ))}
              </div>
            </div>
            <span className="text-[11px] font-bold text-text">Pindai Verifikasi</span>
            <span className="text-[10px] text-text-muted leading-tight max-w-[140px]">
              Tercatat pada database publik AmanahZakat
            </span>
          </div>
        </div>

        {/* Total Highlight Box */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-primary-soft border border-primary-border">
          <span className="font-bold text-sm text-primary-dark">
            {receipt.isZakat ? "Total Zakat Diterima" : "Total Donasi Diterima"}
          </span>
          <span className="font-mono font-extrabold text-xl sm:text-2xl text-primary">
            {formatIDR(receipt.amount)}
          </span>
        </div>

        {/* Legal & Tax Note */}
        <div className="pt-2 text-xs text-text-muted leading-relaxed border-t border-border/80">
          <p>{receipt.notes}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="navy" className="flex-1 sm:flex-initial" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Cetak / Simpan PDF
        </Button>
      </div>
    </div>
  );
}
