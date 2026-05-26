"use client";

import { useState } from "react";

const VW = 420;
const VH = 260;
const CX = 180;
const CY = 130;

const LAYERS = [
  { key: "core", r: 30, fill: "#fde047", label: "중심부 (핵)", desc: "수소 핵융합 — 약 1,500만 K, 에너지 생성" },
  { key: "radiative", r: 55, fill: "#fbbf24", label: "복사층", desc: "빛(복사)으로 에너지 전달 — 수십만 년 걸림" },
  { key: "convective", r: 75, fill: "#f97316", label: "대류층", desc: "뜨거운 기체가 위로 솟구치며 에너지 전달" },
  { key: "photosphere", r: 90, fill: "#fb923c", label: "광구(光球)", desc: "우리가 보는 태양의 표면 — 약 6,000 K" },
  { key: "chromosphere", r: 100, fill: "#fca5a5", label: "채층(彩層)", desc: "광구 위 얇은 붉은빛 층 — 개기일식 때 보임" },
  { key: "corona", r: 120, fill: "#fee2e2", label: "코로나", desc: "태양 가장 바깥 대기 — 100만 K 이상, 개기일식 때 흰 빛으로 보임" },
];

export default function SunLayers() {
  const [showActivity, setShowActivity] = useState(true);
  const [selected, setSelected] = useState<string>("photosphere");
  const sel = LAYERS.find((l) => l.key === selected)!;

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={() => setShowActivity((s) => !s)}
          className={`text-sm px-3 py-1.5 rounded-full border ${
            showActivity
              ? "bg-brand-600 text-white border-brand-600"
              : "border-slate-300 text-slate-600 hover:border-brand-500"
          }`}
        >
          {showActivity ? "표면 활동 숨기기" : "표면 활동 보이기"}
        </button>
        <span className="text-xs text-slate-500">(흑점·홍염·플레어)</span>
      </div>

      <div className="viz-scroll">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-auto">
          <rect x={0} y={0} width={VW} height={VH} fill="#0f172a" />

          {/* outer corona (drawn first) — only the upper half so we can label the right side */}
          {/* draw layers from outermost to innermost */}
          {[...LAYERS].reverse().map((l) => {
            const isSel = l.key === selected;
            return (
              <circle
                key={l.key}
                cx={CX}
                cy={CY}
                r={l.r}
                fill={l.fill}
                opacity={l.key === "corona" ? 0.35 : l.key === "chromosphere" ? 0.7 : 1}
                stroke={isSel ? "#0ea5e9" : "none"}
                strokeWidth={isSel ? 2 : 0}
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(l.key)}
              />
            );
          })}

          {/* corona rays */}
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i * 360) / 16;
            const rad = (a * Math.PI) / 180;
            const x1 = CX + 115 * Math.cos(rad);
            const y1 = CY + 115 * Math.sin(rad);
            const x2 = CX + (130 + (i % 3) * 8) * Math.cos(rad);
            const y2 = CY + (130 + (i % 3) * 8) * Math.sin(rad);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fee2e2" strokeWidth={1} opacity={0.45} />
            );
          })}

          {showActivity && (
            <g>
              {/* sunspots on photosphere */}
              <ellipse cx={CX - 35} cy={CY + 20} rx={8} ry={5} fill="#7c2d12" />
              <ellipse cx={CX - 35} cy={CY + 20} rx={4} ry={2.5} fill="#1c1917" />
              <ellipse cx={CX + 20} cy={CY - 30} rx={6} ry={4} fill="#7c2d12" />
              <ellipse cx={CX + 20} cy={CY - 30} rx={3} ry={2} fill="#1c1917" />
              <text x={CX - 35} y={CY + 38} textAnchor="middle" fontSize="9" fill="#fde047" fontWeight="600">
                흑점
              </text>

              {/* prominence (홍염) — arc looping out from limb */}
              <path
                d={`M ${CX - 80} ${CY - 40} q -30 -40 -10 -70 q 30 -10 30 30`}
                fill="none"
                stroke="#ef4444"
                strokeWidth={3}
                opacity={0.85}
              />
              <text x={CX - 110} y={CY - 75} fontSize="9" fill="#fca5a5" fontWeight="600">
                홍염
              </text>

              {/* flare — bright spike */}
              <g transform={`translate(${CX + 75} ${CY - 50})`}>
                <path d="M 0 0 L 8 -18 L 4 -8 L 18 -10 L 6 -2 L 16 8 L 2 4 L 0 18 L -4 6 L -16 12 L -6 0 L -16 -8 L -2 -4 Z" fill="#fde047" />
                <text x={20} y={-10} fontSize="9" fill="#fde047" fontWeight="600">
                  플레어
                </text>
              </g>
            </g>
          )}

          {/* layer labels with leader lines */}
          {LAYERS.map((l, i) => {
            const yBase = 30 + i * 28;
            const labelX = 310;
            // leader line points from layer edge (top-right direction) to label
            const angle = -Math.PI / 4 + (i - 2.5) * 0.18;
            const ex = CX + l.r * Math.cos(angle);
            const ey = CY + l.r * Math.sin(angle);
            const isSel = l.key === selected;
            return (
              <g key={l.key} style={{ cursor: "pointer" }} onClick={() => setSelected(l.key)}>
                <line x1={ex} y1={ey} x2={labelX - 4} y2={yBase} stroke="#94a3b8" strokeWidth={0.6} />
                <text
                  x={labelX}
                  y={yBase + 4}
                  fontSize="10"
                  fill={isSel ? "#fbbf24" : "#e2e8f0"}
                  fontWeight={isSel ? 700 : 500}
                >
                  {l.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 p-3">
        <div className="font-bold text-slate-800 text-sm">{sel.label}</div>
        <div className="text-sm text-slate-600 mt-0.5">{sel.desc}</div>
      </div>

      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
        태양 내부에서 만들어진 에너지는 <strong>복사 → 대류</strong>를 거쳐 <strong>광구</strong>에서 빛으로 방출된다.
        표면에는 주변보다 온도가 낮아 어둡게 보이는 <strong>흑점</strong>, 자기장이 만든 거대한 불꽃 <strong>홍염·플레어</strong> 같은 활동이 관측된다.
      </p>
    </div>
  );
}
