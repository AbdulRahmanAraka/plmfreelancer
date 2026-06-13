"use server";

import { z } from "zod";
import { LEGAL } from "@/config/legal";
import { sendEmail } from "@/server/services/email.service";

const TRAINING_TECHNOLOGIES = [
  "teamcenter",
  "windchill",
  "enovia",
  "aras_innovator",
  "business_processes",
  "other",
] as const;

const TRAINING_MODES = ["online", "onsite", "hybrid"] as const;

type TrainingTechnology = (typeof TRAINING_TECHNOLOGIES)[number];
type TrainingMode = (typeof TRAINING_MODES)[number];

const LABELS = {
  technology: {
    teamcenter: "Teamcenter",
    windchill: "Windchill",
    enovia: "ENOVIA",
    aras_innovator: "Aras Innovator",
    business_processes: "PLM Business Processes",
    other: "Other",
  } satisfies Record<TrainingTechnology, string>,
  mode: {
    online: "Online",
    onsite: "Onsite",
    hybrid: "Hybrid",
  } satisfies Record<TrainingMode, string>,
};

const TrainingRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  organization: z.string().trim().max(160).optional().default(""),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(254),
  phone: z.string().trim().min(4, "Please enter a phone number").max(60),
  technology: z.enum(TRAINING_TECHNOLOGIES, {
    message: "Please select a training technology",
  }),
  participants: z.string().trim().max(40).optional().default(""),
  mode: z.enum(TRAINING_MODES).optional(),
  preferredDates: z.string().trim().max(160).optional().default(""),
  details: z
    .string()
    .trim()
    .min(20, "Please share a few more details about the training")
    .max(6000),
});

export type TrainingRequestState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const INITIAL_TRAINING_REQUEST_STATE: TrainingRequestState = {
  status: "idle",
  message: "",
};

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export async function submitTrainingRequestAction(
  _prev: TrainingRequestState,
  formData: FormData,
): Promise<TrainingRequestState> {
  if (asString(formData.get("hp_field"))) {
    return {
      status: "success",
      message: "Request submitted successfully.",
    };
  }

  const raw = {
    fullName: asString(formData.get("fullName")),
    organization: asString(formData.get("organization")),
    email: asString(formData.get("email")),
    phone: asString(formData.get("phone")),
    technology: asString(formData.get("technology")),
    participants: asString(formData.get("participants")),
    mode: asString(formData.get("mode")) || undefined,
    preferredDates: asString(formData.get("preferredDates")),
    details: asString(formData.get("details")),
  };

  const parsed = TrainingRequestSchema.safeParse(raw);
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
    data.organization ? `Organization: ${data.organization}` : null,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    "",
    `Training Technology: ${LABELS.technology[data.technology]}`,
    data.participants ? `Number of Participants: ${data.participants}` : null,
    data.mode ? `Training Mode: ${LABELS.mode[data.mode]}` : null,
    data.preferredDates ? `Preferred Dates: ${data.preferredDates}` : null,
    "",
    "Training Requirement Details:",
    data.details,
  ].filter((line): line is string => line !== null);

  try {
    await sendEmail({
      to: LEGAL.contactEmail,
      subject: `Training request from ${data.fullName}`,
      heading: "New PLM Training Request",
      body: lines.join("\n"),
    });
  } catch (err) {
    console.warn("[training] failed to send email", err);
  }

  return {
    status: "success",
    message: "Request submitted successfully.",
  };
}
