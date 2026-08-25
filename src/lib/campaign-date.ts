const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

/** Accept ISO `YYYY-MM-DD` or Indonesian display → ISO. */
export function toIsoDate(input?: string | null): string {
  if (!input) return '';
  const raw = input.trim();
  if (!raw) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const parts = raw.split(/\s+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const monthIndex = MONTHS_ID.findIndex((m) => m.toLowerCase() === parts[1].toLowerCase());
    const year = parseInt(parts[2], 10);
    if (day && monthIndex >= 0 && year) {
      return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return '';
}

/** Format ISO or Indo → Indonesian display for UI. */
export function formatTenggatDisplay(input?: string | null): string {
  if (!input) return '—';
  const iso = toIsoDate(input);
  if (!iso) return input;
  const [year, month, day] = iso.split('-').map((n) => parseInt(n, 10));
  if (!year || !month || !day) return input;
  return `${day} ${MONTHS_ID[month - 1]} ${year}`;
}
