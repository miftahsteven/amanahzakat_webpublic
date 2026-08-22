import React from "react";
import { formatIDR, formatCompactIDR } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface MoneyTextProps {
  amount: number | undefined | null;
  compact?: boolean;
  className?: string;
}

export function MoneyText({ amount, compact = false, className }: MoneyTextProps) {
  const formatted = compact ? formatCompactIDR(amount) : formatIDR(amount);

  return (
    <span className={cn("font-mono font-bold tracking-tight text-text", className)}>
      {formatted}
    </span>
  );
}
