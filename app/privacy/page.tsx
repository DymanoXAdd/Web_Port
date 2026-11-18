import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/sections/Header";
import Footer from "@/components/Footer";
import { sanityFetch } from "@/lib/sanity";
import { pageInfoQuery, socialsQuery } from "@/lib/sanity-queries";
import type { PageInfo, Social } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Privacy | Luis A Ruiz",
  description: "What this site collects, who handles it, and how to have it deleted.",
};

// Keep in step with what the site actually does: contact form (Resend), Sentry, Vercel Analytics and
// logs, and the Orbis leaderboard. Change "Last updated" with every edit.
export default async function PrivacyPage() {
  const [socials, pageInfo] = await Promise.all([
    sanityFetch<Social[]>({ query: socialsQuery }).catch(() => [] as Social[]),
    sanityFetch<PageInfo | null>({ query: pageInfoQuery }).catch(() => null),
  ]);
  const email = pageInfo?.contactInfo?.email;
  const contact = email ? (
    <>
      email <a href={`mailto:${email}`} className="text-brand-text underline underline-offset-4">{email}</a> or use the{" "}
      <Link href="/#contact" className="text-brand-text underline underline-offset-4">contact form</Link>
    </>
  ) : (
    <>
      use the <Link href="/#contact" className="text-brand-text underline underline-offset-4">contact form</Link>
    </>
  );

  const h2 = "mt-6 font-mono text-xl font-semibold text-fg";
  return (
    <>
      <Header socials={socials} />
      <main id="main" className="bg-ink px-6 py-16 text-soft">
        <article className="mx-auto flex max-w-2xl flex-col gap-4 leading-relaxed">
          <h1 className="font-mono text-4xl font-semibold text-fg">Privacy</h1>
          <p className="text-muted">Last updated 17 November 2026</p>
          <p>
            This is the personal site of Luis A Ruiz. It collects as little as it can. This page says what it collects,
            who handles it, and how to have it deleted. For any question or request, {contact}.
          </p>

          <h2 className={h2}>Cookies</h2>
          <p>The site sets no cookies and stores nothing in your browser.</p>

          <h2 className={h2}>Contact form</h2>
          <p>
            The form asks for your name, email, a subject and a message. When you press send, it goes to Luis by email
            through Resend, an email delivery service. The site keeps no copy. Resend keeps a delivery log for a short
            time, and the email stays in Luis&apos;s inbox until he deletes it. It is used only to reply to you.
          </p>

          <h2 className={h2}>Visit statistics</h2>
          <p>
            Vercel Web Analytics counts page views and the kind of browser and device used. It uses no cookies, does not
            identify you, and does not follow you to other sites.
          </p>

          <h2 className={h2}>Hosting and error reports</h2>
          <p>
            The site is hosted by Vercel, which keeps standard request logs (IP address, browser, page visited) for a
            short time for security and debugging. When something on the site breaks, Sentry receives an error report
            with the page address, browser and device type, and what went wrong. Error reports are set not to include
            your IP address or what you typed into the form.
          </p>

          <h2 className={h2}>Minecraft leaderboard</h2>
          <p>
            The <Link href="/minecraft" className="text-brand-text underline underline-offset-4">Orbis page</Link> shows the
            usernames, skins and game stats of players on Luis&apos;s Minecraft server. If you play there and want to be
            left off, ask Luis and you will be removed at the next update, within 15 minutes.
          </p>

          <h2 className={h2}>Your rights</h2>
          <p>
            You can ask what information Luis has about you, and ask for it to be corrected or deleted. You will get an
            answer within 30 days. Nothing is sold or shared for advertising. If you live in the EU or UK, you can also
            complain to your data protection authority.
          </p>

          <h2 className={h2}>Children</h2>
          <p>
            The site is not aimed at children under 13 and does not knowingly collect their information through the
            contact form.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
