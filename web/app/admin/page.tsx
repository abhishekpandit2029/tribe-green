"use client";
import { useEffect, useMemo, useState } from "react";
import { Enquiry } from "../../data/catalogue";
const STATUSES: Enquiry["status"][] = ["New", "Contacted", "Converted", "Lost"];
export default function AdminPage() {
  const [logged, setLogged] = useState(false),
    [mounted, setMounted] = useState(false),
    [user, setUser] = useState(""),
    [pass, setPass] = useState(""),
    [error, setError] = useState(""),
    [rows, setRows] = useState<Enquiry[]>([]),
    [filter, setFilter] = useState("All");
  useEffect(() => {
    // Require an explicit sign-in whenever the portal is opened or refreshed.
    void fetch("/api/admin/logout", { method: "POST" })
      .catch(() => {})
      .finally(() => setMounted(true));
  }, []);
  const visible = useMemo(
    () => (filter === "All" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Sign in failed.");
        return;
      }
      setLogged(true);
      const rowsResponse = await fetch("/api/enquiries");
      if (rowsResponse.ok) setRows(await rowsResponse.json());
    } catch {
      setError("The sign-in service is unavailable.");
    }
  }
  async function status(id: string, value: Enquiry["status"]) {
    const response = await fetch("/api/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: value }),
    });
    if (response.ok) {
      const updated = await response.json();
      setRows((current) =>
        current.map((row) => (row.id === id ? updated : row)),
      );
    }
  }
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setRows([]);
    setLogged(false);
  }
  function csv() {
    const keys = [
      "id",
      "name",
      "company",
      "phone",
      "email",
      "occasion",
      "units",
      "budget",
      "deliveryDate",
      "products",
      "customisations",
      "message",
      "source",
      "status",
      "createdAt",
    ];
    const quote = (v: unknown) =>
      `"${String(Array.isArray(v) ? v.join("; ") : (v ?? "")).replaceAll('"', '""')}"`;
    const body = [
      keys.join(","),
      ...rows.map((r) =>
        keys
          .map((k) => quote((r as unknown as Record<string, unknown>)[k]))
          .join(","),
      ),
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
    a.download = "tribe-green-enquiries.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  if (!mounted) return <main className="admin-page" />;
  if (!logged)
    return (
      <main className="admin-login">
        <div className="login-card">
          <span className="eyebrow">TRIBE GREEN · TEAM PORTAL</span>
          <div className="brand-mark login-mark">
            t<span>g</span>
          </div>
          <h1>
            Welcome <em>back.</em>
          </h1>
          <p>Sign in to look after the good things coming in.</p>
          <form onSubmit={login}>
            <label>
              Username
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="button button-dark full-button">
              Enter the portal <span>↗</span>
            </button>
          </form>
          <small>Demo access · admin / admin</small>
        </div>
      </main>
    );
  return (
    <main className="admin-page">
      <div className="admin-top">
        <div>
          <span className="eyebrow">TRIBE GREEN · TEAM PORTAL</span>
          <h1>
            The good <em>things.</em>
          </h1>
          <p>Every thoughtful enquiry, together in one place.</p>
        </div>
        <div className="admin-actions">
          <button className="button button-dark" onClick={csv}>
            Download CSV <span>↓</span>
          </button>
          <button className="logout" onClick={() => void logout()}>
            Sign out
          </button>
        </div>
      </div>
      <div className="admin-metrics">
        <div>
          <strong>{rows.length}</strong>
          <span>All enquiries</span>
        </div>
        <div>
          <strong>{rows.filter((r) => r.status === "New").length}</strong>
          <span>Need a reply</span>
        </div>
        <div>
          <strong>{rows.filter((r) => r.status === "Converted").length}</strong>
          <span>Made a connection</span>
        </div>
      </div>
      <div className="admin-table-head">
        <h2>
          Enquiries <span>{visible.length}</span>
        </h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      {visible.length === 0 ? (
        <div className="admin-empty">
          <span>✳</span>
          <h3>Nothing here just yet.</h3>
          <p>New enquiries from the website and app will appear here.</p>
          <a href="/enquire">Send a test enquiry ↗</a>
        </div>
      ) : (
        <div className="admin-list">
          {visible.map((r) => (
            <article className="admin-row" key={r.id}>
              <div className="row-meta">
                <span>{r.id}</span>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                <span className="source-chip">{r.source}</span>
              </div>
              <div className="row-main">
                <div>
                  <h3>
                    {r.name} <small>at {r.company}</small>
                  </h3>
                  <p>
                    {r.email} · {r.phone}
                  </p>
                </div>
                <select
                  className={`status-select status-${r.status.toLowerCase()}`}
                  value={r.status}
                  onChange={(e) =>
                    status(r.id, e.target.value as Enquiry["status"])
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="row-details">
                <span>
                  {r.units} gifts · {r.budget}
                </span>
                <span>{r.occasion}</span>
                <span>{r.products.join(", ") || "Gift ideas welcome"}</span>
              </div>
              {r.message && <p className="row-message">“{r.message}”</p>}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
