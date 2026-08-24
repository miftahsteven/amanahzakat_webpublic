import { zakatConfig as fallbackConfig } from '@/config/zakat';

export interface ZakatConfigView {
  id: string;
  hargaEmasPerGram: number;
  hargaBerasPerKg: number;
  nisabEmasGram: number;
  nisabBerasKg: number;
  nisabPertanianKg: number;
  zakatRate: number;
  fitrahKgPerJiwa: number;
  nisabEmasNominal: number;
  nisabProfesiBulanan: number;
  fitrahNominalPerJiwa: number;
  updatedAt: string;
}

export type ZakatJenis = 'MAAL' | 'PROFESI' | 'FITRAH';

export interface ZakatHitungPayload {
  jenis: ZakatJenis;
  input: Record<string, unknown>;
}

export interface ZakatHitungResponse {
  jenis: string;
  wajibZakat: boolean;
  hasilNominal: number;
  detail: Record<string, unknown>;
  config: ZakatConfigView;
}

function buildFallbackConfig(): ZakatConfigView {
  const nisabEmasNominal = Math.round(fallbackConfig.nisabGoldGram * fallbackConfig.goldPricePerGram);
  const nisabProfesiBulanan = Math.round((fallbackConfig.nisabRiceKgAnnual * fallbackConfig.ricePricePerKg) / 12);
  const fitrahNominalPerJiwa = Math.round(fallbackConfig.fitrahKgPerPerson * fallbackConfig.ricePricePerKg);

  return {
    id: 'fallback',
    hargaEmasPerGram: fallbackConfig.goldPricePerGram,
    hargaBerasPerKg: fallbackConfig.ricePricePerKg,
    nisabEmasGram: fallbackConfig.nisabGoldGram,
    nisabBerasKg: fallbackConfig.nisabRiceKgAnnual,
    nisabPertanianKg: 653,
    zakatRate: fallbackConfig.professionRate,
    fitrahKgPerJiwa: fallbackConfig.fitrahKgPerPerson,
    nisabEmasNominal,
    nisabProfesiBulanan,
    fitrahNominalPerJiwa,
    updatedAt: new Date().toISOString(),
  };
}

export class ZakatService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5005/api/v1/public';

  private getApiUrl(path: string) {
    const base = this.baseUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
  }

  async getConfig(): Promise<ZakatConfigView> {
    try {
      const res = await fetch(this.getApiUrl('/zakat/config'), { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch zakat config');
      return res.json();
    } catch {
      return buildFallbackConfig();
    }
  }

  async hitung(payload: ZakatHitungPayload): Promise<ZakatHitungResponse> {
    const apiPayload = this.toApiPayload(payload);

    try {
      const res = await fetch(this.getApiUrl('/zakat/hitung'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload),
      });
      if (!res.ok) throw new Error('Failed to calculate zakat');
      return res.json();
    } catch {
      const config = buildFallbackConfig();
      if (payload.jenis === 'MAAL') {
        const tabungan = Number(payload.input.kas ?? 0) + Number(payload.input.emas ?? 0) + Number(payload.input.invest ?? 0) - Number(payload.input.utang ?? 0);
        const wajib = tabungan >= config.nisabEmasNominal;
        const hasilNominal = wajib ? Math.round(tabungan * config.zakatRate) : 0;
        return { jenis: 'MAAL', wajibZakat: wajib, hasilNominal, detail: {}, config };
      }
      if (payload.jenis === 'PROFESI') {
        const bruto = Number(payload.input.gaji ?? 0) + Number(payload.input.bonus ?? 0);
        const pokok = Number(payload.input.pokok ?? 0);
        const netto = pokok > 0 ? bruto - pokok : bruto;
        const wajib = netto >= config.nisabProfesiBulanan;
        const hasilNominal = wajib ? Math.round(netto * config.zakatRate) : 0;
        return { jenis: 'PROFESI', wajibZakat: wajib, hasilNominal, detail: {}, config };
      }
      const jiwa = Number(payload.input.jiwa ?? 0);
      const beras = Number(payload.input.beras ?? config.hargaBerasPerKg);
      const hasilNominal = Math.round(jiwa * config.fitrahKgPerJiwa * beras);
      return { jenis: 'FITRAH', wajibZakat: jiwa > 0, hasilNominal, detail: {}, config };
    }
  }

  private toApiPayload(payload: ZakatHitungPayload) {
    if (payload.jenis === 'MAAL') {
      const kas = Number(payload.input.kas ?? 0);
      const emasRp = Number(payload.input.emas ?? 0);
      const invest = Number(payload.input.invest ?? 0);
      const utang = Number(payload.input.utang ?? 0);
      return {
        jenis: 'MAAL',
        input: {
          tabungan: kas,
          investasi: invest + emasRp,
          emasGram: 0,
          piutangLancar: 0,
          hutangJatuhTempo: utang,
        },
      };
    }
    if (payload.jenis === 'PROFESI') {
      return {
        jenis: 'PROFESI',
        input: {
          pendapatanBulanan: Number(payload.input.gaji ?? 0),
          bonus: Number(payload.input.bonus ?? 0),
          kebutuhanPokok: Number(payload.input.pokok ?? 0),
        },
      };
    }
    return {
      jenis: 'FITRAH',
      input: {
        jumlahJiwa: Number(payload.input.jiwa ?? 0),
        hargaBerasKg: Number(payload.input.beras ?? 0) || undefined,
      },
    };
  }
}

export const zakatService = new ZakatService();
