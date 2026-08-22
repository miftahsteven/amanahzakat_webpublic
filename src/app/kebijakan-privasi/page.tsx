import { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Kebijakan Privasi & Perlindungan Data",
  description: "Ketentuan privasi dan perlindungan data pribadi donatur serta pemohon bantuan di AmanahZakat.",
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="space-y-8 pb-20">
      <PageHero
        breadcrumbs={[{ label: "Kebijakan Privasi" }]}
        badge="Privasi & Keamanan"
        title="Kebijakan Privasi & Perlindungan Data Pribadi"
        description="AmanahZakat berkomitmen menjaga kerahasiaan dan keamanan data pribadi muzakki, donatur, dan pemohon bantuan."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-border shadow-subtle space-y-6 text-sm text-text-muted leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-extrabold text-base text-text">1. Informasi yang Kami Kumpulkan</h3>
            <p>
              Kami mengumpulkan informasi yang Anda berikan secara sukarela saat melakukan transaksi
              donasi, perhitungan zakat, atau pengajuan bantuan, antara lain: nama lengkap, nomor
              telepon / WhatsApp, alamat email, nomor induk karyawan (untuk pemohon bantuan), serta
              dokumen pendukung yang diunggah.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-base text-text">2. Penggunaan Informasi</h3>
            <p>Informasi yang dikumpulkan digunakan untuk keperluan:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Penerbitan Surat Bukti Membayar Zakat (SBMZ) dan tanda terima donasi resmi.</li>
              <li>Penyampaian laporan perkembangan penyaluran dan transparansi program.</li>
              <li>Verifikasi kelayakan dan pemrosesan pengajuan bantuan oleh tim amil.</li>
              <li>Kepatuhan terhadap regulasi audit syariah PSAK 109 dan ketentuan BAZNAS.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-base text-text">3. Opsi Donatur Anonim (Hamba Allah)</h3>
            <p>
              Donatur memiliki hak penuh untuk memilih opsi &ldquo;Sembunyikan nama (Hamba Allah)&rdquo;.
              Pada daftar donatur publik, nama Anda tidak akan ditampilkan, namun data administratif
              tetap tersimpan aman untuk penerbitan SBMZ dan audit keuangan resmi.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-base text-text">4. Keamanan Dokumen Pengajuan Bantuan</h3>
            <p>
              Seluruh berkas identitas dan dokumen medis/pendidikan yang diunggah oleh pemohon bantuan
              bersifat rahasia dan hanya dapat diakses oleh tim amil dan komite penyaluran yang berwenang.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-base text-text">5. Kontak Informasi</h3>
            <p>
              Apabila Anda memiliki pertanyaan seputar kebijakan privasi ini, silakan hubungi kami
              melalui email: <strong>privasi@amanahzakat.id</strong> atau WhatsApp: <strong>0811-2100-900</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
