// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CodeStats from "./pages/CodeStats";
import RedirectPage from "./pages/RedirectPage";
import Healthz from "./pages/Healthz";

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Dashboard (list, add, delete) */}
        <Route path="/" element={<Dashboard />} />

        {/* Stats for a single code */}
        <Route path="/code/:code" element={<CodeStats />} />

        {/* Health check */}
        <Route path="/healthz" element={<Healthz />} />

        {/* Redirect route — must be last */}
        <Route path="/:code" element={<RedirectPage />} />
      </Routes>
    </Layout>
  );
}
