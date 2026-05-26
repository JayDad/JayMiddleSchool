"use client";

import { useState } from "react";

type Mode = "size" | "distance";

type Planet = {
  key: string;
  name: string;
  // Earth radius (Earth = 1)
  radius: number;
  // AU (Earth = 1)
  distance: number;
  color: string;
  type: "지구형" | "목성형";
  // 평균 거리 km
  distanceKm: string;
  // 반지름 km
  radiusKm: string;
  feature: string;
};

const PLANETS: Planet[] = [
  { key: "mercury", name: "수성", radius: 0.38, distance: 0.39, color: "#9ca3af", type: "지구형", distanceKm: "약 5,800만 km", radiusKm: "약 2,440 km", feature: "태양에서 가장 가까움. 대기 거의 없음. 낮·밤 온도차 큼." },
  { key: "venus", name: "금성", radius: 0.95, distance: 0.72, color: "#fcd34d", type: "지구형", distanceKm: "약 1억 800만 km", radiusKm: "약 6,050 km", feature: "두꺼운 이산화탄소 대기로 표면 온도 약 470℃. 가장 밝게 보임." },
  { key: "earth", name: "지구", radius: 1, distance: 1, color: "#3b82f6", type: "지구형", distanceKm: "약 1억 5,000만 km (1 AU)", radiusKm: "약 6,378 km", feature: "액체 물·생명이 존재하는 유일한 행성." },
  { key: "mars", name: "화성", radius: 0.53, distance: 1.52, color: "#ef4444", type: "지구형", distanceKm: "약 2억 2,800만 km", radiusKm: "약 3,400 km", feature: "붉은 사막. 극관(얼음). 올림푸스 화산. 위성 2개." },
  { key: "jupiter", name: "목성", radius: 11.2, distance: 5.2, color: "#f59e0b", type: "목성형", distanceKm: "약 7억 8,000만 km", radiusKm: "약 71,500 km", feature: "태양계 최대 행성. 대적점(거대 폭풍). 위성 95개 이상." },
  { key: "saturn", name: "토성", radius: 9.4, distance: 9.5, color: "#fbbf24", type: "목성형", distanceKm: "약 14억 km", radiusKm: "약 60,300 km", feature: "뚜렷한 고리. 밀도가 물보다 작음." },
  { key: "uranus", name: "천왕성", radius: 4.0, distance: 19.2, color: "#22d3ee", type: "목성형", distanceKm: "약 29억 km", radiusKm: "약 25,600 km", feature: "자전축이 거의 옆으로 누워 있음(약 98°). 청록색." },
  { key: "neptune", name: "해왕성", radius: 3.9, distance: 30.1, color: "#3b82f6", type: "목성형", distanceKm: "약 45억 km", radiusKm: "약 24,800 km", feature: "강한 바람(약 2,000 km/h). 짙은 파란색." },
];

