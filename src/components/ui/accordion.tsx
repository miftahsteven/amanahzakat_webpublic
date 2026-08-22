"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: string;
  subtitle?: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItem({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  children,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200 overflow-hidden bg-white",
        isOpen ? "border-primary-border shadow-sm" : "border-border",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 md:p-5 text-left font-bold text-text hover:text-primary transition-colors gap-3"
      >
        <div className="flex flex-col gap-1 pr-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("text-sm md:text-base leading-snug", isOpen && "text-primary")}>
              {title}
            </span>
            {badge && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary-border">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <span className="text-xs text-text-muted font-normal">{subtitle}</span>}
        </div>
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3EFE9] text-text-muted transition-transform duration-200",
            isOpen && "rotate-180 bg-primary-soft text-primary"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>
      {isOpen && (
        <div className="border-t border-border/70 px-4 py-4 md:px-5 md:py-4 text-sm text-text-muted leading-relaxed bg-[#FCFBFA] animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}
