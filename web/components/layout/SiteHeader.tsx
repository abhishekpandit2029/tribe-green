"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";

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
        <Menu aria-hidden="true" />
      </button>
      <nav className={open ? "nav nav-open" : "nav"}>
        <Link href="/#collection" onClick={() => setOpen(false)}>
          Our collection
        </Link>
        <Link href="/#about" onClick={() => setOpen(false)}>
          Our story
        </Link>
        <Link href="/enquire" onClick={() => setOpen(false)}>
          Let&apos;s talk <ArrowUpRight aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}
