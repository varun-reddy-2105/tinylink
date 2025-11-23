// src/components/Layout.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <NavLink to="/" className="app-logo">
            tinylink<span className="accent">.io</span>
          </NavLink>

          <nav className="app-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/healthz"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link-active" : "")
              }
            >
              Health
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="app-container">{children}</div>
      </main>

      <footer className="app-footer">
        <div className="app-footer-inner">
          <span>© {new Date().getFullYear()} tinylink</span>
          <span className="app-footer-muted">
            Minimal URL shortener dashboard
          </span>
        </div>
      </footer>
    </div>
  );
}
