"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type TrendPoint = {
  date: string; // kort, lesbar dato-etikett (f.eks. "sep. 2026")
  value: number | null;
};

function formatValue(value: number, unit: "kr" | "%" | "andel") {
  if (unit === "%") return `${(value * 100).toFixed(1)} %`;
  return `${Math.round(value).toLocaleString("nb-NO")} kr`;
}

export function MetricTrendChart({
  label,
  unit,
  points,
}: {
  label: string;
  unit: "kr" | "%" | "andel";
  points: TrendPoint[];
}) {
  const chartData = points.map((p) => ({ ...p, value: p.value ?? null }));
  const latest = [...points].reverse().find((p) => p.value != null);
  const hasEnoughData = points.filter((p) => p.value != null).length >= 2;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-brand-dark">
        {latest?.value != null ? formatValue(latest.value, unit) : "—"}
      </p>

      {hasEnoughData ? (
        <div className="mt-3 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                formatter={(value: number) => formatValue(value, unit)}
                labelFormatter={(label) => label as string}
                contentStyle={{ fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1E8A5F"
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-400">
          Fyll ut enda en kartlegging for å se utvikling over tid.
        </p>
      )}
    </div>
  );
}
