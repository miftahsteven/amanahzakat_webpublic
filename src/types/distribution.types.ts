export type AsnafCategory =
  | "Fakir"
  | "Miskin"
  | "Amil"
  | "Muallaf"
  | "Riqab"
  | "Gharimin"
  | "Fisabilillah"
  | "Ibnu Sabil";

export interface DistributionCostItem {
  item: string;
  nilai: number;
}

export interface DistributionReport {
  id: number;
  slug: string;
  judul: string;
  program: string;
  kampanye: string;
  lokasi: string;
  tgl: string;
  nominal: number;
  penerima: number;
  asnaf: AsnafCategory;
  mitra: string;
  status: "Terbit" | "Draf";
  ringkas: string;
  isi?: string;
  rincian?: DistributionCostItem[];
  imageUrl?: string;
}
