import "server-only";
import { Resend } from "resend";
import { env, hasEmailEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

let cachedClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!hasEmailEnv) return null;
  if (!cachedClient) {
    cachedClient = new Resend(env.RESEND_API_KEY);
  }
  return cachedClient;
}

// Resend's default rate limit is 2 requests/second across all sends. A single
// admin action can fan out to multiple recipients (e.g. one notification per
// admin in `applyToProjectAction`) and fire emails almost simultaneously,
// which can trip a 429 `rate_limit_exceeded`. We serialize sends through a
// promise chain with a minimum gap to stay safely below the limit.
const MIN_SEND_INTERVAL_MS = 600;
let lastSendAt = 0;
let throttleQueue: Promise<void> = Promise.resolve();

function throttleSend(): Promise<void> {
  const next = throttleQueue.then(async () => {
    const elapsed = Date.now() - lastSendAt;
    const wait = MIN_SEND_INTERVAL_MS - elapsed;
    if (wait > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, wait));
    }
    lastSendAt = Date.now();
  });
  // Swallow rejections so one failure doesn't break the queue for everyone.
  throttleQueue = next.catch(() => undefined);
  return next;
}

export async function getUserEmail(userId: string): Promise<string | null> {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) return null;
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error || !data?.user?.email) return null;
    return data.user.email;
  } catch (err) {
    console.warn("[email] failed to fetch user email", err);
    return null;
  }
}

type EmailAttachment = {
  filename: string;
  content: Buffer;
};

type SendEmailInput = {
  to: string;
  subject: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  attachments?: EmailAttachment[];
};

function buildHtml({ heading, body, ctaLabel, ctaUrl }: Omit<SendEmailInput, "to" | "subject">) {
  const cta =
    ctaLabel && ctaUrl
      ? `<p style="margin:24px 0 0 0;">
           <a href="${escapeHtml(ctaUrl)}"
              style="background:#4338ca;color:#ffffff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
             ${escapeHtml(ctaLabel)}
           </a>
         </p>`
      : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f7;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0"
                 style="background:#ffffff;border-radius:14px;padding:28px;box-shadow:0 4px 16px rgba(0,0,0,0.04);">
            <tr><td>
              <p style="margin:0 0 12px 0;color:#4f46e5;font-weight:700;letter-spacing:0.5px;font-size:12px;text-transform:uppercase;">PLM Freelancer Platform</p>
              <h1 style="margin:0 0 12px 0;font-size:20px;color:#0f172a;">${escapeHtml(heading)}</h1>
              <p style="margin:0;line-height:1.55;font-size:14px;color:#334155;white-space:pre-wrap;">${escapeHtml(body)}</p>
              ${cta}
              <p style="margin:24px 0 0 0;color:#94a3b8;font-size:12px;">You're receiving this because of activity on your account. Manage notifications in your dashboard.</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildText({ heading, body, ctaLabel, ctaUrl }: Omit<SendEmailInput, "to" | "subject">) {
  const ctaLine = ctaLabel && ctaUrl ? `\n\n${ctaLabel}: ${ctaUrl}` : "";
  return `${heading}\n\n${body}${ctaLine}\n\n— PLM Freelancer Platform`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const client = getResendClient();
  if (!client) {
    console.info("[email] skipped (no RESEND_API_KEY/EMAIL_FROM configured)", {
      to: input.to,
      subject: input.subject,
    });
    return false;
  }

  try {
    await throttleSend();
    const { data, error } = await client.emails.send({
      from: env.EMAIL_FROM as string,
      to: input.to,
      subject: input.subject,
      html: buildHtml(input),
      text: buildText(input),
      attachments: input.attachments?.map((file) => ({
        filename: file.filename,
        content: file.content,
      })),
    });
    if (error) {
      const e = error as {
        name?: string;
        message?: string;
        statusCode?: number;
      };
      console.warn("[email] resend reported error", {
        name: e.name,
        statusCode: e.statusCode,
        message: e.message,
        to: input.to,
        subject: input.subject,
      });
      return false;
    }
    console.info("[email] sent", {
      id: data?.id,
      to: input.to,
      subject: input.subject,
    });
    return true;
  } catch (err) {
    const e = err as {
      name?: string;
      message?: string;
      statusCode?: number;
      cause?: unknown;
    };
    console.warn("[email] send threw", {
      name: e?.name,
      statusCode: e?.statusCode,
      message: e?.message,
      cause: e?.cause,
      to: input.to,
      subject: input.subject,
    });
    return false;
  }
}

export async function sendUserEmail(
  userId: string,
  input: Omit<SendEmailInput, "to">,
): Promise<boolean> {
  const email = await getUserEmail(userId);
  if (!email) return false;
  return sendEmail({ ...input, to: email });
}
