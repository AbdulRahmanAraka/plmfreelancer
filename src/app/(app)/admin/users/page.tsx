import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

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

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function formatRegistered(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return dateFormatter.format(date);
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
    .select("user_id, full_name, phone, role, created_at")
    .order("created_at", { ascending: false });

  if (tab === "freelancers") {
    profilesQuery = profilesQuery.eq("role", "freelancer");
  } else if (tab === "clients") {
    profilesQuery = profilesQuery.eq("role", "client");
  }

  const { data: profiles, error: profilesError } = await profilesQuery;

  const {
    data: authData,
    error: authError,
  } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });

  const emailMap = new Map<string, string>(
    (authData?.users ?? []).map((u) => [u.id, u.email ?? ""]),
  );

  type Row = {
    user_id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    created_at: string;
  };

  let rows: Row[] = ((profiles ?? []) as Array<{
    user_id: string;
    full_name: string | null;
    phone: string | null;
    role: string;
    created_at: string;
  }>).map((p) => ({
    user_id: p.user_id,
    name: p.full_name?.trim() || "—",
    email: emailMap.get(p.user_id) || "—",
    phone: p.phone?.trim() || "—",
    role: p.role,
    created_at: p.created_at,
  }));

  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(needle) ||
        r.email.toLowerCase().includes(needle) ||
        r.phone.toLowerCase().includes(needle) ||
        r.role.toLowerCase().includes(needle),
    );
  }

  const errorMessage = profilesError?.message ?? authError?.message ?? null;

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
            placeholder="Search name, email, phone, role..."
            className="h-9 w-72 rounded-lg border border-border bg-white px-3 text-sm text-indigo-950 placeholder:text-muted-foreground focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </form>
      </div>

      <h1 className="text-sm font-bold text-indigo-950">{titleByTab[tab]}</h1>

      {errorMessage ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

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
                    {q
                      ? "No users match your search."
                      : "No users registered yet."}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.user_id}
                    className="border-b border-border last:border-b-0 transition hover:bg-indigo-50/40"
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
                      {formatRegistered(row.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {rows.length} {rows.length === 1 ? "user" : "users"}
        {q ? ` matching "${q}"` : ""}
        {tab !== "all" ? ` in ${tab}` : ""}.
      </p>
    </div>
  );
}
