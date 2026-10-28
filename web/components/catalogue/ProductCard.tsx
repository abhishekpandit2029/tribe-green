import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "../../data/catalogue";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <Link className="product-card" href={`/products/${product.id}`}>
      <div className="product-image">
        <Image
          src={product.image}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width:700px) 90vw, (max-width:1100px) 45vw, 30vw"
          priority={index < 3}
        />
        <span className="product-index">0{index + 1}</span>
        <span className="product-arrow">
          <ArrowUpRight aria-hidden="true" />
        </span>
      </div>
      <div className="product-info">
        <div>
          <span className="product-category">{product.category}</span>
          <h3>{product.name}</h3>
        </div>
        <span className="price">
          ₹{product.priceMin.toLocaleString("en-IN")} –<br />₹
          {product.priceMax.toLocaleString("en-IN")} <small>/ unit</small>
        </span>
      </div>
      <p className="product-desc">{product.description}</p>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <>
      <div className="product-grid">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="empty-state">
          No gifts match those filters. Try another combination.
        </div>
      )}
    </>
  );
}
