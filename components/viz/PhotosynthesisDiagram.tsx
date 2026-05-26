"use client";

import { useState } from "react";

export default function PhotosynthesisDiagram() {
  const [light, setLight] = useState(60);
  // bubble rate: faster duration when light is high
  const bubbleDur = Math.max(0.6, 3.0 - (light / 100) * 2.4);
  const bubbleCount = Math.max(1, Math.round(light / 20));

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
        <label className="text-slate-600 font-semibold">빛의 세기</label>
        <input
          type="range"
          min={0}
          max={100}
          value={light}
          onChange={(e) => setLight(parseInt(e.target.value))}
          className="flex-1 min-w-[140px] accent-brand-600"
        />
        <span className="text-slate-700 w-10 text-right">{light}%</span>
      </div>

      <div className="viz-scroll">
        <svg viewBox="0 0 420 260" className="w-full h-auto">
          {/* sun */}
          <g opacity={0.2 + (light / 100) * 0.8}>
            <circle cx={50} cy={40} r={20} fill="#fbbf24" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const a = (i * Math.PI) / 4;
              const x1 = 50 + Math.cos(a) * 26;
              const y1 = 40 + Math.sin(a) * 26;
              const x2 = 50 + Math.cos(a) * 34;
              const y2 = 40 + Math.sin(a) * 34;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* light arrows down onto leaf */}
          {[0, 1, 2].map((i) => (
            <g key={i} opacity={0.3 + (light / 100) * 0.7}>
              <line
                x1={90 + i * 18}
                y1={50}
                x2={140 + i * 18}
                y2={110}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 3"
                markerEnd="url(#arrLight)"
              />
            </g>
          ))}
          <text x={110} y={42} fontSize="11" fill="#b45309" fontWeight="600">
            빛 에너지
          </text>

          {/* leaf cross-section (large outline) */}
          <g>
            {/* upper epidermis */}
            <path
              d="M 120 110 Q 220 90 320 110 L 320 200 Q 220 220 120 200 Z"
              fill="#bbf7d0"
              stroke="#16a34a"
              strokeWidth={2}
            />
            {/* chloroplasts */}
            {[
              [160, 135],
              [195, 130],
              [230, 138],
              [265, 132],
              [295, 140],
              [175, 165],
              [215, 170],
              [250, 165],
              [285, 172],
              [200, 195],
              [240, 198],
              [275, 192],
            ].map(([cx, cy], i) => (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx={10}
                ry={6}
                fill="#22c55e"
                stroke="#15803d"
                strokeWidth={1}
              />
            ))}
            {/* stoma (bottom opening) */}
            <path
              d="M 215 200 Q 220 212 225 200"
              fill="#fff"
              stroke="#15803d"
              strokeWidth={1.5}
            />
            <path
              d="M 210 198 Q 200 210 215 218"
              fill="none"
              stroke="#15803d"
              strokeWidth={1.5}
            />
            <path
              d="M 230 198 Q 240 210 225 218"
              fill="none"
              stroke="#15803d"
              strokeWidth={1.5}
            />
          </g>

          <text x={220} y={108} fontSize="11" fill="#15803d" textAnchor="middle" fontWeight="600">
            잎 · 엽록체
          </text>

          {/* CO2 input (left) */}
          <g>
            <line
              x1={50}
              y1={155}
              x2={118}
              y2={155}
              stroke="#64748b"
              strokeWidth={2}
              markerEnd="url(#arrG)"
            />
            <text x={55} y={148} fontSize="11" fill="#475569" fontWeight="600">
              CO₂
            </text>
          </g>

          {/* H2O input from stem/roots (bottom) */}
          <g>
            <line
              x1={170}
              y1={250}
              x2={170}
              y2={205}
              stroke="#3b82f6"
              strokeWidth={2}
              markerEnd="url(#arrB)"
            />
            <text x={150} y={250} fontSize="11" fill="#1d4ed8" fontWeight="600">
              H₂O
            </text>
          </g>

          {/* glucose (stored inside leaf) */}
          <g>
            <rect x={250} y={150} width={62} height={22} rx={6} fill="#fde68a" stroke="#b45309" />
            <text x={281} y={165} fontSize="10" fill="#92400e" textAnchor="middle" fontWeight="700">
              C₆H₁₂O₆
            </text>
            <text x={281} y={184} fontSize="9" fill="#92400e" textAnchor="middle">
              (포도당 저장)
            </text>
          </g>

          {/* O2 output through stoma */}
          {Array.from({ length: bubbleCount }).map((_, i) => (
            <g key={i}>
              <circle cx={220} cy={215} r={4} fill="#ffffff" stroke="#0ea5e9" strokeWidth={1.5}>
                <animate
                  attributeName="cy"
                  values="215;255"
                  dur={`${bubbleDur}s`}
                  begin={`${i * (bubbleDur / bubbleCount)}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur={`${bubbleDur}s`}
                  begin={`${i * (bubbleDur / bubbleCount)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
          <text x={260} y={245} fontSize="11" fill="#0369a1" fontWeight="600">
            O₂ ↓ (기공으로 방출)
          </text>

          <defs>
            <marker id="arrG" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#64748b" />
            </marker>
            <marker id="arrB" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#3b82f6" />
            </marker>
            <marker id="arrLight" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="mt-3 text-sm text-slate-700">
        <span className="font-semibold text-slate-800">반응식: </span>
        6CO₂ + 6H₂O <span className="text-amber-600">+ 빛 에너지</span> → C₆H₁₂O₆ + 6O₂
        <span className="block text-xs text-slate-500 mt-1">
          빛이 셀수록 산소 방울이 빠르게 발생한다 — 빛은 광합성의 에너지원.
        </span>
      </div>
    </div>
  );
}
