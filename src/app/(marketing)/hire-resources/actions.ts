"use server";

import { z } from "zod";
import { LEGAL } from "@/config/legal";
import { sendEmail } from "@/server/services/email.service";

const SKILLS = [
  "teamcenter",
  "windchill",
  "enovia",
  "aras_innovator",
  "other",
] as const;

const EXPERIENCE_BANDS = [
  "0_2",
  "2_5",
  "5_10",
  "10_15",
  "15_plus",
] as const;

const DURATIONS = [
  "short_term",
  "long_term",
  "contract",
  "project_based",
] as const;

type Skill = (typeof SKILLS)[number];
type ExperienceBand = (typeof EXPERIENCE_BANDS)[number];
type Duration = (typeof DURATIONS)[number];

const LABELS = {
  skill: {
    teamcenter: "Teamcenter",
    windchill: "Windchill",
    enovia: "ENOVIA",
    aras_innovator: "Aras Innovator",
    other: "Other",
  } satisfies Record<Skill, string>,
  experience: {
    "0_2": "0 – 2 years",
    "2_5": "2 – 5 years",
    "5_10": "5 – 10 years",
    "10_15": "10 – 15 years",
    "15_plus": "15+ years",
  } satisfies Record<ExperienceBand, string>,
  duration: {
    short_term: "Short Term",
    long_term: "Long Term",
    contract: "Contract",
    project_based: "Project Based",
  } satisfies Record<Duration, string>,
};

const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;

const ResourceRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  company: z.string().trim().max(160).optional().default(""),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(254),
  phone: z.string().trim().max(60).optional().default(""),
  skill: z.enum(SKILLS, { message: "Please select the required skill" }),
  experience: z.enum(EXPERIENCE_BANDS, {
    message: "Please select required experience",
  }),
  duration: z.enum(DURATIONS, {
    message: "Please select contract duration",
  }),
  startDate: z.string().trim().max(40).optional().default(""),
  description: z
    .string()
    .trim()
    .min(20, "Please share a few more details about the role")
    .max(6000),
});

export type ResourceRequestState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const INITIAL_RESOURCE_REQUEST_STATE: ResourceRequestState = {
  status: "idle",
  message: "",
};

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function submitResourceRequestAction(
  _prev: ResourceRequestState,
  formData: FormData,
): Promise<ResourceRequestState> {
  try {
    return await handleResourceRequest(formData);
  } catch (err) {
    console.error("[hire-resources] submit failed", err);
    return {
      status: "error",
      message:
        "We could not submit your request right now. Please try again or email contact@plmfreelancer.com.",
    };
  }
}

async function handleResourceRequest(
  formData: FormData,
): Promise<ResourceRequestState> {
  if (asString(formData.get("hp_field"))) {
    return {
      status: "success",
      message: "Resource request submitted successfully.",
    };
  }

  const raw = {
    fullName: asString(formData.get("fullName")),
    company: asString(formData.get("company")),
    email: asString(formData.get("email")),
    phone: asString(formData.get("phone")),
    skill: asString(formData.get("skill")),
    experience: asString(formData.get("experience")),
    duration: asString(formData.get("duration")),
    startDate: asString(formData.get("startDate")),
    description: asString(formData.get("description")),
  };

  const parsed = ResourceRequestSchema.safeParse(raw);
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
        message: "JD file is too large. Please keep attachments under 3 MB.",
      };
    }
    attachmentBuffer = Buffer.from(await attachmentEntry.arrayBuffer());
    attachmentName = attachmentEntry.name || "job-description";
  }

  const lines = [
    `Name: ${data.fullName}`,
    data.company ? `Company: ${data.company}` : null,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    "",
    `Required Skill: ${LABELS.skill[data.skill]}`,
    `Experience Required: ${LABELS.experience[data.experience]}`,
    `Contract Duration: ${LABELS.duration[data.duration]}`,
    data.startDate ? `Preferred Start Date: ${data.startDate}` : null,
    "",
    "Job Description / Requirement:",
    data.description,
    attachmentName ? "" : null,
    attachmentName ? `Attached JD: ${attachmentName}` : null,
  ].filter((line): line is string => line !== null);

  try {
    await sendEmail({
      to: LEGAL.contactEmail,
      subject: `Hire PLM Resources request from ${data.fullName}`,
      heading: "New Resource Hiring Request",
      body: lines.join("\n"),
      attachments: attachmentBuffer
        ? [{ filename: attachmentName, content: attachmentBuffer }]
        : undefined,
    });
  } catch (err) {
    console.warn("[hire-resources] failed to send email", err);
  }

  return {
    status: "success",
    message: "Resource request submitted successfully.",
  };
}
