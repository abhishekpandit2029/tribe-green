import type { Metadata } from "next";
import "./styles.css";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://tribe-green.vercel.app",
  ),
  title: {
    default: "Gifts that bring us closer | Tribe Green",
    template: "%s | Tribe Green",
  },
  description:
    "Thoughtful corporate gifts for the moments that matter. Discover considered welcome kits, team gifts and branded essentials from Tribe Green.",
  openGraph: {
    title: "Gifts that bring us closer | Tribe Green",
    description: "Thoughtful corporate gifting, made personal.",
    images: ["/share-card.svg"],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/share-card.svg"] },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
