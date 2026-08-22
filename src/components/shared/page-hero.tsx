import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/layout/breadcrumbs";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  breadcrumbs?: BreadcrumbItem[];
  badge?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHero({
  breadcrumbs,
  badge,
  title,
  description,
  children,
  className,
}: PageHeroProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-b from-[#EEF3FB] to-background border-b border-border py-8 md:py-12",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-2" />}

        {badge && (
          <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-primary text-white">
            {badge}
          </span>
        )}

        <h1 className="text-2xl sm:text-4xl font-extrabold text-text tracking-tight leading-tight max-w-3xl">
          {title}
        </h1>

        {description && (
          <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-2xl">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
