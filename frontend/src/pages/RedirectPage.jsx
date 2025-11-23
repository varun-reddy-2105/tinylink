// src/pages/RedirectPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import Spinner from "../components/Spinner";

export default function RedirectPage() {
  const { code } = useParams();
  const [state, setState] = useState("loading"); // loading | error
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setState("loading");

    api
      .resolveCode(code)
      .then((data) => {
        if (!isMounted) return;
        const target = data.url || data.target || data.location;
        if (target) {
          window.location.replace(target);
        } else {
          setError("No destination URL configured for this code.");
          setState("error");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.status === 404) {
          setError("This short code does not exist.");
        } else {
          setError(err.message || "Failed to resolve short code.");
        }
        setState("error");
      });

    return () => {
      isMounted = false;
    };
  }, [code]);

  if (state === "loading") {
    return (
      <div className="page page-centered">
        <Spinner size="lg" />
        <h1 className="page-title">Redirecting…</h1>
        <p className="page-subtitle">
          Looking up <code>{code}</code> and sending you to the destination.
        </p>
      </div>
    );
  }

  return (
    <div className="page page-centered">
      <h1 className="page-title">We couldn’t redirect you</h1>
      <p className="form-error-message">{error}</p>
      <Link to="/" className="btn btn-primary">
        Go to dashboard
      </Link>
    </div>
  );
}
