import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css"; // Assuming you have your Tailwind/global styles here

export const metadata: Metadata = {
  title: "Luis Ruiz | Full Stack Developer",
  description:
    "Computer Programmer & Game Developer. Strong in SQL, data, and building things that matter.",
  keywords: [
    "developer",
    "programmer",
    "SQL",
    "full stack",
    "game developer",
    "portfolio",
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
      <head>
        {/* Template fonts: heading (HelveticaNowDisplay-Medium) + body (HelveticaNowDisplayW01-Rg).
            Translated from the design template's index.html <link> tags into Next.js. */}
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium"
        />
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}