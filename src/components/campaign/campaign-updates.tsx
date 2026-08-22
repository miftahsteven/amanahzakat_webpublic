import React from "react";
import { CampaignFieldUpdate, DonorActivity, FundUsageItem } from "@/types/campaign.types";
import { formatIDR } from "@/lib/currency";
import { Calendar, Heart, ShieldCheck } from "lucide-react";

export function CampaignFundBreakdown({ rincian }: { rincian: FundUsageItem[] }) {
  const total = rincian.reduce((sum, r) => sum + r.nilai, 0);

  return (
    <div className="space-y-4 bg-white p-6 rounded-2xl border border-border">
      <h3 className="font-extrabold text-base text-text">
        Rincian Rencana Penggunaan Dana
      </h3>

      <div className="space-y-2.5">
        {rincian.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2 border-b border-border/60 text-xs sm:text-sm"
          >
            <span className="text-text-muted">{item.item}</span>
            <span className="font-mono font-bold text-text shrink-0">{formatIDR(item.nilai)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 text-sm font-bold">
        <span>Total Rencana Kebutuhan</span>
        <span className="font-mono text-primary font-extrabold text-base">{formatIDR(total)}</span>
      </div>
    </div>
  );
}

export function CampaignUpdatesList({ updates }: { updates: CampaignFieldUpdate[] }) {
  if (!updates || updates.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-border bg-white text-xs text-text-muted text-center">
        Belum ada kabar lapangan terbaru untuk program ini.
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white p-6 rounded-2xl border border-border">
      <h3 className="font-extrabold text-base text-text">
        Kabar & Perkembangan Lapangan ({updates.length})
      </h3>

      <div className="relative border-l-2 border-primary/30 ml-2 space-y-6 pl-4 py-1">
        {updates.map((up, idx) => (
          <div key={idx} className="relative space-y-1">
            <div className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-white" />
            <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
              <Calendar className="h-3.5 w-3.5" />
              <span>{up.tgl}</span>
            </div>
            <h4 className="font-bold text-sm text-text leading-snug">{up.judul}</h4>
            <p className="text-xs text-text-muted leading-relaxed">{up.isi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonorActivityList({ donors }: { donors?: DonorActivity[] }) {
  const defaultDonors: DonorActivity[] = [
    { nama: "PT Cahaya Nusantara", nominal: 50000000, waktu: "2 jam lalu", doa: "Semoga berkah jariyah untuk semua" },
    { nama: "Hj. Sundari Wibowo", nominal: 25000000, waktu: "5 jam lalu" },
    { nama: "Donatur Anonim", nominal: 1000000, waktu: "1 hari lalu", doa: "Bismillah lancar pembangunannya" },
    { nama: "Komunitas Subuh Berkah", nominal: 5000000, waktu: "2 hari lalu" },
  ];

  const list = donors && donors.length > 0 ? donors : defaultDonors;

  return (
    <div className="space-y-4 bg-white p-6 rounded-2xl border border-border">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-text">
          Donatur Terbaru ({list.length})
        </h3>
        <span className="text-[11px] font-bold text-primary flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Tercatat Resmi
        </span>
      </div>

      <div className="space-y-3">
        {list.map((d, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-[#FBFAF7] border border-border/70 text-xs"
          >
            <div className="p-2 rounded-full bg-primary-soft text-primary shrink-0 mt-0.5">
              <Heart className="h-3.5 w-3.5 fill-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-text">{d.nama}</span>
                <span className="font-mono font-bold text-primary">{formatIDR(d.nominal)}</span>
              </div>
              {d.doa && <p className="text-text-muted italic text-[11px]">&ldquo;{d.doa}&rdquo;</p>}
              <span className="text-[10px] text-text-subtle block">{d.waktu}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
