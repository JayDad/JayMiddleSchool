"use client";

import { useState } from "react";

type TimeOfDay = "day" | "night";

export default function PlantRespirationCycle() {
  const [time, setTime] = useState<TimeOfDay>("day");
  const isDay = time === "day";

  // arrow thickness — photosynthesis only during day, respiration always
  const photoIn = isDay ? 6 : 0; // CO2 in (photosynthesis)
  const photoOut = isDay ? 6 : 0; // O2 out (photosynthesis)
  const respIn = 2; // O2 in (respiration)
  const respOut = 2; // CO2 out (respiration)

  // net flow
  const netCO2 = respOut - photoIn; // negative = net intake of CO2
  const netO2 = photoOut - respIn; // positive = net release of O2

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setTime("day")}
          className={`text-sm px-3 py-1.5 rounded-full border ${
            isDay
              ? "bg-amber-500 text-white border-amber-500"
              : "border-slate-300 text-slate-600 hover:border-amber-400"
          }`}
        >
          ☀ 낮
        </button>
        <button
          onClick={() => setTime("night")}
          className={`text-sm px-3 py-1.5 rounded-full border ${
            !isDay
              ? "bg-slate-700 text-white border-slate-700"
              : "border-slate-300 text-slate-600 hover:border-slate-500"
          }`}
        >
          ☾ 밤
        </button>
      </div>

      <div className="viz-scroll">
        <svg viewBox="0 0 420 260" className="w-full h-auto">
          {/* sky background */}
          <rect
            x={0}
            y={0}
            width={420}
            height={260}
            fill={isDay ? "#e0f2fe" : "#1e293b"}
            opacity={0.35}
          />
          {/* sun / moon */}
          {isDay ? (
            <g>
              <circle cx={60} cy={45} r={18} fill="#fbbf24" />
            </g>
          ) : (
            <g>
              <circle cx={60} cy={45} r={18} fill="#f1f5f9" />
              <circle cx={66} cy={40} r={16} fill={isDay ? "#fbbf24" : "#1e293b"} opacity={0.35} />
              {[
                [120, 30],
                [180, 60],
                [260, 35],
                [330, 55],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r={1.2} fill="#f8fafc" />
              ))}
            </g>
          )}

          {/* plant */}
          <g>
            {/* stem */}
            <rect x={206} y={150} width={8} height={70} fill="#15803d" />
            {/* leaves */}
            <ellipse cx={180} cy={150} rx={32} ry={18} fill="#22c55e" stroke="#15803d" />
            <ellipse cx={240} cy={150} rx={32} ry={18} fill="#22c55e" stroke="#15803d" />
            <ellipse cx={210} cy={125} rx={28} ry={16} fill="#22c55e" stroke="#15803d" />
            {/* ground */}
            <rect x={0} y={220} width={420} height={40} fill="#a16207" opacity={0.4} />
            {/* roots */}
            <path d="M 210 220 L 205 245 M 210 220 L 215 245 M 210 220 L 198 250 M 210 220 L 224 250"
              stroke="#78350f" strokeWidth={1.5} fill="none" />
          </g>

          {/* photosynthesis arrows (left side) — visible only by day */}
          <g opacity={isDay ? 1 : 0.15}>
            {/* CO2 in */}
            <line
              x1={70}
              y1={130}
              x2={150}
              y2={130}
              stroke="#16a34a"
              strokeWidth={photoIn || 1}
              markerEnd="url(#arrGreen)"
            />
            <text x={80} y={122} fontSize="11" fill="#15803d" fontWeight="700">
              CO₂ 흡수
            </text>
            {/* O2 out */}
            <line
              x1={150}
              y1={100}
              x2={70}
              y2={100}
              stroke="#0ea5e9"
              strokeWidth={photoOut || 1}
              markerEnd="url(#arrBlue)"
            />
            <text x={80} y={92} fontSize="11" fill="#0369a1" fontWeight="700">
              O₂ 방출
            </text>
            <text x={110} y={75} fontSize="10" fill="#15803d" textAnchor="middle">
              광합성
            </text>
          </g>

          {/* respiration arrows (right side) — always */}
          <g>
            {/* O2 in */}
            <line
              x1={350}
              y1={130}
              x2={270}
              y2={130}
              stroke="#0ea5e9"
              strokeWidth={respIn}
              markerEnd="url(#arrBlue)"
            />
            <text x={290} y={122} fontSize="11" fill="#0369a1" fontWeight="700">
              O₂ 흡수
            </text>
            {/* CO2 out */}
            <line
              x1={270}
              y1={100}
              x2={350}
              y2={100}
              stroke="#dc2626"
              strokeWidth={respOut}
              markerEnd="url(#arrRed)"
            />
            <text x={290} y={92} fontSize="11" fill="#b91c1c" fontWeight="700">
              CO₂ 방출
            </text>
            <text x={310} y={75} fontSize="10" fill="#b91c1c" textAnchor="middle">
              호흡 (낮·밤 모두)
            </text>
          </g>

          {/* net summary box */}
          <g>
            <rect
              x={120}
              y={195}
              width={180}
              height={22}
              rx={6}
              fill={isDay ? "#dcfce7" : "#fee2e2"}
              stroke={isDay ? "#15803d" : "#b91c1c"}
            />
            <text
              x={210}
              y={210}
              fontSize="11"
              fill={isDay ? "#15803d" : "#b91c1c"}
              textAnchor="middle"
              fontWeight="700"
            >
              {isDay
                ? "순(겉보기): CO₂ 흡수 · O₂ 방출"
                : "순(겉보기): CO₂ 방출만 (광합성 ✗)"}
            </text>
          </g>

          <defs>
            <marker id="arrGreen" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#16a34a" />
            </marker>
            <marker id="arrBlue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#0ea5e9" />
            </marker>
            <marker id="arrRed" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#dc2626" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="mt-3 text-sm text-slate-700">
        {isDay ? (
          <>
            <span className="font-semibold text-emerald-700">낮:</span> 광합성 속도 &gt; 호흡 속도
            → 겉으로는 CO₂를 흡수하고 O₂를 내보내는 것처럼 보인다. 화살표 굵기가 양을 뜻함.
          </>
        ) : (
          <>
            <span className="font-semibold text-rose-700">밤:</span> 빛이 없어 광합성을 못 하고
            호흡만 한다 → CO₂를 내보내고 O₂를 흡수.
          </>
        )}
      </div>
    </div>
  );
}
