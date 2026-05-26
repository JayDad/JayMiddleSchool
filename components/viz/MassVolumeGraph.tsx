"use client";

import { useState } from "react";

const W = 420;
const H = 280;
const PAD_L = 50;
const PAD_R = 20;
const PAD_T = 24;
const PAD_B = 40;
const X0 = PAD_L;
const Y0 = H - PAD_B;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

// x = volume (0..30 cm³), y = mass (0..40 g)
const VMAX = 30;
const MMAX = 40;

const MATERIALS = [
  { name: "코르크", density: 0.24, color: "#d97706" },
  { name: "얼음", density: 0.92, color: "#0ea5e9" },
  { name: "물", density: 1.0, color: "#2563eb" },
  { name: "알루미늄", density: 2.7, color: "#94a3b8" },
];

const xAt = (v: number) => X0 + (v / VMAX) * PLOT_W;
const yAt = (m: number) => Y0 - (m / MMAX) * PLOT_H;

export default function MassVolumeGraph() {
  const [volume, setVolume] = useState(10);
  const [highlight, setHighlight] = useState<string>("물");

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="viz-scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label="질량-부피 그래프"
        >
          {/* axes */}
          <line x1={X0} y1={Y0} x2={X0 + PLOT_W} y2={Y0} stroke="#94a3b8" strokeWidth={1.5} />
          <line x1={X0} y1={Y0} x2={X0} y2={Y0 - PLOT_H} stroke="#94a3b8" strokeWidth={1.5} />

          {/* ticks: volume */}
          {[0, 10, 20, 30].map((v) => (
            <g key={`v${v}`}>
              <line x1={xAt(v)} y1={Y0} x2={xAt(v)} y2={Y0 + 4} stroke="#94a3b8" />
              <text x={xAt(v)} y={Y0 + 16} fontSize="10" fill="#475569" textAnchor="middle">
                {v}
              </text>
            </g>
          ))}
          <text x={X0 + PLOT_W / 2} y={H - 6} textAnchor="middle" fontSize="11" fill="#0f172a">
            부피 (cm³)
          </text>
          {/* ticks: mass */}
          {[0, 10, 20, 30, 40].map((m) => (
            <g key={`m${m}`}>
              <line x1={X0 - 4} y1={yAt(m)} x2={X0} y2={yAt(m)} stroke="#94a3b8" />
              <text x={X0 - 8} y={yAt(m) + 4} fontSize="10" fill="#475569" textAnchor="end">
                {m}
              </text>
            </g>
          ))}
          <text x={X0 - 32} y={PAD_T + 4} fontSize="11" fill="#0f172a">
            질량 (g)
          </text>

          {/* lines for each material */}
          {MATERIALS.map((mat) => {
            // line up to where it exits the plot
            const vEnd = Math.min(VMAX, MMAX / mat.density);
            const x1 = xAt(0);
            const y1 = yAt(0);
            const x2 = xAt(vEnd);
            const y2 = yAt(vEnd * mat.density);
            const isHi = highlight === mat.name;
            return (
              <g key={mat.name}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={mat.color}
                  strokeWidth={isHi ? 3 : 1.5}
                  opacity={isHi ? 1 : 0.55}
                />
                <text
                  x={x2 + 4}
                  y={y2 - 4}
                  fontSize="10"
                  fill={mat.color}
                  fontWeight={isHi ? 700 : 400}
                >
                  {mat.name}
                </text>
              </g>
            );
          })}

          {/* highlighted point at chosen volume */}
          {(() => {
            const mat = MATERIALS.find((m) => m.name === highlight)!;
            const mass = volume * mat.density;
            const px = xAt(volume);
            const py = yAt(Math.min(MMAX, mass));
            return (
              <g>
                <line x1={px} y1={Y0} x2={px} y2={py} stroke="#cbd5e1" strokeDasharray="3 3" />
                <line x1={X0} y1={py} x2={px} y2={py} stroke="#cbd5e1" strokeDasharray="3 3" />
                <circle cx={px} cy={py} r={6} fill={mat.color} stroke="#0f172a" strokeWidth={1.5} />
                <text x={px + 10} y={py - 6} fontSize="11" fill="#0f172a" fontWeight={600}>
                  {volume} cm³, {mass.toFixed(1)} g
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">물질 선택</p>
          <div className="flex flex-wrap gap-2">
            {MATERIALS.map((m) => (
              <button
                key={m.name}
                onClick={() => setHighlight(m.name)}
                className={`text-sm px-3 py-1.5 rounded-full border ${
                  highlight === m.name
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-slate-300 text-slate-600 hover:border-brand-500"
                }`}
              >
                {m.name}{" "}
                <span className="text-xs opacity-70 ml-1">({m.density} g/cm³)</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">
            부피: <span className="tabular-nums">{volume}</span> cm³
          </p>
          <input
            type="range"
            min={0}
            max={VMAX}
            step={1}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full"
            aria-label="부피 선택"
          />
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            <strong className="text-slate-800">직선의 기울기 = 밀도</strong>.
            기울기가 가파를수록 같은 부피에 질량이 많이 들어가는 무거운 물질이에요.
          </p>
        </div>
      </div>
    </div>
  );
}
