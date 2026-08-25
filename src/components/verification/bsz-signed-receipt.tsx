"use client";

import * as React from "react";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { verificationService } from "@/services/verification";
import { VerificationResult } from "@/types/verification.types";

interface BszSignedReceiptProps {
  refCode: string;
  sig: string;
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-[13px] py-2 border-b border-dashed border-border/80 last:border-0">
      <span className="text-text-muted shrink-0">{label}</span>
      <span
        className={`text-right text-text ${mono ? "font-mono font-semibold" : "font-semibold"}`}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Public BSZ receipt opened from signed QR URL.
 * Same information as ERP "Lihat Bukti", without embedding another QR.
 */
export function BszSignedReceipt({ refCode, sig }: BszSignedReceiptProps) {
  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState<VerificationResult | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = verificationService.verifyBszSigned
          ? await verificationService.verifyBszSigned(refCode, sig)
          : await verificationService.verifyDocument(refCode);
        if (!cancelled) setResult(res);
      } catch {
        if (!cancelled) {
          setResult({
            isValid: false,
            documentNumber: refCode,
            errorMessage: "Terjadi kesalahan saat memverifikasi tautan bukti setor.",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refCode, sig]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white border border-border shadow-card text-center text-sm text-text-muted">
        Memverifikasi keabsahan tautan bukti setor…
      </div>
    );
  }

  if (!result?.isValid) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-red-50/70 border border-red-200 shadow-card text-center space-y-3">
        <AlertCircle className="h-10 w-10 text-brandRed mx-auto" />
        <h3 className="font-extrabold text-lg text-red-900">Tautan Tidak Valid</h3>
        <p className="text-xs text-red-800 max-w-md mx-auto leading-relaxed">
          {result?.errorMessage ||
            "Signature tidak cocok atau dokumen tidak ditemukan. Minta muzakki menunjukkan bukti setor asli."}
        </p>
      </div>
    );
  }

  const noBukti = result.noKwitansi || result.documentNumber;
  const noSbmz = result.noSbmz || result.documentNumber;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 w-fit mx-auto">
        <ShieldCheck className="h-4 w-4" />
        Dokumen resmi · tautan bertanda tangan valid
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card text-text">
        <div className="bg-[#0D1714] text-[#E7EFE9] px-6 py-5">
          <div className="text-[10.5px] font-bold uppercase tracking-[1.2px] text-[#7D938A]">
            Bukti Setor Zakat
          </div>
          <div className="text-[19px] font-extrabold mt-1.5">AmanahZakat</div>
          <div className="text-[11.5px] text-[#8FA79C] mt-1">
            {result.institutionName || "Lembaga Amil Zakat Nasional · SK Kemenag RI"}
            {result.institutionNpwp ? ` · NPWP ${result.institutionNpwp}` : ""}
          </div>
        </div>

        <div className="px-6 py-5 space-y-3">
          <div className="divide-y divide-dashed divide-border/80">
            <Row label="No. Bukti" value={noBukti} mono />
            <Row label="Nomor SBMZ" value={noSbmz} mono />
            <Row label="Tanggal Setor" value={result.paymentDate || "-"} mono />
            <Row label="Nama Muzakki" value={result.donorName || "-"} />
            <Row label="Jenis Dana" value={result.fundType || "-"} />
            <Row label="Kanal Pembayaran" value={result.paymentMethod || "-"} />
            {result.status ? <Row label="Status" value={result.status} /> : null}
            {result.glAccount ? <Row label="Akun G/L" value={result.glAccount} mono /> : null}
          </div>

          <div className="bg-[#F4F8F6] border border-dashed border-[#BFE4D4] rounded-xl px-[18px] py-4 flex justify-between items-center">
            <span className="text-[12.5px] font-semibold text-[#4D5C56]">Jumlah Setoran</span>
            <span className="font-mono text-[21px] font-semibold text-[#0B7C56]">
              {result.formattedAmount || "-"}
            </span>
          </div>

          <p className="m-0 text-[11.5px] text-[#8B9992] leading-relaxed">
            {result.notes ||
              "Bukti setor ini sah tanpa tanda tangan basah dan dapat digunakan sebagai pengurang penghasilan kena pajak sesuai PP No. 60 Tahun 2010."}
          </p>
        </div>
      </div>
    </div>
  );
}
