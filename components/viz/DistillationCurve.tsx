"use client";

import { useEffect, useRef, useState } from "react";

const W = 480;
const H = 280;
const PAD_L = 50;
const PAD_R = 20;
const PAD_T = 24;
const PAD_B = 40;
const X0 = PAD_L;
const Y0 = H - PAD_B;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

// y-axis: temperature 0..140
// x-axis: time 0..1
// Two-stage curve: rise → plateau at BP1 (78℃ ethanol) → rise → plateau at BP2 (100℃ water)

const BP1 = 78;
const BP2 = 100;
const TMAX = 140;

// segments along time (cumulative)
const SEG = [
  { from: 0.0, to: 0.18, fromT: 22, toT: BP1 }, // rise to BP1
  { from: 0.18, to: 0.42, fromT: BP1, toT: BP1 }, // plateau BP1
  { from: 0.42, to: 0.55, fromT: BP1, toT: BP2 }, // rise to BP2
  { from: 0.55, to: 0.85, fromT: BP2, toT: BP2 }, // plateau BP2
  { from: 0.85, to: 1.0, fromT: BP2, toT: 118 }, // small post-rise
];

function tempAt(p: number): number {
  for (const s of SEG) {
    if (p >= s.from && p <= s.to) {
      const r = (p - s.from) / (s.to - s.from);
      return s.fromT + (s.toT - s.fromT) * r;
    }
  }
  return SEG[SEG.length - 1].toT;
}

function xAt(p: number) {
  return X0 + p * PLOT_W;
}
function yAt(temp: number) {
  return Y0 - (temp / TMAX) * PLOT_H;
}

export default function DistillationCurve() {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 6000;

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
      return;
    }
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts - t * DURATION;
      const p = Math.min(1, (ts - startRef.current) / DURATION);
      setT(p);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else setPlaying(false);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]); // eslint-disable-line react-hooks/exhaustive-deps

  // build path up to time t
  const samples = 200;
  const cutoff = Math.max(2, Math.round(t * samples));
  let pathD = "";
  for (let i = 0; i <= cutoff; i++) {
    const p = (i / samples);
    const x = xAt(p);
    const y = yAt(tempAt(p));
    pathD += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }

  const currentTemp = tempAt(t);
  const cx = xAt(t);
  const cy = yAt(currentTemp);

  const phaseLabel = (() => {
    if (t < 0.18) return "가열 — 끓는점에 도달 중";
    if (t < 0.42) return "에탄올(BP 78℃) 분리 중 — 받는 그릇에 모임";
    if (t < 0.55) return "에탄올 다 끓음 — 다시 온도 상승";
    if (t < 0.85) return "물(BP 100℃) 분리 중";
    return "거의 끝 — 약간의 후잔";
  })();

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="viz-scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label="에탄올-물 혼합액의 증류 가열곡선"
        >
          {/* axes */}
          <line x1={X0} y1={Y0} x2={X0 + PLOT_W} y2={Y0} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PLOT_H} stroke="#94a3b8" strokeWidth={1.5} />

          {/* y-axis temperature ticks */}
          {[0, 20, 40, 60, 80, 100, 120, 140].map((v) => (
            <g key={v}>
              <line x1={X0 - 4} y1={yAt(v)} x2={X0} y2={yAt(v)} stroke="#94a3b8" />
              <text x={X0 - 8} y={yAt(v) + 4} textAnchor="end" fontSize="10" fill="#475569">
                {v}
              </text>
            </g>
          ))}
          <text x={X0 - 32} y={PAD_T + 8} fontSize="11" fill="#0f172a">℃</text>

          {/* x-axis label */}
          <text x={X0 + PLOT_W / 2} y={H - 10} textAnchor="middle" fontSize="11" fill="#0f172a">
            시간 →
          </text>

          {/* dashed lines for BPs */}
          <line x1={X0} y1={yAt(BP1)} x2={X0 + PLOT_W} y2={yAt(BP1)} stroke="#0ea5e9" strokeDasharray="4 4" strokeWidth={1} />
          <text x={X0 + PLOT_W - 4} y={yAt(BP1) - 4} textAnchor="end" fontSize="10" fill="#0ea5e9">
            에탄올 78℃
          </text>
          <line x1={X0} y1={yAt(BP2)} x2={X0 + PLOT_W} y2={yAt(BP2)} stroke="#22c55e" strokeDasharray="4 4" strokeWidth={1} />
          <text x={X0 + PLOT_W - 4} y={yAt(BP2) - 4} textAnchor="end" fontSize="10" fill="#16a34a">
            물 100℃
          </text>

          {/* curve */}
          <path d={pathD} stroke="#1e40af" strokeWidth={2.2} fill="none" />

          {/* current point */}
          <circle cx={cx} cy={cy} r={5} fill="#1e40af">
            <animate attributeName="r" values="4;6;4" dur="0.9s" repeatCount="indefinite" />
          </circle>
          <text x={cx + 8} y={cy - 8} fontSize="11" fill="#1e40af" fontWeight={600}>
            {currentTemp.toFixed(0)}℃
          </text>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => {
            if (t >= 1) setT(0);
            setPlaying((p) => !p);
          }}
          className="text-sm px-3 py-1.5 rounded-full border border-brand-500 bg-brand-600 text-white hover:bg-brand-700"
        >
          {playing ? "■ 정지" : "▶ 재생"}
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setT(0);
          }}
          className="text-sm px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:border-brand-500"
        >
          처음으로
        </button>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(t * 1000)}
          onChange={(e) => {
            setPlaying(false);
            setT(Number(e.target.value) / 1000);
          }}
          className="flex-1 min-w-[140px]"
          aria-label="진행도"
        />
        <span className="text-xs text-slate-500 tabular-nums">{Math.round(t * 100)}%</span>
      </div>
      <p className="text-sm text-slate-700 mt-3 leading-relaxed">
        <span className="font-semibold">현재:</span> {phaseLabel}
      </p>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
        에탄올-물 혼합액을 가열하면 끓는점이 낮은 <strong className="text-slate-800">에탄올이 먼저</strong>
        끓어서 거의 다 빠져나갈 때까지 78℃ 부근에서 온도가 유지돼요. 그 후 다시
        온도가 올라 100℃에서 물이 끓기 시작합니다.
      </p>
    </div>
  );
}
