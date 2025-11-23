// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const initialForm = { url: "", code: "" };

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");

  const [filter, setFilter] = useState("");
  const [copyState, setCopyState] = useState({});

  const fetchLinks = () => {
    setLoading(true);
    api
      .listLinks()
      .then((data) => setLinks(Array.isArray(data) ? data : []))
      .catch((err) => setLoadingError(err.message || "Failed to load links"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const filteredLinks = useMemo(() => {
    const lower = filter.toLowerCase();
    return links.filter(
      (l) =>
        l.code.toLowerCase().includes(lower) ||
        l.targetUrl?.toLowerCase().includes(lower) || // FIXED HERE
        l.shortUrl.toLowerCase().includes(lower)
    );
  }, [links, filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      await api.createLink({
        targetUrl: form.url.trim(), // FIXED HERE
        code: form.code.trim() || undefined,
      });
      setForm(initialForm);
      fetchLinks();
      setFormSuccess("Short link created successfully!");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this link?")) return;
    await api.deleteLink(id);
    fetchLinks();
  };

  const handleCopy = async (id, text) => {
    await navigator.clipboard.writeText(text);
    setCopyState({ [id]: "Copied!" });
    setTimeout(() => setCopyState({}), 1500);
  };

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>

      <section className="card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div>
              <label>Destination URL</label>
              <input
                type="url"
                value={form.url}
                name="url"
                onChange={(e) =>
                  setForm((p) => ({ ...p, url: e.target.value }))
                }
                required
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label>Custom Code (optional)</label>
              <input
                value={form.code}
                name="code"
                onChange={(e) =>
                  setForm((p) => ({ ...p, code: e.target.value }))
                }
                placeholder="promo2025"
              />
            </div>
          </div>

          {formSuccess && (
            <p className="form-success-message">{formSuccess}</p>
          )}

          <button className="btn btn-primary" disabled={formSubmitting}>
            {formSubmitting ? <Spinner size="sm" /> : "Create Link"}
          </button>
        </form>
      </section>

      <section className="card card-mt">
        <h2>Your Links</h2>

        <input
          type="search"
          className="filter-input"
          placeholder="Filter by code, URL…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        {loading && <Spinner />}

        {!loading && filteredLinks.length === 0 && (
          <EmptyState title="No links yet" description="Create one above" />
        )}

        {!loading && filteredLinks.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Clicks</th>
                <th>Short URL</th>
                <th>Original URL</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link) => (
                <tr key={link.id}>
                  <td>
                    <Link to={`/code/${link.code}`}>{link.code}</Link>
                  </td>
                  <td>{link.totalClicks ?? 0}</td>
                  <td>
                    <button
                      className="link-copy-btn"
                      onClick={() => handleCopy(link.id, link.shortUrl)}
                    >
                      {copyState[link.id] || link.shortUrl}
                    </button>
                  </td>

                  {/* 🌟 FIXED Original URL field */}
                  <td className="truncate">
                    <a
                      href={link.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-original"
                    >
                      {link.targetUrl}
                    </a>
                  </td>

                  <td>
                    <button
                      className="btn btn-text delete-btn"
                      onClick={() => handleDelete(link.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
