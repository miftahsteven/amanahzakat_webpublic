"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
      <div className="h-20 w-20 rounded-full bg-red-50 text-brandRed flex items-center justify-center border border-red-200">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text">Terjadi Kendala Teknis</h1>
        <p className="text-sm text-text-muted">
          Mohon maaf, sistem mengalami kesalahan saat memproses permintaan Anda. Silakan coba kembali.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={() => reset()}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Muat Ulang Halaman
        </Button>
        <Link href="/">
          <Button variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
