import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register", "/forgot-password", "/privacy", "/terms"],
        disallow: [
          "/client",
          "/client/",
          "/freelancer",
          "/freelancer/",
          "/freelancers/",
          "/admin",
          "/admin/",
          "/account",
          "/account/",
          "/api/",
          "/auth/",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
