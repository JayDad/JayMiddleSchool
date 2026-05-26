"use client";

import { useState } from "react";

type Mode = "conduction" | "convection" | "radiation";

const MODES: { key: Mode; label: string; desc: string; example: string }[] = [
  {
    key: "conduction",
    label: "전도",
    desc: "고체에서 입자의 진동이 옆 입자로 전달되어 열이 이동",
    example: "금속 숟가락이 뜨거워짐, 다리미",
  },
  {
    key: "convection",
    label: "대류",
    desc: "액체·기체에서 따뜻한 부분은 위로, 차가운 부분은 아래로 순환",
    example: "주전자 물 끓이기, 에어컨은 위에·난로는 아래에",
  },
  {
    key: "radiation",
    label: "복사",
    desc: "매질 없이 전자기파로 직접 전달 (진공에서도 가능)",
    example: "태양빛, 모닥불 옆 따뜻함",
  },
];

export default function HeatTransferModes() {
  const [mode, setMode] = useState<Mode>("conduction");
  const current = MODES.find((m) => m.key === mode)!;

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              m.key === mode
                ? "bg-brand-600 text-white border-brand-600"
                : "border-slate-300 text-slate-600 hover:border-brand-500"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="viz-scroll">
        <svg viewBox="0 0 420 240" className="w-full h-auto">
          {mode === "conduction" && <Conduction />}
          {mode === "convection" && <Convection />}
          {mode === "radiation" && <Radiation />}
        </svg>
      </div>

      <div className="mt-3 grid sm:grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-sm">
        <span className="text-slate-500 font-semibold">설명</span>
        <span className="text-slate-700">{current.desc}</span>
        <span className="text-slate-500 font-semibold">예시</span>
        <span className="text-slate-700">{current.example}</span>
      </div>
    </div>
  );
}

function Conduction() {
  // metal rod heated on the left, heat propagates to the right
  const N = 14;
  return (
    <g>
      {/* flame on left */}
      <g transform="translate(40 170)">
        <path
          d="M -10 0 Q -14 -20 0 -30 Q 14 -20 10 0 Z"
          fill="#f97316"
        />
        <path d="M -5 0 Q -6 -12 0 -18 Q 6 -12 5 0 Z" fill="#fde047" />
        <text x={0} y={20} textAnchor="middle" fontSize="11" fill="#475569">
          가열
        </text>
      </g>
      {/* rod */}
      <rect x={70} y={100} width={300} height={28} rx={4} fill="#cbd5e1" stroke="#64748b" />
      {/* gradient particles indicating temperature falloff */}
      {Array.from({ length: N }).map((_, i) => {
        const cx = 78 + i * (284 / (N - 1));
        const heat = 1 - i / (N - 1); // 1 hot → 0 cold
        const r = 200 + heat * 55;
        const g = 60 + (1 - heat) * 110;
        const b = 60 + (1 - heat) * 180;
        return (
          <circle key={i} cx={cx} cy={114} r={5} fill={`rgb(${r},${g},${b})`}>
            <animate
              attributeName="cy"
              values={`114;${114 - 2 - heat * 2};114`}
              dur={`${0.5 - heat * 0.3}s`}
              repeatCount="indefinite"
              begin={`${i * 0.05}s`}
            />
          </circle>
        );
      })}
      <text x={220} y={160} textAnchor="middle" fontSize="12" fill="#475569">
        입자의 진동이 차례로 전달 →
      </text>
      <text x={70} y={92} fontSize="11" fill="#ef4444" fontWeight="600">뜨거움</text>
      <text x={370} y={92} fontSize="11" fill="#3b82f6" fontWeight="600" textAnchor="end">차가움</text>
    </g>
  );
}

