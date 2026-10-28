"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Enquiry } from "../../data/catalogue";
import { AdminDashboard, AdminLogin } from "../../components/admin/AdminViews";

export default function AdminPage() {
  const [logged, setLogged] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
        });
        const result = await response.json();
        if (!active) return;
        if (response.ok && result.authenticated) {
          setLogged(true);
          setLoadingEnquiries(true);
          try {
            const rowsResponse = await fetch("/api/enquiries", {
              cache: "no-store",
            });
            if (rowsResponse.ok) setRows(await rowsResponse.json());
            else if (rowsResponse.status === 401) setLogged(false);
            else
              setError(
                "Your session is active, but enquiries could not be loaded.",
              );
          } finally {
            setLoadingEnquiries(false);
          }
        }
      } catch {
        if (active)
          setError("Could not check your admin session. Refresh to try again.");
      } finally {
        if (active) setAuthChecked(true);
      }
    }
    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const visibleRows = useMemo(
    () =>
      filter === "All" ? rows : rows.filter((row) => row.status === filter),
    [rows, filter],
  );

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      setLoadingEnquiries(true);
      try {
        const rowsResponse = await fetch("/api/enquiries", {
          cache: "no-store",
        });
        if (rowsResponse.ok) setRows(await rowsResponse.json());
      } finally {
        setLoadingEnquiries(false);
      }
    } catch {
      setError("The sign-in service is unavailable.");
    }
  }

  async function updateStatus(id: string, status: Enquiry["status"]) {
    const response = await fetch("/api/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
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

  function downloadCsv() {
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
    const quote = (value: unknown) =>
      `"${String(Array.isArray(value) ? value.join("; ") : (value ?? "")).replaceAll('"', '""')}"`;
    const csv = [
      keys.join(","),
      ...rows.map((row) =>
        keys
          .map((key) => quote((row as unknown as Record<string, unknown>)[key]))
          .join(","),
      ),
    ].join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "tribe-green-enquiries.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  if (!authChecked) return <main className="admin-page" />;
  if (!logged) {
    return (
      <AdminLogin
        user={user}
        pass={pass}
        error={error}
        onUserChange={setUser}
        onPassChange={setPass}
        onSubmit={login}
      />
    );
  }
  return (
    <AdminDashboard
      rows={rows}
      visibleRows={visibleRows}
      loadingEnquiries={loadingEnquiries}
      filter={filter}
      onFilterChange={setFilter}
      onStatusChange={updateStatus}
      onDownload={downloadCsv}
      onLogout={() => void logout()}
    />
  );
}
