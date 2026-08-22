/**
 * Formats a number to Indonesian Rupiah (e.g. Rp 1.500.000)
 */
export function formatIDR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "Rp 0";
  }
  return "Rp " + Math.round(amount).toLocaleString("id-ID");
}

/**
 * Formats large amounts in millions/billions for compact display (e.g. Rp 388,4 Jt, Rp 1,1 M)
 */
export function formatCompactIDR(amount: number | undefined | null): string {
  if (!amount || isNaN(amount)) return "Rp 0";
  if (amount >= 1_000_000_000) {
    const b = amount / 1_000_000_000;
    const formatted = b.toFixed(1).replace(".", ",");
    return `Rp ${formatted} M`;
  }
  if (amount >= 1_000_000) {
    const jt = (amount / 1_000_000).toFixed(1).replace(".", ",").replace(",0", "");
    return `Rp ${jt} Jt`;
  }
  if (amount >= 1_000) {
    const rb = (amount / 1_000).toFixed(0);
    return `Rp ${rb} Rb`;
  }
  return formatIDR(amount);
}

/**
 * Parses user input string with dots, commas, or "Rp" to a clean number
 */
export function parseIDR(value: string | number | undefined | null): number {
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  if (!value) return 0;
  const cleaned = String(value).replace(/[^0-9]/g, "");
  return Number(cleaned) || 0;
}
