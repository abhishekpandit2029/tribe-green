import type { FormEvent } from "react";
import type { Enquiry } from "../../data/catalogue";
import { ArrowUpRight, Download, Sparkles } from "lucide-react";

const STATUSES: Enquiry["status"][] = ["New", "Contacted", "Converted", "Lost"];

export function AdminLogin({
  user,
  pass,
  error,
  onUserChange,
  onPassChange,
  onSubmit,
}: {
  user: string;
  pass: string;
  error: string;
  onUserChange: (value: string) => void;
  onPassChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
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
        <form onSubmit={onSubmit}>
          <label>
            Username
            <input
              value={user}
              onChange={(event) => onUserChange(event.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={pass}
              onChange={(event) => onPassChange(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button button-dark full-button">
            Enter the portal <ArrowUpRight aria-hidden="true" />
          </button>
        </form>
      </div>
    </main>
  );
}

export function AdminDashboard({
  rows,
  visibleRows,
  loadingEnquiries,
  filter,
  onFilterChange,
  onStatusChange,
  onDownload,
  onLogout,
}: {
  rows: Enquiry[];
  visibleRows: Enquiry[];
  loadingEnquiries: boolean;
  filter: string;
  onFilterChange: (value: string) => void;
  onStatusChange: (id: string, status: Enquiry["status"]) => void;
  onDownload: () => void;
  onLogout: () => void;
}) {
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
          <button className="button button-dark" onClick={onDownload}>
            Download CSV <Download aria-hidden="true" />
          </button>
          <button className="logout" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </div>
      <AdminMetrics rows={rows} />
      <div className="admin-table-head">
        <h2>
          Enquiries <span>{visibleRows.length}</span>
        </h2>
        <select
          value={filter}
          onChange={(event) => onFilterChange(event.target.value)}
        >
          <option>All</option>
          {STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>
      {loadingEnquiries ? (
        <div className="admin-loading" role="status" aria-live="polite">
          <span className="admin-spinner" aria-hidden="true" />
          <span>Loading enquiries…</span>
        </div>
      ) : visibleRows.length === 0 ? (
        <AdminEmptyState />
      ) : (
        <div className="admin-list">
          {visibleRows.map((enquiry) => (
            <AdminEnquiryRow
              key={enquiry.id}
              enquiry={enquiry}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function AdminMetrics({ rows }: { rows: Enquiry[] }) {
  return (
    <div className="admin-metrics">
      <div>
        <strong>{rows.length}</strong>
        <span>All enquiries</span>
      </div>
      <div>
        <strong>{rows.filter((row) => row.status === "New").length}</strong>
        <span>Need a reply</span>
      </div>
      <div>
        <strong>
          {rows.filter((row) => row.status === "Converted").length}
        </strong>
        <span>Made a connection</span>
      </div>
    </div>
  );
}

function AdminEmptyState() {
  return (
    <div className="admin-empty">
      <span>
        <Sparkles aria-hidden="true" />
      </span>
      <h3>Nothing here just yet.</h3>
      <p>New enquiries from the website and app will appear here.</p>
      <a href="/enquire">
        Send a test enquiry <ArrowUpRight aria-hidden="true" />
      </a>
    </div>
  );
}

function AdminEnquiryRow({
  enquiry,
  onStatusChange,
}: {
  enquiry: Enquiry;
  onStatusChange: (id: string, status: Enquiry["status"]) => void;
}) {
  return (
    <article className="admin-row">
      <div className="row-meta">
        <span>{enquiry.id}</span>
        <span>{new Date(enquiry.createdAt).toLocaleDateString()}</span>
        <span className="source-chip">{enquiry.source}</span>
      </div>
      <div className="row-main">
        <div>
          <h3>
            {enquiry.name} <small>at {enquiry.company}</small>
          </h3>
          <p>
            {enquiry.email} · {enquiry.phone}
          </p>
        </div>
        <select
          className={`status-select status-${enquiry.status.toLowerCase()}`}
          value={enquiry.status}
          onChange={(event) =>
            onStatusChange(enquiry.id, event.target.value as Enquiry["status"])
          }
        >
          {STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>
      <div className="row-details">
        <span>
          {enquiry.units} gifts · {enquiry.budget}
        </span>
        <span>{enquiry.occasion}</span>
        <span>{enquiry.products.join(", ") || "Gift ideas welcome"}</span>
      </div>
      {enquiry.giftMessage && (
        <p className="row-message">
          Gift message: “{enquiry.giftMessage}”
        </p>
      )}
    </article>
  );
}
