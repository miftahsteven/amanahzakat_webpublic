import Link from "next/link";
import { SearchX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
      <div className="h-20 w-20 rounded-full bg-primary-soft text-primary flex items-center justify-center">
        <SearchX className="h-10 w-10" />
      </div>
      <div className="space-y-2 max-w-md">
        <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
          404 — HALAMAN TIDAK DITEMUKAN
        </span>
        <h1 className="text-3xl font-extrabold text-text">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-text-muted">
          Halaman atau tautan yang Anda tuju tidak tersedia atau telah dipindahkan.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="primary">
            <Home className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </Link>
        <Link href="/kampanye">
          <Button variant="outline">
            Lihat Program Kampanye
          </Button>
        </Link>
      </div>
    </div>
  );
}
