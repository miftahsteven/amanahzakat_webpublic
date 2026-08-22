import { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan Layanan",
  description: "Syarat dan ketentuan umum pemanfaatan layanan donasi ZISWAF dan permohonan bantuan di AmanahZakat.",
};

export default function SyaratKetentuanPage() {
  return (
    <div className="space-y-8 pb-20">
      <PageHero
        breadcrumbs={[{ label: "Syarat & Ketentuan" }]}
        badge="Ketentuan Layanan"
        title="Syarat & Ketentuan Layanan AmanahZakat"
        description="Harap membaca syarat dan ketentuan berikut sebelum menggunakan layanan donasi dan permohonan bantuan."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-border shadow-subtle space-y-6 text-sm text-text-muted leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-extrabold text-base text-text">1. Ketentuan Donasi & Akad Syariah</h3>
            <p>
              Dengan menunaikan zakat, infak, shodaqoh, atau wakaf melalui situs ini, donatur menyatakan
              bahwa dana yang disalurkan bersumber dari harta yang halal dan mewakilkan (taukil) kepada
              LAZNAS AmanahZakat untuk menyalurkannya kepada mustahik sesuai peruntukan program dan akad syariah.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-base text-text">2. Pembayaran & Konfirmasi Transaksi</h3>
            <p>
              Setiap transaksi donasi akan menerbitkan instruksi pembayaran berupa Virtual Account, QRIS,
              atau E-Wallet dengan batas waktu (expiration time) yang ditentukan. Pembayaran yang
              terkonfirmasi sah akan otomatis menerbitkan Bukti Setor / SBMZ resmi ber-QR.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-base text-text">3. Ketentuan Pengajuan Bantuan</h3>
            <p>
              Pengiriman formulir pengajuan bantuan tidak serta-merta menjamin disetujuinya bantuan.
              Persetujuan dan besaran nominal bantuan yang disalurkan sepenuhnya merupakan hak prerogatif
              komite amil AmanahZakat berdasarkan hasil verifikasi dokumen dan ketersediaan alokasi asnaf.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-base text-text">4. Perubahan Ketentuan</h3>
            <p>
              AmanahZakat berhak memperbarui syarat dan ketentuan ini sewaktu-waktu sesuai dengan
              perkembangan regulasi BAZNAS, Kementerian Agama, atau undang-undang yang berlaku di Indonesia.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
