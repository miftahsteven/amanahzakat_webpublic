import { Metadata } from "next";
import { notFound } from "next/navigation";
import { donationService } from "@/services/donation";
import { PaymentInstructionScreen } from "@/components/payment/payment-instruction-screen";

export const metadata: Metadata = {
  title: "Selesaikan Pembayaran Donasi — AmanahZakat Peduli",
  description: "Instruksi dan nomor rekening/QRIS untuk menyelesaikan pembayaran donasi ZIS.",
};

export const dynamic = "force-dynamic";

export default async function PembayaranPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = await params;
  const instruction = await donationService.getPaymentStatus(transactionId);

  if (!instruction) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FBFAF7] text-[#1A1613]">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <PaymentInstructionScreen initialInstruction={instruction} />
      </div>
    </main>
  );
}
