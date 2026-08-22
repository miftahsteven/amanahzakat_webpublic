/**
 * Formats a Date object or ISO string to Indonesian date (e.g. 24 Juli 2026)
 */
export function formatDateIndonesian(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "-";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats a Date object or ISO string to Indonesian date & time (e.g. 24 Juli 2026, 14:30 WIB)
 */
export function formatDateTimeIndonesian(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "-";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const dateStr = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const timeStr = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr}, ${timeStr} WIB`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Calculates remaining countdown from target timestamp (e.g. "23:59:12")
 */
export function formatCountdown(targetExpiryTime: number | string): {
  formatted: string;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const target = typeof targetExpiryTime === "string" ? new Date(targetExpiryTime).getTime() : targetExpiryTime;
  const remaining = Math.max(0, target - Date.now());
  const isExpired = remaining <= 0;

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  const pad = (n: number) => String(n).padStart(2, "0");
  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return { formatted, hours, minutes, seconds, isExpired };
}
