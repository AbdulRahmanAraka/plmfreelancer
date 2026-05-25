export type BudgetCurrency = "INR" | "USD";

export function normalizeCurrency(value: string | null | undefined): BudgetCurrency {
  return value === "USD" ? "USD" : "INR";
}

export function currencySymbol(currency: BudgetCurrency): string {
  return currency === "USD" ? "$" : "₹";
}

const formatters: Record<BudgetCurrency, Intl.NumberFormat> = {
  INR: new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }),
  USD: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }),
};

export function formatBudget(
  value: number | null | undefined,
  currency: string | null | undefined,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const code = normalizeCurrency(currency);
  return formatters[code].format(value);
}

export function formatBudgetRange(
  min: number | null | undefined,
  max: number | null | undefined,
  currency: string | null | undefined,
): string {
  const hasMin = min !== null && min !== undefined && !Number.isNaN(min);
  const hasMax = max !== null && max !== undefined && !Number.isNaN(max);
  if (!hasMin && !hasMax) return "—";
  if (hasMin && hasMax) {
    return `${formatBudget(min, currency)} – ${formatBudget(max, currency)}`;
  }
  return formatBudget((hasMin ? min : max) as number, currency);
}
