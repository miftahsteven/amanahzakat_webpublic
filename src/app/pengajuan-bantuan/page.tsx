import { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { AssistanceLanding } from "@/components/assistance/assistance-landing";

export const metadata: Metadata = {
  title: "Layanan Pengajuan Bantuan Kemanusiaan & Karyawan",
  description:
    "Portal pengajuan bantuan biaya kesehatan, pendidikan, modal usaha, dan bantuan darurat bagi karyawan dan keluarga mustahik binaan.",
};

export default function PengajuanBantuanPage() {
  return (
    <div className="space-y-4 pb-20">
      <PageHero
        breadcrumbs={[{ label: "Pengajuan Bantuan" }]}
        badge="Layanan Karyawan & Mustahik"
        title="Layanan Pengajuan Bantuan Kemanusiaan"
        description="AmanahZakat menyediakan saluran bantuan bagi karyawan dan keluarga binaan yang sedang menghadapi kondisi darurat medis, pendidikan, atau musibah hidup."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AssistanceLanding />
      </div>
    </div>
  );
}
