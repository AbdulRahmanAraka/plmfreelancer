const DRAFT_PREFIX = "plm:profile-draft";

export function profileDraftKey(scope: "client" | "freelancer", userId: string) {
  return `${DRAFT_PREFIX}:${scope}:${userId}`;
}

export function readFormDraft<T extends Record<string, unknown>>(key: string): Partial<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<T>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeFormDraft(key: string, data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore quota / private-mode errors.
  }
}

export function clearFormDraft(key: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore.
  }
}

export function mergeWithDraft<T extends Record<string, unknown>>(
  saved: T,
  draft: Partial<T> | null,
): T {
  if (!draft) return saved;
  return { ...saved, ...draft };
}
