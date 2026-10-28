import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="footer">
      <Link className="brand footer-brand" href="/">
        <span className="brand-mark">
          t<span>g</span>
        </span>
        <span>
          tribe green<small>THOUGHTFUL BY NATURE</small>
        </span>
      </Link>
      <p>Little gestures. Lasting connections.</p>
      <Link href="/admin">
        Team portal <ArrowUpRight aria-hidden="true" />
      </Link>
      <span>© 2026 Tribe Green</span>
    </footer>
  );
}