export default function PlanetComparison() {
  const [mode, setMode] = useState<Mode>("size");
  const [selected, setSelected] = useState<string>("earth");
  const sel = PLANETS.find((p) => p.key === selected)!;

  const VW = 420;
  const VH = 220;

  // Size mode: scale radius proportionally, cap at 40px for Jupiter
  const maxR = Math.max(...PLANETS.map((p) => p.radius));
  const sizeScale = 40 / maxR;
  // Distance mode: distance positions; use sqrt to compress huge outer distances visually
  const maxD = Math.max(...PLANETS.map((p) => p.distance));

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setMode("size")}
          className={`text-sm px-3 py-1.5 rounded-full border ${
            mode === "size"
              ? "bg-brand-600 text-white border-brand-600"
              : "border-slate-300 text-slate-600 hover:border-brand-500"
          }`}
        >
          상대 크기
        </button>
        <button
          onClick={() => setMode("distance")}
          className={`text-sm px-3 py-1.5 rounded-full border ${
            mode === "distance"
              ? "bg-brand-600 text-white border-brand-600"
              : "border-slate-300 text-slate-600 hover:border-brand-500"
          }`}
        >
          상대 거리
        </button>
        <span className="text-xs text-slate-500 self-center ml-1">
          (크기·거리는 같은 그림에 함께 표현 못 함 — 다른 스케일)
        </span>
      </div>

      <div className="viz-scroll">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-auto">
          <rect x={0} y={0} width={VW} height={VH} fill="#f8fafc" />

          {mode === "size" && (
            <g>
              {/* Sun for size reference (sun radius ~109 earth radii — way too big, show partial arc) */}
              <path
                d={`M 0 ${VH / 2 - 80} A 80 80 0 0 1 0 ${VH / 2 + 80}`}
                fill="#fbbf24"
                stroke="#f59e0b"
              />
              <text x={8} y={VH / 2 + 4} fontSize="10" fill="#78350f" fontWeight="700">
                태양
              </text>
              <text x={8} y={VH / 2 + 18} fontSize="8" fill="#78350f">
                (실제는 훨씬 큼)
              </text>

              {/* planets in a row */}
              {PLANETS.map((p, i) => {
                const r = Math.max(2, p.radius * sizeScale);
                const cx = 110 + i * 38;
                const cy = VH / 2;
                const isSel = p.key === selected;
                return (
                  <g key={p.key} style={{ cursor: "pointer" }} onClick={() => setSelected(p.key)}>
                    <circle cx={cx} cy={cy} r={r} fill={p.color} stroke={isSel ? "#0ea5e9" : "#475569"} strokeWidth={isSel ? 2 : 0.5} />
                    <text x={cx} y={VH - 30} textAnchor="middle" fontSize="9" fill={isSel ? "#0ea5e9" : "#475569"} fontWeight={isSel ? 700 : 500}>
                      {p.name}
                    </text>
                    <text x={cx} y={VH - 18} textAnchor="middle" fontSize="7" fill="#94a3b8">
                      {p.type}
                    </text>
                  </g>
                );
              })}
              <text x={VW / 2} y={20} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
                상대 크기 비교 (지구 반지름 = 1)
              </text>
            </g>
          )}

          {mode === "distance" && (
            <g>
              {/* sun at left */}
              <circle cx={20} cy={VH / 2} r={14} fill="#fbbf24" stroke="#f59e0b" />
              <text x={20} y={VH / 2 + 30} textAnchor="middle" fontSize="9" fill="#78350f" fontWeight="700">
                태양
              </text>
              {/* horizontal line */}
              <line x1={20} y1={VH / 2} x2={VW - 10} y2={VH / 2} stroke="#cbd5e1" strokeWidth={1} />

              {PLANETS.map((p, i) => {
                // Use sqrt scale to compress
                const frac = Math.sqrt(p.distance / maxD);
                const cx = 40 + frac * (VW - 60);
                const cy = VH / 2;
                const r = 4 + (p.type === "목성형" ? 2 : 0);
                const isSel = p.key === selected;
                return (
                  <g key={p.key} style={{ cursor: "pointer" }} onClick={() => setSelected(p.key)}>
                    <circle cx={cx} cy={cy} r={r} fill={p.color} stroke={isSel ? "#0ea5e9" : "#475569"} strokeWidth={isSel ? 2 : 0.5} />
                    <text
                      x={cx}
                      y={cy - 10 - (i % 2) * 10}
                      textAnchor="middle"
                      fontSize="9"
                      fill={isSel ? "#0ea5e9" : "#475569"}
                      fontWeight={isSel ? 700 : 500}
                    >
                      {p.name}
                    </text>
                    <text x={cx} y={cy + 18} textAnchor="middle" fontSize="7" fill="#94a3b8">
                      {p.distance.toFixed(p.distance < 10 ? 1 : 0)} AU
                    </text>
                  </g>
                );
              })}
              <text x={VW / 2} y={20} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
                상대 거리 비교 (√스케일 — 시각화용)
              </text>
              <text x={VW / 2} y={VH - 8} textAnchor="middle" fontSize="8" fill="#94a3b8">
                1 AU ≈ 1억 5,000만 km (지구-태양 거리)
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* info card */}
      <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ background: sel.color, border: "1px solid #475569" }}
          />
          <span className="font-bold text-slate-800">{sel.name}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${sel.type === "지구형" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
            {sel.type}
          </span>
        </div>
        <div className="grid sm:grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-sm">
          <span className="text-slate-500">반지름</span>
          <span className="text-slate-700">{sel.radiusKm} (지구의 {sel.radius}배)</span>
          <span className="text-slate-500">평균 거리</span>
          <span className="text-slate-700">{sel.distanceKm} ({sel.distance} AU)</span>
          <span className="text-slate-500">특징</span>
          <span className="text-slate-700">{sel.feature}</span>
        </div>
      </div>
    </div>
  );
}
