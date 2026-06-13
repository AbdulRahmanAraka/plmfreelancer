import { TrainingRequestForm } from "@/components/marketing/training-request-form";
import {
  ServiceFormSection,
  ServicePageHero,
} from "@/components/marketing/service-page-shell";

export const metadata = {
  title: "PLM Training | PLM Freelancer",
  description:
    "Connect with experienced trainers for corporate, team, or individual training programs across leading PLM technologies and business processes.",
};

export default function TrainingPage() {
  return (
    <>
      <ServicePageHero
        eyebrow="For Learning"
        title="PLM Training"
        description="Connect with experienced trainers for corporate, team, or individual training programs across leading PLM technologies and business processes."
      />

      <ServiceFormSection
        kicker="Training Request"
        title="Tell us about your training need"
      >
        <TrainingRequestForm />
      </ServiceFormSection>
    </>
  );
}
