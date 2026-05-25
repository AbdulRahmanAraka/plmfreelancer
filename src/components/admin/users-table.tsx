"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ProfileAvatar } from "@/components/ui/profile-avatar";

export type AdminUserRow = {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
  freelancer: {
    professional_title: string | null;
    introduction: string | null;
    country: string | null;
    state: string | null;
    address: string | null;
    plm_experience_years: number | null;
    plm_experience_months: number | null;
    hourly_rate: number | null;
    availability: string | null;
    notice_period: string | null;
    portfolio_url: string | null;
    profile_image_url: string | null;
    skills: string[];
    software: string[];
  } | null;
  client: {
    company_name: string | null;
    address: string | null;
  } | null;
};

type Props = {
  rows: AdminUserRow[];
  emptyMessage: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return dateFormatter.format(d);
}

function roleBadgeClass(role: string): string {
  switch (role) {
    case "freelancer":
      return "text-sky-700";
    case "client":
      return "text-cyan-700";
    case "admin":
      return "text-indigo-700";
    default:
      return "text-slate-700";
  }
}

function roleChipClass(role: string): string {
  switch (role) {
    case "freelancer":
      return "bg-sky-50 text-sky-700 ring-sky-200";
    case "client":
      return "bg-cyan-50 text-cyan-700 ring-cyan-200";
    case "admin":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-200";
  }
}

export function AdminUsersTable({ rows, emptyMessage }: Props) {
  const [selected, setSelected] = useState<AdminUserRow | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-indigo-900">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Registered</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.user_id}
                    onClick={() => setSelected(row)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(row);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    title="Click to view full profile"
                    className="cursor-pointer border-b border-border last:border-b-0 transition hover:bg-indigo-50/40 focus:bg-indigo-50/60 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300"
                  >
                    <td className="px-4 py-3 font-semibold text-indigo-950">{row.name}</td>
                    <td className="px-4 py-3 text-indigo-900/90">{row.email}</td>
                    <td className="px-4 py-3 text-indigo-900/90">{row.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-sm font-medium capitalize",
                          roleBadgeClass(row.role),
                        )}
                      >
                        {row.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-indigo-900/85">
                      {formatDate(row.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <ProfileModal user={selected} onClose={() => setSelected(null)} />
      ) : null}
    </>
  );
}

function ProfileModal({
  user,
  onClose,
}: {
  user: AdminUserRow;
  onClose: () => void;
}) {
  const profileImage = user.freelancer?.profile_image_url ?? null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/40 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-indigo-700 shadow-sm transition hover:bg-indigo-50 hover:text-indigo-900"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="max-h-[85vh] overflow-y-auto px-6 pb-6 pt-6">
          <div className="flex flex-wrap items-center gap-4 pr-10">
            <ProfileAvatar
              src={profileImage}
              alt={user.name}
              size={80}
              fallbackFontSize={28}
              className="shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="profile-modal-title"
                  className="text-xl font-bold text-indigo-950"
                >
                  {user.name}
                </h2>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ring-1",
                    roleChipClass(user.role),
                  )}
                >
                  {user.role}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1",
                    user.is_active
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-rose-200",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      user.is_active ? "bg-emerald-500" : "bg-rose-500",
                    )}
                  />
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              {user.freelancer?.professional_title ? (
                <p className="mt-1 text-sm font-medium text-indigo-700">
                  {user.freelancer.professional_title}
                </p>
              ) : null}
            </div>
          </div>

          <dl className="mt-5 grid gap-3 rounded-xl border border-border bg-slate-50/60 p-4 text-sm sm:grid-cols-3">
            <KV label="Email" value={user.email} />
            <KV label="Phone" value={user.phone} />
            <KV label="Registered" value={formatDate(user.created_at)} />
          </dl>

          {user.freelancer ? (
            <FreelancerSection f={user.freelancer} userId={user.user_id} />
          ) : null}

          {user.client ? <ClientSection c={user.client} /> : null}

          <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
            {user.role === "freelancer" ? (
              <Link
                href={`/freelancers/${user.user_id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-50"
              >
                Open full profile page
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FreelancerSection({
  f,
  userId,
}: {
  f: NonNullable<AdminUserRow["freelancer"]>;
  userId: string;
}) {
  const location =
    [f.state, f.country].filter((part): part is string => Boolean(part?.trim())).join(", ") || "—";

  const experience = (() => {
    const years = f.plm_experience_years ?? 0;
    const months = f.plm_experience_months ?? 0;
    if (!years && !months) return "—";
    const parts: string[] = [];
    if (years) parts.push(`${years} yr${years === 1 ? "" : "s"}`);
    if (months) parts.push(`${months} mo`);
    return parts.join(" ");
  })();

  const rate =
    f.hourly_rate != null
      ? `₹${Number(f.hourly_rate).toLocaleString("en-IN")} / hr`
      : "—";

  return (
    <section className="mt-5 space-y-4">
      {f.introduction ? (
        <div>
          <h3 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700/70">
            Introduction
          </h3>
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {f.introduction}
          </p>
        </div>
      ) : null}

      <dl className="grid gap-3 rounded-xl border border-border bg-white p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <KV label="Location" value={location} />
        <KV label="Experience" value={experience} />
        <KV label="Hourly rate" value={rate} />
        <KV label="Availability" value={f.availability || "—"} />
        <KV label="Notice period" value={f.notice_period || "—"} />
        <KV
          label="Portfolio"
          value={
            f.portfolio_url ? (
              <a
                href={f.portfolio_url}
                target="_blank"
                rel="noreferrer noopener"
                className="truncate font-medium text-indigo-700 hover:underline"
              >
                Open link →
              </a>
            ) : (
              "—"
            )
          }
        />
        {f.address ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <KV label="Address" value={f.address} />
          </div>
        ) : null}
      </dl>

      {f.skills.length > 0 || f.software.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {f.skills.length > 0 ? (
            <ChipGroup
              title="Skills"
              items={f.skills}
              chipClass="bg-indigo-50 text-indigo-800 ring-indigo-100"
            />
          ) : null}
          {f.software.length > 0 ? (
            <ChipGroup
              title="Software"
              items={f.software}
              chipClass="bg-cyan-50 text-cyan-800 ring-cyan-100"
            />
          ) : null}
        </div>
      ) : (
        <p className="text-xs italic text-muted-foreground">
          No skills or software added yet by this freelancer.
        </p>
      )}

      <p className="text-[11px] text-muted-foreground">User ID: {userId}</p>
    </section>
  );
}

function ClientSection({ c }: { c: NonNullable<AdminUserRow["client"]> }) {
  return (
    <section className="mt-5">
      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-indigo-700/70">
        Client Details
      </h3>
      <dl className="grid gap-3 rounded-xl border border-border bg-white p-4 text-sm sm:grid-cols-2">
        <KV label="Company name" value={c.company_name || "—"} />
        <KV label="Address" value={c.address || "—"} />
      </dl>
    </section>
  );
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-indigo-700/70">
        {label}
      </dt>
      <dd className="mt-0.5 wrap-break-word text-sm text-indigo-950">{value}</dd>
    </div>
  );
}

function ChipGroup({
  title,
  items,
  chipClass,
}: {
  title: string;
  items: string[];
  chipClass: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-indigo-700/70">
        {title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
              chipClass,
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
