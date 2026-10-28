import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";

export function HomeHero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">THOUGHTFUL GIFTS. STRONGER CONNECTIONS.</span>
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
          Find your kind of gift <ArrowDownRight aria-hidden="true" />
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
  );
}

export function PromiseBand() {
  return (
    <section className="promise" id="about">
      <span>GOOD GIFTS, GOOD FEELINGS</span>
      <p>
        Not just another thing.
        <br />
        <em>A reason to remember.</em>
      </p>
      <span>
        PERSONAL BY DESIGN&nbsp; <Sparkles aria-hidden="true" /> &nbsp; MADE TO
        CONNECT
      </span>
    </section>
  );
}

export function HomeClosingSections() {
  return (
    <>
      <section className="note-band">
        <span className="eyebrow">A NOTE FROM US</span>
        <p>
          Some things say more
          <br />
          than words ever could. <em>Gifts should too.</em>
        </p>
        <Link href="/enquire" className="button button-light">
          Let’s make it personal <ArrowUpRight aria-hidden="true" />
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
          Tell us what you’re thinking <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
