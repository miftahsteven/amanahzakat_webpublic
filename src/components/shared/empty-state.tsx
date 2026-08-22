import React from "react";
import Link from "next/link";
import { SearchX, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "Tidak ada data ditemukan",
  description = "Coba ubah kata kunci pencarian atau filter yang Anda pilih.",
  actionHref,
  actionLabel,
  onActionClick,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-2xl border border-dashed border-border-strong my-6 space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-soft text-primary">
        {icon || <SearchX className="h-8 w-8 opacity-80" />}
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="font-bold text-lg text-text">{title}</h3>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
      {actionHref && actionLabel && (
        <Link href={actionHref}>
          <Button variant="secondary" size="sm">
            {actionLabel}
          </Button>
        </Link>
      )}
      {onActionClick && actionLabel && (
        <Button variant="secondary" size="sm" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Terjadi Kesalahan",
  description = "Gagal memuat data dari server. Silakan coba beberapa saat lagi.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/50 rounded-2xl border border-red-200 my-6 space-y-3">
      <h3 className="font-bold text-base text-brandRed">{title}</h3>
      <p className="text-sm text-text-muted max-w-md">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          Coba Lagi
        </Button>
      )}
    </div>
  );
}

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-white overflow-hidden p-5 space-y-4">
          <div className="h-44 bg-[#EAE5DC] rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 bg-[#EAE5DC] rounded w-1/3" />
            <div className="h-6 bg-[#EAE5DC] rounded w-4/5" />
            <div className="h-4 bg-[#EAE5DC] rounded w-full" />
          </div>
          <div className="h-2.5 bg-[#EAE5DC] rounded-full" />
          <div className="flex justify-between">
            <div className="h-4 bg-[#EAE5DC] rounded w-1/4" />
            <div className="h-4 bg-[#EAE5DC] rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
