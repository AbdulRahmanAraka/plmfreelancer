import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FreelancerIntro } from "@/components/freelancer/freelancer-intro-card";

export async function loadFreelancerIntros(
  freelancerIds: string[],
): Promise<Map<string, FreelancerIntro>> {
  const result = new Map<string, FreelancerIntro>();
  const uniqueIds = [...new Set(freelancerIds.filter(Boolean))];
  if (uniqueIds.length === 0) {
    return result;
  }

  const supabase = await createSupabaseServerClient();

  const [{ data: profiles }, { data: freelancerProfiles }] = await Promise.all([
    supabase.from("profiles").select("user_id, full_name").in("user_id", uniqueIds),
    supabase
      .from("freelancer_profiles")
      .select("user_id, professional_title, introduction, profile_image_path")
      .in("user_id", uniqueIds),
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.user_id as string, p]));
  const freelancerMap = new Map(
    (freelancerProfiles ?? []).map((p) => [p.user_id as string, p]),
  );

  const imagePaths = (freelancerProfiles ?? [])
    .filter((p) => Boolean(p.profile_image_path))
    .map((p) => [p.user_id as string, p.profile_image_path as string] as const);

  const signedEntries = await Promise.all(
    imagePaths.map(async ([userId, path]) => {
      const { data } = await supabase.storage
        .from("freelancer-profiles")
        .createSignedUrl(path, 60 * 60);
      return [userId, data?.signedUrl ?? null] as const;
    }),
  );
  const signedImageMap = new Map<string, string>(
    signedEntries.filter((entry): entry is readonly [string, string] => Boolean(entry[1])),
  );

  for (const userId of uniqueIds) {
    const base = profileMap.get(userId);
    const freelancer = freelancerMap.get(userId);
    result.set(userId, {
      userId,
      fullName: base?.full_name ?? "",
      professionalTitle: freelancer?.professional_title ?? null,
      introduction: freelancer?.introduction ?? null,
      profileImageUrl: signedImageMap.get(userId) ?? null,
    });
  }

  return result;
}
