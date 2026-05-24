export type UserRole = "client" | "freelancer" | "admin";

export type ProjectStatus =
  | "Open"
  | "Assigned"
  | "In Progress"
  | "Completed"
  | "Accepted";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
}
