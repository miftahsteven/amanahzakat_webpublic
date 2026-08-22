"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Check, RefreshCw, AlertCircle, Clock, CheckCircle2, QrCode, CreditCard, Building2, Wallet } from "lucide-react";
import { PaymentInstruction } from "@/types/payment.types";
import { PaymentStatus } from "@/types/donation.types";
import { donationService } from "@/services/donation";
import { formatIDR } from "@/lib/currency";
import { formatCountdown } from "@/lib/date";
import { generateQrMatrix } from "@/lib/qr";

interface PaymentInstructionScreenProps {
  initialInstruction: PaymentInstruction;
}

export function PaymentInstructionScreen({
  initialInstruction,
}: PaymentInstructionScreenProps) {
  const router = useRouter();
  const [instruction, setInstruction] = React.useState<PaymentInstruction>(initialInstruction);
  const [copiedVa, setCopiedVa] = React.useState(false);
  const [copiedAmount, setCopiedAmount] = React.useState(false);
  const [copiedRekening, setCopiedRekening] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Countdown
  const [countdown, setCountdown] = React.useState(() =>
    formatCountdown(instruction.expiresAt)
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      const cd = formatCountdown(instruction.expiresAt);
      setCountdown(cd);
      if (cd.isExpired && instruction.status === "PENDING") {
        setInstruction((prev) => ({ ...prev, status: "EXPIRED" }));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [instruction.expiresAt, instruction.status]);

  // QR Cells
  const qrCells = React.useMemo(() => {
    return generateQrMatrix(instruction.qrString || instruction.transactionId, 21);
  }, [instruction.qrString, instruction.transactionId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const updated = await donationService.getPaymentStatus(instruction.transactionId);
    if (updated) {
      setInstruction(updated);
      if (updated.status === "PAID") {
        router.push(`/donasi/sukses/${updated.transactionId}`);
      }
    }
    setIsRefreshing(false);
  };

  const handleDemoStatusChange = async (status: PaymentStatus) => {
    const updated = await donationService.updatePaymentStatusForDemo(
      instruction.transactionId,
      status
    );
    if (updated) {
      setInstruction(updated);
      if (status === "PAID") {
        router.push(`/donasi/sukses/${updated.transactionId}`);
      }
    }
  };

  const handleCopyVa = () => {
    if (instruction.virtualAccountNumber && navigator.clipboard) {
      navigator.clipboard.writeText(instruction.virtualAccountNumber);
      setCopiedVa(true);
      setTimeout(() => setCopiedVa(false), 2000);
    }
  };

  const handleCopyAmount = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(String(instruction.totalAmount));
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleCopyRekening = (rek: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rek);
      setCopiedRekening(true);
      setTimeout(() => setCopiedRekening(false), 2000);
    }
  };

  const isPending = instruction.status === "PENDING";
  const isPaid = instruction.status === "PAID";
  const isExpired = instruction.status === "EXPIRED";
  const isFailed = instruction.status === "FAILED";

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/donasi"
        className="text-[#14509C] hover:text-[#0E3B74] font-bold text-sm inline-flex items-center gap-1.5 cursor-pointer select-none transition-colors"
      >
        ← Kembali ke Formulir Donasi
      </Link>

      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-[30px] font-extrabold text-[#1A1613] tracking-tight leading-none">
            Selesaikan pembayaran
          </h1>
          <p className="text-sm text-[#6D645B] mt-2 font-medium">
            Nomor transaksi:{" "}
            <span className="font-mono font-bold text-[#14509C]">
              {instruction.transactionId}
            </span>
          </p>
        </div>

        <div>
          {isPending && (
            <span className="bg-[#FFF4E5] text-[#B76E00] border border-[#FFE2B8] font-bold text-xs px-3.5 py-1.5 rounded-full inline-block">
              Menunggu Pembayaran
            </span>
          )}
          {isPaid && (
            <span className="bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] font-bold text-xs px-3.5 py-1.5 rounded-full inline-block">
              Pembayaran Berhasil
            </span>
          )}
          {isExpired && (
            <span className="bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF] font-bold text-xs px-3.5 py-1.5 rounded-full inline-block">
              Kedaluwarsa
            </span>
          )}
        </div>
      </div>

      {/* Countdown Box if Pending */}
      {isPending && (
        <div className="bg-[#0B1F3D] text-[#E9EEF7] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D90AD] block">
              Bayar sebelum
            </span>
            <span className="font-mono text-2xl sm:text-[32px] font-bold text-[#A8C8F0] tracking-tight block mt-1">
              {countdown.formatted}
            </span>
          </div>
          <p className="text-xs text-[#8FA6C4] max-w-xs leading-relaxed">
            Transaksi otomatis diverifikasi. Dana Anda langsung tercatat secara sah dan menerbitkan bukti setor ber-QR.
          </p>
        </div>
      )}

      {/* Main Payment Instruction Card */}
      <div className="bg-white border border-[#EAE5DC] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Payment Amount Card */}
        <div className="bg-[#FBFAF7] border border-[#EAE5DC] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#6D645B] block font-medium">
              Jumlah yang Harus Ditransfer
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono font-extrabold text-2xl sm:text-3xl text-[#0E3B74]">
                {formatIDR(instruction.totalAmount)}
              </span>
              {instruction.uniqueCode > 0 && (
                <span className="text-xs text-[#8C827A]">
                  (termasuk kode unik Rp {instruction.uniqueCode})
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyAmount}
            className="self-start sm:self-center px-4 py-2 rounded-xl border border-[#DDD7CD] hover:border-[#14509C] text-xs font-bold text-[#1A1613] bg-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            {copiedAmount ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">Nominal Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#6D645B]" />
                <span>Salin Nominal</span>
              </>
            )}
          </button>
        </div>

        {/* Bank Transfer Details */}
        {instruction.channel === "BANK_TRANSFER" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-[#1A1613]">
              Transfer ke Rekening Resmi AmanahZakat:
            </h3>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DDD7CD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#14509C] uppercase tracking-wider block">
                  Bank Syariah Indonesia (BSI)
                </span>
                <span className="font-mono font-extrabold text-xl sm:text-2xl text-[#1A1613] block">
                  7015.738.876
                </span>
                <span className="text-xs text-[#6D645B] block">
                  a.n. Yayasan AmanahZakat Peduli
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyRekening("7015738876")}
                className="self-start sm:self-center px-4 py-2 rounded-xl bg-[#EEF3FB] hover:bg-[#14509C] hover:text-white text-[#14509C] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                {copiedRekening ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Salin Rekening</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* QRIS Display */}
        {instruction.channel === "QRIS" && (
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-[#DDD7CD] space-y-4 text-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white p-3 rounded-2xl border border-border shadow-sm">
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

            <div className="space-y-1">
              <h4 className="font-bold text-sm sm:text-base text-[#1A1613]">
                Pindai QRIS Menggunakan Aplikasi Perbankan / E-Wallet Anda
              </h4>
              <p className="text-xs text-[#6D645B] max-w-sm">
                BCA Mobile, Livin by Mandiri, BRImo, BSI Mobile, GoPay, OVO, ShopeePay, DANA.
              </p>
            </div>
          </div>
        )}

        {/* Virtual Account Display */}
        {instruction.channel === "VIRTUAL_ACCOUNT" && instruction.virtualAccountNumber && (
          <div className="p-5 rounded-2xl bg-[#EEF3FB] border border-[#BCD3EE] space-y-3">
            <span className="text-xs text-[#0E3B74] font-bold block uppercase tracking-wider">
              Nomor Virtual Account {instruction.providerLabel}
            </span>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono font-extrabold text-2xl text-[#14509C] tracking-wider">
                {instruction.virtualAccountNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyVa}
                className="px-4 py-2 rounded-xl bg-[#14509C] hover:bg-[#0E3B74] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                {copiedVa ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedVa ? "Tersalin!" : "Salin VA"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step by Step Instructions */}
        <div className="space-y-2.5 pt-2 text-xs border-t border-[#F0ECE4]">
          <h4 className="font-bold text-[#1A1613] uppercase tracking-wider">
            Panduan Pembayaran:
          </h4>
          <ol className="list-decimal list-inside space-y-1.5 text-[#6D645B] leading-relaxed">
            <li>Transfer sesuai nominal tepat hingga 3 digit terakhir (<strong>{formatIDR(instruction.totalAmount)}</strong>).</li>
            <li>Kode unik dipakai untuk otomatisasi pencocokan sistem akuntansi zakat PSAK 109.</li>
            <li>Setelah transfer, klik tombol <strong>&ldquo;Konfirmasi / Cek Status Pembayaran&rdquo;</strong> di bawah.</li>
          </ol>
        </div>

        {/* Action Buttons & Status Check */}
        {isPending && (
          <div className="space-y-3 pt-4 border-t border-[#F0ECE4]">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full bg-[#14509C] hover:bg-[#0E3B74] active:scale-98 text-white font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Memeriksa Status..." : "Cek Status Pembayaran"}</span>
            </button>

            {/* Quick Demo Confirmation Button */}
            <button
              type="button"
              onClick={() => handleDemoStatusChange("PAID")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Simulasi Konfirmasi Pembayaran Selesai (Demo)</span>
            </button>
          </div>
        )}

        {/* Paid Banner */}
        {isPaid && (
          <div className="space-y-4 pt-2">
            <div className="p-5 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-center space-y-1.5">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <h3 className="font-extrabold text-base">Alhamdulillah, Pembayaran Diterima!</h3>
              <p className="text-xs text-emerald-800">
                Surat Bukti Membayar Zakat (SBMZ) dan tanda terima resmi telah diterbitkan.
              </p>
            </div>

            <Link
              href={`/donasi/sukses/${instruction.transactionId}`}
              className="block w-full"
            >
              <button
                type="button"
                className="w-full bg-[#0E3B74] hover:bg-[#14509C] text-white font-bold text-sm sm:text-base py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Lihat Bukti Setor & SBMZ Resmi →
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
