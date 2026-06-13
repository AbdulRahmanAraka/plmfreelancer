import { ResourceRequestForm } from "@/components/marketing/resource-request-form";
import {
  ServiceFormSection,
  ServicePageHero,
} from "@/components/marketing/service-page-shell";

export const metadata = {
  title: "Hire PLM Resources | PLM Freelancer",
  description:
    "Connect with experienced PLM professionals for short-term, long-term, contract, or project-based engagements across Teamcenter, Windchill, ENOVIA, Aras Innovator, and other PLM platforms.",
};

export default function HireResourcesPage() {
  return (
    <>
      <ServicePageHero
        eyebrow="For Clients"
        title="Hire PLM Resources"
        description="Connect with experienced PLM professionals for short-term, long-term, contract, or project-based engagements across Teamcenter, Windchill, ENOVIA, Aras Innovator, and other PLM platforms."
      />

      <ServiceFormSection
        kicker="Resource Request"
        title="Tell us what you need"
      >
        <ResourceRequestForm />
      </ServiceFormSection>
    </>
  );
}
