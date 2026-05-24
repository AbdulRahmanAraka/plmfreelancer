import { Card } from "@/components/ui/card";
import { LEGAL } from "@/config/legal";

export const metadata = {
  title: "Privacy Policy | PLM Freelancer Platform",
  description: "How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <Card
          title="Privacy Policy"
          description={`Effective ${LEGAL.effectiveDate}. We respect your privacy. This policy explains what we collect, why, and how to control it.`}
        >
          <article className="prose prose-sm max-w-none text-slate-800 [&_h2]:mt-7 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-indigo-950 [&_h3]:mt-5 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-indigo-900 [&_p]:mt-2 [&_p]:leading-7 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
            <h2>1. Who we are</h2>
            <p>
              {LEGAL.companyName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates a
              freelance marketplace connecting clients with PLM (Product Lifecycle Management)
              specialists. This Privacy Policy applies to our website, web application, and
              related services.
            </p>

            <h2>2. Information we collect</h2>
            <h3>2.1 Information you provide</h3>
            <ul>
              <li>Account details: full name, email address, phone number, role (client or freelancer).</li>
              <li>Profile data (freelancers): professional title, introduction, profile picture, skills, software expertise, hourly rate, availability, portfolio link, country, state, and address.</li>
              <li>Profile data (clients): company name, address.</li>
              <li>Project content: titles, descriptions, attachments, deadlines, budget, and conversation threads.</li>
              <li>Application data: cover letters, application history, and status updates.</li>
            </ul>
            <h3>2.2 Information collected automatically</h3>
            <ul>
              <li>Authentication session cookies required to keep you signed in.</li>
              <li>Basic technical logs (timestamp, route, status code) used for debugging and security.</li>
              <li>If we add analytics, usage events such as page views and feature usage (clearly disclosed if enabled).</li>
            </ul>

            <h2>3. How we use information</h2>
            <ul>
              <li>To operate the platform: matching freelancers and clients, processing applications, tracking deliveries.</li>
              <li>To communicate with you: in-app notifications and email about project activity, account events, and security notices.</li>
              <li>To enforce our Terms of Service, prevent abuse, and resolve disputes.</li>
              <li>To improve the product through aggregated, non-identifying usage data.</li>
            </ul>
            <p>We do not sell your personal information.</p>

            <h2>4. Sub-processors and third-party services</h2>
            <p>
              We rely on the following service providers strictly to operate the platform. Each
              processes only the data necessary for its function:
            </p>
            <ul>
              <li><strong>Supabase</strong> &mdash; database, authentication, and file storage.</li>
              <li><strong>Vercel</strong> &mdash; web hosting and content delivery.</li>
              <li><strong>Resend</strong> &mdash; transactional emails (account, notifications, password reset).</li>
            </ul>

            <h2>5. International transfers</h2>
            <p>
              Some of the providers above may store or process data outside India. By using the
              platform you consent to such transfers, which we ensure are protected by appropriate
              contractual safeguards.
            </p>

            <h2>6. Data retention</h2>
            <ul>
              <li>Account and profile data: retained while your account is active.</li>
              <li>Project content and threads: retained for the lifetime of the project and a reasonable archival period after closure.</li>
              <li>If you delete your account, identifiable data is deleted within 30 days, except where retention is required by law or for legitimate business needs (dispute, fraud prevention).</li>
            </ul>

            <h2>7. Your rights</h2>
            <ul>
              <li>Access &mdash; ask for a copy of the personal data we hold about you.</li>
              <li>Correction &mdash; update profile details directly in your dashboard.</li>
              <li>Deletion &mdash; request account deletion by writing to {LEGAL.contactEmail}.</li>
              <li>Objection &mdash; ask us to stop certain processing (e.g., marketing emails).</li>
              <li>Portability &mdash; receive your project data in a structured format.</li>
            </ul>
            <p>
              Under India&apos;s Digital Personal Data Protection Act and the EU GDPR (where
              applicable), you may exercise these rights by contacting us.
            </p>

            <h2>8. Cookies</h2>
            <p>
              We use only essential cookies required to keep you signed in. We do not use
              advertising or cross-site tracking cookies. If we add analytics cookies in the
              future, we will request consent first.
            </p>

            <h2>9. Security</h2>
            <p>
              We use HTTPS in transit, encrypted storage for files, row-level security policies in
              the database, and modern authentication. No system is perfectly secure; if you
              suspect a breach affecting your account, please contact us immediately.
            </p>

            <h2>10. Children</h2>
            <p>
              The platform is not directed at users under 18. We do not knowingly collect data
              from minors. If you believe a minor has provided personal information, contact us
              to have it removed.
            </p>

            <h2>11. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be announced in
              the dashboard or via email. The &ldquo;Effective&rdquo; date at the top reflects the
              latest revision.
            </p>

            <h2>12. Contact</h2>
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
