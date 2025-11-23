"use client";

import { useEffect, useState } from "react";

interface LinkItem {
  code: string;
  totalClicks: number;
}

export function Metrics() {
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalLinks, setTotalLinks] = useState(0);

  useEffect(() => {
    fetch("/api/links")
      .then((res) => res.json())
      .then((data: LinkItem[]) => {
        setTotalLinks(data.length);
        setTotalClicks(data.reduce((sum, item) => sum + item.totalClicks, 0));
      });
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <MetricCard label="Total Links" value={totalLinks} />
      <MetricCard label="Total Clicks" value={totalClicks} />
      <MetricCard label="Today Clicks" value={0} comingSoon />
      <MetricCard label="Active Links" value={totalLinks} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  comingSoon,
}: {
  label: string;
  value: number;
  comingSoon?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-slate-900 mt-1">
        {value} {comingSoon && <span className="text-[10px] text-slate-400">(soon)</span>}
      </p>
    </div>
  );
}
