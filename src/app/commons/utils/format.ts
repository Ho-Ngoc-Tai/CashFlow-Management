/**
 * Formats a number to Vietnamese Dong currency format (e.g., "1.250.000.000 ₫")
 */
export function formatVND(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Formats a number with commas for display
 */
export function formatNumber(val: number | string): string {
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
}

/**
 * Formats percentage with sign
 */
export function formatPercentage(val: number): string {
  const sign = val > 0 ? "+" : "";
  return `${sign}${val.toFixed(1)}%`;
}

/**
 * Formats ISO date string to human-readable Vietnamese date/time
 */
export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Formats ISO date to Date-only string (dd/MM/yyyy)
 */
export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return isoString;
  }
}
