"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donationFormSchema, DonationFormSchemaValues } from "@/lib/validation";
import { FundType, PaymentChannel } from "@/types/donation.types";
import { Campaign } from "@/types/campaign.types";
import { donationService } from "@/services/donation";
import { formatIDR } from "@/lib/currency";
import { AlertCircle } from "lucide-react";

interface DonationFormProps {
  campaigns: Campaign[];
  initialCampaignSlug?: string;
  initialFundType?: FundType;
  initialAmount?: number;
}

const fundTabs: { type: FundType; label: string; ket: string }[] = [
  {
    type: "ZAKAT",
    label: "Zakat",
    ket: "Donasi zakat menerbitkan Surat Bukti Membayar Zakat (SBMZ) — dapat dilampirkan ke SPT Tahunan sebagai pengurang penghasilan bruto.",
  },
  {
    type: "INFAQ",
    label: "Infak",
    ket: "Infak disalurkan untuk kebutuhan operasional kemanusiaan dan tanggap darurat bencana.",
  },
  {
    type: "SHODAQOH",
    label: "Shodaqoh",
    ket: "Sedekah umum yang fleksibel untuk berbagai kemaslahatan mustahik dhuafa.",
  },
  {
    type: "WAQF_CASH",
    label: "Wakaf Uang",
    ket: "Wakaf produktif yang pokoknya dijaga abadi dan manfaat investasinya disalurkan untuk umat.",
  },
];

const nominalPresets = [50000, 100000, 250000, 500000, 1000000];

const paymentMethods: { channel: PaymentChannel; label: string }[] = [
  { channel: "BANK_TRANSFER", label: "Transfer Bank" },
  { channel: "QRIS", label: "QRIS" },
  { channel: "VIRTUAL_ACCOUNT", label: "Virtual Account" },
  { channel: "EWALLET", label: "E-Wallet" },
];

