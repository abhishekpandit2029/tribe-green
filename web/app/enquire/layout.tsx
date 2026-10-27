import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Start an enquiry",
  description:
    "Tell Tribe Green about your corporate gifting idea and our team will help make it personal.",
  openGraph: {
    title: "Start an enquiry | Tribe Green",
    description: "Tell us what you’re dreaming up. We’ll take it from there.",
    images: ["/share-card.svg"],
  },
};
export default function EnquireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
