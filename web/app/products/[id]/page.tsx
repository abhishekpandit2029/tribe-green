import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "../../../data/catalogue";
import { WhatsAppLink } from "../../ui";
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const p = PRODUCTS.find((x) => x.id === params.id);
  return p
    ? {
        title: p.name,
        description: p.description,
        openGraph: {
          title: `${p.name} | Tribe Green`,
          description: p.description,
          images: [p.image],
        },
      }
    : { title: "Gift not found" };
}
export default function ProductPage({ params }: { params: { id: string } }) {
  const p = PRODUCTS.find((x) => x.id === params.id);
  if (!p) return notFound();
  return (
    <main className="detail section-wrap">
      <Link className="back-link" href="/#collection">
        ← Back to the collection
      </Link>
      <div className="detail-grid">
        <div className="detail-image">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width:750px) 100vw, 55vw"
            unoptimized
          />
          <span className="detail-index">
            A THOUGHTFUL LITTLE SOMETHING · {p.category.toUpperCase()}
          </span>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            THE GOOD STUFF · 0{PRODUCTS.indexOf(p) + 1}
          </span>
          <h1>
            {p.name.split(" ").slice(0, -1).join(" ")}{" "}
            <em>{p.name.split(" ").slice(-1)}</em>
          </h1>
          <p className="detail-desc">{p.description}</p>
          <div className="detail-price">
            ₹{p.priceMin.toLocaleString("en-IN")} – ₹
            {p.priceMax.toLocaleString("en-IN")} <small>/ unit</small>
          </div>
          <div className="detail-block">
            <span className="eyebrow">JUST RIGHT FOR</span>
            <div className="tag-list">
              {p.occasions.map((o) => (
                <span key={o}>{o}</span>
              ))}
            </div>
          </div>
          <div className="detail-block">
            <span className="eyebrow">MAKE IT YOURS</span>
            <div className="tag-list">
              {p.customisations.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
          <Link
            className="button button-dark full-button"
            href={`/enquire?product=${p.id}`}
          >
            Enquire about this gift <span>↗</span>
          </Link>
          <WhatsAppLink product={p.name} />
        </div>
      </div>
    </main>
  );
}
