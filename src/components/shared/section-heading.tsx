import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "left",
  actionHref,
  actionLabel,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8",
        align === "center" && "text-center md:flex-col md:items-center",
        className
      )}
    >
      <div className={cn("space-y-2", align === "center" && "max-w-2xl mx-auto")}>
        {badge && (
          <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary-soft text-primary border border-primary-border">
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors group shrink-0"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
