"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { PRODUCTS, CATEGORIES, OCCASIONS, BUDGETS } from "../data/catalogue";

export default function Home() {
  const [category, setCategory] = useState("All gifts"),
    [occasion, setOccasion] = useState(""),
    [budget, setBudget] = useState(""),
    [search, setSearch] = useState("");
  const shown = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (category === "All gifts" || p.category === category) &&
          (!occasion || p.occasions.includes(occasion)) &&
          (!budget ||
            (budget === "Under ₹500"
              ? p.priceMin < 500
              : budget === "₹500 to ₹1,500"
                ? p.priceMax >= 500 && p.priceMin <= 1500
                : budget === "₹1,500 to ₹3,000"
                  ? p.priceMax >= 1500 && p.priceMin <= 3000
                  : p.priceMax > 3000)) &&
          p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [category, occasion, budget, search],
  );
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            THOUGHTFUL GIFTS. STRONGER CONNECTIONS.
          </span>
          <h1>
            Good things
            <br />
            are meant to <em>be shared.</em>
          </h1>
          <p>
            Gifting that says “we see you.” Thoughtfully made, beautifully
            personal, and always a little unexpected.
          </p>
          <a className="button button-dark" href="#collection">
            Find your kind of gift <span>↘</span>
          </a>
          <div className="hero-foot">
            <span>01 / 03</span>
            <span>Made for the moments that matter</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-photo" />
          <div className="sun-disc" />
          <div className="hero-tag">
            A little joy,
            <br />
            <i>wrapped up.</i>
          </div>
          <div className="hero-sticker">
            made
            <br />
            with
            <br />
            meaning
          </div>
        </div>
        <span className="hero-side">CURATED WITH CARE · EST. WITH HEART</span>
      </section>
      <section className="promise" id="about">
        <span>GOOD GIFTS, GOOD FEELINGS</span>
        <p>
          Not just another thing.
          <br />
          <em>A reason to remember.</em>
        </p>
        <span>PERSONAL BY DESIGN&nbsp; ✳ &nbsp; MADE TO CONNECT</span>
      </section>
      <section className="collection section-wrap" id="collection">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE GOOD STUFF</span>
            <h2>
              Made to make
              <br />
              <em>someone's day.</em>
            </h2>
          </div>
          <p>
            Useful, considered, and made personal.
            <br />
            Find a little something for every kind of moment.
          </p>
        </div>
        <div className="filters">
          <div className="category-pills">
            {["All gifts", ...CATEGORIES].map((c) => (
              <button
                key={c}
                className={category === c ? "active" : ""}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="filter-selects">
            <input
              aria-label="Search gifts"
              placeholder="Find a gift..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            >
              <option value="">Every occasion</option>
              {OCCASIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <select value={budget} onChange={(e) => setBudget(e.target.value)}>
              <option value="">Every budget</option>
              {BUDGETS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="product-grid">
          {shown.map((p, i) => (
            <Link
              className="product-card"
              href={`/products/${p.id}`}
              key={p.id}
            >
              <div className="product-image">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  unoptimized
                  sizes="(max-width:700px) 90vw, (max-width:1100px) 45vw, 30vw"
                  priority={i < 3}
                />
                <span className="product-index">0{i + 1}</span>
                <span className="product-arrow">↗</span>
              </div>
              <div className="product-info">
                <div>
                  <span className="product-category">{p.category}</span>
                  <h3>{p.name}</h3>
                </div>
                <span className="price">
                  ₹{p.priceMin.toLocaleString("en-IN")} –<br />₹
                  {p.priceMax.toLocaleString("en-IN")} <small>/ unit</small>
                </span>
              </div>
              <p className="product-desc">{p.description}</p>
            </Link>
          ))}
        </div>
        {shown.length === 0 && (
          <div className="empty-state">
            No gifts match those filters. Try another combination.
          </div>
        )}
      </section>
      <section className="note-band">
        <span className="eyebrow">A NOTE FROM US</span>
        <p>
          Some things say more
          <br />
          than words ever could. <em>Gifts should too.</em>
        </p>
        <Link href="/enquire" className="button button-light">
          Let’s make it personal <span>↗</span>
        </Link>
      </section>
      <section className="bottom-cta">
        <span className="eyebrow">HAVE SOMETHING IN MIND?</span>
        <h2>
          Let’s make a little
          <br />
          <em>magic happen.</em>
        </h2>
        <Link href="/enquire" className="button button-dark">
          Tell us what you’re thinking <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
