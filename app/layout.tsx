import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css"; // Assuming you have your Tailwind/global styles here

export const metadata: Metadata = {
  // The one metadata block for the site (app/page.tsx used to override it; these are the values that were live).
  title: "Luis A Ruiz | Full Stack Developer & Game Developer",
  description:
    "Computer Programmer with expertise in SQL and data. Building games and leveling up. Let's connect.",
  keywords: [
    "developer",
    "programmer",
    "SQL",
    "full stack",
    "game developer",
    "portfolio",
    "Luis Ruiz",
  ],
  authors: [{ name: "Luis Ruiz" }],
  creator: "Luis Ruiz",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://luisaruiz.xyz/",
    siteName: "Luis Ruiz Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@luisaruiz",
  },
  icons: {
    icon: "/favicon.ico",
  },
  // Next.js handles these metadata fields natively:
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}