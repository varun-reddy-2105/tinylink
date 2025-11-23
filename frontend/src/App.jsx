// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CodeStats from "./pages/CodeStats";
import RedirectPage from "./pages/RedirectPage";
import Healthz from "./pages/Healthz";
import Home from "./pages/Home"; // New Landing Page

export default function App() {
  return (
    <Layout>
      <Routes>

        {/* New Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Stats for a single code */}
        <Route path="/code/:code" element={<CodeStats />} />

        {/* Health Check */}
        <Route path="/healthz" element={<Healthz />} />

        {/* Redirect route (MUST be last) */}
        <Route path="/:code" element={<RedirectPage />} />
        
      </Routes>
    </Layout>
  );
}
