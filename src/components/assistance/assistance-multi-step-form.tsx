"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Check,
} from "lucide-react";

import {
  applicantStepSchema,
  assistanceDetailStepSchema,
  assistanceConsentsSchema,
} from "@/lib/validation";
import {
  AssistanceCategory,
  AssistanceDocumentDraft,
} from "@/types/assistance.types";
import { assistanceService } from "@/services/assistance";
import { assistanceCategories, assistanceDocumentRules } from "@/config/assistance";
import { formatIDR } from "@/lib/currency";

import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const DRAFT_KEY = "az_assistance_draft_v1";

export function AssistanceMultiStepForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Form State
  const [applicantData, setApplicantData] = React.useState({
    fullName: "",
    employeeId: "",
    company: "",
    department: "",
    position: "",
    email: "",
    phone: "",
    domicileCity: "",
  });

  const [detailData, setDetailData] = React.useState<{
    category: AssistanceCategory;
    title: string;
    description: string;
    requestedAmount?: number;
    incidentOrNeedDate?: string;
    isSelf: boolean;
    beneficiaryName?: string;
    beneficiaryRelationship?: string;
  }>({
    category: "HEALTH",
    title: "",
    description: "",
    requestedAmount: undefined,
    incidentOrNeedDate: "",
    isSelf: true,
    beneficiaryName: "",
    beneficiaryRelationship: "",
  });

  const [documents, setDocuments] = React.useState<AssistanceDocumentDraft[]>([]);
  const [consents, setConsents] = React.useState({
    dataAccuracy: false,
    privacyProcessing: false,
    submissionNotApproval: false,
  });

  // Step 1 Form
  const applicantForm = useForm({
    resolver: zodResolver(applicantStepSchema),
    defaultValues: applicantData,
  });

  // Step 2 Form
  const detailForm = useForm({
    resolver: zodResolver(assistanceDetailStepSchema),
    defaultValues: detailData,
  });

  // Load draft on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.applicant) {
          setApplicantData(parsed.applicant);
          applicantForm.reset(parsed.applicant);
        }
        if (parsed.detail) {
          setDetailData(parsed.detail);
          detailForm.reset(parsed.detail);
        }
      }
    } catch {
      // ignore
    }
  }, [applicantForm, detailForm]);

  // Save draft
  const saveDraft = (newApplicant = applicantData, newDetail = detailData) => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          applicant: newApplicant,
          detail: newDetail,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch {
      // ignore
    }
  };

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setApplicantData({
        fullName: "",
        employeeId: "",
        company: "",
        department: "",
        position: "",
        email: "",
        phone: "",
        domicileCity: "",
      });
      applicantForm.reset();
      setCurrentStep(1);
    } catch {
      // ignore
    }
  };

  // Step Navigation
  const handleNextStep1 = applicantForm.handleSubmit((data) => {
    setApplicantData(data);
    saveDraft(data, detailData);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const handleNextStep2 = detailForm.handleSubmit((data) => {
    setDetailData(data);
    saveDraft(applicantData, data);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const handleFileUpload = (docType: string, file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal adalah 10 MB.");
      return;
    }

    const newDoc: AssistanceDocumentDraft = {
      localId: `doc-${Date.now()}-${Math.random()}`,
      documentType: docType,
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      localPreviewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    };

    setDocuments((prev) => {
      // Replace existing of same type or add
      const filtered = prev.filter((d) => d.documentType !== docType);
      return [...filtered, newDoc];
    });
  };

  const handleRemoveDoc = (localId: string) => {
    setDocuments((prev) => prev.filter((d) => d.localId !== localId));
  };

  const handleNextStep3 = () => {
    // Check required documents (proposal, employee_id, main_supporting_doc)
    const hasProposal = documents.some((d) => d.documentType === "proposal");
    const hasId = documents.some((d) => d.documentType === "employee_id");
    const hasSupporting = documents.some((d) => d.documentType === "main_supporting_doc");

    if (!hasProposal || !hasId || !hasSupporting) {
      alert("Harap unggah seluruh dokumen wajib (Proposal, ID Card Karyawan, dan Dokumen Pendukung).");
      return;
    }

    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitFinal = async () => {
    if (!consents.dataAccuracy || !consents.privacyProcessing || !consents.submissionNotApproval) {
      alert("Anda harus menyetujui seluruh pernyataan sebelum mengirimkan pengajuan.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const res = await assistanceService.createSubmission({
        applicant: applicantData,
        category: detailData.category,
        title: detailData.title,
        description: detailData.description,
        requestedAmount: detailData.requestedAmount,
        incidentOrNeedDate: detailData.incidentOrNeedDate,
        beneficiary: {
          isSelf: detailData.isSelf,
          fullName: detailData.beneficiaryName,
          relationship: detailData.beneficiaryRelationship,
        },
        documents,
        consents,
      });

      // Clear draft on successful submission
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }

      router.push(`/pengajuan-bantuan/sukses/${res.submissionId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengirimkan pengajuan. Silakan coba lagi.";
      setSubmitError(message);
      setIsSubmitting(false);
    }
  };

  const stepperItems = [
    { num: 1, label: "Data Pemohon" },
    { num: 2, label: "Detail Bantuan" },
    { num: 3, label: "Unggah Dokumen" },
    { num: 4, label: "Review & Kirim" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Stepper Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-border shadow-subtle">
        <div className="flex items-center justify-between">
          {stepperItems.map((item, idx) => {
            const isCompleted = currentStep > item.num;
            const isCurrent = currentStep === item.num;
            return (
              <React.Fragment key={item.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-primary text-white ring-4 ring-primary-soft"
                        : "bg-[#EAE5DC] text-text-muted"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : item.num}
                  </div>
                  <span
                    className={`text-xs font-bold hidden sm:inline ${
                      isCurrent ? "text-primary" : "text-text-muted"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {idx < stepperItems.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      currentStep > item.num ? "bg-emerald-600" : "bg-[#EAE5DC]"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1: DATA PEMOHON */}
      {currentStep === 1 && (
        <form onSubmit={handleNextStep1} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-card animate-fadeIn">
          <div className="space-y-1 pb-4 border-b border-border">
            <h3 className="font-extrabold text-xl text-text">Langkah 1: Identitas Pemohon Karyawan</h3>
            <p className="text-xs text-text-muted">
              Isikan data karyawan pemohon sesuai dengan nomor induk karyawan di perusahaan / unit kerja Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label required>Nama Lengkap Karyawan</Label>
              <Input
                {...applicantForm.register("fullName")}
                error={!!applicantForm.formState.errors.fullName}
                placeholder="cth. Ahmad Sulaiman"
              />
              {applicantForm.formState.errors.fullName && (
                <p className="text-xs text-brandRed font-semibold">{applicantForm.formState.errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label required>Nomor Induk Karyawan (NIP)</Label>
              <Input
                {...applicantForm.register("employeeId")}
                error={!!applicantForm.formState.errors.employeeId}
                placeholder="cth. AXA-004182 / TEL-19804"
              />
              {applicantForm.formState.errors.employeeId && (
                <p className="text-xs text-brandRed font-semibold">{applicantForm.formState.errors.employeeId.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label required>Perusahaan / Institusi</Label>
              <Input
                {...applicantForm.register("company")}
                error={!!applicantForm.formState.errors.company}
                placeholder="cth. PT Telkom / AXA Mandiri / Pertamina"
              />
              {applicantForm.formState.errors.company && (
                <p className="text-xs text-brandRed font-semibold">{applicantForm.formState.errors.company.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Divisi / Departemen (Opsional)</Label>
              <Input
                {...applicantForm.register("department")}
                placeholder="cth. IT Operation / Keuangan"
              />
            </div>

            <div className="space-y-1.5">
              <Label required>Kota / Kabupaten Domisili</Label>
              <Input
                {...applicantForm.register("domicileCity")}
                error={!!applicantForm.formState.errors.domicileCity}
                placeholder="cth. Jakarta Timur / Bekasi"
              />
              {applicantForm.formState.errors.domicileCity && (
                <p className="text-xs text-brandRed font-semibold">{applicantForm.formState.errors.domicileCity.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label required>Alamat Email Aktif</Label>
              <Input
                type="email"
                {...applicantForm.register("email")}
                error={!!applicantForm.formState.errors.email}
                placeholder="nama@perusahaan.co.id"
              />
              {applicantForm.formState.errors.email && (
                <p className="text-xs text-brandRed font-semibold">{applicantForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label required>Nomor WhatsApp Aktif</Label>
              <Input
                {...applicantForm.register("phone")}
                error={!!applicantForm.formState.errors.phone}
                placeholder="08123456789"
              />
              {applicantForm.formState.errors.phone && (
                <p className="text-xs text-brandRed font-semibold">{applicantForm.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleClearDraft}
              className="text-xs text-text-subtle hover:text-brandRed hover:underline"
            >
              Hapus Draf
            </button>

            <Button type="submit" variant="primary" size="md">
              <span>Lanjut ke Detail Bantuan</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </form>
      )}

      {/* STEP 2: DETAIL BANTUAN */}
      {currentStep === 2 && (
        <form onSubmit={handleNextStep2} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-card animate-fadeIn">
          <div className="space-y-1 pb-4 border-b border-border">
            <h3 className="font-extrabold text-xl text-text">Langkah 2: Detail Kebutuhan Bantuan</h3>
            <p className="text-xs text-text-muted">
              Pilih kategori program bantuan dan jelaskan kondisi kebutuhan mendesak yang Anda hadapi.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label required>Kategori Bantuan</Label>
              <select
                {...detailForm.register("category")}
                className="w-full h-12 rounded-xl border border-border-strong bg-white px-4 text-sm font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {assistanceCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.shortDesc}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label required>Judul Pengajuan</Label>
              <Input
                {...detailForm.register("title")}
                error={!!detailForm.formState.errors.title}
                placeholder="cth. Bantuan Tindakan Medis Rawat Inap Anak"
              />
              {detailForm.formState.errors.title && (
                <p className="text-xs text-brandRed font-semibold">{detailForm.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label required>Uraian Latar Belakang & Kebutuhan</Label>
              <Textarea
                {...detailForm.register("description")}
                error={!!detailForm.formState.errors.description}
                placeholder="Ceritakan kronologis kejadian, kondisi yang dialami, dan bagaimana bantuan ini akan dipergunakan..."
                className="min-h-[120px]"
              />
              {detailForm.formState.errors.description && (
                <p className="text-xs text-brandRed font-semibold">{detailForm.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nominal Bantuan yang Diajukan (Rp)</Label>
                <Controller
                  name="requestedAmount"
                  control={detailForm.control}
                  render={({ field }) => (
                    <Input
                      placeholder="cth. 5.000.000"
                      value={field.value ? field.value.toLocaleString("id-ID") : ""}
                      onChange={(e) => {
                        const num = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
                        field.onChange(num);
                      }}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Tanggal Kebutuhan / Kejadian (Opsional)</Label>
                <Input type="date" {...detailForm.register("incidentOrNeedDate")} />
              </div>
            </div>

            {/* Beneficiary Self / Dependent Toggle */}
            <div className="pt-2 p-4 rounded-xl bg-[#FAF8F4] border border-border space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-text cursor-pointer">
                <input
                  type="checkbox"
                  {...detailForm.register("isSelf")}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Pengajuan ditujukan untuk diri pemohon sendiri</span>
              </label>

              {!detailForm.watch("isSelf") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Nama Anggota Keluarga Penerima</Label>
                    <Input
                      {...detailForm.register("beneficiaryName")}
                      placeholder="cth. Siti Fatimah (Anak)"
                      className="h-10 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Hubungan dengan Pemohon</Label>
                    <Input
                      {...detailForm.register("beneficiaryRelationship")}
                      placeholder="cth. Anak Kandung / Orang Tua"
                      className="h-10 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Kembali</span>
            </Button>

            <Button type="submit" variant="primary" size="md">
              <span>Lanjut ke Unggah Dokumen</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: UNGGAH DOKUMEN */}
      {currentStep === 3 && (
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-card animate-fadeIn">
          <div className="space-y-1 pb-4 border-b border-border">
            <h3 className="font-extrabold text-xl text-text">Langkah 3: Unggah Dokumen Persyaratan</h3>
            <p className="text-xs text-text-muted">
              Pilih file dokumen dalam format PDF, JPG, atau PNG (maks. 10 MB per file).
            </p>
          </div>

          <div className="space-y-4">
            {assistanceDocumentRules.map((rule) => {
              const uploaded = documents.find((d) => d.documentType === rule.id);

              return (
                <div
                  key={rule.id}
                  className="p-5 rounded-2xl border border-border bg-[#FBFAF7] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-text">{rule.name}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            rule.required ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {rule.required ? "Wajib" : "Opsional"}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{rule.description}</p>
                    </div>
                  </div>

                  {/* Upload State */}
                  {uploaded ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-emerald-300 text-xs">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="font-bold text-text truncate">{uploaded.fileName}</span>
                        <span className="text-text-subtle">
                          ({(uploaded.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(uploaded.localId)}
                        className="text-brandRed hover:text-red-700 p-1 shrink-0"
                        title="Hapus file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-strong hover:border-primary rounded-xl bg-white cursor-pointer transition-colors text-center space-y-2">
                      <UploadCloud className="h-6 w-6 text-primary" />
                      <span className="text-xs font-bold text-text">
                        Pilih Berkas atau Tarik ke Sini
                      </span>
                      <span className="text-[11px] text-text-subtle">
                        PDF, JPG, JPEG, PNG (Maks 10 MB)
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(rule.id, f);
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(2)}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Kembali</span>
            </Button>

            <Button type="button" variant="primary" size="md" onClick={handleNextStep3}>
              <span>Lanjut ke Review & Pernyataan</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & DECLARATION */}
      {currentStep === 4 && (
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-card animate-fadeIn">
          <div className="space-y-1 pb-4 border-b border-border">
            <h3 className="font-extrabold text-xl text-text">Langkah 4: Review & Pernyataan Pemohon</h3>
            <p className="text-xs text-text-muted">
              Pastikan data dan dokumen yang Anda lampirkan telah lengkap dan benar sebelum dikirimkan ke tim amil.
            </p>
          </div>

          {/* Review Summary Cards */}
          <div className="space-y-4 text-xs">
            {/* Applicant Summary */}
            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-text">Data Pemohon</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-primary font-bold hover:underline"
                >
                  Ubah
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-text-muted">
                <div>Nama: <strong className="text-text">{applicantData.fullName}</strong></div>
                <div>NIP: <strong className="text-text">{applicantData.employeeId}</strong></div>
                <div>Perusahaan: <strong className="text-text">{applicantData.company}</strong></div>
                <div>WhatsApp: <strong className="text-text">{applicantData.phone}</strong></div>
                <div className="col-span-2">Email: <strong className="text-text">{applicantData.email}</strong></div>
              </div>
            </div>

            {/* Assistance Detail Summary */}
            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-text">Detail Bantuan</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-primary font-bold hover:underline"
                >
                  Ubah
                </button>
              </div>
              <div className="space-y-1.5 text-text-muted">
                <div>Kategori: <strong className="text-text">{detailData.category}</strong></div>
                <div>Judul: <strong className="text-text">{detailData.title}</strong></div>
                <div>Nominal Pengajuan: <strong className="text-primary font-mono font-bold text-sm">{formatIDR(detailData.requestedAmount || 0)}</strong></div>
                <div className="text-xs leading-relaxed pt-1 text-text">{detailData.description}</div>
              </div>
            </div>

            {/* Documents Summary */}
            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-text">Dokumen Terlampir ({documents.length})</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-primary font-bold hover:underline"
                >
                  Ubah
                </button>
              </div>
              <ul className="list-disc list-inside space-y-1 text-text-muted">
                {documents.map((d) => (
                  <li key={d.localId}>
                    <span className="text-text font-medium">{d.fileName}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Consents & Declarations */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 text-xs">
            <span className="font-extrabold text-amber-900 block">Pernyataan & Persetujuan Pemohon:</span>

            <label className="flex items-start gap-2.5 cursor-pointer select-none text-amber-900">
              <input
                type="checkbox"
                checked={consents.dataAccuracy}
                onChange={(e) => setConsents((prev) => ({ ...prev, dataAccuracy: e.target.checked }))}
                className="mt-0.5 rounded text-amber-700 focus:ring-amber-600"
              />
              <span>
                Saya menyatakan bahwa seluruh keterangan dan dokumen yang saya berikan adalah benar, akurat, dan dapat dipertanggungjawabkan.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer select-none text-amber-900">
              <input
                type="checkbox"
                checked={consents.privacyProcessing}
                onChange={(e) => setConsents((prev) => ({ ...prev, privacyProcessing: e.target.checked }))}
                className="mt-0.5 rounded text-amber-700 focus:ring-amber-600"
              />
              <span>
                Saya menyetujui pemrosesan dan verifikasi data pribadi serta dokumen untuk keperluan penilaian kelayakan mustahik oleh amil AmanahZakat.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer select-none text-amber-900">
              <input
                type="checkbox"
                checked={consents.submissionNotApproval}
                onChange={(e) => setConsents((prev) => ({ ...prev, submissionNotApproval: e.target.checked }))}
                className="mt-0.5 rounded text-amber-700 focus:ring-amber-600"
              />
              <span>
                Saya memahami bahwa pengiriman formulir ini merupakan proses permohonan dan tidak menjamin persetujuan otomatis bantuan.
              </span>
            </label>
          </div>

          {submitError && (
            <div className="p-3 rounded-xl bg-red-50 text-brandRed border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setCurrentStep(3)}
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Kembali</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onClick={handleSubmitFinal}
              className="shadow-md"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              <span>Kirim Pengajuan Bantuan</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
