export const SOFTWARE_OPTIONS = [
  "Siemens Teamcenter",
  "PTC Windchill",
  "Dassault ENOVIA",
  "SAP PLM",
  "Oracle Fusion Cloud PLM",
  "Aras Innovator",
];

export const SKILL_OPTIONS = [
  "PLM Implementation",
  "PLM Customization",
  "BMIDE",
  "ITK",
  "Data Migration",
  "ERP Integration",
  "Training and Support",
];

export const PROJECT_DURATION_OPTIONS = [
  { value: "short_term", label: "Short term (1–3 months)" },
  { value: "medium_term", label: "Medium term (3–6 months)" },
  { value: "long_term", label: "Long term (6–12 months)" },
  { value: "extended", label: "12+ months" },
] as const;

export const PROJECT_ENGAGEMENT_OPTIONS = [
  { value: "full_time", label: "Full time" },
  { value: "part_time", label: "Part time" },
] as const;

export type ProjectDuration = (typeof PROJECT_DURATION_OPTIONS)[number]["value"];
export type ProjectEngagementType = (typeof PROJECT_ENGAGEMENT_OPTIONS)[number]["value"];

const durationLabelMap = Object.fromEntries(
  PROJECT_DURATION_OPTIONS.map((option) => [option.value, option.label]),
) as Record<ProjectDuration, string>;

const engagementLabelMap = Object.fromEntries(
  PROJECT_ENGAGEMENT_OPTIONS.map((option) => [option.value, option.label]),
) as Record<ProjectEngagementType, string>;

export function projectDurationLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return durationLabelMap[value as ProjectDuration] ?? value;
}

export function projectEngagementLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return engagementLabelMap[value as ProjectEngagementType] ?? value;
}
