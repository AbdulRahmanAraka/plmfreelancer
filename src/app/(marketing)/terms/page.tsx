import { Card } from "@/components/ui/card";
import { LEGAL } from "@/config/legal";

export const metadata = {
  title: "Terms of Service | PLM Freelancer Platform",
  description: "The rules governing use of the platform.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <Card
          title="Terms of Service"
          description={`Effective ${LEGAL.effectiveDate}. By using this platform you agree to these Terms.`}
        >
          <article className="prose prose-sm max-w-none text-slate-800 [&_h2]:mt-7 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-indigo-950 [&_h3]:mt-5 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-indigo-900 [&_p]:mt-2 [&_p]:leading-7 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
            <h2>1. Acceptance of terms</h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) form a binding agreement between you and
              {" "}{LEGAL.companyName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account
              or using the platform you accept these Terms. If you do not agree, do not use the
              platform.
            </p>

            <h2>2. The platform</h2>
            <p>
              We provide a marketplace where clients post PLM projects and freelancers apply,
              get assigned, and deliver work. We are an intermediary platform only and are not a
              party to any agreement, contract, or commercial relationship between clients and
              freelancers.
            </p>

            <h2>3. Account eligibility</h2>
            <ul>
              <li>You must be at least 18 years old.</li>
              <li>You must provide accurate, current information when creating an account.</li>
              <li>One account per person. Sharing accounts or creating duplicate accounts is not permitted.</li>
              <li>You are responsible for keeping your password confidential and for all activity under your account.</li>
            </ul>

            <h2>4. User responsibilities</h2>
            <h3>4.1 Clients</h3>
            <ul>
              <li>Provide accurate project requirements, deadlines, and budgets.</li>
              <li>Review applicants in good faith and communicate decisions promptly.</li>
              <li>Honor any commercial agreement reached with the freelancer outside the platform.</li>
            </ul>
            <h3>4.2 Freelancers</h3>
            <ul>
              <li>Apply only to projects you can reasonably deliver.</li>
              <li>Maintain accurate profile information about your skills and availability.</li>
              <li>Deliver assigned work on the agreed scope and timeline.</li>
            </ul>

            <h2>5. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Post unlawful, infringing, defamatory, harassing, or fraudulent content.</li>
              <li>Upload malware, viruses, or other harmful files.</li>
              <li>Scrape, reverse-engineer, or otherwise abuse the platform.</li>
              <li>Solicit users to circumvent the platform for the sole purpose of avoiding obligations created on the platform.</li>
              <li>Misrepresent your identity, credentials, or affiliation.</li>
            </ul>

            <h2>6. Content ownership</h2>
            <p>
              You retain ownership of the project files, descriptions, and other content you
              upload. By uploading content you grant us a limited, non-exclusive license to
              store, transmit, and display it solely to operate the platform and provide the
              service to you and your authorized counterparties (e.g., the assigned freelancer or
              client).
            </p>

            <h2>7. Payments and contracts</h2>
            <p>
              The platform currently does not process payments or escrow funds between clients
              and freelancers. Any payment, contract, invoice, or tax matter is the sole
              responsibility of the parties involved. We are not a party to any such transaction
              and accept no liability for payment disputes.
            </p>

            <h2>8. Disclaimers</h2>
            <ul>
              <li>The platform is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, express or implied.</li>
              <li>We do not warrant that the platform will be uninterrupted, error-free, or secure.</li>
              <li>We do not verify the credentials, skills, or character of any user. You are responsible for your own due diligence.</li>
            </ul>

            <h2>9. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, {LEGAL.companyName} and its affiliates,
              officers, employees, and contractors will not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of profits, revenue, data,
              or goodwill arising from your use of the platform. Our total cumulative liability
              for any claim arising out of these Terms will not exceed the amount you paid us in
              the 12 months prior to the claim, or INR 1,000, whichever is greater.
            </p>

            <h2>10. Indemnity</h2>
            <p>
              You agree to indemnify and hold harmless {LEGAL.companyName} from any claim, loss,
              or expense (including reasonable legal fees) arising from your use of the platform,
              your breach of these Terms, or any agreement or dispute with another user.
            </p>

            <h2>11. Termination</h2>
            <p>
              We may suspend or terminate your account at any time for breach of these Terms,
              suspected fraud or abuse, or to comply with legal obligations. You may close your
              account at any time by contacting {LEGAL.contactEmail}.
            </p>

            <h2>12. Changes to these Terms</h2>
            <p>
              We may update these Terms occasionally. Material changes will be announced in the
              dashboard or via email. Continued use of the platform after changes constitutes
              acceptance of the updated Terms.
            </p>

            <h2>13. Governing law and disputes</h2>
            <p>
              These Terms are governed by the laws of India. Any dispute arising under or in
              connection with these Terms will be subject to the exclusive jurisdiction of{" "}
              {LEGAL.jurisdiction}.
            </p>

            <h2>14. Contact</h2>
            <p>
              {LEGAL.companyName}
              <br />
              {LEGAL.contactAddress}
              <br />
              Email: {LEGAL.contactEmail}
            </p>
          </article>
        </Card>
    </main>
  );
}
