"use server";

import { z } from "zod";
import { LEGAL } from "@/config/legal";
import { sendEmail } from "@/server/services/email.service";

const REQUIREMENT_KEYS = [
  "hire_resources",
  "vendor_support",
  "project_requirement",
  "general_inquiry",
] as const;

type RequirementKey = (typeof REQUIREMENT_KEYS)[number];

const REQUIREMENT_LABELS: Record<RequirementKey, string> = {
  hire_resources: "Hire Resources",
  vendor_support: "Need Vendor Support",
  project_requirement: "Project Requirement",
  general_inquiry: "General Inquiry",
};

const InquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  company: z.string().trim().max(120).optional().default(""),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(254),
  phone: z.string().trim().max(40).optional().default(""),
  requirementTypes: z.array(z.enum(REQUIREMENT_KEYS)).default([]),
  message: z
    .string()
    .trim()
    .min(10, "Please share a few more details so we can help")
    .max(4000),
});

export type InquiryState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const INITIAL_INQUIRY_STATE: InquiryState = {
  status: "idle",
  message: "",
};

export async function submitInquiryAction(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  if (typeof formData.get("hp_field") === "string" && formData.get("hp_field")) {
    return { status: "success", message: "Thanks — we will be in touch." };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    requirementTypes: formData
      .getAll("requirementType")
      .map((value) => String(value))
      .filter((value): value is RequirementKey =>
        (REQUIREMENT_KEYS as readonly string[]).includes(value),
      ),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = InquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ??
        "Please double-check the form and try again.",
    };
  }

  const data = parsed.data;
  const selectedLabels = data.requirementTypes.map(
    (key) => REQUIREMENT_LABELS[key],
  );

  const bodyLines = [
    `Name: ${data.name}`,
    data.company ? `Company: ${data.company}` : null,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    selectedLabels.length
      ? `Requirement Type: ${selectedLabels.join(", ")}`
      : null,
    "",
    "Message:",
    data.message,
  ].filter((line): line is string => line !== null);

  const body = bodyLines.join("\n");

  try {
    await sendEmail({
      to: LEGAL.contactEmail,
      subject: `New inquiry from ${data.name}`,
      heading: "New Contact Inquiry",
      body,
    });
  } catch (err) {
    console.warn("[contact] failed to send inquiry email", err);
  }

  return {
    status: "success",
    message:
      "Inquiry received. Our team will review and get back to you as soon as possible.",
  };
}
