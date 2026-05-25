import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { AdminUsersTable, type AdminUserRow } from "@/components/admin/users-table";

export const dynamic = "force-dynamic";

type TabKey = "all" | "freelancers" | "clients";

type AdminUsersPageProps = {
  searchParams: Promise<{ tab?: string; q?: string }>;
};

const tabs: Array<{ key: TabKey; label: string; href: string }> = [
  { key: "all", label: "Registered Users", href: "/admin/users" },
  { key: "freelancers", label: "Freelancers", href: "/admin/users?tab=freelancers" },
  { key: "clients", label: "Clients", href: "/admin/users?tab=clients" },
];

const titleByTab: Record<TabKey, string> = {
  all: "Register info — all clients & freelancers who signed up",
  freelancers: "Registered freelancers",
  clients: "Registered clients",
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  await requireRole(["admin"]);

  const params = await searchParams;
  const tab: TabKey =
    params.tab === "freelancers"
      ? "freelancers"
      : params.tab === "clients"
        ? "clients"
        : "all";
  const q = (params.q ?? "").trim();

  const admin = createSupabaseAdminClient();

  let profilesQuery = admin
    .from("profiles")
    .select("user_id, full_name, phone, role, is_active, created_at")
    .order("created_at", { ascending: false });

  if (tab === "freelancers") {
    profilesQuery = profilesQuery.eq("role", "freelancer");
  } else if (tab === "clients") {
    profilesQuery = profilesQuery.eq("role", "client");
  }

  const { data: profiles, error: profilesError } = await profilesQuery;

  const baseProfiles = (profiles ?? []) as Array<{
    user_id: string;
    full_name: string | null;
    phone: string | null;
    role: string;
    is_active: boolean;
    created_at: string;
  }>;

  const { data: authData, error: authError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  const emailMap = new Map<string, string>(
    (authData?.users ?? []).map((u) => [u.id, u.email ?? ""]),
  );

  const userIds = baseProfiles.map((p) => p.user_id);
  const freelancerIds = baseProfiles
    .filter((p) => p.role === "freelancer")
    .map((p) => p.user_id);
  const clientIds = baseProfiles
    .filter((p) => p.role === "client")
    .map((p) => p.user_id);

  const [
    { data: freelancerDetails },
    { data: clientDetails },
    { data: skillRows },
    { data: softwareRows },
  ] = await Promise.all([
    freelancerIds.length
      ? admin
          .from("freelancer_profiles")
          .select(
            "user_id, professional_title, introduction, country, state, address, plm_experience_years, plm_experience_months, hourly_rate, availability, notice_period, portfolio_url, profile_image_path",
          )
          .in("user_id", freelancerIds)
      : { data: [] as Array<Record<string, unknown>> },
    clientIds.length
      ? admin
          .from("client_profiles")
          .select("user_id, company_name, address")
          .in("user_id", clientIds)
      : { data: [] as Array<Record<string, unknown>> },
    freelancerIds.length
      ? admin
          .from("freelancer_skills")
          .select("freelancer_id, skill")
          .in("freelancer_id", freelancerIds)
      : { data: [] as Array<{ freelancer_id: string; skill: string }> },
    freelancerIds.length
      ? admin
          .from("freelancer_software")
          .select("freelancer_id, software")
          .in("freelancer_id", freelancerIds)
      : { data: [] as Array<{ freelancer_id: string; software: string }> },
  ]);

  type FreelancerDetailRow = {
    user_id: string;
    professional_title: string | null;
    introduction: string | null;
    country: string | null;
    state: string | null;
    address: string | null;
    plm_experience_years: number | null;
    plm_experience_months: number | null;
    hourly_rate: number | string | null;
    availability: string | null;
    notice_period: string | null;
    portfolio_url: string | null;
    profile_image_path: string | null;
  };

  type ClientDetailRow = {
    user_id: string;
    company_name: string | null;
    address: string | null;
  };

  const freelancerMap = new Map<string, FreelancerDetailRow>(
    ((freelancerDetails ?? []) as FreelancerDetailRow[]).map((d) => [d.user_id, d]),
  );

  const clientMap = new Map<string, ClientDetailRow>(
    ((clientDetails ?? []) as ClientDetailRow[]).map((d) => [d.user_id, d]),
  );

  const skillsByFreelancer = new Map<string, string[]>();
  for (const row of (skillRows ?? []) as Array<{ freelancer_id: string; skill: string }>) {
    const list = skillsByFreelancer.get(row.freelancer_id) ?? [];
    list.push(row.skill);
    skillsByFreelancer.set(row.freelancer_id, list);
  }

  const softwareByFreelancer = new Map<string, string[]>();
  for (const row of (softwareRows ?? []) as Array<{ freelancer_id: string; software: string }>) {
    const list = softwareByFreelancer.get(row.freelancer_id) ?? [];
    list.push(row.software);
    softwareByFreelancer.set(row.freelancer_id, list);
  }

  // Generate signed URLs for freelancer profile images (1 hour expiry).
  const profileImagePaths = ((freelancerDetails ?? []) as FreelancerDetailRow[])
    .filter((d) => Boolean(d.profile_image_path))
    .map((d) => ({ userId: d.user_id, path: d.profile_image_path as string }));

  const signedImageEntries = await Promise.all(
    profileImagePaths.map(async ({ userId, path }) => {
      const { data } = await admin.storage
        .from("freelancer-profiles")
        .createSignedUrl(path, 60 * 60);
      return [userId, data?.signedUrl ?? null] as const;
    }),
  );
  const signedImageMap = new Map<string, string>(
    signedImageEntries.filter(
      (entry): entry is readonly [string, string] => Boolean(entry[1]),
    ),
  );

  void userIds;

  let rows: AdminUserRow[] = baseProfiles.map((p) => {
    const f = freelancerMap.get(p.user_id);
    const c = clientMap.get(p.user_id);
    return {
      user_id: p.user_id,
      name: p.full_name?.trim() || "—",
      email: emailMap.get(p.user_id) || "—",
      phone: p.phone?.trim() || "—",
      role: p.role,
      is_active: p.is_active,
      created_at: p.created_at,
      freelancer: f
        ? {
            professional_title: f.professional_title,
            introduction: f.introduction,
            country: f.country,
            state: f.state,
            address: f.address,
            plm_experience_years: f.plm_experience_years,
            plm_experience_months: f.plm_experience_months,
            hourly_rate:
              f.hourly_rate == null
                ? null
                : typeof f.hourly_rate === "string"
                  ? Number(f.hourly_rate)
                  : f.hourly_rate,
            availability: f.availability,
            notice_period: f.notice_period,
            portfolio_url: f.portfolio_url,
            profile_image_url: signedImageMap.get(p.user_id) ?? null,
            skills: skillsByFreelancer.get(p.user_id) ?? [],
            software: softwareByFreelancer.get(p.user_id) ?? [],
          }
        : null,
      client: c
        ? {
            company_name: c.company_name,
            address: c.address,
          }
        : null,
    };
  });

  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter((r) => {
      const blob = [
        r.name,
        r.email,
        r.phone,
        r.role,
        r.freelancer?.professional_title ?? "",
        r.freelancer?.country ?? "",
        r.freelancer?.state ?? "",
        r.client?.company_name ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(needle);
    });
  }

  const errorMessage = profilesError?.message ?? authError?.message ?? null;

  const emptyMessage = q
    ? "No users match your search."
    : "No users registered yet.";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((t) => {
            const isActive = t.key === tab;
            return (
              <Link
                key={t.key}
                href={t.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ring-1",
                  isActive
                    ? "bg-indigo-700 text-white ring-indigo-700 shadow-sm hover:bg-indigo-800"
                    : "bg-white text-indigo-700 ring-indigo-200 hover:bg-indigo-50 hover:ring-indigo-300",
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        <form className="flex" method="get" action="/admin/users">
          {tab !== "all" ? <input type="hidden" name="tab" value={tab} /> : null}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search name, email, phone, role, company, title..."
            className="h-9 w-80 rounded-lg border border-border bg-white px-3 text-sm text-indigo-950 placeholder:text-muted-foreground focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </form>
      </div>

      <div className="flex items-center justify-between gap-2">
        <h1 className="text-sm font-bold text-indigo-950">{titleByTab[tab]}</h1>
        <p className="text-[11px] text-muted-foreground">
          Click any row to view the user&apos;s full profile.
        </p>
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      <AdminUsersTable rows={rows} emptyMessage={emptyMessage} />

      <p className="text-xs text-muted-foreground">
        Showing {rows.length} {rows.length === 1 ? "user" : "users"}
        {q ? ` matching "${q}"` : ""}
        {tab !== "all" ? ` in ${tab}` : ""}.
      </p>
    </div>
  );
}
