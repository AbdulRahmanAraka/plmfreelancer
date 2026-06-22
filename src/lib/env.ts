import { z } from "zod";

function normalizeUrlToOrigin(value: unknown) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed;
  }
}

function normalizeAppUrl(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return undefined;
  }
}

function normalizeEmailAddress(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const bracketMatch = trimmed.match(/<([^>]+)>/);
  const candidate = (bracketMatch?.[1] ?? trimmed).trim();
  return z.string().email().safeParse(candidate).success ? candidate : undefined;
}

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .preprocess(normalizeAppUrl, z.string().url())
    .default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(normalizeUrlToOrigin, z.string().url().optional()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.preprocess(normalizeEmailAddress, z.string().email().optional()),
});

const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
});

if (!parsedEnv.success) {
  console.error(
    "[env] Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors,
  );
}

export const env = parsedEnv.success
  ? parsedEnv.data
  : envSchema.parse({
      NEXT_PUBLIC_APP_URL: undefined,
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
      SUPABASE_SERVICE_ROLE_KEY: undefined,
      RESEND_API_KEY: undefined,
      EMAIL_FROM: undefined,
    });

export const hasSupabaseEnv = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const hasEmailEnv = Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
