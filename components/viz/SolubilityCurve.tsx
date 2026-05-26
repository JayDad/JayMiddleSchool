"use client";

import { useState } from "react";

type Substance = {
  name: string;
  color: string;
  // 용해도 (g / 물 100g) at given temperature
  data: Record<number, number>;
};

const DATA: Substance[] = [
  {
    name: "질산칼륨 KNO₃",
    color: "#2563eb",
    data: { 0: 13, 20: 32, 40: 64, 60: 110, 80: 169, 100: 246 },
  },
  {
    name: "염화나트륨 NaCl",
    color: "#16a34a",
    data: { 0: 35.7, 20: 35.9, 40: 36.4, 60: 37.1, 80: 38.0, 100: 39.2 },
  },
  {
    name: "황산구리 CuSO₄",
    color: "#9333ea",
    data: { 0: 14, 20: 20, 40: 28, 60: 40, 80: 55, 100: 75 },
  },
];

const VIEW_W = 520;
const VIEW_H = 320;
const PAD = { l: 48, r: 16, t: 16, b: 40 };

export default function SolubilityCurve() {
  const [temp, setTemp] = useState(60);
  const [mass, setMass] = useState(80);
  const [substance, setSubstance] = useState(DATA[0].name);

  const xMin = 0;
  const xMax = 100;
  const yMin = 0;
  const yMax = 260;

  const x = (t: number) =>
    PAD.l + ((t - xMin) / (xMax - xMin)) * (VIEW_W - PAD.l - PAD.r);
  const y = (g: number) =>
    PAD.t + (1 - (g - yMin) / (yMax - yMin)) * (VIEW_H - PAD.t - PAD.b);

  const active = DATA.find((d) => d.name === substance)!;
  const solubilityAt = (s: Substance, t: number) => {
    const temps = Object.keys(s.data).map(Number).sort((a, b) => a - b);
    for (let i = 0; i < temps.length - 1; i++) {
      const a = temps[i];
      const b = temps[i + 1];
      if (t >= a && t <= b) {
        const ratio = (t - a) / (b - a);
        return s.data[a] + (s.data[b] - s.data[a]) * ratio;
      }
    }
    return s.data[temps[temps.length - 1]];
  };

  const currentSol = solubilityAt(active, temp);
  const dissolved = Math.min(mass, currentSol);
  const undissolved = Math.max(0, mass - currentSol);

  const pathFor = (s: Substance) => {
    const temps = Object.keys(s.data).map(Number).sort((a, b) => a - b);
    return temps
      .map((t, i) => `${i === 0 ? "M" : "L"} ${x(t)} ${y(s.data[t])}`)
      .join(" ");
  };

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        {DATA.map((s) => (
          <button
            key={s.name}
            onClick={() => setSubstance(s.name)}
            className={`text-sm px-3 py-1 rounded-full border ${
              s.name === substance
                ? "text-white border-transparent"
                : "border-slate-300 text-slate-600 hover:border-brand-500"
            }`}
            style={
              s.name === substance ? { background: s.color } : undefined
            }
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="viz-scroll">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto"
        role="img"
        aria-label="용해도 곡선"
      >
        {/* y grid */}
        {[0, 50, 100, 150, 200, 250].map((g) => (
          <g key={g}>
            <line
              x1={PAD.l}
              x2={VIEW_W - PAD.r}
              y1={y(g)}
              y2={y(g)}
              stroke="#e2e8f0"
            />
            <text
              x={PAD.l - 6}
              y={y(g) + 3}
              textAnchor="end"
              fontSize="10"
              fill="#64748b"
            >
              {g}
            </text>
          </g>
        ))}
        {/* x ticks */}
        {[0, 20, 40, 60, 80, 100].map((t) => (
          <g key={t}>
            <line
              x1={x(t)}
              x2={x(t)}
              y1={VIEW_H - PAD.b}
              y2={VIEW_H - PAD.b + 4}
              stroke="#94a3b8"
            />
            <text
              x={x(t)}
              y={VIEW_H - PAD.b + 16}
              textAnchor="middle"
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

        {/* curves */}
        {DATA.map((s) => (
          <path
            key={s.name}
            d={pathFor(s)}
            fill="none"
            stroke={s.color}
            strokeWidth={s.name === substance ? 3 : 1.5}
            opacity={s.name === substance ? 1 : 0.35}
          />
        ))}

        {/* current temp vertical line */}
        <line
          x1={x(temp)}
          x2={x(temp)}
          y1={PAD.t}
          y2={VIEW_H - PAD.b}
          stroke="#0f172a"
          strokeDasharray="3 3"
        />
        <circle
          cx={x(temp)}
          cy={y(currentSol)}
          r={6}
          fill={active.color}
          stroke="white"
          strokeWidth={2.5}
          style={{ transition: "cx 0.15s linear, cy 0.15s linear" }}
        >
          <animate
            attributeName="r"
            values="6;9;6"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x={x(temp) + 10}
          y={y(currentSol) - 10}
          fontSize="12"
          fontWeight="600"
          fill="#0f172a"
          style={{ transition: "x 0.15s linear, y 0.15s linear" }}
        >
          {currentSol.toFixed(1)} g
        </text>

        {/* labels */}
        <text
          x={PAD.l - 36}
          y={PAD.t + 12}
          fontSize="11"
          fill="#475569"
          transform={`rotate(-90 ${PAD.l - 36} ${PAD.t + 12})`}
        >
          용해도 (g/물100g)
        </text>
        <text
          x={VIEW_W - PAD.r}
          y={VIEW_H - 6}
          textAnchor="end"
          fontSize="11"
          fill="#475569"
        >
          온도 (℃)
        </text>
      </svg>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <label className="block">
          <div className="flex justify-between text-sm text-slate-600">
            <span>온도</span>
            <span className="font-semibold text-slate-900">{temp} ℃</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
        </label>
        <label className="block">
          <div className="flex justify-between text-sm text-slate-600">
            <span>물 100g에 넣은 양</span>
            <span className="font-semibold text-slate-900">{mass} g</span>
          </div>
          <input
            type="range"
            min={0}
            max={250}
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
        </label>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-3 items-stretch">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center text-xs sm:text-sm">
          <div className="rounded-lg bg-emerald-50 p-2 transition-colors">
            <div className="text-xs text-emerald-700">녹는 양</div>
            <div
              className="font-bold text-emerald-800 tabular-nums"
              style={{ transition: "color 0.2s" }}
            >
              {dissolved.toFixed(1)} g
            </div>
            <div className="mt-1 h-1.5 rounded bg-emerald-100 overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{
                  width: `${Math.min(100, (dissolved / Math.max(mass, 1)) * 100)}%`,
                  transition: "width 0.2s linear",
                }}
              />
            </div>
          </div>
          <div className="rounded-lg bg-amber-50 p-2 transition-colors">
            <div className="text-xs text-amber-700">안 녹고 남는 양</div>
            <div className="font-bold text-amber-800 tabular-nums">
              {undissolved.toFixed(1)} g
            </div>
            <div className="mt-1 h-1.5 rounded bg-amber-100 overflow-hidden">
              <div
                className="h-full bg-amber-500"
                style={{
                  width: `${Math.min(100, (undissolved / Math.max(mass, 1)) * 100)}%`,
                  transition: "width 0.2s linear",
                }}
              />
            </div>
          </div>
          <div
            className={`rounded-lg p-2 transition-colors ${
              undissolved > 0
                ? "bg-amber-100"
                : dissolved === currentSol
                  ? "bg-blue-50"
                  : "bg-slate-100"
            }`}
          >
            <div className="text-xs text-slate-600">상태</div>
            <div className="font-bold text-slate-800">
              {undissolved > 0
                ? "포화 + 남음"
                : dissolved === currentSol
                  ? "포화"
                  : "불포화"}
            </div>
          </div>
        </div>

        {/* mini beaker — water level fixed (100 g), solution color deepens
            with dissolved concentration, undissolved solute settles as crystals. */}
        <div className="flex flex-col items-center sm:items-end">
          <svg viewBox="0 0 80 100" className="w-16 h-20" aria-label="비커 시각화">
            {/* beaker outline */}
            <path
              d="M10 15 L10 90 Q10 95 15 95 L65 95 Q70 95 70 90 L70 15"
              fill="none"
              stroke="#94a3b8"
              strokeWidth={2}
            />
            {/* fixed water level (100 g) */}
            <rect
              x={11}
              y={35}
              width={58}
              height={60}
              fill={active.color}
              opacity={Math.min(0.7, 0.1 + (dissolved / currentSol) * 0.55)}
              style={{ transition: "opacity 0.2s" }}
            />
            {/* water surface line */}
            <line x1={11} y1={35} x2={69} y2={35} stroke="#94a3b8" strokeWidth={1} />
            {/* undissolved crystals — pile grows upward with amount */}
            {undissolved > 0 && (() => {
              const COLS = 10;             // crystals per row
              const COL_W = 5.4;           // horizontal spacing
              const ROW_H = 3.6;           // vertical spacing
              const R = 1.6;
              const X0 = 14;               // left edge of pile
              const FLOOR_Y = 93;          // bottom row center
              const SURFACE_Y = 36;        // water surface (cap rows here)
              const maxRows = Math.floor((FLOOR_Y - SURFACE_Y) / ROW_H);
              // Scale: 1 crystal per ~2 g of undissolved solute (visual)
              const count = Math.min(
                COLS * maxRows,
                Math.ceil(undissolved / 2),
              );
              return (
                <g>
                  {Array.from({ length: count }).map((_, i) => {
                    const row = Math.floor(i / COLS);
                    const col = i % COLS;
                    // alternate odd rows half-step for a pile look
                    const offset = row % 2 === 0 ? 0 : COL_W / 2;
                    return (
                      <circle
                        key={i}
                        cx={X0 + col * COL_W + offset}
                        cy={FLOOR_Y - row * ROW_H}
                        r={R}
                        fill={active.color}
                      />
                    );
                  })}
                </g>
              );
            })()}
          </svg>
          <div className="text-[10px] text-slate-500 mt-1">물 100 g</div>
        </div>
      </div>
    </div>
  );
}