function Convection() {
  return (
    <g>
      {/* pot */}
      <path d="M 80 220 L 80 90 L 340 90 L 340 220 Z" fill="none" stroke="#64748b" strokeWidth={2} />
      <rect x={75} y={88} width={270} height={4} fill="#64748b" />
      {/* water */}
      <rect x={82} y={100} width={256} height={118} fill="#bfdbfe" opacity={0.6} />
      {/* flame */}
      <g transform="translate(210 230)">
        <path d="M -25 0 Q -30 -18 -10 -25 Q 0 -32 10 -25 Q 30 -18 25 0 Z" fill="#f97316" />
        <path d="M -12 -2 Q -14 -14 0 -20 Q 14 -14 12 -2 Z" fill="#fde047" />
      </g>
      {/* convection currents - circulating arrows */}
      {[0, 1].map((side) => {
        const dir = side === 0 ? -1 : 1;
        const baseX = 210 + dir * 60;
        return (
          <g key={side}>
            {/* up arrow (warm) */}
            <path
              d={`M ${baseX - 8} 200 Q ${baseX - 8} 130 ${baseX - 8} 110`}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
              markerEnd="url(#arrowR)"
            />
            {/* over */}
            <path
              d={`M ${baseX - 8} 110 Q ${baseX} 105 ${baseX + 8} 110`}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
            />
            {/* down (cool) */}
            <path
              d={`M ${baseX + 8} 110 Q ${baseX + 8} 160 ${baseX + 8} 200`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2}
              markerEnd="url(#arrowB)"
            />
          </g>
        );
      })}
      <defs>
        <marker id="arrowR" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M 0 0 L 6 4 L 0 8 Z" fill="#ef4444" />
        </marker>
        <marker id="arrowB" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M 0 0 L 6 4 L 0 8 Z" fill="#3b82f6" />
        </marker>
      </defs>
      {/* moving bubbles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={210 + (i - 2) * 30} cy={210} r={3} fill="#fbbf24" opacity={0.8}>
          <animate
            attributeName="cy"
            values="210;100;100"
            dur="3s"
            begin={`${i * 0.4}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0.8;0"
            dur="3s"
            begin={`${i * 0.4}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      <text x={140} y={80} fontSize="11" fill="#ef4444" fontWeight="600">↑ 따뜻한 물(가벼움) 상승</text>
      <text x={280} y={80} fontSize="11" fill="#3b82f6" fontWeight="600">차가운 물(무거움) 하강 ↓</text>
    </g>
  );
}

function Radiation() {
  return (
    <g>
      {/* sun */}
      <circle cx={80} cy={80} r={32} fill="#fbbf24" />
      <circle cx={80} cy={80} r={32} fill="none" stroke="#f59e0b" strokeWidth={2}>
        <animate attributeName="r" values="32;36;32" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x={80} y={130} textAnchor="middle" fontSize="11" fill="#475569">태양 / 모닥불</text>
      {/* radiation waves — wavy lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <path
            d={`M 115 ${50 + i * 15} q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0`}
            fill="none"
            stroke="#f97316"
            strokeWidth={2}
            opacity={0}
          >
            <animate
              attributeName="opacity"
              values="0;0.9;0"
              dur="1.6s"
              begin={`${i * 0.2}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dasharray"
              values="0 260;260 0"
              dur="1.6s"
              begin={`${i * 0.2}s`}
              repeatCount="indefinite"
            />
          </path>
        </g>
      ))}
      {/* person/object */}
      <g transform="translate(340 130)">
        <circle cx={0} cy={-30} r={12} fill="#fbcfe8" stroke="#475569" />
        <path d="M -16 -10 L 16 -10 L 12 30 L -12 30 Z" fill="#bfdbfe" stroke="#475569" />
        <text x={0} y={55} textAnchor="middle" fontSize="11" fill="#475569">받는 쪽</text>
      </g>
      <text x={220} y={220} textAnchor="middle" fontSize="12" fill="#475569">
        매질 없이 전자기파로 전달 (진공에서도 OK)
      </text>
    </g>
  );
}
