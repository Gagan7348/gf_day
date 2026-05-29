import type { Metadata } from "next";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "For My Avani ♥ — Our Love Story",
  description: "A beautiful, handcrafted love portal made with every beat of my heart, just for you Avani.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "For My Avani ♥ — Our Love Story",
    description: "A beautiful, handcrafted love portal made with every beat of my heart, just for you Avani.",
    siteName: "For My Avani",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For My Avani ♥ — Our Love Story",
    description: "A beautiful, handcrafted love portal made with every beat of my heart, just for you Avani.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="overflow-x-hidden overflow-y-auto">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

