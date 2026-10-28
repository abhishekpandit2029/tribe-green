"use client";

import { useMemo, useState } from "react";
import { PRODUCTS } from "../../data/catalogue";
import { CatalogueFilters } from "./CatalogueFilters";
import { ProductGrid } from "./ProductCard";

export function CatalogueSection() {
  const [category, setCategory] = useState("All gifts");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [search, setSearch] = useState("");

  const shown = useMemo(
    () =>
      PRODUCTS.filter(
        (product) =>
          (category === "All gifts" || product.category === category) &&
          (!occasion || product.occasions.includes(occasion)) &&
          (!budget ||
            (budget === "Under ₹500"
              ? product.priceMin < 500
              : budget === "₹500 to ₹1,500"
                ? product.priceMax >= 500 && product.priceMin <= 1500
                : budget === "₹1,500 to ₹3,000"
                  ? product.priceMax >= 1500 && product.priceMin <= 3000
                  : product.priceMax > 3000)) &&
          product.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [category, occasion, budget, search],
  );

  return (
    <section className="collection section-wrap" id="collection">
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE GOOD STUFF</span>
          <h2>
            Made to make
            <br />
            <em>someone&apos;s day.</em>
          </h2>
        </div>
        <p>
          Useful, considered, and made personal.
          <br />
          Find a little something for every kind of moment.
        </p>
      </div>
      <CatalogueFilters
        category={category}
        occasion={occasion}
        budget={budget}
        search={search}
        onCategoryChange={setCategory}
        onOccasionChange={setOccasion}
        onBudgetChange={setBudget}
        onSearchChange={setSearch}
      />
      <ProductGrid products={shown} />
    </section>
  );
}
