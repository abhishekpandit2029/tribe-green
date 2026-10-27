import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Team portal",
  description: "Manage Tribe Green corporate gifting enquiries.",
  openGraph: {
    title: "Team portal | Tribe Green",
    description: "Manage corporate gifting enquiries.",
    images: ["/share-card.svg"],
  },
  robots: { index: false, follow: false },
};
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
