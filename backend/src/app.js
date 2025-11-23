// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import Dashboard from "./pages/Dashboard";
import HealthPage from "./pages/HealthPage";
import StatsPage from "./pages/StatsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppHeader />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/code/:code" element={<StatsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
