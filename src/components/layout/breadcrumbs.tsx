import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1.5 text-xs text-text-muted", className)}
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-primary transition-colors font-medium"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Beranda</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.label + index}>
            <ChevronRight className="h-3.5 w-3.5 text-text-subtle shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors font-medium truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-bold text-text truncate max-w-[240px]">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
