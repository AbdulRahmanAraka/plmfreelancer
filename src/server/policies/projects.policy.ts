import type { UserRole } from "@/types/domain";

export function canManageProject(role: UserRole) {
  return role === "admin" || role === "client";
}
