import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "../../../data/catalogue";
import { ProductDetails } from "../../../components/catalogue/ProductDetails";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = PRODUCTS.find((item) => item.id === params.id);
  return product
    ? {
        title: product.name,
        description: product.description,
        openGraph: {
          title: `${product.name} | Tribe Green`,
          description: product.description,
          images: [product.image],
        },
      }
    : { title: "Gift not found" };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = PRODUCTS.find((item) => item.id === params.id);
  if (!product) return notFound();
  return <ProductDetails product={product} index={PRODUCTS.indexOf(product)} />;
}
