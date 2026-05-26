"use client";

import { useState } from "react";

const W = 460;
const H = 280;
const PAD_L = 50;
const PAD_R = 20;
const PAD_T = 24;
const PAD_B = 40;
const X0 = PAD_L;
const Y0 = H - PAD_B;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const TMAX = 130;

const xAt = (p: number) => X0 + p * PLOT_W;
const yAt = (t: number) => Y0 - (t / TMAX) * PLOT_H;

// Pure substance heating curve (water): 0..30s rise to 100, plateau, post-rise
function pureTemp(p: number): number {
  if (p < 0.2) return 20 + (100 - 20) * (p / 0.2);
  if (p < 0.75) return 100;
  return 100 + (118 - 100) * ((p - 0.75) / 0.25);
}

// Mixture (salt water): no clean plateau — temperature keeps rising slowly while boiling
function mixTemp(p: number): number {
  if (p < 0.2) return 20 + (100 - 20) * (p / 0.2);
  // Slow rise during "boiling" — from 100 to ~110
  if (p < 0.85) return 100 + (110 - 100) * ((p - 0.2) / 0.65);
  return 110 + (122 - 110) * ((p - 0.85) / 0.15);
}

export default function PureMixtureCurve() {
  const [mode, setMode] = useState<"pure" | "mixture" | "both">("both");

  const samples = 120;
  const buildPath = (f: (p: number) => number) => {
    let d = "";
    for (let i = 0; i <= samples; i++) {
      const p = i / samples;
      const x = xAt(p);
      const y = yAt(f(p));
      d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return d;
  };

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        {(
          [
            { id: "pure", label: "순물질 (물)" },
            { id: "mixture", label: "혼합물 (소금물)" },
            { id: "both", label: "둘 다 비교" },
          ] as const
        ).map((b) => (
          <button
            key={b.id}
            onClick={() => setMode(b.id)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              mode === b.id
                ? "bg-brand-600 text-white border-brand-600"
                : "border-slate-300 text-slate-600 hover:border-brand-500"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="viz-scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label="순물질과 혼합물의 가열곡선 비교"
        >
          {/* axes */}
          <line x1={X0} y1={Y0} x2={X0 + PLOT_W} y2={Y0} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PLOT_H} stroke="#94a3b8" strokeWidth={1.5} />
          {[0, 20, 40, 60, 80, 100, 120].map((v) => (
            <g key={v}>
              <line x1={X0 - 4} y1={yAt(v)} x2={X0} y2={yAt(v)} stroke="#94a3b8" />
              <text x={X0 - 8} y={yAt(v) + 4} textAnchor="end" fontSize="10" fill="#475569">
                {v}
              </text>
            </g>
          ))}
          <text x={X0 - 32} y={PAD_T + 6} fontSize="11" fill="#0f172a">℃</text>
          <text x={X0 + PLOT_W / 2} y={H - 10} textAnchor="middle" fontSize="11" fill="#0f172a">
            시간 →
          </text>

          {/* reference 100℃ */}
          <line x1={X0} y1={yAt(100)} x2={X0 + PLOT_W} y2={yAt(100)} stroke="#cbd5e1" strokeDasharray="3 3" />
          <text x={X0 + PLOT_W - 4} y={yAt(100) - 4} textAnchor="end" fontSize="10" fill="#94a3b8">
            100℃
          </text>

          {(mode === "pure" || mode === "both") && (
            <g>
              <path d={buildPath(pureTemp)} stroke="#2563eb" strokeWidth={2.4} fill="none" />
              {/* highlight horizontal plateau */}
              <line
                x1={xAt(0.2)}
                y1={yAt(100)}
                x2={xAt(0.75)}
                y2={yAt(100)}
                stroke="#2563eb"
                strokeWidth={4}
                opacity={0.25}
              />
              <text x={xAt(0.475)} y={yAt(100) - 10} textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight={600}>
                수평구간 — 끓는점 일정
              </text>
            </g>
          )}
          {(mode === "mixture" || mode === "both") && (
            <g>
              <path d={buildPath(mixTemp)} stroke="#dc2626" strokeWidth={2.4} fill="none" strokeDasharray={mode === "both" ? "0" : "0"} />
              <text
                x={xAt(0.55)}
                y={yAt(mixTemp(0.55)) - 8}
                textAnchor="middle"
                fontSize="10"
                fill="#dc2626"
                fontWeight={600}
              >
                온도가 계속 변함
              </text>
            </g>
          )}

          {mode === "both" && (
            <g>
              <rect x={X0 + 8} y={PAD_T + 4} width={120} height={36} fill="#fff" stroke="#e2e8f0" rx={4} />
              <line x1={X0 + 14} y1={PAD_T + 14} x2={X0 + 30} y2={PAD_T + 14} stroke="#2563eb" strokeWidth={3} />
              <text x={X0 + 34} y={PAD_T + 18} fontSize="10" fill="#0f172a">
                순물질 (물)
              </text>
              <line x1={X0 + 14} y1={PAD_T + 30} x2={X0 + 30} y2={PAD_T + 30} stroke="#dc2626" strokeWidth={3} />
              <text x={X0 + 34} y={PAD_T + 34} fontSize="10" fill="#0f172a">
                혼합물 (소금물)
              </text>
            </g>
          )}
        </svg>
      </div>

      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
        순물질은 끓는 동안 <strong className="text-slate-800">수평구간(평평한 부분)</strong>이
        뚜렷이 나오는 반면, 혼합물은 끓는 동안에도 온도가 조금씩 계속 올라가요.
        이 차이가 순물질·혼합물을 구별하는 핵심 신호입니다.
      </p>
    </div>
  );
}
