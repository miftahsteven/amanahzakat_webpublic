import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Heart, Newspaper, ArrowRight } from "lucide-react";
import { donationService } from "@/services/donation";
import { ReceiptPreview } from "@/components/shared/receipt-preview";
import { ShareButtons } from "@/components/shared/share-buttons";

export const metadata: Metadata = {
  title: "Donasi Berhasil — AmanahZakat Peduli",
  description: "Konfirmasi pembayaran donasi dan Surat Bukti Membayar Zakat (SBMZ) resmi.",
};

export const dynamic = "force-dynamic";

export default async function DonasiSuksesPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = await params;
  const [instruction, receipt] = await Promise.all([
    donationService.getPaymentStatus(transactionId),
    donationService.getReceiptData(transactionId),
  ]);

  if (!instruction || !receipt) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FBFAF7] text-[#1A1613]">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {/* Back Link */}
        <Link
          href="/donasi"
          className="text-[#14509C] hover:text-[#0E3B74] font-bold text-sm inline-flex items-center gap-1.5 cursor-pointer select-none transition-colors"
        >
          ← Kembali ke Beranda Donasi
        </Link>

        {/* Success Banner Card */}
        <div className="p-6 rounded-3xl bg-[#E6F4EA] border border-[#CEEAD6] flex items-center gap-4 text-[#137333] shadow-xs">
          <div className="p-3 rounded-2xl bg-[#137333] text-white shrink-0">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl text-[#0D652D]">
              Alhamdulillah, Pembayaran Donasi Berhasil!
            </h1>
            <p className="text-xs sm:text-sm text-[#137333] mt-0.5">
              Transaksi #{instruction.transactionId} telah terverifikasi secara sah dalam pembukuan
              resmi LAZNAS.
            </p>
          </div>
        </div>

        {/* SBMZ Receipt Preview Card */}
        <ReceiptPreview receipt={receipt} />

        {/* Share Section Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE5DC] shadow-xs space-y-3">
          <h4 className="font-bold text-sm sm:text-base text-[#1A1613]">
            Ajak Keluarga & Kerabat Berbagi
          </h4>
          <ShareButtons
            title={instruction.campaignTitle || "Program Kemanusiaan AmanahZakat"}
            text={`Saya baru saja berdonasi untuk "${instruction.campaignTitle || "Program Kebaikan"}" melalui AmanahZakat Peduli. Penyaluran transparan dan berizin resmi:`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/donasi" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#DDD7CD] hover:border-[#14509C] hover:text-[#14509C] text-xs sm:text-sm font-bold text-[#1A1613] bg-white transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Heart className="h-4 w-4 text-[#14509C]" />
              <span>Tunaikan Donasi Lain</span>
            </button>
          </Link>

          <Link href="/kabar-penyaluran" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#14509C] hover:bg-[#0E3B74] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Newspaper className="h-4 w-4" />
              <span>Lihat Kabar Penyaluran Lapangan</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
