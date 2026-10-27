"use client";
import Link from "next/link";
import { useState } from "react";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <Link className="brand" href="/">
        <span className="brand-mark">
          t<span>g</span>
        </span>
        <span>
          tribe green<small>GIFTS THAT BRING US CLOSER</small>
        </span>
      </Link>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      <nav className={open ? "nav nav-open" : "nav"}>
        <Link href="/#collection" onClick={() => setOpen(false)}>
          Our collection
        </Link>
        <Link href="/#about" onClick={() => setOpen(false)}>
          Our story
        </Link>
        <Link href="/enquire" onClick={() => setOpen(false)}>
          Let's talk <span>↗</span>
        </Link>
      </nav>
    </header>
  );
}
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
      <Link href="/admin">Team portal ↗</Link>
      <span>© 2026 Tribe Green</span>
    </footer>
  );
}
export function WhatsAppLink({ product }: { product: string }) {
  const message = encodeURIComponent(
    `Hi Tribe Green! I'd love to know more about ${product} for a corporate gifting order.`,
  );
  return (
    <a
      className="whatsapp"
      target="_blank"
      rel="noreferrer"
      href={`https://wa.me/917207967958?text=${message}`}
    >
      ✳ Chat about this on WhatsApp
    </a>
  );
}
export function ThankYou({ name }: { name: string }) {
  return (
    <div className="thanks">
      <span className="eyebrow">A LITTLE SOMETHING IS ON ITS WAY</span>
      <div className="thanks-icon">✓</div>
      <h2>Thank you, {name}.</h2>
      <p>
        We’ve got your enquiry and our gifting team will be in touch shortly to
        make something lovely happen.
      </p>
      <Link href="/" className="button button-dark">
        Back to the collection <span>↗</span>
      </Link>
    </div>
  );
}
