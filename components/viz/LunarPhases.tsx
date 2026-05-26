"use client";

import { useState } from "react";

const VW = 420;
const VH = 280;
const EARTH_X = 210;
const EARTH_Y = 140;
const ORBIT_R = 90;

// 8 phases. illum = illuminated fraction seen from Earth (0 = new, 1 = full).
// terminatorOffset: -1..1 — controls which side is lit on display.
const PHASES = [
  { key: "new", label: "삭(朔)", angle: 0, illum: 0, ko: "달이 보이지 않음" },
  { key: "waxingCrescent", label: "초승달", angle: 45, illum: 0.25, ko: "오른쪽 가늘게" },
  { key: "firstQuarter", label: "상현(上弦)", angle: 90, illum: 0.5, ko: "오른쪽 반달" },
  { key: "waxingGibbous", label: "상현망 사이", angle: 135, illum: 0.75, ko: "오른쪽 부풂" },
  { key: "full", label: "보름(망 望)", angle: 180, illum: 1, ko: "둥근 보름달" },
  { key: "waningGibbous", label: "망하현 사이", angle: 225, illum: 0.75, ko: "왼쪽 부풂" },
  { key: "lastQuarter", label: "하현(下弦)", angle: 270, illum: 0.5, ko: "왼쪽 반달" },
  { key: "waningCrescent", label: "그믐달", angle: 315, illum: 0.25, ko: "왼쪽 가늘게" },
];

// Render moon disc: light side based on phase angle.
// `r` radius, `idx` is index of PHASES.
function MoonDisc({ r, idx, cx = 0, cy = 0 }: { r: number; idx: number; cx?: number; cy?: number }) {
  const phase = PHASES[idx];
  const a = phase.angle;
  // dark side is on the side facing the sun? No — sun illuminates side facing the sun.
  // Sun is to the LEFT (west) in our diagram (we'll place sun on left side).
  // For Earth view: when moon at angle 0 (between sun & earth) -> new moon (sun behind moon).
  // Drawing illuminated portion as circular arc + ellipse for the terminator.
  const illum = phase.illum;
  // determine if right or left is lit:
  // angle 0..180 → right side increasingly lit (waxing)
  // angle 180..360 → left side lit (waning)
  const waxing = a > 0 && a < 180;
  const isFull = a === 180;
  const isNew = a === 0;

  // base dark moon
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle cx={0} cy={0} r={r} fill="#1e293b" stroke="#475569" strokeWidth={0.5} />
      {isFull && <circle cx={0} cy={0} r={r} fill="#fef9c3" />}
      {!isFull && !isNew && (
        <>
          {/* half disc covering the lit hemisphere */}
          <path
            d={`M 0 ${-r} A ${r} ${r} 0 0 ${waxing ? 1 : 0} 0 ${r} Z`}
            fill="#fef9c3"
          />
          {/* terminator ellipse: width depends on illum (illum 0.5 → straight) */}
          {illum !== 0.5 && (
            <ellipse
              cx={0}
              cy={0}
              rx={Math.abs(r * (1 - 2 * illum))}
              ry={r}
              fill={illum > 0.5 ? "#fef9c3" : "#1e293b"}
            />
          )}
        </>
      )}
      <circle cx={0} cy={0} r={r} fill="none" stroke="#475569" strokeWidth={0.5} />
    </g>
  );
}

export default function LunarPhases() {
  const [selected, setSelected] = useState(4); // start at full moon

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="viz-scroll">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-auto">
          <rect x={0} y={0} width={VW} height={VH} fill="#0f172a" />
          {/* sun (left side, far) */}
          <g>
            <circle cx={30} cy={EARTH_Y} r={18} fill="#fbbf24" />
            <text x={30} y={EARTH_Y + 4} textAnchor="middle" fontSize="9" fill="#78350f" fontWeight="700">
              태양
            </text>
            {/* sun rays going right */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={i}
                x1={50}
                y1={EARTH_Y - 30 + i * 15}
                x2={100}
                y2={EARTH_Y - 30 + i * 15}
                stroke="#fbbf24"
                strokeWidth={1}
                opacity={0.5}
              />
            ))}
          </g>

          {/* earth's shadow cone (extends to right) */}
          <path
            d={`M ${EARTH_X} ${EARTH_Y - 12} L ${VW - 5} ${EARTH_Y - 30} L ${VW - 5} ${EARTH_Y + 30} L ${EARTH_X} ${EARTH_Y + 12} Z`}
            fill="#1e293b"
            opacity={0.4}
          />

          {/* moon orbit circle */}
          <circle cx={EARTH_X} cy={EARTH_Y} r={ORBIT_R} fill="none" stroke="#475569" strokeWidth={0.8} strokeDasharray="3 3" />

          {/* earth */}
          <circle cx={EARTH_X} cy={EARTH_Y} r={14} fill="#3b82f6" />
          <text x={EARTH_X} y={EARTH_Y + 4} textAnchor="middle" fontSize="10" fill="#e2e8f0" fontWeight="700">
            지구
          </text>

          {/* 8 moon positions */}
          {PHASES.map((p, i) => {
            // Place phase 0 (new) between earth and sun → angle pointing left (180°).
            // Phase 4 (full) is opposite of sun → on right of earth (0°).
            const placementAngle = 180 - p.angle; // map: phase0 -> 180° (left), phase4 -> 0° (right)
            const a = (placementAngle * Math.PI) / 180;
            const mx = EARTH_X + ORBIT_R * Math.cos(a);
            const my = EARTH_Y + ORBIT_R * Math.sin(a);
            const isSel = i === selected;
            return (
              <g key={p.key}>
                <g
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelected(i)}
                  transform={`translate(${mx} ${my})`}
                >
                  {isSel && <circle cx={0} cy={0} r={14} fill="none" stroke="#0ea5e9" strokeWidth={2} />}
                  <MoonDisc r={10} idx={i} />
                </g>
                <text
                  x={mx}
                  y={my + 24}
                  textAnchor="middle"
                  fontSize="8"
                  fill={isSel ? "#fbbf24" : "#cbd5e1"}
                  fontWeight={isSel ? 700 : 400}
                >
                  {p.label}
                </text>
              </g>
            );
          })}

          {/* enlarged view (lower right corner) */}
          <g transform={`translate(${VW - 60} ${VH - 60})`}>
            <rect x={-38} y={-38} width={76} height={76} rx={6} fill="#1e293b" stroke="#475569" />
            <MoonDisc r={26} idx={selected} />
            <text x={0} y={-44} textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="600">
              지구에서 보는 모양
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PHASES.map((p, i) => (
          <button
            key={p.key}
            onClick={() => setSelected(i)}
            className={`text-xs px-2.5 py-1.5 rounded-full border ${
              i === selected
                ? "bg-brand-600 text-white border-brand-600"
                : "border-slate-300 text-slate-600 hover:border-brand-500"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-700 mt-3">
        <strong>{PHASES[selected].label}</strong> — {PHASES[selected].ko}
      </p>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
        달의 위상은 <strong>태양·지구·달의 상대적 위치</strong>에 따라 달라진다. 달 표면의 절반은 항상 햇빛을 받지만,
        지구에서 보는 각도가 달라지면서 빛나는 부분이 다르게 보인다. 위상이 한 바퀴 도는 데 약 <strong>29.5일(삭망월)</strong>이 걸린다.
      </p>
    </div>
  );
}
