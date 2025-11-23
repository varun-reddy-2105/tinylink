// src/pages/Healthz.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import Spinner from "../components/Spinner";

export default function Healthz() {
  const [state, setState] = useState("loading"); // loading | success | error
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setState("loading");

    api
      .healthz()
      .then((data) => {
        if (!isMounted) return;
        setPayload(data);
        setState("success");
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Health check failed.");
        setState("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isHealthy =
    state === "success" &&
    (payload?.status === "ok" || payload?.status === "healthy");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Health check</h1>
          <p className="page-subtitle">
            Lightweight status page exposing /healthz response.
          </p>
        </div>
      </div>

      <section className="card">
        {state === "loading" && (
          <div className="card-body-centered">
            <Spinner size="lg" />
            <p className="muted">Checking service health…</p>
          </div>
        )}

        {state === "error" && (
          <div className="card-body-centered">
            <p className="form-error-message">{error}</p>
          </div>
        )}

        {state === "success" && (
          <div className="card-body">
            <div className={`health-pill ${isHealthy ? "ok" : "bad"}`}>
              <span className="health-dot" />
              <span>
                {isHealthy ? "All systems operational" : "Service degraded"}
              </span>
            </div>

            <pre className="health-json">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
}
