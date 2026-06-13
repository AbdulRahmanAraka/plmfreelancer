"use server";

import { z } from "zod";
import { LEGAL } from "@/config/legal";
import { sendEmail } from "@/server/services/email.service";

const PROJECT_TYPES = [
  "implementation",
  "customization",
  "migration",
  "integration",
  "support",
  "upgrade",
  "end_to_end_delivery",
  "other",
] as const;

const APPLICATIONS = [
  "teamcenter",
  "windchill",
  "enovia",
  "aras_innovator",
  "other",
] as const;

const ESTIMATED_DURATIONS = [
  "under_1_month",
  "1_3_months",
  "3_6_months",
  "6_12_months",
  "over_12_months",
] as const;

type ProjectType = (typeof PROJECT_TYPES)[number];
type Application = (typeof APPLICATIONS)[number];
type EstimatedDuration = (typeof ESTIMATED_DURATIONS)[number];

const LABELS = {
  projectType: {
    implementation: "Implementation",
    customization: "Customization",
    migration: "Migration",
    integration: "Integration",
    support: "Support",
    upgrade: "Upgrade",
    end_to_end_delivery: "End-to-End Delivery",
    other: "Other",
  } satisfies Record<ProjectType, string>,
  application: {
    teamcenter: "Teamcenter",
    windchill: "Windchill",
    enovia: "ENOVIA",
    aras_innovator: "Aras Innovator",
    other: "Other",
  } satisfies Record<Application, string>,
  duration: {
    under_1_month: "Under 1 month",
    "1_3_months": "1 – 3 months",
    "3_6_months": "3 – 6 months",
    "6_12_months": "6 – 12 months",
    over_12_months: "Over 12 months",
  } satisfies Record<EstimatedDuration, string>,
};

const VendorRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  company: z.string().trim().max(160).optional().default(""),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(254),
  phone: z.string().trim().max(60).optional().default(""),
  projectType: z.enum(PROJECT_TYPES, {
    message: "Please select a project type",
  }),
  application: z.enum(APPLICATIONS, {
    message: "Please select a PLM application",
  }),
  location: z.string().trim().min(2, "Please enter project location").max(160),
  estimatedDuration: z.enum(ESTIMATED_DURATIONS, {
    message: "Please select an estimated duration",
  }),
  requirements: z
    .string()
    .trim()
    .min(20, "Please describe the requirement in a few more words")
    .max(6000),
});

export type VendorRequestState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const INITIAL_VENDOR_REQUEST_STATE: VendorRequestState = {
  status: "idle",
  message: "",
};

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function submitVendorRequestAction(
  _prev: VendorRequestState,
  formData: FormData,
): Promise<VendorRequestState> {
  if (asString(formData.get("hp_field"))) {
    return {
      status: "success",
      message:
        "Vendor request submitted. Our team will connect you with trusted PLM partners shortly.",
    };
  }

  const raw = {
    fullName: asString(formData.get("fullName")),
    company: asString(formData.get("company")),
    email: asString(formData.get("email")),
    phone: asString(formData.get("phone")),
    projectType: asString(formData.get("projectType")),
    application: asString(formData.get("application")),
    location: asString(formData.get("location")),
    estimatedDuration: asString(formData.get("estimatedDuration")),
    requirements: asString(formData.get("requirements")),
  };

  const parsed = VendorRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ??
        "Please complete the required fields and try again.",
    };
  }

  const data = parsed.data;

  const lines = [
    `Name: ${data.fullName}`,
    data.company ? `Company: ${data.company}` : null,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    "",
    `Project Type: ${LABELS.projectType[data.projectType]}`,
    `PLM Application: ${LABELS.application[data.application]}`,
    `Project Location: ${data.location}`,
    `Estimated Duration: ${LABELS.duration[data.estimatedDuration]}`,
    "",
    "Requirement Details:",
    data.requirements,
  ].filter((line): line is string => line !== null);

  try {
    await sendEmail({
      to: LEGAL.contactEmail,
      subject: `Vendor request from ${data.fullName}`,
      heading: "New Vendor Engagement Request",
      body: lines.join("\n"),
    });
  } catch (err) {
    console.warn("[find-vendors] failed to send email", err);
  }

  return {
    status: "success",
    message:
      "Vendor request submitted. Our team will connect you with trusted PLM partners shortly.",
  };
}
