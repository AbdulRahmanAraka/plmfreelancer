import { VendorRequestForm } from "@/components/marketing/vendor-request-form";
import {
  ServiceFormSection,
  ServicePageHero,
} from "@/components/marketing/service-page-shell";

export const metadata = {
  title: "Find PLM Vendors | PLM Freelancer",
  description:
    "Find trusted PLM vendors and implementation partners for customization, migration, integration, support, upgrades, and end-to-end project delivery.",
};

export default function FindVendorsPage() {
  return (
    <>
      <ServicePageHero
        eyebrow="For Clients"
        title="Find PLM Vendors"
        description="Find trusted PLM vendors and implementation partners for customization, migration, integration, support, upgrades, and end-to-end project delivery."
      />

      <ServiceFormSection
        kicker="Vendor Request"
        title="Share your project requirement"
      >
        <VendorRequestForm />
      </ServiceFormSection>
    </>
  );
}