export function DonationForm({
  campaigns,
  initialCampaignSlug,
  initialFundType = "ZAKAT",
  initialAmount = 100000,
}: DonationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Preselected campaign if slug exists
  const preselectedCampaign = campaigns.find((c) => c.slug === initialCampaignSlug);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DonationFormSchemaValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      campaignId: preselectedCampaign ? preselectedCampaign.id : campaigns[0]?.id || undefined,
      campaignTitle: preselectedCampaign
        ? preselectedCampaign.nama
        : campaigns[0]?.nama || "Donasi Kemanusiaan Umum",
      fundType: initialFundType,
      amount: initialAmount,
      fullName: "",
      contact: "",
      isAnonymous: false,
      message: "",
      channel: "BANK_TRANSFER",
      agreeTerms: true,
    },
  });

  const selectedCampaignId = watch("campaignId");
  const selectedFundType = watch("fundType");
  const selectedAmount = watch("amount") || 0;
  const isAnonymous = watch("isAnonymous");
  const selectedChannel = watch("channel");

  // Selected Campaign Object & Title
  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId);
  const campaignSubtitle = activeCampaign
    ? `Untuk kampanye ${activeCampaign.nama}`
    : "Untuk program AmanahZakat Peduli";

  // Fund type info text
  const currentFundTab = fundTabs.find((f) => f.type === selectedFundType) || fundTabs[0];

  // Unique code simulation for Bank Transfer
  const uniqueCode = React.useMemo(() => {
    if (selectedChannel === "BANK_TRANSFER") {
      return 482; // Deterministic unique code for transfer bank demo
    }
    return 0;
  }, [selectedChannel]);

  const totalTransfer = selectedAmount + uniqueCode;

  const onSubmit = async (data: DonationFormSchemaValues) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const campaignObj = campaigns.find((c) => c.id === data.campaignId);

      const instruction = await donationService.createDonationPayment({
        campaignId: data.campaignId,
        campaignTitle: campaignObj ? campaignObj.nama : "Donasi Kemanusiaan Umum",
        fundType: data.fundType,
        amount: data.amount,
        donor: {
          fullName: data.isAnonymous ? "Hamba Allah" : data.fullName,
          contact: data.contact,
          anonymous: data.isAnonymous,
        },
        message: data.message,
        channel: data.channel,
      });

      router.push(`/donasi/pembayaran/${instruction.transactionId}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal membuat transaksi donasi. Silakan coba lagi.";
      setSubmitError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="text-[#14509C] hover:text-[#0E3B74] font-bold text-sm flex items-center gap-1.5 cursor-pointer select-none transition-colors"
      >
        ← Kembali
      </button>

      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-3xl sm:text-[34px] font-extrabold text-[#1A1613] tracking-tight leading-none">
          Salurkan donasi Anda
        </h1>
        <p className="text-sm sm:text-[15px] text-[#6D645B] mt-2 font-medium">
          {campaignSubtitle}
        </p>
      </div>

      {/* Main Form Card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-[#EAE5DC] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
      >
        {/* 1. Pilih Kampanye */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-bold text-[#4F473F]">
            Pilih kampanye
          </label>
          <select
            value={selectedCampaignId || ""}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : undefined;
              setValue("campaignId", val);
              const found = campaigns.find((c) => c.id === val);
              setValue("campaignTitle", found ? found.nama : "Donasi Kemanusiaan Umum");
            }}
            className="w-full border border-[#DDD7CD] rounded-xl px-4 py-3 text-sm text-[#1A1613] font-semibold bg-white cursor-pointer focus:outline-none focus:border-[#14509C] transition-colors"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nama}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Jenis Dana */}
        <div className="space-y-2.5">
          <label className="block text-xs sm:text-sm font-bold text-[#4F473F]">
            Jenis dana
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {fundTabs.map((f) => {
              const isSelected = selectedFundType === f.type;
              return (
                <button
                  key={f.type}
                  type="button"
                  onClick={() => setValue("fundType", f.type)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#14509C] text-white shadow-xs"
                      : "bg-white text-[#5E564E] border border-[#DDD7CD] hover:border-[#14509C] hover:text-[#14509C]"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <p className="text-[12px] sm:text-[13px] text-[#14509C] font-medium leading-relaxed pt-0.5">
            {currentFundTab.ket}
          </p>
        </div>

        {/* 3. Nominal Donasi */}
        <div className="space-y-2.5">
          <label className="block text-xs sm:text-sm font-bold text-[#4F473F]">
            Nominal donasi
          </label>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {nominalPresets.map((preset) => {
              const isSelected = selectedAmount === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setValue("amount", preset, { shouldValidate: true })}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#14509C] text-white shadow-xs border border-[#14509C]"
                      : "bg-white text-[#1A1613] border border-[#DDD7CD] hover:border-[#14509C]"
                  }`}
                >
                  {formatIDR(preset)}
                </button>
              );
            })}
          </div>

          {/* Custom Numeric Input with Left Rp Addon */}
          <div className="flex items-center border border-[#DDD7CD] rounded-xl overflow-hidden focus-within:border-[#14509C] transition-colors mt-2">
            <span className="px-4 py-3 text-sm font-bold text-[#8B8177] bg-[#F7F4EE] border-r border-[#EAE5DC] select-none">
              Rp
            </span>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  inputMode="numeric"
                  value={field.value ? field.value.toLocaleString("id-ID") : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(Number(raw) || 0);
                  }}
                  placeholder="0"
                  className="w-full border-0 outline-none px-4 py-3 text-base sm:text-lg font-mono font-bold text-[#1A1613] bg-transparent"
                />
              )}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-600 font-semibold">{errors.amount.message}</p>
          )}
        </div>

        {/* 4. Nama Donatur & Email/WhatsApp (2 Column Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-[#4F473F]">
              Nama donatur
            </label>
            <input
              type="text"
              {...register("fullName")}
              placeholder="Nama lengkap"
              disabled={isAnonymous}
              className={`w-full border border-[#DDD7CD] rounded-xl px-4 py-3 text-sm text-[#1A1613] font-medium outline-none focus:border-[#14509C] transition-colors ${
                isAnonymous ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white"
              }`}
            />
            {errors.fullName && !isAnonymous && (
              <p className="text-xs text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-[#4F473F]">
              Email / WhatsApp
            </label>
            <input
              type="text"
              {...register("contact")}
              placeholder="Untuk kirim bukti setor"
              className="w-full border border-[#DDD7CD] rounded-xl px-4 py-3 text-sm text-[#1A1613] font-medium outline-none focus:border-[#14509C] transition-colors bg-white"
            />
            {errors.contact && (
              <p className="text-xs text-red-600">{errors.contact.message}</p>
            )}
          </div>
        </div>

        {/* 5. Doa / Pesan (Opsional) */}
        <div className="space-y-1.5">
          <label className="block text-xs sm:text-sm font-bold text-[#4F473F]">
            Doa / pesan (opsional)
          </label>
          <input
            type="text"
            {...register("message")}
            placeholder="Semoga menjadi jalan kebaikan"
            className="w-full border border-[#DDD7CD] rounded-xl px-4 py-3 text-sm text-[#1A1613] font-medium outline-none focus:border-[#14509C] transition-colors bg-white"
          />
        </div>

        {/* 6. Anonymous Checkbox */}
        <div
          onClick={() => setValue("isAnonymous", !isAnonymous)}
          className="flex items-center gap-2.5 cursor-pointer select-none pt-1"
        >
          <div
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
              isAnonymous
                ? "bg-[#14509C] border-[#14509C] text-white"
                : "border-[#DDD7CD] bg-white"
            }`}
          >
            {isAnonymous && <span className="text-xs font-bold leading-none">✓</span>}
          </div>
          <span className="text-xs sm:text-sm font-medium text-[#4F473F]">
            Sembunyikan nama saya (donatur anonim)
          </span>
        </div>

        {/* 7. Metode Pembayaran */}
        <div className="space-y-2.5 pt-1">
          <label className="block text-xs sm:text-sm font-bold text-[#4F473F]">
            Metode pembayaran
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {paymentMethods.map((m) => {
              const isSelected = selectedChannel === m.channel;
              return (
                <button
                  key={m.channel}
                  type="button"
                  onClick={() => setValue("channel", m.channel)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#14509C] text-white shadow-xs"
                      : "bg-white text-[#5E564E] border border-[#DDD7CD] hover:border-[#14509C] hover:text-[#14509C]"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 8. Summary Box (Blue tinted card) */}
        <div className="bg-[#F4F8FC] border border-dashed border-[#BCD3EE] rounded-2xl p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm text-[#4F473F]">
            <span>Donasi</span>
            <span className="font-mono font-bold text-[#1A1613]">
              {formatIDR(selectedAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-[#4F473F]">
            <span>Kode unik verifikasi</span>
            <span className="font-mono font-bold text-[#1A1613]">
              {uniqueCode > 0 ? `Rp ${uniqueCode}` : "−"}
            </span>
          </div>

          <div className="h-px bg-[#D7E8E0]" />

          <div className="flex items-baseline justify-between pt-0.5">
            <span className="text-xs sm:text-sm font-bold text-[#4F473F]">
              Total transfer
            </span>
            <span className="font-mono font-extrabold text-xl sm:text-2xl text-[#0E3B74]">
              {formatIDR(totalTransfer)}
            </span>
          </div>
        </div>

        {submitError && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* 9. Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#14509C] hover:bg-[#0E3B74] active:scale-98 text-white font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Memproses Transaksi..." : "Lanjutkan Pembayaran"}
        </button>

        <p className="text-[11.5px] sm:text-xs text-[#9A9086] text-center leading-relaxed font-medium">
          Donasi Anda langsung tercatat di sistem pengelolaan AmanahZakat dan muncul pada dashboard
          amil secara real-time.
        </p>
      </form>
    </div>
  );
}
