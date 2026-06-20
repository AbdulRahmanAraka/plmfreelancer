"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentUserId, requireRole } from "@/lib/auth/session";
import { sendUserEmail } from "@/server/services/email.service";
import { getFreelancerProfileStatus } from "@/server/services/freelancer-profile-status.service";
import { env } from "@/lib/env";
import { normalizePhone } from "@/lib/utils";

/**
 * Return the user_id whose stored phone normalizes to the same digit-only
 * sequence as `phone`, or null if no match. Calls a Postgres helper so the
 * comparison matches the unique index on the column.
 */
async function findProfileIdByNormalizedPhone(
  admin: ReturnType<typeof createSupabaseAdminClient>,
  phone: string,
): Promise<string | null> {
  if (!normalizePhone(phone)) return null;
  // Custom RPC; admin client lacks generated Database types, so the args
  // param is inferred as undefined. Safe to assert until types are generated.
  // @ts-expect-error -- TODO: generate Supabase types and drop this directive
  const { data } = await admin.rpc("find_profile_id_by_phone", { p: phone });
  return typeof data === "string" ? data : null;
}

function asText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function asNumberOrNull(value: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseSkillsFromForm(formData: FormData): string[] {
  return [
    ...new Set(
      formData
        .getAll("skills")
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .filter(Boolean),
    ),
  ];
}

function asIntegerOrNull(value: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function splitCsv(value: string) {
  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}

function sanitizeAttachmentPath(path: string, ownerId: string): string | null {
  if (!path) return null;
  if (path.includes("..") || path.startsWith("/")) return null;
  if (!path.startsWith(`${ownerId}/`)) return null;
  return path;
}

type NotificationKind =
  | "project_applied"
  | "project_assigned"
  | "status_updated"
  | "project_completed"
  | "project_accepted"
  | "enhancement_requested"
  | "system";

const CTA_BY_KIND: Record<NotificationKind, { label: string; path: string }> = {
  project_applied: { label: "Review applicants", path: "/admin" },
  project_assigned: { label: "Open your dashboard", path: "/freelancer" },
  status_updated: { label: "Open your dashboard", path: "/client" },
  project_completed: { label: "Review delivery", path: "/client" },
  project_accepted: { label: "Open your dashboard", path: "/freelancer" },
  enhancement_requested: { label: "View revision thread", path: "/freelancer" },
  system: { label: "Open your dashboard", path: "/" },
};

async function createNotification(input: {
  recipientId: string;
  actorId?: string;
  projectId?: number;
  kind: NotificationKind;
  title: string;
  message: string;
  emailCta?: { label: string; path: string };
}) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("notifications").insert({
    recipient_id: input.recipientId,
    actor_id: input.actorId ?? null,
    project_id: input.projectId ?? null,
    kind: input.kind,
    title: input.title,
    message: input.message,
  });

  // Skip email when the actor notifies themselves (e.g. creator of a project,
  // freelancer toggling their own status). The in-app row above is enough
  // and email would be pure noise / wasted quota.
  if (input.actorId && input.actorId === input.recipientId) {
    return;
  }

  const cta = input.emailCta ?? CTA_BY_KIND[input.kind];
  const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  await sendUserEmail(input.recipientId, {
    subject: input.title,
    heading: input.title,
    body: input.message,
    ctaLabel: cta?.label,
    ctaUrl: cta ? `${baseUrl}${cta.path}` : undefined,
  });
}

export async function createProjectAction(formData: FormData) {
  await requireRole(["client", "admin"]);
  const clientId = await getCurrentUserId();
  const supabase = await createSupabaseServerClient();

  const title = asText(formData, "title");
  const description = asText(formData, "description");
  const budgetType = asText(formData, "budget_type");
  const budgetCurrency = "USD";
  const budgetMin = asNumberOrNull(asText(formData, "budget_min"));
  const budgetMax = asNumberOrNull(asText(formData, "budget_max"));
  const deadline = asText(formData, "deadline");
  const submittedPath = asText(formData, "attachment_path");
  const skills = parseSkillsFromForm(formData);

  if (!title || !description) {
    redirect("/client?error=Title+and+description+are+required");
  }

  if (skills.length === 0) {
    redirect("/client?error=Please+select+at+least+one+required+skill");
  }

  if (!budgetType || !["hourly", "fixed"].includes(budgetType)) {
    redirect("/client?error=Please+select+a+budget+type");
  }

  if (budgetMin === null || budgetMax === null) {
    redirect("/client?error=Please+enter+both+min+and+max+budget");
  }

  if (budgetMin > budgetMax) {
    redirect("/client?error=Min+budget+cannot+be+greater+than+max+budget");
  }

  if (!deadline) {
    redirect("/client?error=Please+pick+a+deadline");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const attachmentPath = sanitizeAttachmentPath(submittedPath, clientId);
  if (submittedPath && !attachmentPath) {
    redirect("/client?error=Invalid+attachment+path");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      client_id: clientId,
      title,
      description,
      budget_type: budgetType,
      budget_currency: budgetCurrency,
      budget_min: budgetMin,
      budget_max: budgetMax,
      deadline,
      contact_name: user?.user_metadata?.full_name ?? "Client",
      contact_email: user?.email ?? "",
      attachment_path: attachmentPath,
      status: "open",
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/client?error=${encodeURIComponent(error.message)}`);
  }

  if (data?.id) {
    const { error: skillsError } = await supabase
      .from("project_skills")
      .insert(skills.map((skill) => ({ project_id: data.id, skill })));

    if (skillsError) {
      redirect(`/client?error=${encodeURIComponent(skillsError.message)}`);
    }
  }

  await createNotification({
    recipientId: clientId,
    actorId: clientId,
    projectId: data?.id,
    kind: "system",
    title: "Project Created",
    message: `Project "${title}" was created successfully.`,
  });

  revalidatePath("/client");
  revalidatePath("/freelancer");
}

export async function updateProjectAction(formData: FormData) {
  await requireRole(["client", "admin"]);
  const supabase = await createSupabaseServerClient();
  const clientId = await getCurrentUserId();

  const projectId = Number(asText(formData, "project_id"));
  const title = asText(formData, "title");
  const description = asText(formData, "description");
  const budgetCurrency = "USD";
  const budgetMin = asNumberOrNull(asText(formData, "budget_min"));
  const budgetMax = asNumberOrNull(asText(formData, "budget_max"));
  const deadline = asText(formData, "deadline");
  const submittedPath = asText(formData, "attachment_path");

  if (!projectId || !title || !description) {
    redirect("/client?error=Project+update+payload+is+invalid");
  }

  if (budgetMin === null || budgetMax === null) {
    redirect("/client?error=Please+enter+both+min+and+max+budget");
  }

  if (budgetMin > budgetMax) {
    redirect("/client?error=Min+budget+cannot+be+greater+than+max+budget");
  }

  if (!deadline) {
    redirect("/client?error=Please+pick+a+deadline");
  }

  const updatePayload: {
    title: string;
    description: string;
    budget_currency: string;
    budget_min: number;
    budget_max: number;
    deadline: string;
    attachment_path?: string;
  } = {
    title,
    description,
    budget_currency: budgetCurrency,
    budget_min: budgetMin,
    budget_max: budgetMax,
    deadline,
  };

  if (submittedPath) {
    const sanitized = sanitizeAttachmentPath(submittedPath, clientId);
    if (!sanitized) {
      redirect("/client?error=Invalid+attachment+path");
    }
    updatePayload.attachment_path = sanitized;
  }

  const { error } = await supabase.from("projects").update(updatePayload).eq("id", projectId);
  if (error) {
    redirect(`/client?error=${encodeURIComponent(error.message)}`);
  }

  await createNotification({
    recipientId: clientId,
    actorId: clientId,
    projectId,
    kind: "system",
    title: "Project Updated",
    message: `Project "${title}" was updated.`,
  });

  revalidatePath("/client");
  revalidatePath("/freelancer");
}

export async function deleteProjectAction(formData: FormData) {
  const role = await requireRole(["client", "admin"]);
  const supabase = await createSupabaseServerClient();
  const clientId = await getCurrentUserId();
  const projectId = Number(asText(formData, "project_id"));
  const returnTo = asText(formData, "return_to");

  if (!projectId) {
    redirect(role === "admin" ? "/admin?error=Project+selection+is+invalid" : "/client?error=Project+selection+is+invalid");
  }

  const { data: project } = await supabase
    .from("projects")
    .select("title")
    .eq("id", projectId)
    .single();

  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) {
    const base = role === "admin" ? "/admin" : "/client";
    redirect(`${base}?error=${encodeURIComponent(error.message)}`);
  }

  await createNotification({
    recipientId: clientId,
    actorId: clientId,
    projectId,
    kind: "system",
    title: "Project Deleted",
    message: `Project "${project?.title ?? `#${projectId}`}" was deleted.`,
  });

  revalidatePath("/client");
  revalidatePath("/freelancer");
  revalidatePath("/admin");
  revalidatePath(`/projects/${projectId}`);

  if (returnTo.startsWith("/")) {
    redirect(returnTo);
  }
  redirect(role === "admin" ? "/admin" : "/client");
}

export async function applyToProjectAction(formData: FormData) {
  await requireRole(["freelancer", "admin"]);
  const freelancerId = await getCurrentUserId();
  const supabase = await createSupabaseServerClient();

  const projectId = Number(asText(formData, "project_id"));
  const coverLetter = asText(formData, "cover_letter");

  if (!projectId) {
    redirect("/freelancer?error=Project+selection+is+invalid");
  }

  const status = await getFreelancerProfileStatus(freelancerId);
  if (!status.isComplete) {
    redirect(
      "/freelancer?error=Please+complete+your+profile+before+applying+to+projects",
    );
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id, title")
    .eq("id", projectId)
    .single();

  const { error } = await supabase.from("project_applications").insert({
    project_id: projectId,
    freelancer_id: freelancerId,
    cover_letter: coverLetter || null,
    status: "applied",
  });

  if (error) {
    redirect(`/freelancer?error=${encodeURIComponent(error.message)}`);
  }

  const { data: freelancerProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("user_id", freelancerId)
    .single();
  const freelancerName = freelancerProfile?.full_name?.trim() || "A freelancer";

  const adminClient = createSupabaseAdminClient();
  const { data: admins } = await adminClient
    .from("profiles")
    .select("user_id")
    .eq("role", "admin")
    .eq("is_active", true);

  for (const adminProfile of (admins ?? []) as Array<{ user_id: string }>) {
    await createNotification({
      recipientId: adminProfile.user_id,
      actorId: freelancerId,
      projectId,
      kind: "project_applied",
      title: "New Freelancer Application",
      message: `${freelancerName} applied for "${project?.title ?? `Project #${projectId}`}".`,
    });
  }

  revalidatePath("/freelancer");
  revalidatePath("/admin");
}

export async function updateFreelancerProjectStatusAction(formData: FormData) {
  await requireRole(["freelancer", "admin"]);
  const supabase = await createSupabaseServerClient();
  const freelancerId = await getCurrentUserId();
  const projectId = Number(asText(formData, "project_id"));
  const status = asText(formData, "status");

  if (!projectId || !["in_progress", "completed"].includes(status)) {
    redirect("/freelancer?error=Status+update+payload+is+invalid");
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id, title, client_id")
    .eq("id", projectId)
    .single();

  const { error: projectError } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", projectId)
    .eq("assigned_freelancer_id", freelancerId);

  if (projectError) {
    redirect(`/freelancer?error=${encodeURIComponent(projectError.message)}`);
  }

  const appStatus = status === "completed" ? "completed" : "assigned";
  await supabase
    .from("project_applications")
    .update({ status: appStatus })
    .eq("project_id", projectId)
    .eq("freelancer_id", freelancerId);

  if (project?.client_id) {
    await createNotification({
      recipientId: project.client_id,
      actorId: freelancerId,
      projectId,
      kind: status === "completed" ? "project_completed" : "status_updated",
      title: status === "completed" ? "Project Completed" : "Project In Progress",
      message:
        status === "completed"
          ? `Freelancer marked "${project.title}" as completed.`
          : `Freelancer started working on "${project.title}".`,
    });
  }

  await createNotification({
    recipientId: freelancerId,
    actorId: freelancerId,
    projectId,
    kind: "status_updated",
    title: "Status Updated",
    message: `Project "${project?.title ?? `#${projectId}`}" is now ${status.replace("_", " ")}.`,
  });

  revalidatePath("/freelancer");
  revalidatePath("/client");
  revalidatePath("/admin");
}

export async function adminAssignProjectToFreelancerAction(formData: FormData) {
  await requireRole(["admin"]);
  const adminId = await getCurrentUserId();
  const adminClient = createSupabaseAdminClient();

  const projectId = Number(asText(formData, "project_id"));
  const freelancerId = asText(formData, "freelancer_id");

  if (!projectId || !freelancerId) {
    redirect("/admin?error=Assignment+payload+is+invalid");
  }

  const { data: freelancerProfile, error: freelancerLookupError } = await adminClient
    .from("freelancer_profiles")
    .select("user_id")
    .eq("user_id", freelancerId)
    .maybeSingle();

  if (freelancerLookupError) {
    redirect(`/admin?error=${encodeURIComponent(freelancerLookupError.message)}`);
  }
  if (!freelancerProfile) {
    redirect("/admin?error=Selected+user+is+not+a+freelancer");
  }

  // Idempotency guard: if the project is already assigned to this freelancer,
  // skip the update + notifications. Prevents duplicate email storms when the
  // admin re-submits the form or clicks Assign multiple times.
  const { data: currentProject } = await adminClient
    .from("projects")
    .select("assigned_freelancer_id")
    .eq("id", projectId)
    .single();

  if (currentProject?.assigned_freelancer_id === freelancerId) {
    revalidatePath("/admin");
    revalidatePath("/freelancer");
    revalidatePath("/client");
    redirect("/admin?error=Project+is+already+assigned+to+this+freelancer");
  }

  const { error: projectError } = await adminClient
    .from("projects")
    .update({
      assigned_freelancer_id: freelancerId,
      status: "assigned",
    })
    .eq("id", projectId);

  if (projectError) {
    redirect(`/admin?error=${encodeURIComponent(projectError.message)}`);
  }

  const { error: appError } = await adminClient
    .from("project_applications")
    .upsert(
      {
        project_id: projectId,
        freelancer_id: freelancerId,
        status: "assigned",
      },
      { onConflict: "project_id,freelancer_id" },
    );

  if (appError) {
    redirect(`/admin?error=${encodeURIComponent(appError.message)}`);
  }

  const { data: project } = await adminClient
    .from("projects")
    .select("title, client_id")
    .eq("id", projectId)
    .single();

  await createNotification({
    recipientId: freelancerId,
    actorId: adminId,
    projectId,
    kind: "project_assigned",
    title: "Project Assigned",
    message: `You were assigned to "${project?.title ?? `Project #${projectId}`}".`,
  });

  if (project?.client_id) {
    await createNotification({
      recipientId: project.client_id,
      actorId: adminId,
      projectId,
      kind: "project_assigned",
      title: "Freelancer Assigned",
      message: `A freelancer has been assigned to "${project.title}".`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/freelancer");
  revalidatePath("/client");
}

export async function adminUnassignProjectAction(formData: FormData) {
  await requireRole(["admin"]);
  const adminId = await getCurrentUserId();
  const adminClient = createSupabaseAdminClient();

  const projectId = Number(asText(formData, "project_id"));

  if (!projectId) {
    redirect("/admin?error=Project+selection+is+invalid");
  }

  const { data: project, error: lookupError } = await adminClient
    .from("projects")
    .select("title, client_id, assigned_freelancer_id, status")
    .eq("id", projectId)
    .single();

  if (lookupError) {
    redirect(`/admin?error=${encodeURIComponent(lookupError.message)}`);
  }

  if (!project?.assigned_freelancer_id) {
    redirect("/admin?error=Project+is+not+assigned");
  }

  if (project.status === "accepted") {
    redirect("/admin?error=Cannot+cancel+an+accepted+project");
  }

  const previousFreelancerId = project.assigned_freelancer_id;

  const { error: projectError } = await adminClient
    .from("projects")
    .update({
      assigned_freelancer_id: null,
      status: "open",
      client_decision: "pending",
      closed_at: null,
    })
    .eq("id", projectId);

  if (projectError) {
    redirect(`/admin?error=${encodeURIComponent(projectError.message)}`);
  }

  await adminClient
    .from("project_applications")
    .update({ status: "applied" })
    .eq("project_id", projectId)
    .eq("freelancer_id", previousFreelancerId);

  await createNotification({
    recipientId: previousFreelancerId,
    actorId: adminId,
    projectId,
    kind: "system",
    title: "Assignment Cancelled",
    message: `Your assignment to "${project.title}" was cancelled by admin.`,
  });

  if (project.client_id) {
    await createNotification({
      recipientId: project.client_id,
      actorId: adminId,
      projectId,
      kind: "system",
      title: "Freelancer Unassigned",
      message: `The assigned freelancer for "${project.title}" was removed. The project is open again.`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/freelancer");
  revalidatePath("/client");
}

export async function assignFreelancerAction(formData: FormData) {
  await requireRole(["admin"]);
  const adminId = await getCurrentUserId();
  const supabase = await createSupabaseServerClient();

  const projectId = Number(asText(formData, "project_id"));
  const freelancerId = asText(formData, "freelancer_id");
  const applicationId = Number(asText(formData, "application_id"));

  if (!projectId || !freelancerId || !applicationId) {
    redirect("/admin?error=Assignment+payload+is+invalid");
  }

  // Idempotency guard (see adminAssignProjectToFreelancerAction for rationale).
  const { data: currentProject } = await supabase
    .from("projects")
    .select("assigned_freelancer_id")
    .eq("id", projectId)
    .single();

  if (currentProject?.assigned_freelancer_id === freelancerId) {
    revalidatePath("/admin");
    revalidatePath("/freelancer");
    revalidatePath("/client");
    redirect("/admin?error=Project+is+already+assigned+to+this+freelancer");
  }

  const { error: projectError } = await supabase
    .from("projects")
    .update({
      assigned_freelancer_id: freelancerId,
      status: "assigned",
    })
    .eq("id", projectId);

  if (projectError) {
    redirect(`/admin?error=${encodeURIComponent(projectError.message)}`);
  }

  const { error: appError } = await supabase
    .from("project_applications")
    .update({ status: "assigned" })
    .eq("id", applicationId);

  if (appError) {
    redirect(`/admin?error=${encodeURIComponent(appError.message)}`);
  }

  const { data: project } = await supabase
    .from("projects")
    .select("title, client_id")
    .eq("id", projectId)
    .single();

  await createNotification({
    recipientId: freelancerId,
    actorId: adminId,
    projectId,
    kind: "project_assigned",
    title: "Project Assigned",
    message: `You were assigned to "${project?.title ?? `Project #${projectId}`}".`,
  });

  if (project?.client_id) {
    await createNotification({
      recipientId: project.client_id,
      actorId: adminId,
      projectId,
      kind: "project_assigned",
      title: "Freelancer Assigned",
      message: `A freelancer has been assigned to "${project.title}".`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/freelancer");
  revalidatePath("/client");
}

export async function clientDecisionAction(formData: FormData) {
  await requireRole(["client", "admin"]);
  const supabase = await createSupabaseServerClient();
  const clientId = await getCurrentUserId();
  const projectId = Number(asText(formData, "project_id"));
  const decision = asText(formData, "decision");
  const description = asText(formData, "description");

  if (!projectId || !["accepted", "enhancement_requested"].includes(decision)) {
    redirect("/client?error=Decision+payload+is+invalid");
  }

  if (decision === "enhancement_requested" && !description) {
    redirect("/client?error=Please+describe+the+changes+you+need");
  }

  const { data: project } = await supabase
    .from("projects")
    .select("title, assigned_freelancer_id")
    .eq("id", projectId)
    .single();

  const nextStatus = decision === "accepted" ? "accepted" : "enhancement_requested";
  const { error } = await supabase
    .from("projects")
    .update({
      status: nextStatus,
      client_decision: decision,
      closed_at: decision === "accepted" ? new Date().toISOString() : null,
    })
    .eq("id", projectId)
    .eq("client_id", clientId);

  if (error) {
    redirect(`/client?error=${encodeURIComponent(error.message)}`);
  }

  if (decision === "accepted" && project?.assigned_freelancer_id) {
    await supabase
      .from("project_applications")
      .update({ status: "accepted" })
      .eq("project_id", projectId)
      .eq("freelancer_id", project.assigned_freelancer_id);
  }

  if (decision === "enhancement_requested") {
    const { error: threadError } = await supabase.from("project_enhancements").insert({
      project_id: projectId,
      client_id: clientId,
      author_id: clientId,
      kind: "request",
      description,
    });
    if (threadError) {
      redirect(`/client?error=${encodeURIComponent(threadError.message)}`);
    }
  }

  if (project?.assigned_freelancer_id) {
    await createNotification({
      recipientId: project.assigned_freelancer_id,
      actorId: clientId,
      projectId,
      kind: decision === "accepted" ? "project_accepted" : "enhancement_requested",
      title: decision === "accepted" ? "Work Accepted" : "Enhancement Requested",
      message:
        decision === "accepted"
          ? `Client accepted delivery for "${project.title}".`
          : `Client requested enhancements for "${project.title}".`,
    });
  }

  revalidatePath("/client");
  revalidatePath("/freelancer");
  revalidatePath("/admin");
}

export async function addEnhancementMessageAction(formData: FormData) {
  await requireRole(["client", "freelancer", "admin"]);
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();
  const projectId = Number(asText(formData, "project_id"));
  const description = asText(formData, "description");
  const returnTo = asText(formData, "return_to") || "/client";

  if (!projectId || !description) {
    redirect(`${returnTo}?error=${encodeURIComponent("Message cannot be empty")}`);
  }

  const { data: project } = await supabase
    .from("projects")
    .select("title, client_id, assigned_freelancer_id")
    .eq("id", projectId)
    .single();

  if (!project) {
    redirect(`${returnTo}?error=Project+not+found`);
  }

  const isClient = project.client_id === userId;
  const isFreelancer = project.assigned_freelancer_id === userId;

  if (!isClient && !isFreelancer) {
    redirect(`${returnTo}?error=Not+authorized+for+this+thread`);
  }

  const { error: threadError } = await supabase.from("project_enhancements").insert({
    project_id: projectId,
    client_id: isClient ? userId : null,
    author_id: userId,
    kind: "reply",
    description,
  });

  if (threadError) {
    redirect(`${returnTo}?error=${encodeURIComponent(threadError.message)}`);
  }

  const recipientId = isClient ? project.assigned_freelancer_id : project.client_id;
  if (recipientId) {
    await createNotification({
      recipientId,
      actorId: userId,
      projectId,
      kind: "system",
      title: "New message on enhancement thread",
      message: `New note on "${project.title}".`,
    });
  }

  revalidatePath("/client");
  revalidatePath("/freelancer");
}

export async function freelancerResubmitAction(formData: FormData) {
  await requireRole(["freelancer", "admin"]);
  const supabase = await createSupabaseServerClient();
  const freelancerId = await getCurrentUserId();
  const projectId = Number(asText(formData, "project_id"));
  const description = asText(formData, "description");

  if (!projectId) {
    redirect("/freelancer?error=Invalid+project");
  }

  const { data: project } = await supabase
    .from("projects")
    .select("title, client_id, assigned_freelancer_id, status")
    .eq("id", projectId)
    .single();

  if (!project || project.assigned_freelancer_id !== freelancerId) {
    redirect("/freelancer?error=Not+authorized+for+this+project");
  }

  if (description) {
    const { error: threadError } = await supabase.from("project_enhancements").insert({
      project_id: projectId,
      client_id: null,
      author_id: freelancerId,
      kind: "resubmit",
      description,
    });
    if (threadError) {
      redirect(`/freelancer?error=${encodeURIComponent(threadError.message)}`);
    }
  }

  const { error: statusError } = await supabase
    .from("projects")
    .update({ status: "completed", client_decision: null })
    .eq("id", projectId)
    .eq("assigned_freelancer_id", freelancerId);

  if (statusError) {
    redirect(`/freelancer?error=${encodeURIComponent(statusError.message)}`);
  }

  if (project.client_id) {
    await createNotification({
      recipientId: project.client_id,
      actorId: freelancerId,
      projectId,
      kind: "project_completed",
      title: "Revisions delivered",
      message: `Freelancer re-submitted "${project.title}" for review.`,
    });
  }

  revalidatePath("/client");
  revalidatePath("/freelancer");
}

export async function updateClientProfileAction(formData: FormData) {
  await requireRole(["client", "admin"]);
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  const fullName = asText(formData, "full_name");
  const phone = asText(formData, "phone");
  const companyName = asText(formData, "company_name");
  const address = asText(formData, "address");

  if (!fullName || !phone || !companyName || !address) {
    redirect("/client/profile?error=Please+fill+all+required+fields");
  }

  const adminClient = createSupabaseAdminClient();
  const phoneOwnerId = await findProfileIdByNormalizedPhone(adminClient, phone);

  if (phoneOwnerId && phoneOwnerId !== userId) {
    redirect("/client/profile?error=This+phone+number+is+already+used+by+another+account");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone })
    .eq("user_id", userId);

  if (profileError) {
    const msg = profileError.message.toLowerCase();
    if (
      msg.includes("profiles_phone_key") ||
      msg.includes("phone_normalized") ||
      msg.includes("phone")
    ) {
      redirect("/client/profile?error=This+phone+number+is+already+used+by+another+account");
    }
    redirect(`/client/profile?error=${encodeURIComponent(profileError.message)}`);
  }

  const { error: clientError } = await supabase.from("client_profiles").upsert({
    user_id: userId,
    company_name: companyName,
    address,
  });

  if (clientError) {
    redirect(`/client/profile?error=${encodeURIComponent(clientError.message)}`);
  }

  revalidatePath("/client");
  revalidatePath("/client/profile");
  redirect("/client/profile?message=Profile+saved+successfully");
}

export async function updateFreelancerProfileAction(formData: FormData) {
  try {
  await requireRole(["freelancer", "admin"]);
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  const fullName = asText(formData, "full_name");
  const phone = asText(formData, "phone");
  const country = asText(formData, "country");
  const state = asText(formData, "state");
  const hourlyRate = asNumberOrNull(asText(formData, "hourly_rate"));
  const experienceYears = asIntegerOrNull(asText(formData, "experience_years"));
  const experienceMonths = asIntegerOrNull(asText(formData, "experience_months"));
  const professionalTitle = asText(formData, "professional_title");
  const introduction = asText(formData, "introduction");
  const availability = asText(formData, "availability");
  const lookingForFullTimeJob = asText(formData, "looking_for_full_time_job");
  const lookingForJob = lookingForFullTimeJob === "yes";
  const noticePeriod = lookingForJob ? asText(formData, "notice_period") : "";
  const portfolioUrl = asText(formData, "portfolio_url");
  const profileImage = formData.get("profile_image");
  const checkboxSkills = formData
    .getAll("skills")
    .filter((item): item is string => typeof item === "string");
  const checkboxSoftware = formData
    .getAll("software")
    .filter((item): item is string => typeof item === "string");

  const skills =
    checkboxSkills.length > 0 ? [...new Set(checkboxSkills.map((s) => s.trim()).filter(Boolean))] : splitCsv(asText(formData, "skills_csv"));
  const software =
    checkboxSoftware.length > 0 ? [...new Set(checkboxSoftware.map((s) => s.trim()).filter(Boolean))] : splitCsv(asText(formData, "software_csv"));

  if (
    !fullName ||
    !phone ||
    !country ||
    !professionalTitle ||
    experienceYears === null ||
    hourlyRate === null ||
    !availability
  ) {
    redirect("/freelancer/profile?error=Please+fill+all+required+fields");
  }

  if (!["Full time", "Part time"].includes(availability)) {
    redirect("/freelancer/profile?error=Availability+must+be+Full+time+or+Part+time");
  }

  if (!["yes", "no"].includes(lookingForFullTimeJob)) {
    redirect("/freelancer/profile?error=Please+answer+whether+you+are+looking+for+a+full-time+job");
  }

  if (lookingForJob && !noticePeriod) {
    redirect("/freelancer/profile?error=Please+enter+your+notice+period");
  }

  if (skills.length === 0) {
    redirect("/freelancer/profile?error=Please+select+at+least+one+skill");
  }

  if (software.length === 0) {
    redirect("/freelancer/profile?error=Please+select+at+least+one+software");
  }

  const adminClient = createSupabaseAdminClient();
  const phoneOwnerId = await findProfileIdByNormalizedPhone(adminClient, phone);

  if (phoneOwnerId && phoneOwnerId !== userId) {
    redirect("/freelancer/profile?error=This+phone+number+is+already+used+by+another+account");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone })
    .eq("user_id", userId);
  if (profileError) {
    const msg = profileError.message.toLowerCase();
    if (
      msg.includes("profiles_phone_key") ||
      msg.includes("phone_normalized") ||
      msg.includes("phone")
    ) {
      redirect("/freelancer/profile?error=This+phone+number+is+already+used+by+another+account");
    }
    redirect(`/freelancer/profile?error=${encodeURIComponent(profileError.message)}`);
  }

  const { error: freelancerError } = await supabase.from("freelancer_profiles").upsert({
    user_id: userId,
    country,
    state: state || null,
    hourly_rate: hourlyRate,
    plm_experience_years: experienceYears,
    plm_experience_months: experienceMonths,
    professional_title: professionalTitle,
    introduction: introduction || null,
    availability,
    looking_for_job: lookingForJob,
    notice_period: lookingForJob ? noticePeriod : null,
    portfolio_url: portfolioUrl || null,
  });
  if (freelancerError) {
    redirect(`/freelancer/profile?error=${encodeURIComponent(freelancerError.message)}`);
  }

  await supabase.from("freelancer_skills").delete().eq("freelancer_id", userId);
  await supabase.from("freelancer_software").delete().eq("freelancer_id", userId);

  if (skills.length > 0) {
    const { error: skillError } = await supabase
      .from("freelancer_skills")
      .insert(skills.map((skill) => ({ freelancer_id: userId, skill })));
    if (skillError) {
      redirect(`/freelancer/profile?error=${encodeURIComponent(skillError.message)}`);
    }
  }

  if (software.length > 0) {
    const { error: softwareError } = await supabase
      .from("freelancer_software")
      .insert(software.map((tool) => ({ freelancer_id: userId, software: tool })));
    if (softwareError) {
      redirect(`/freelancer/profile?error=${encodeURIComponent(softwareError.message)}`);
    }
  }

  if (profileImage instanceof File && profileImage.size > 0) {
    const maxImageBytes = 3 * 1024 * 1024;
    if (profileImage.size > maxImageBytes) {
      redirect("/freelancer/profile?error=Profile+picture+must+be+3+MB+or+smaller");
    }
    const safeName = profileImage.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uploadPath = `${userId}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from("freelancer-profiles")
      .upload(uploadPath, profileImage, { upsert: false });

    if (uploadError) {
      redirect(`/freelancer/profile?error=${encodeURIComponent(uploadError.message)}`);
    }

    const { error: imagePathError } = await supabase
      .from("freelancer_profiles")
      .update({ profile_image_path: uploadPath })
      .eq("user_id", userId);

    if (imagePathError) {
      redirect(`/freelancer/profile?error=${encodeURIComponent(imagePathError.message)}`);
    }
  }

  revalidatePath("/freelancer");
  revalidatePath("/freelancer/profile");
  redirect("/freelancer/profile?message=Profile+saved+successfully");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message =
      error instanceof Error ? error.message : "Something went wrong while saving your profile";
    redirect(`/freelancer/profile?error=${encodeURIComponent(message)}`);
  }
}

export async function markNotificationReadAction(formData: FormData) {
  await requireRole(["client", "freelancer", "admin"]);
  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();
  const notificationId = Number(asText(formData, "notification_id"));

  if (!notificationId) return;

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("recipient_id", userId);

  revalidatePath("/client");
  revalidatePath("/freelancer");
  revalidatePath("/admin");
}
