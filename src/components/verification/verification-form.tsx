"use client";

import * as React from "react";
import { Search, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, FileText } from "lucide-react";
import { verificationService } from "@/services/verification";
import { VerificationResult } from "@/types/verification.types";
import { generateQrMatrix } from "@/lib/qr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VerificationFormProps {
  initialCode?: string;
}

export function VerificationForm({ initialCode = "" }: VerificationFormProps) {
  const [queryCode, setQueryCode] = React.useState(initialCode);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<VerificationResult | null>(null);

  const handleSearch = React.useCallback(async (codeToSearch: string) => {
    const code = codeToSearch.trim();
    if (!code) return;

    setIsLoading(true);
    try {
      const res = await verificationService.verifyDocument(code);
      setResult(res);
    } catch {
      setResult({
        isValid: false,
        documentNumber: code,
        errorMessage: "Terjadi kesalahan saat memverifikasi dokumen.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode, handleSearch]);

  const qrCells = React.useMemo(() => {
    if (!result?.isValid) return [];
    return generateQrMatrix(result.documentNumber, 21);
  }, [result]);

  const sampleCodes = ["ZIS-260726-014", "SBMZ/2026/07/ASK004182"];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Search Input Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border shadow-card space-y-4">
        <div className="space-y-1">
          <h3 className="font-extrabold text-lg text-text">
            Masukkan Nomor Bukti Setor / SBMZ / Transaksi
          </h3>
          <p className="text-xs text-text-muted">
            Sistem akan mencocokkan nomor dokumen dengan basis data transaksi resmi LAZNAS AmanahZakat.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(queryCode);
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="cth. ZIS-260726-014 atau SBMZ/2026/07/..."
              value={queryCode}
              onChange={(e) => setQueryCode(e.target.value)}
              className="font-mono text-sm h-12 uppercase"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="shrink-0 h-12"
          >
            <Search className="h-4 w-4 mr-1.5" />
            Verifikasi Sekarang
          </Button>
        </form>

        {/* Sample Codes */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-text-muted">
          <span>Contoh dokumen terdaftar:</span>
          {sampleCodes.map((sc) => (
            <button
              key={sc}
              type="button"
              onClick={() => {
                setQueryCode(sc);
                handleSearch(sc);
              }}
              className="font-mono font-bold text-primary hover:underline bg-primary-soft px-2 py-0.5 rounded border border-primary-border"
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div className="animate-fadeIn">
          {result.isValid ? (
            /* Valid Result Card */
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-500/30 shadow-card space-y-6">
              {/* Header Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      TERCATAT SAH
                    </span>
                    <span className="text-xs text-text-subtle font-mono">{result.documentNumber}</span>
                  </div>
                  <h3 className="font-extrabold text-xl text-text leading-tight">
                    {result.fundType}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shrink-0">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>DOKUMEN RESMI LAZNAS</span>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 space-y-2.5 text-sm">
                  <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
                    <span className="text-text-muted">Nama Donatur</span>
                    <span className="col-span-2 font-bold text-text">{result.donorName}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
                    <span className="text-text-muted">Nominal ZIS</span>
                    <span className="col-span-2 font-mono font-extrabold text-primary text-base">
                      {result.formattedAmount}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
                    <span className="text-text-muted">Peruntukan</span>
                    <span className="col-span-2 font-semibold text-text">{result.campaignTitle}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
                    <span className="text-text-muted">Tanggal Setor</span>
                    <span className="col-span-2 font-medium text-text">{result.paymentDate}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
                    <span className="text-text-muted">Kanal Pembayaran</span>
                    <span className="col-span-2 font-medium text-text">{result.paymentMethod}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1.5 border-b border-border/60">
                    <span className="text-text-muted">Penerbit</span>
                    <span className="col-span-2 text-xs font-semibold text-text-muted">{result.institutionName}</span>
                  </div>
                </div>

                {/* QR Matrix */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FAF8F4] border border-border text-center space-y-2">
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
                  <span className="text-[11px] font-bold text-text">Keabsahan Digital</span>
                  <span className="text-[10px] text-text-subtle">SK Menag RI No. 892/2019</span>
                </div>
              </div>

              {/* Tax Note */}
              <div className="p-4 rounded-xl bg-primary-soft text-xs text-primary-dark border border-primary-border leading-relaxed">
                {result.notes}
              </div>
            </div>
          ) : (
            /* Invalid Result Card */
            <div className="p-6 sm:p-8 rounded-3xl bg-red-50/70 border border-red-200 shadow-card text-center space-y-3">
              <AlertCircle className="h-10 w-10 text-brandRed mx-auto" />
              <h3 className="font-extrabold text-lg text-red-900">
                Dokumen Tidak Ditemukan
              </h3>
              <p className="text-xs text-red-800 max-w-md mx-auto leading-relaxed">
                {result.errorMessage || "Pastikan kode atau nomor transaksi yang Anda masukkan sudah sesuai."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQueryCode("")}
                className="mt-2"
              >
                Coba Nomor Lain
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
