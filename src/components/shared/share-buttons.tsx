"use client";

import * as React from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  title: string;
  url?: string;
  text?: string;
}

export function ShareButtons({ title, url, text }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "https://peduli.amanahzakat.id");
  const shareText = text || `Ayo dukung program "${title}" melalui AmanahZakat Peduli. Penyaluran transparan dan tercatat resmi: ${shareUrl}`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpen = (link: string) => {
    if (typeof window !== "undefined") {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
        <Share2 className="h-3.5 w-3.5" />
        <span>Bagikan Kebaikan Ini</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => handleOpen(`https://wa.me/?text=${encodeURIComponent(shareText)}`)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-[#25D366] hover:bg-[#1EBE5D] transition-colors"
        >
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => handleOpen(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-[#229ED9] hover:bg-[#1C8CC0] transition-colors"
        >
          Telegram
        </button>
        <button
          type="button"
          onClick={() => handleOpen(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-[#111111] hover:bg-black transition-colors"
        >
          X (Twitter)
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold text-text bg-[#F3EFE9] hover:bg-[#EAE5DC] transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Tersalin!" : "Salin Teks"}</span>
        </button>
      </div>
    </div>
  );
}
