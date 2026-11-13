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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}