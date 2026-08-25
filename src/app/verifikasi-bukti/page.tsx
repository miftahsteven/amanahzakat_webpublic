import { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { VerificationForm } from "@/components/verification/verification-form";
import { BszSignedReceipt } from "@/components/verification/bsz-signed-receipt";

export const metadata: Metadata = {
  title: "Verifikasi Keabsahan Bukti Setor & SBMZ",
  description:
    "Cek dan verifikasi keabsahan Surat Bukti Membayar Zakat (SBMZ) atau Bukti Penerimaan Donasi resmi AmanahZakat.",
};

export const dynamic = "force-dynamic";

export default async function VerifikasiBuktiPage(props: {
  searchParams?: Promise<{ code?: string; ref?: string; sig?: string }>;
}) {
  const params = props.searchParams ? await props.searchParams : {};
  const ref = (params.ref || "").trim();
  const sig = (params.sig || "").trim();
  const hasSignedLink = Boolean(ref && sig);

  return (
    <div className="space-y-8 pb-20">
      <PageHero
        breadcrumbs={[{ label: "Verifikasi Bukti Setor" }]}
        badge="Layanan Validasi Dokumen"
        title={
          hasSignedLink
            ? "Verifikasi Bukti Setor (QR)"
            : "Verifikasi Keabsahan SBMZ & Bukti Setor"
        }
        description={
          hasSignedLink
            ? "Hasil pemindaian QR pada Bukti Setor Zakat (BSZ). Informasi di bawah ini setara dokumen resmi untuk keperluan pemeriksaan pajak."
            : "Pastikan keabsahan dokumen tanda terima zakat, infak, atau wakaf Anda yang diterbitkan resmi oleh LAZNAS AmanahZakat untuk keperluan pelaporan pajak SPT."
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {hasSignedLink ? (
          <BszSignedReceipt refCode={ref} sig={sig} />
        ) : (
          <VerificationForm initialCode={params.code || ""} />
        )}
      </div>
    </div>
  );
}
