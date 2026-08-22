import { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { VerificationForm } from "@/components/verification/verification-form";

export const metadata: Metadata = {
  title: "Verifikasi Keabsahan Bukti Setor & SBMZ",
  description:
    "Cek dan verifikasi keabsahan Surat Bukti Membayar Zakat (SBMZ) atau Bukti Penerimaan Donasi resmi AmanahZakat.",
};

export const dynamic = "force-dynamic";

export default async function VerifikasiBuktiPage(props: {
  searchParams?: Promise<{ code?: string }>;
}) {
  const params = props.searchParams ? await props.searchParams : {};

  return (
    <div className="space-y-8 pb-20">
      <PageHero
        breadcrumbs={[{ label: "Verifikasi Bukti Setor" }]}
        badge="Layanan Validasi Dokumen"
        title="Verifikasi Keabsahan SBMZ & Bukti Setor"
        description="Pastikan keabsahan dokumen tanda terima zakat, infak, atau wakaf Anda yang diterbitkan resmi oleh LAZNAS AmanahZakat untuk keperluan pelaporan pajak SPT."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VerificationForm initialCode={params.code || ""} />
      </div>
    </div>
  );
}
