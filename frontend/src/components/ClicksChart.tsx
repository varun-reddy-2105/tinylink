"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

interface Item {
  updatedAt: string;
  totalClicks: number;
}

export function ClicksChart() {
  const [data, setData] = useState<{ name: string; clicks: number }[]>([]);

  useEffect(() => {
    fetch("/api/links")
      .then((r) => r.json())
      .then((items: Item[]) => {
        const grouped: Record<string, number> = {};

        items.forEach((item) => {
          const d = new Date(item.updatedAt).toLocaleDateString();
          grouped[d] = (grouped[d] ?? 0) + item.totalClicks;
        });

        setData(
          Object.entries(grouped).map(([name, clicks]) => ({
            name,
            clicks,
          }))
        );
      });
  }, []);

  if (!data.length) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
      <h2 className="text-sm font-medium text-slate-700 mb-4">
        Click activity
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="name" stroke="#64748B" />
          <YAxis stroke="#64748B" />
          <Tooltip />
          <Line type="monotone" dataKey="clicks" stroke="#2563EB" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
