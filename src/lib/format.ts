export type BudgetCurrency = "USD";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdFormatterWithCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** All amounts on the platform are stored and displayed in USD. */
export function normalizeCurrency(value?: string | null): BudgetCurrency {
  void value;
  return "USD";
}

export function currencySymbol(currency?: string | null): string {
  void currency;
  return "$";
}

export function formatBudget(
  value: number | null | undefined,
  currency?: string | null,
): string {
  void currency;
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return usdFormatter.format(value);
}

export function formatBudgetRange(
  min: number | null | undefined,
  max: number | null | undefined,
  currency?: string | null,
): string {
  const hasMin = min !== null && min !== undefined && !Number.isNaN(min);
  const hasMax = max !== null && max !== undefined && !Number.isNaN(max);
  if (!hasMin && !hasMax) return "—";
  if (hasMin && hasMax) {
    return `${formatBudget(min, currency)} – ${formatBudget(max, currency)}`;
  }
  return formatBudget((hasMin ? min : max) as number, currency);
}

export function formatHourlyRate(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${usdFormatterWithCents.format(value)} / hr`;
}
