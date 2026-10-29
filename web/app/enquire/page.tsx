"use client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, LoaderCircle } from "lucide-react";
import {
  BUDGETS,
  CUSTOMISATIONS,
  OCCASIONS,
  PRODUCTS,
} from "../../data/catalogue";
import { ThankYou } from "../../components/enquiry/ThankYou";
import {
  CheckboxGroup,
  FormField,
} from "../../components/enquiry/EnquiryFormControls";
export default function EnquirePage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(""),
    [error, setError] = useState(""),
    [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const productId = new URLSearchParams(window.location.search).get("product");
    const initialProduct = PRODUCTS.find(
      (product) => product.id === productId || product.name === productId,
    );
    if (initialProduct) setSelectedProducts([initialProduct.name]);
  }, []);
  function toggleProduct(value: string) {
    setSelectedProducts((current) =>
      current.includes(value)
        ? current.filter((product) => product !== value)
        : [...current, value],
    );
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const phone = String(f.get("phone") || "").replace(/\D/g, "");
    const email = String(f.get("email") || "");
    const units = Number(f.get("units"));
    if (phone.length < 10 || phone.length > 15) {
      setError("Please enter a valid phone number (10–15 digits).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!Number.isInteger(units) || units < 1) {
      setError("Please enter at least 1 unit.");
      return;
    }
    const payload = {
      name: String(f.get("name")),
      company: String(f.get("company")),
      phone,
      email,
      occasion: String(f.get("occasion")),
      units,
      budget: String(f.get("budget")),
      products: f.getAll("products").map(String),
      customisations: f.getAll("customisations").map(String),
      giftMessage: String(f.get("giftMessage") || ""),
      source: "Website",
    };
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(
          result.error || "Could not save your enquiry. Please try again.",
        );
        return;
      }
      setSubmitted(String(result.name));
    } catch {
      setError("The enquiry service is unavailable. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }
  if (submitted)
    return (
      <main className="form-page">
        <ThankYou name={submitted} />
      </main>
    );
  return (
    <main className="form-page section-wrap">
      <div className="form-intro">
        <span className="eyebrow">A GOOD THING STARTS HERE</span>
        <h1>
          Let’s make it
          <br />
          <em>personal.</em>
        </h1>
        <p>
          Tell us a little about what you’re dreaming up. We’ll take it from
          there.
        </p>
        <div className="form-aside">
          Made for teams, shared with care.
          <br />
          <span>We usually reply within one business day.</span>
        </div>
      </div>
      <form className="enquiry-form" onSubmit={submit}>
        <div className="form-top">
          <span>THE DETAILS</span>
          <span>01 — 03</span>
        </div>
        <div className="form-grid">
          <FormField label="Your name *">
            <input name="name" placeholder="e.g. Aanya Sharma" required />
          </FormField>
          <FormField label="Company *">
            <input name="company" placeholder="Company name" required />
          </FormField>
          <FormField label="Email address *">
            <input
              name="email"
              type="email"
              placeholder="you@company.com"
              required
            />
          </FormField>
          <FormField label="Phone number *">
            <input
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              required
            />
          </FormField>
          <FormField label="What are we celebrating? *">
            <select name="occasion" required defaultValue="">
              <option value="" disabled>
                Select an occasion
              </option>
              {OCCASIONS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Number of gifts *">
            <input
              name="units"
              type="number"
              min="1"
              placeholder="e.g. 50"
              required
            />
          </FormField>
          <FormField label="Budget per gift *">
            <select name="budget" required defaultValue="">
              <option value="" disabled>
                Select a budget
              </option>
              {BUDGETS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Gift message">
            <input
              name="giftMessage"
              placeholder="Write a note to include with the gifts"
            />
          </FormField>
        </div>
        <CheckboxGroup
          legend="Anything caught your eye?"
          name="products"
          options={PRODUCTS.map((product) => ({
            value: product.name,
            id: product.id,
          }))}
          selectedValues={selectedProducts}
          onToggle={toggleProduct}
        />
        <CheckboxGroup
          legend="Make it yours"
          name="customisations"
          options={CUSTOMISATIONS.map((customisation) => ({
            value: customisation,
            id: customisation,
          }))}
        />
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button
          className="button button-dark submit-button"
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              Submitting your enquiry…
              <LoaderCircle className="submit-spinner" aria-hidden="true" />
            </>
          ) : (
            <>
              Send your enquiry <ArrowUpRight aria-hidden="true" />
            </>
          )}
        </button>
        <p className="privacy-note">
          By sending this form, you agree to be contacted about your gifting
          enquiry.
        </p>
        <Link className="back-link" href="/">
          <ArrowLeft aria-hidden="true" />
          Back to the collection
        </Link>
      </form>
    </main>
  );
}
