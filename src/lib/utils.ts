export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Strip every non-digit character from a phone number so different
 * formattings of the same number compare as equal.
 *   "+91 98765 43210" -> "919876543210"
 *   "+91-9876543210"  -> "919876543210"
 *   "(987) 654-3210"  -> "9876543210"
 * Returns empty string when the input has no digits.
 */
export function normalizePhone(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/\D/g, "");
}
