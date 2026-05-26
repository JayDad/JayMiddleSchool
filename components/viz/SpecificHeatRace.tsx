"use client";

import { useEffect, useRef, useState } from "react";

type Substance = {
  key: string;
  label: string;
  c: number;
  color: string;
};

const SUBSTANCES: Substance[] = [
  { key: "water", label: "물", c: 4.18, color: "#3b82f6" },
  { key: "oil", label: "식용유", c: 2.0, color: "#f59e0b" },
  { key: "sand", label: "모래", c: 0.84, color: "#a16207" },
  { key: "iron", label: "철", c: 0.45, color: "#64748b" },
];

const M = 100;
const HEAT_PER_SEC = 200;
const T0 = 20;
const T_MAX = 100;
const DUR = 8;

export default function SpecificHeatRace() {
  const [a, setA] = useState<Substance>(SUBSTANCES[0]);
  const [b, setB] = useState<Substance>(SUBSTANCES[3]);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const startRef = useRef<number | null>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    const step = (now: number) => {
      if (startRef.current === null) startRef.current = now - tRef.current * 1000;
      const elapsed = (now - startRef.current) / 1000;
      const next = Math.min(elapsed, DUR);
      tRef.current = next;
      setT(next);
      if (next >= DUR) {
        setPlaying(false);
        startRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [playing]);

  const tempOf = (s: Substance) => {
    const dT = (HEAT_PER_SEC * t) / (s.c * M);
    return Math.min(T0 + dT, T_MAX);
  };

  const Ta = tempOf(a);
  const Tb = tempOf(b);

  const reset = () => {
    setPlaying(false);
    tRef.current = 0;
    startRef.current = null;
    setT(0);
  };

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        {[
          { label: "A 물질", value: a, set: setA },
          { label: "B 물질", value: b, set: setB },
        ].map((row) => (
          <div key={row.label}>
            <div className="text-xs text-slate-500 mb-1">{row.label}</div>
            <div className="flex flex-wrap gap-1.5">
              {SUBSTANCES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => {
                    row.set(s);
                    reset();
                  }}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    s.key === row.value.key
                      ? "bg-brand-600 text-white border-brand-600"
                      : "border-slate-300 text-slate-600 hover:border-brand-500"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => {
            if (t >= DUR) {
              tRef.current = 0;
              startRef.current = null;
              setT(0);
            }
            setPlaying((p) => !p);
          }}
          className="text-sm px-3 py-1.5 rounded-full bg-brand-600 text-white hover:bg-brand-700"
        >
          {playing ? "⏸ 일시정지" : t >= DUR ? "↺ 다시" : "▶ 동시 가열"}
        </button>
        <input
          type="range"
          min={0}
          max={DUR}
          step={0.05}
          value={t}
          onChange={(e) => {
            setPlaying(false);
            const v = Number(e.target.value);
            tRef.current = v;
            startRef.current = null;
            setT(v);
          }}
          className="flex-1"
        />
        <div className="text-xs text-slate-500 tabular-nums w-14 text-right">
          {t.toFixed(1)}s
        </div>
      </div>

      <div className="viz-scroll">
        <svg viewBox="0 0 420 220" className="w-full h-auto">
          <Thermometer x={70} label={a.label} color={a.color} temp={Ta} c={a.c} />
          <Thermometer x={210} label={b.label} color={b.color} temp={Tb} c={b.c} />
          <Graph x={300} a={a} b={b} t={t} />
        </svg>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        같은 질량({M} g), 같은 열량(매초 {HEAT_PER_SEC} J)을 받았을 때 — 비열이 작을수록 더 빨리 뜨거워진다.
      </div>
    </div>
  );
}

function Thermometer({
  x,
  label,
  color,
  temp,
  c,
}: {
  x: number;
  label: string;
  color: string;
  temp: number;
  c: number;
}) {
  const top = 30;
  const bot = 170;
  const h = bot - top;
  const frac = (temp - T0) / (T_MAX - T0);
  const fillY = bot - frac * h;
  return (
    <g transform={`translate(${x} 0)`}>
      <text x={0} y={20} textAnchor="middle" fontSize="12" fill="#475569" fontWeight="600">
        {label}
      </text>
      <rect x={-8} y={top} width={16} height={h} fill="#f1f5f9" stroke="#94a3b8" rx={3} />
      <rect
        x={-6}
        y={fillY}
        width={12}
        height={bot - fillY}
        fill={color}
        opacity={0.85}
      />
      <circle cx={0} cy={bot + 12} r={11} fill={color} stroke="#475569" />
      {[20, 40, 60, 80, 100].map((mark) => {
        const my = bot - ((mark - T0) / (T_MAX - T0)) * h;
        return (
          <g key={mark}>
            <line x1={-12} x2={-8} y1={my} y2={my} stroke="#94a3b8" />
            <text x={-15} y={my + 3} textAnchor="end" fontSize="9" fill="#64748b">
              {mark}
            </text>
          </g>
        );
      })}
      <text x={0} y={200} textAnchor="middle" fontSize="11" fill="#0f172a" fontWeight="600">
        {temp.toFixed(1)}℃
      </text>
      <text x={0} y={213} textAnchor="middle" fontSize="9" fill="#64748b">
        c = {c.toFixed(2)}
      </text>
    </g>
  );
}

function Graph({ x, a, b, t }: { x: number; a: Substance; b: Substance; t: number }) {
  const W = 100;
  const H = 140;
  const x0 = x;
  const y0 = 170;
  const tempToY = (T: number) => y0 - ((T - T0) / (T_MAX - T0)) * H;
  const tToX = (tt: number) => x0 + (tt / DUR) * W;

  const buildPath = (s: Substance) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const tt = (i / 40) * t;
      const T = Math.min(T0 + (HEAT_PER_SEC * tt) / (s.c * M), T_MAX);
      pts.push(`${tToX(tt).toFixed(1)},${tempToY(T).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  return (
    <g>
      <line x1={x0} x2={x0} y1={y0} y2={y0 - H} stroke="#94a3b8" />
      <line x1={x0} x2={x0 + W} y1={y0} y2={y0} stroke="#94a3b8" />
      <text x={x0 - 4} y={y0 - H - 4} textAnchor="end" fontSize="9" fill="#64748b">℃</text>
      <text x={x0 + W + 2} y={y0 + 10} fontSize="9" fill="#64748b">s</text>
      {[40, 60, 80, 100].map((mark) => {
        const my = tempToY(mark);
        return (
          <g key={mark}>
            <line x1={x0 - 2} x2={x0} y1={my} y2={my} stroke="#94a3b8" />
            <text x={x0 - 4} y={my + 3} textAnchor="end" fontSize="8" fill="#94a3b8">{mark}</text>
          </g>
        );
      })}
      <polyline points={buildPath(a)} fill="none" stroke={a.color} strokeWidth={2} />
      <polyline points={buildPath(b)} fill="none" stroke={b.color} strokeWidth={2} />
      <text x={x0 + 4} y={y0 - H + 12} fontSize="9" fill={a.color} fontWeight="600">{a.label}</text>
      <text x={x0 + 4} y={y0 - H + 24} fontSize="9" fill={b.color} fontWeight="600">{b.label}</text>
      <text x={x0 + W / 2} y={y0 + 22} textAnchor="middle" fontSize="10" fill="#475569">
        시간-온도
      </text>
    </g>
  );
}
