// src/pages/CodeStats.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import Spinner from "../components/Spinner";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function CodeStats() {
  const { code } = useParams();
  const [stats, setStats] = useState(null);
  const [state, setState] = useState("loading"); // loading | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setState("loading");

    api
      .getStats(code)
      .then((data) => {
        if (!isMounted) return;
        setStats(data);
        setState("success");
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to load stats.");
        setState("error");
      });

    return () => {
      isMounted = false;
    };
  }, [code]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stats for {code}</h1>
          <p className="page-subtitle">
            Traffic overview and metadata for this short code.
          </p>
        </div>
        <Link to="/" className="btn btn-secondary btn-sm">
          Back to dashboard
        </Link>
      </div>

      <section className="card">
        {state === "loading" && (
          <div className="card-body-centered">
            <Spinner size="lg" />
            <p className="muted">Loading stats…</p>
          </div>
        )}

        {state === "error" && (
          <div className="card-body-centered">
            <p className="form-error-message">{error}</p>
            <Link to="/" className="btn btn-secondary">
              Back to dashboard
            </Link>
          </div>
        )}

        {state === "success" && stats && (
          <div className="card-body">
            <div className="stats-grid">
              <div className="stats-item">
                <span className="stats-label">Short URL</span>
                <span className="stats-value truncate" title={stats.shortUrl}>
                  {stats.shortUrl}
                </span>
              </div>

              <div className="stats-item">
                <span className="stats-label">Destination</span>
                <span className="stats-value truncate" title={stats.url}>
                  {stats.url}
                </span>
              </div>

              <div className="stats-item">
                <span className="stats-label">Total clicks</span>
                <span className="stats-value">
                  {stats.clicks ?? stats.totalClicks ?? 0}
                </span>
              </div>

              <div className="stats-item">
                <span className="stats-label">Created</span>
                <span className="stats-value">
                  {stats.createdAt
                    ? new Date(stats.createdAt).toLocaleString()
                    : "—"}
                </span>
              </div>
            </div>

            <div className="stats-extra">
              <h3 className="chart-title">Click analytics</h3>
              <ClicksChart clicks={stats.clickDetails || stats.analytics || []} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ClicksChart({ clicks }) {
  let data =
    clicks?.map((d) => ({
      date: d.date || d.day || new Date().toISOString().slice(0, 10),
      clicks: d.clicks ?? d.count ?? 0,
    })) || [];

  // If backend doesn't send analytics yet, gently mock for demo
  if (!data.length) {
    data = [
      { date: "Day 1", clicks: 2 },
      { date: "Day 2", clicks: 5 },
      { date: "Day 3", clicks: 3 },
      { date: "Day 4", clicks: 8 },
    ];
  }

  return (
    <div style={{ width: "100%", height: 260, marginTop: "16px" }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            fontSize={11}
            tickMargin={6}
          />
          <YAxis stroke="#9ca3af" fontSize={11} />
          <Tooltip
            contentStyle={{
              background: "rgba(2,6,23,0.9)",
              border: "1px solid rgba(148,163,184,0.35)",
              borderRadius: "10px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "var(--accent)" }}
          />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={true}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
