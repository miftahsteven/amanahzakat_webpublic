"use client";

import * as React from "react";
import { Search, Clock, CheckCircle2, AlertCircle, FileText, Building2, User } from "lucide-react";
import { assistanceService } from "@/services/assistance";
import { AssistanceSubmissionResponse } from "@/types/assistance.types";
import { formatIDR } from "@/lib/currency";
import { formatDateIndonesian } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssistanceStatusBadge } from "@/components/shared/status-badge";

interface AssistanceStatusTimelineProps {
  initialCode?: string;
}

export function AssistanceStatusTimeline({ initialCode = "" }: AssistanceStatusTimelineProps) {
  const [queryCode, setQueryCode] = React.useState(initialCode);
  const [isLoading, setIsLoading] = React.useState(false);
  const [submission, setSubmission] = React.useState<AssistanceSubmissionResponse | null>(null);
  const [notFound, setNotFound] = React.useState(false);

  const handleSearch = React.useCallback(async (codeToSearch: string) => {
    const code = codeToSearch.trim();
    if (!code) return;

    setIsLoading(true);
    setNotFound(false);
    try {
      const res = await assistanceService.getSubmissionStatus(code);
      if (res) {
        setSubmission(res);
      } else {
        setSubmission(null);
        setNotFound(true);
      }
    } catch {
      setSubmission(null);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode, handleSearch]);

  const sampleCodes = ["PMH-2026-0801", "PMH-2026-0802", "PMH-2026-0803"];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Search Input Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border shadow-card space-y-4">
        <div className="space-y-1">
          <h3 className="font-extrabold text-lg text-text">
            Cek Status Pengajuan Bantuan Karyawan
          </h3>
          <p className="text-xs text-text-muted">
            Masukkan nomor registrasi pengajuan Anda (contoh: PMH-2026-0801).
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
              placeholder="cth. PMH-2026-0801"
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
            Cek Status
          </Button>
        </form>

        {/* Sample Codes */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-text-muted">
          <span>Contoh nomor pengajuan demo:</span>
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

      {/* Submission Result Details */}
      {submission && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border shadow-card space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-text-subtle font-bold">
                  {submission.submissionNumber}
                </span>
                <AssistanceStatusBadge status={submission.status} />
              </div>
              <h3 className="font-extrabold text-xl text-text leading-tight">
                {submission.title}
              </h3>
            </div>

            <span className="text-xs text-text-muted">
              Diajukan: {formatDateIndonesian(submission.submittedAt)}
            </span>
          </div>

          {/* Applicant & Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF8F4] border border-border text-xs">
            <div className="space-y-1">
              <span className="text-text-subtle block">Pemohon / Karyawan:</span>
              <span className="font-bold text-text text-sm flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                {submission.applicantName}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-text-subtle block">Perusahaan / Unit Kerja:</span>
              <span className="font-bold text-text text-sm flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                {submission.company}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-text-subtle block">Kategori Bantuan:</span>
              <span className="font-bold text-text text-sm">{submission.categoryLabel}</span>
            </div>

            {submission.requestedAmount && (
              <div className="space-y-1">
                <span className="text-text-subtle block">Nominal Diajukan:</span>
                <span className="font-mono font-bold text-primary text-sm">
                  {formatIDR(submission.requestedAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-4 pt-2">
            <h4 className="font-extrabold text-base text-text">Perkembangan Tahapan Pengajuan</h4>

            <div className="relative border-l-2 border-primary/30 ml-3 space-y-6 pl-5 py-1">
              {submission.timeline.map((item, idx) => (
                <div key={idx} className="relative space-y-1">
                  <div
                    className={`absolute -left-[27px] top-1 h-4 w-4 rounded-full flex items-center justify-center ring-4 ring-white ${
                      item.isCompleted
                        ? "bg-emerald-600 text-white"
                        : item.isCurrent
                        ? "bg-primary text-white animate-pulse"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-text leading-snug">{item.label}</span>
                    <span className="text-xs text-text-subtle">({item.date})</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Public Notes if any */}
          {submission.publicNotes && (
            <div className="p-4 rounded-2xl bg-primary-soft text-xs text-primary-dark border border-primary-border">
              <span className="font-bold block mb-1">Catatan Tim Amil:</span>
              <p>{submission.publicNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* Not Found State */}
      {notFound && (
        <div className="p-8 rounded-3xl bg-red-50/70 border border-red-200 shadow-card text-center space-y-3 animate-fadeIn">
          <AlertCircle className="h-10 w-10 text-brandRed mx-auto" />
          <h3 className="font-extrabold text-lg text-red-900">
            Pengajuan Tidak Ditemukan
          </h3>
          <p className="text-xs text-red-800 max-w-md mx-auto leading-relaxed">
            Periksa kembali nomor registrasi yang Anda masukkan (contoh format: PMH-2026-0801).
          </p>
        </div>
      )}
    </div>
  );
}
