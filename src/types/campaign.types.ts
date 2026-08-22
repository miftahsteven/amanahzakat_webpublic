export type CampaignProgramCategory =
  | "Wakaf Sumur"
  | "Qurban"
  | "Konservasi DAS Citarum"
  | "Beasiswa Anak Yatim"
  | "Program Infak Oksigen"
  | "Modal Usaha Mikro"
  | "Wakaf Pohon"
  | "Bantuan Kesehatan"
  | "Bantuan Pangan"
  | "Bantuan Pangan Keluarga";

export type CampaignStatus = "Berjalan" | "Tercapai" | "Selesai" | "Draf";

export interface FundUsageItem {
  item: string;
  nilai: number;
}

export interface CampaignFieldUpdate {
  tgl: string;
  judul: string;
  isi: string;
}

export interface DonorActivity {
  nama: string;
  nominal: number;
  waktu: string;
  doa?: string;
}

export interface Campaign {
  id: number;
  slug: string;
  nama: string;
  program: CampaignProgramCategory;
  lokasi: string;
  target: number;
  terkumpul: number;
  donaturCount: number;
  tenggat: string;
  ringkas: string;
  cerita: string;
  imageUrl?: string;
  rincian: FundUsageItem[];
  kabar: CampaignFieldUpdate[];
  donaturList?: DonorActivity[];
  status: CampaignStatus;
  isFeatured?: boolean;
}

export interface CampaignQuery {
  category?: string;
  search?: string;
  status?: string;
  sortBy?: "terbaru" | "mendekati-target" | "paling-banyak";
}
