import { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { AssistanceMultiStepForm } from "@/components/assistance/assistance-multi-step-form";

export const metadata: Metadata = {
  title: "Formulir Pengajuan Bantuan Karyawan",
  description: "Isi data diri, uraian permohonan, dan unggah dokumen pendukung pengajuan bantuan.",
};

export default function PengajuanFormPage() {
  return (
    <div className="space-y-4 pb-20">
      <PageHero
        breadcrumbs={[
          { label: "Pengajuan Bantuan", href: "/pengajuan-bantuan" },
          { label: "Formulir Pengajuan" },
        ]}
        badge="Formulir Online"
        title="Formulir Pengajuan Bantuan Karyawan"
        description="Lengkapi informasi pemohon, rincian permohonan bantuan, dan lampirkan dokumen pendukung untuk diverifikasi oleh tim amil."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AssistanceMultiStepForm />
      </div>
    </div>
  );
}
