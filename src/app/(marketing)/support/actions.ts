"use server";

import { z } from "zod";
import type { MarketingFormState } from "@/components/marketing/form-action-state";
import { LEGAL } from "@/config/legal";
import { sendEmail } from "@/server/services/email.service";

const PLATFORMS = [
  "teamcenter",
  "windchill",
  "enovia",
  "aras_innovator",
  "other",
] as const;

const SUPPORT_TYPES = [
  "production_issue",
  "application_error",
  "user_support",
  "custom_development",
  "integration_support",
  "migration_support",
  "upgrade_support",
  "performance_issue",
  "other",
] as const;

const PRIORITIES = ["critical", "high", "medium", "low"] as const;

const SUPPORT_MODES = ["remote", "onsite", "either"] as const;

type Platform = (typeof PLATFORMS)[number];
type SupportType = (typeof SUPPORT_TYPES)[number];
type Priority = (typeof PRIORITIES)[number];
type SupportMode = (typeof SUPPORT_MODES)[number];

const LABELS = {
  platform: {
    teamcenter: "Teamcenter",
    windchill: "Windchill",
    enovia: "ENOVIA",
    aras_innovator: "Aras Innovator",
    other: "Other",
  } satisfies Record<Platform, string>,
  supportType: {
    production_issue: "Production Issue",
    application_error: "Application Error",
    user_support: "User Support",
    custom_development: "Custom Development",
    integration_support: "Integration Support",
    migration_support: "Migration Support",
    upgrade_support: "Upgrade Support",
    performance_issue: "Performance Issue",
    other: "Other",
  } satisfies Record<SupportType, string>,
  priority: {
    critical: "Critical (Immediate)",
    high: "High",
    medium: "Medium",
    low: "Low",
  } satisfies Record<Priority, string>,
  supportMode: {
    remote: "Remote",
    onsite: "Onsite",
    either: "Either",
  } satisfies Record<SupportMode, string>,
};

const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;

const SupportSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  company: z.string().trim().max(120).optional().default(""),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(254),
  phone: z.string().trim().max(60).optional().default(""),
  platform: z.enum(PLATFORMS, {
    message: "Please select a PLM platform",
  }),
  supportType: z.enum(SUPPORT_TYPES, {
    message: "Please select a support type",
  }),
  priority: z.enum(PRIORITIES, {
    message: "Please select a priority",
  }),
  supportMode: z.enum(SUPPORT_MODES).optional(),
  preferredStartDate: z.string().trim().max(40).optional().default(""),
  description: z
    .string()
    .trim()
    .min(20, "Please describe the issue in a few more words")
    .max(6000),
  immediate: z.boolean().default(false),
});

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function submitSupportRequestAction(
  _prev: MarketingFormState,
  formData: FormData,
): Promise<MarketingFormState> {
  if (asString(formData.get("hp_field"))) {
    return {
      status: "success",
      message:
        "Thank you for contacting PLM Freelancer. Your support request has been received and our team will connect you with a suitable PLM expert shortly.",
    };
  }

  const raw = {
    fullName: asString(formData.get("fullName")),
    company: asString(formData.get("company")),
    email: asString(formData.get("email")),
    phone: asString(formData.get("phone")),
    platform: asString(formData.get("platform")),
    supportType: asString(formData.get("supportType")),
    priority: asString(formData.get("priority")),
    supportMode: asString(formData.get("supportMode")) || undefined,
    preferredStartDate: asString(formData.get("preferredStartDate")),
    description: asString(formData.get("description")),
    immediate: formData.get("immediate") === "on",
  };

  const parsed = SupportSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ??
        "Please complete the required fields and try again.",
    };
  }

  const data = parsed.data;

  const attachmentEntry = formData.get("attachment");
  let attachmentBuffer: Buffer | null = null;
  let attachmentName = "";
  if (attachmentEntry instanceof File && attachmentEntry.size > 0) {
    if (attachmentEntry.size > MAX_ATTACHMENT_BYTES) {
      return {
        status: "error",
        message: "Attachment is too large. Please keep files under 3 MB.",
      };
    }
    attachmentBuffer = Buffer.from(await attachmentEntry.arrayBuffer());
    attachmentName = attachmentEntry.name || "attachment";
  }

  const lines = [
    `Name: ${data.fullName}`,
    data.company ? `Company: ${data.company}` : null,
    `Email: ${data.email}`,
    data.phone ? `Phone / WhatsApp: ${data.phone}` : null,
    "",
    `PLM Platform: ${LABELS.platform[data.platform]}`,
    `Support Type: ${LABELS.supportType[data.supportType]}`,
    `Priority: ${LABELS.priority[data.priority]}`,
    data.supportMode
      ? `Required Support Mode: ${LABELS.supportMode[data.supportMode]}`
      : null,
    data.preferredStartDate
      ? `Preferred Start Date: ${data.preferredStartDate}`
      : null,
    data.immediate ? "Flag: Requester needs immediate assistance" : null,
    "",
    "Description:",
    data.description,
    attachmentName ? "" : null,
    attachmentName ? `Attachment included: ${attachmentName}` : null,
  ].filter((line): line is string => line !== null);

  try {
    await sendEmail({
      to: LEGAL.contactEmail,
      subject: `[${LABELS.priority[data.priority].toUpperCase()}] Support request from ${data.fullName}`,
      heading: "New On-Demand PLM Support Request",
      body: lines.join("\n"),
      attachments: attachmentBuffer
        ? [{ filename: attachmentName, content: attachmentBuffer }]
        : undefined,
    });
  } catch (err) {
    console.warn("[support] failed to send support email", err);
  }

  return {
    status: "success",
    message:
      "Thank you for contacting PLM Freelancer. Your support request has been received and our team will connect you with a suitable PLM expert shortly.",
  };
}
