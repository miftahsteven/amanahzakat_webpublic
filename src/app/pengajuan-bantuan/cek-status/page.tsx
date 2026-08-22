import { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { AssistanceStatusTimeline } from "@/components/assistance/assistance-status-timeline";

export const metadata: Metadata = {
  title: "Cek Status Pengajuan Bantuan Online",
  description: "Pantau perkembangan dan tahapan verifikasi pengajuan bantuan karyawan secara transparan.",
};

export const dynamic = "force-dynamic";

export default async function CekStatusBantuanPage(props: {
  searchParams?: Promise<{ code?: string }>;
}) {
  const params = props.searchParams ? await props.searchParams : {};

  return (
    <div className="space-y-8 pb-20">
      <PageHero
        breadcrumbs={[
          { label: "Pengajuan Bantuan", href: "/pengajuan-bantuan" },
          { label: "Cek Status Pengajuan" },
        ]}
        badge="Tracking Online"
        title="Lacak Status Pengajuan Bantuan"
        description="Masukkan nomor registrasi permohonan bantuan Anda untuk melihat perkembangan verifikasi dokumen, penelaahan amil, dan status pencairan bantuan."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AssistanceStatusTimeline initialCode={params.code || ""} />
      </div>
    </div>
  );
}
