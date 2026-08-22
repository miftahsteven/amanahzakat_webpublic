export interface ImpactMetric {
  angka: string;
  satuan: string;
  label: string;
  keterangan: string;
  icon?: string;
}

export interface FundAllocationItem {
  label: string;
  percentage: number;
  percentageLabel: string;
  color: string;
  description?: string;
}

export interface BeneficiaryStory {
  nama: string;
  wilayah: string;
  program: string;
  kutipan: string;
  peran?: string;
  avatarUrl?: string;
}

export interface AnnualReportDoc {
  tahun: string;
  judul: string;
  deskripsi: string;
  ukuranFile: string;
  tanggalTerbit: string;
  auditor: string;
}
