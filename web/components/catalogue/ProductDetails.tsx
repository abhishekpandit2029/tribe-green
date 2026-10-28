import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Product } from "../../data/catalogue";
import { WhatsAppLink } from "./WhatsAppLink";

export function ProductDetails({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <main className="detail section-wrap">
      <Link className="back-link" href="/#collection">
        <ArrowLeft aria-hidden="true" />
        Back to the collection
      </Link>
      <div className="detail-grid">
        <div className="detail-image">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width:750px) 100vw, 55vw"
            unoptimized
          />
          <span className="detail-index">
            A THOUGHTFUL LITTLE SOMETHING · {product.category.toUpperCase()}
          </span>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">THE GOOD STUFF · 0{index + 1}</span>
          <h1>
            {product.name.split(" ").slice(0, -1).join(" ")}{" "}
            <em>{product.name.split(" ").slice(-1)}</em>
          </h1>
          <p className="detail-desc">{product.description}</p>
          <div className="detail-price">
            ₹{product.priceMin.toLocaleString("en-IN")} – ₹
            {product.priceMax.toLocaleString("en-IN")} <small>/ unit</small>
          </div>
          <DetailTagList title="JUST RIGHT FOR" values={product.occasions} />
          <DetailTagList
            title="MAKE IT YOURS"
            values={product.customisations}
          />
          <Link
            className="button button-dark full-button"
            href={`/enquire?product=${product.id}`}
          >
            Enquire about this gift <ArrowUpRight aria-hidden="true" />
          </Link>
          <WhatsAppLink product={product.name} />
        </div>
      </div>
    </main>
  );
}

function DetailTagList({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="detail-block">
      <span className="eyebrow">{title}</span>
      <div className="tag-list">
        {values.map((value) => (
          <span key={value}>{value}</span>
        ))}
      </div>
    </div>
  );
}
