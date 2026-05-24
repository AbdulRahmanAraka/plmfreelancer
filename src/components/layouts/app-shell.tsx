import Link from "next/link";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/(auth)/actions";
import { markNotificationReadAction } from "@/app/(app)/actions";
import { Button } from "@/components/ui/button";

type ShellRole = "client" | "freelancer" | "admin";

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

const navByRole: Record<ShellRole, Array<{ href: string; label: string }>> = {
  client: [
    { href: "/client", label: "Client Dashboard" },
    { href: "/client/profile", label: "Client Profile" },
    { href: "/account", label: "Account Settings" },
  ],
  freelancer: [
    { href: "/freelancer", label: "Freelancer Dashboard" },
    { href: "/freelancer/profile", label: "Freelancer Profile" },
    { href: "/account", label: "Account Settings" },
  ],
  admin: [
    { href: "/client", label: "Client Dashboard" },
    { href: "/client/profile", label: "Client Profile" },
    { href: "/freelancer", label: "Freelancer Dashboard" },
    { href: "/freelancer/profile", label: "Freelancer Profile" },
    { href: "/admin", label: "Admin Console" },
    { href: "/account", label: "Account Settings" },
  ],
};

export function AppShell({
  children,
  role,
  notifications,
}: {
  children: ReactNode;
  role: ShellRole;
  notifications: NotificationItem[];
}) {
  const navItems = navByRole[role];
  const unreadCount = notifications.filter((item) => !item.is_read).length;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-white/85 p-6 backdrop-blur lg:block">
        <p className="mb-7 text-lg font-bold text-indigo-950">PLM Workspace</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-indigo-900 transition hover:bg-indigo-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-indigo-900">
            Notifications: {unreadCount} unread
          </div>
          <form action={signOutAction}>
            <Button type="submit" variant="secondary">
              Sign Out
            </Button>
          </form>
        </div>
        <div className="mb-4 rounded-xl border border-border bg-white p-3">
          {notifications.length === 0 ? (
            <p className="text-xs text-muted-foreground">No notifications yet.</p>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 6).map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border border-border px-3 py-2 text-xs md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-indigo-950">{item.title}</p>
                    <p className="text-muted-foreground">{item.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!item.is_read ? (
                      <form action={markNotificationReadAction}>
                        <input type="hidden" name="notification_id" value={item.id} />
                        <button
                          type="submit"
                          className="rounded-md bg-indigo-100 px-2 py-1 font-medium text-indigo-700"
                        >
                          Mark Read
                        </button>
                      </form>
                    ) : (
                      <span className="rounded-md bg-emerald-100 px-2 py-1 font-medium text-emerald-700">
                        Read
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
