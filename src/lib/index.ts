import {clsx, type ClassValue} from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional classNames and resolve Tailwind conflicts.
 * Used by v0/shadcn components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/**
 * Format currency consistently (default: GBP since you’re in the UK).
 * Change to USD later if needed.
 */
export function formatCurrency(
  amount: number,
  opts: { currency?: string; locale?: string } = {},
) {
  const { currency = "GBP", locale = "en-GB" } = opts;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}


/**
 * Friendly relative time (very lightweight).
 * For production you may prefer date-fns, but this is fine for now.
 */
export function formatRelativeTime(date: Date) {
    const diffMs = Date.now() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)

    if(diffMin < 1) return "just now";
    if(diffMin < 60) return `${diffMin}m ago`;

    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return `${diffHr}h ago`

    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
}