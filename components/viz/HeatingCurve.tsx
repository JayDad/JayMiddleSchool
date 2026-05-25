"use client";

import { useMemo, useState } from "react";

type Substance = {
  name: string;
  meltingPoint: number;
  boilingPoint: number;
  color: string;
};

const SUBSTANCES: Record<string, Substance> = {
  water: {
    name: "물",
    meltingPoint: 0,
    boilingPoint: 100,
    color: "#2563eb",
  },
  ethanol: {
    name: "에탄올",
    meltingPoint: -114,
    boilingPoint: 78,
    color: "#16a34a",
  },
  mercury: {
    name: "수은",
    meltingPoint: -39,
    boilingPoint: 357,
    color: "#9333ea",
  },
};

const VIEW_W = 520;
const VIEW_H = 280;
const PAD = { l: 48, r: 16, t: 16, b: 36 };

export default function HeatingCurve({
  substance = "water",
  showAmountToggle = true,
}: {
  substance?: keyof typeof SUBSTANCES;
  showAmountToggle?: boolean;
}) {
  const [key, setKey] = useState<keyof typeof SUBSTANCES>(substance);
  const [amount, setAmount] = useState<"small" | "large">("small");
  const s = SUBSTANCES[key];

  const { yMin, yMax } = useMemo(() => {
    const yMin = Math.min(s.meltingPoint - 20, -20);
    const yMax = Math.max(s.boilingPoint + 40, 120);
    return { yMin, yMax };
  }, [s]);

  const xMax = 10;
  const segLen = amount === "small" ? 1.2 : 2.4;

  const points: [number, number][] = [
    [0, yMin + 10],
    [1.5, s.meltingPoint],
    [1.5 + segLen, s.meltingPoint],
    [1.5 + segLen + 2, s.boilingPoint],
    [1.5 + segLen + 2 + segLen, s.boilingPoint],
    [xMax, s.boilingPoint + 20],
  ];

  const x = (t: number) =>
    PAD.l + (t / xMax) * (VIEW_W - PAD.l - PAD.r);
  const y = (T: number) =>
    PAD.t +
    (1 - (T - yMin) / (yMax - yMin)) * (VIEW_H - PAD.t - PAD.b);

  const path = points
    .map(([t, T], i) => `${i === 0 ? "M" : "L"} ${x(t)} ${y(T)}`)
    .join(" ");

  const yTicks = niceTicks(yMin, yMax, 5);

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2 items-center mb-3 justify-between">
        <div className="flex gap-2">
          {(Object.keys(SUBSTANCES) as (keyof typeof SUBSTANCES)[]).map((k) => (
            <button
              key={k}
              onClick={() => setKey(k)}
              className={`text-sm px-3 py-1 rounded-full border ${
                k === key
                  ? "bg-brand-600 text-white border-brand-600"
                  : "border-slate-300 text-slate-600 hover:border-brand-500"
              }`}
            >
              {SUBSTANCES[k].name}
            </button>
          ))}
        </div>
        {showAmountToggle && (
          <div className="flex gap-2 text-sm items-center">
            <span className="text-slate-500">양:</span>
            <button
              onClick={() => setAmount("small")}
              className={`px-2 py-1 rounded border ${
                amount === "small"
                  ? "bg-slate-800 text-white border-slate-800"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              적게
            </button>
            <button
              onClick={() => setAmount("large")}
              className={`px-2 py-1 rounded border ${
                amount === "large"
                  ? "bg-slate-800 text-white border-slate-800"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              많이
            </button>
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`${s.name}의 가열곡선`}
      >
        {/* y grid */}
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.l}
              x2={VIEW_W - PAD.r}
              y1={y(t)}
              y2={y(t)}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
            <text
              x={PAD.l - 6}
              y={y(t) + 3}
              textAnchor="end"
              fontSize="10"
              fill="#64748b"
            >
              {t}
            </text>
          </g>
        ))}

        {/* axes */}
        <line
          x1={PAD.l}
          y1={PAD.t}
          x2={PAD.l}
          y2={VIEW_H - PAD.b}
          stroke="#94a3b8"
        />
        <line
          x1={PAD.l}
          y1={VIEW_H - PAD.b}
          x2={VIEW_W - PAD.r}
          y2={VIEW_H - PAD.b}
          stroke="#94a3b8"
        />

        {/* boiling/melting reference lines */}
        <line
          x1={PAD.l}
          x2={VIEW_W - PAD.r}
          y1={y(s.boilingPoint)}
          y2={y(s.boilingPoint)}
          stroke="#ef4444"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <text
          x={VIEW_W - PAD.r - 4}
          y={y(s.boilingPoint) - 4}
          textAnchor="end"
          fontSize="11"
          fill="#ef4444"
        >
          끓는점 {s.boilingPoint}℃
        </text>

        <line
          x1={PAD.l}
          x2={VIEW_W - PAD.r}
          y1={y(s.meltingPoint)}
          y2={y(s.meltingPoint)}
          stroke="#0ea5e9"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <text
          x={VIEW_W - PAD.r - 4}
          y={y(s.meltingPoint) - 4}
          textAnchor="end"
          fontSize="11"
          fill="#0ea5e9"
        >
          녹는점 {s.meltingPoint}℃
        </text>

        {/* curve */}
        <path
          d={path}
          fill="none"
          stroke={s.color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* labels */}
        <text
          x={PAD.l - 36}
          y={PAD.t + 12}
          fontSize="11"
          fill="#475569"
          transform={`rotate(-90 ${PAD.l - 36} ${PAD.t + 12})`}
        >
          온도 (℃)
        </text>
        <text
          x={VIEW_W - PAD.r}
          y={VIEW_H - 8}
          textAnchor="end"
          fontSize="11"
          fill="#475569"
        >
          시간 →
        </text>
      </svg>

      <p className="text-xs text-slate-500 mt-2">
        {amount === "small" ? "양을 적게" : "양을 많이"} 했을 때 — 끓는점·녹는점
        온도는 그대로, <strong>수평구간의 길이만</strong> 길어집니다.
      </p>
    </div>
  );
}

function niceTicks(min: number, max: number, n: number) {
  const step = Math.ceil((max - min) / n / 10) * 10;
  const ticks: number[] = [];
  const start = Math.ceil(min / step) * step;
  for (let v = start; v <= max; v += step) ticks.push(v);
  return ticks;
}
