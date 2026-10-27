"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  BUDGETS,
  CUSTOMISATIONS,
  OCCASIONS,
  PRODUCTS,
} from "../../data/catalogue";
import { ThankYou } from "../ui";
export default function EnquirePage() {
  const [initial, setInitial] = useState("");
  const [submitted, setSubmitted] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    setInitial(
      new URLSearchParams(window.location.search).get("product") || "",
    );
  }, []);
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
      deliveryDate: String(f.get("deliveryDate")),
      products: f.getAll("products").map(String),
      customisations: f.getAll("customisations").map(String),
      message: String(f.get("message") || ""),
      source: "Website",
    };
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
          <label>
            Your name *
            <input name="name" placeholder="e.g. Aanya Sharma" required />
          </label>
          <label>
            Company *
            <input name="company" placeholder="Company name" required />
          </label>
          <label>
            Email address *
            <input
              name="email"
              type="email"
              placeholder="you@company.com"
              required
            />
          </label>
          <label>
            Phone number *
            <input
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              required
            />
          </label>
          <label>
            What are we celebrating? *
            <select name="occasion" required defaultValue="">
              <option value="" disabled>
                Select an occasion
              </option>
              {OCCASIONS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Number of gifts *
            <input
              name="units"
              type="number"
              min="1"
              placeholder="e.g. 50"
              required
            />
          </label>
          <label>
            Budget per gift *
            <select name="budget" required defaultValue="">
              <option value="" disabled>
                Select a budget
              </option>
              {BUDGETS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Ideal delivery date
            <input name="deliveryDate" type="date" />
          </label>
        </div>
        <fieldset>
          <legend>Anything caught your eye?</legend>
          <div className="check-grid">
            {PRODUCTS.map((p) => (
              <label className="check-label" key={p.id}>
                <input
                  type="checkbox"
                  name="products"
                  value={p.name}
                  defaultChecked={p.id === initial}
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Make it yours</legend>
          <div className="check-grid">
            {CUSTOMISATIONS.map((c) => (
              <label className="check-label" key={c}>
                <input type="checkbox" name="customisations" value={c} />
                <span>{c}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="message-label">
          Anything else we should know?
          <textarea
            name="message"
            rows={4}
            placeholder="A colour, a feeling, an idea…"
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="button button-dark submit-button" type="submit">
          Send your enquiry <span>↗</span>
        </button>
        <p className="privacy-note">
          By sending this form, you agree to be contacted about your gifting
          enquiry.
        </p>
        <Link className="back-link" href="/">
          ← Back to the collection
        </Link>
      </form>
    </main>
  );
}
