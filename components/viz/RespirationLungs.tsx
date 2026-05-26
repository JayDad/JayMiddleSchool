"use client";

import { useState } from "react";

type Phase = "inhale" | "exhale";

export default function RespirationLungs() {
  const [phase, setPhase] = useState<Phase>("inhale");
  const inhale = phase === "inhale";

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        <Btn active={inhale} onClick={() => setPhase("inhale")}>들숨</Btn>
        <Btn active={!inhale} onClick={() => setPhase("exhale")}>날숨</Btn>
      </div>

      <div className="viz-scroll">
        <svg viewBox="0 0 420 280" className="w-full h-auto">
          <defs>
            <marker id="ox" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#ef4444" />
            </marker>
            <marker id="co2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#64748b" />
            </marker>
          </defs>

          {/* LEFT: thorax cross-section */}
          <g>
            {/* ribcage outline */}
            <ellipse
              cx={90}
              cy={120}
              rx={inhale ? 60 : 50}
              ry={inhale ? 75 : 65}
              fill="#fff7ed"
              stroke="#475569"
              strokeWidth={1.5}
            />
            {/* ribs */}
            {[0, 1, 2, 3].map((i) => {
              const y = 80 + i * 22;
              const rx = inhale ? 56 : 46;
              return (
                <ellipse
                  key={i}
                  cx={90}
                  cy={y}
                  rx={rx}
                  ry={6}
                  fill="none"
                  stroke="#a16207"
                  strokeWidth={2}
                />
              );
            })}

            {/* lung shape inside */}
            <path
              d={
                inhale
                  ? "M 70 80 Q 50 130 65 180 Q 90 195 115 180 Q 130 130 110 80 Z"
                  : "M 75 90 Q 60 130 72 170 Q 90 185 108 170 Q 120 130 105 90 Z"
              }
              fill="#fbcfe8"
              opacity={0.6}
              stroke="#be185d"
            />

            {/* diaphragm */}
            <path
              d={
                inhale
                  ? "M 30 200 Q 90 220 150 200"
                  : "M 30 195 Q 90 165 150 195"
              }
              fill="none"
              stroke="#7c2d12"
              strokeWidth={3}
            />
            <text x={90} y={230} textAnchor="middle" fontSize="11" fill="#7c2d12" fontWeight="600">
              횡격막 {inhale ? "↓ 내려감" : "↑ 올라감"}
            </text>
            <text x={90} y={62} textAnchor="middle" fontSize="11" fill="#a16207" fontWeight="600">
              갈비뼈 {inhale ? "↑ 올라감" : "↓ 내려감"}
            </text>

            {/* airflow arrow */}
            <g transform="translate(90 20)">
              <line
                x1={0}
                y1={inhale ? 0 : 30}
                x2={0}
                y2={inhale ? 30 : 0}
                stroke={inhale ? "#0ea5e9" : "#64748b"}
                strokeWidth={3}
                markerEnd="url(#ox)"
              />
              <text x={20} y={20} fontSize="11" fill="#475569">
                {inhale ? "공기 들어옴" : "공기 나감"}
              </text>
            </g>
          </g>

          {/* divider */}
          <line x1={200} y1={20} x2={200} y2={260} stroke="#e2e8f0" strokeDasharray="3 3" />

          {/* RIGHT: alveolus close-up */}
          <g transform="translate(230 30)">
            <text x={80} y={0} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
              폐포 ↔ 모세혈관
            </text>

            {/* alveolus (big circle) */}
            <circle cx={50} cy={90} r={45} fill="#fef3c7" stroke="#a16207" strokeWidth={1.5} />
            <text x={50} y={94} textAnchor="middle" fontSize="11" fill="#a16207" fontWeight="600">
              폐포
            </text>

            {/* capillary tube alongside */}
            <path
              d="M 110 50 Q 140 90 110 130"
              fill="none"
              stroke="#ef4444"
              strokeWidth={14}
              strokeLinecap="round"
              opacity={0.4}
            />
            <path
              d="M 110 50 Q 140 90 110 130"
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="3 3"
            />
            <text x={155} y={90} fontSize="10" fill="#475569">모세혈관</text>

            {/* O2 arrow: alveolus → capillary (red) */}
            <g>
              <line x1={88} y1={75} x2={115} y2={75} stroke="#ef4444" strokeWidth={2} markerEnd="url(#ox)" />
              <text x={70} y={68} fontSize="10" fill="#ef4444" fontWeight="600">O₂</text>
            </g>

            {/* CO2 arrow: capillary → alveolus (gray) */}
            <g>
              <line x1={115} y1={110} x2={88} y2={110} stroke="#64748b" strokeWidth={2} markerEnd="url(#co2)" />
              <text x={120} y={120} fontSize="10" fill="#64748b" fontWeight="600">CO₂</text>
            </g>

            {/* gas particles */}
            {Array.from({ length: 5 }).map((_, i) => (
              <circle
                key={`o${i}`}
                r={2.5}
                fill="#ef4444"
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.4}s`}
                  path="M 30 90 L 110 75"
                />
              </circle>
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <circle
                key={`c${i}`}
                r={2.5}
                fill="#64748b"
              >
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                  path="M 110 110 L 40 100"
                />
              </circle>
            ))}

            <text x={80} y={195} textAnchor="middle" fontSize="10" fill="#475569">
              O₂ → 혈액 / CO₂ → 폐포 (확산)
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-3 text-sm text-slate-700">
        {inhale ? (
          <p>
            <b>들숨:</b> 갈비뼈는 위로, 횡격막은 아래로 → 흉강 부피 ↑ → 폐 부피 ↑ →
            폐 내부 압력 ↓ → 공기가 빨려 들어온다.
          </p>
        ) : (
          <p>
            <b>날숨:</b> 갈비뼈는 아래로, 횡격막은 위로 → 흉강 부피 ↓ → 폐 부피 ↓ →
            폐 내부 압력 ↑ → 공기가 밀려 나간다.
          </p>
        )}
      </div>
    </div>
  );
}

function Btn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm px-3 py-1.5 rounded-full border ${
        active
          ? "bg-brand-600 text-white border-brand-600"
          : "border-slate-300 text-slate-600 hover:border-brand-500"
      }`}
    >
      {children}
    </button>
  );
}
