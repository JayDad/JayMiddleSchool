"use client";

import { useState } from "react";

export default function TranspirationViz() {
  const [open, setOpen] = useState(true); // stoma open (day) vs closed (night)

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setOpen(true)}
          className={`text-sm px-3 py-1.5 rounded-full border ${
            open
              ? "bg-amber-500 text-white border-amber-500"
              : "border-slate-300 text-slate-600 hover:border-amber-400"
          }`}
        >
          ☀ 낮 · 기공 열림
        </button>
        <button
          onClick={() => setOpen(false)}
          className={`text-sm px-3 py-1.5 rounded-full border ${
            !open
              ? "bg-slate-700 text-white border-slate-700"
              : "border-slate-300 text-slate-600 hover:border-slate-500"
          }`}
        >
          ☾ 밤 · 기공 닫힘
        </button>
      </div>

      <div className="viz-scroll">
        <svg viewBox="0 0 420 280" className="w-full h-auto">
          {/* sky */}
          <rect
            x={0}
            y={0}
            width={420}
            height={280}
            fill={open ? "#e0f2fe" : "#1e293b"}
            opacity={0.25}
          />

          {/* ground */}
          <rect x={0} y={220} width={420} height={60} fill="#a16207" opacity={0.4} />

          {/* plant cross-section (left half) */}
          <g>
            {/* roots */}
            <path
              d="M 80 220 Q 75 240 70 260 M 80 220 Q 85 245 88 265 M 80 220 Q 65 235 55 255 M 80 220 Q 95 235 105 250"
              stroke="#78350f"
              strokeWidth={2}
              fill="none"
            />
            {/* root hairs (small) */}
            {[
              [60, 250],
              [70, 258],
              [88, 260],
              [100, 248],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={2.5} fill="#fde68a" stroke="#a16207" />
            ))}
            {/* stem (translucent so we can show water column) */}
            <rect x={74} y={120} width={12} height={100} fill="#15803d" stroke="#14532d" />
            {/* xylem (inside stem, lighter) */}
            <rect x={78} y={120} width={4} height={100} fill="#bfdbfe" opacity={0.7} />

            {/* leaf (left) */}
            <ellipse cx={50} cy={120} rx={28} ry={14} fill="#22c55e" stroke="#15803d" />
            {/* leaf (right - the one we zoom into) */}
            <ellipse cx={110} cy={120} rx={28} ry={14} fill="#22c55e" stroke="#15803d" />
          </g>

          {/* water flow arrows (root -> stem -> leaf) */}
          <g>
            <line
              x1={80}
              y1={245}
              x2={80}
              y2={130}
              stroke="#0ea5e9"
              strokeWidth={2}
              strokeDasharray="4 4"
              markerEnd="url(#arrSky)"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;-16"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </line>
            <text x={92} y={180} fontSize="10" fill="#0369a1" fontWeight="600">
              물 상승
            </text>
            <text x={92} y={195} fontSize="9" fill="#0369a1">
              (물관)
            </text>
          </g>

          {/* labels */}
          <text x={50} y={108} fontSize="10" textAnchor="middle" fill="#15803d" fontWeight="600">
            잎
          </text>
          <text x={50} y={272} fontSize="10" textAnchor="middle" fill="#78350f" fontWeight="600">
            뿌리
          </text>

          {/* zoom guide line from leaf to stoma close-up */}
          <line
            x1={130}
            y1={120}
            x2={210}
            y2={90}
            stroke="#94a3b8"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
          <line
            x1={130}
            y1={130}
            x2={210}
            y2={200}
            stroke="#94a3b8"
            strokeWidth={1}
            strokeDasharray="2 3"
          />

          {/* stoma close-up (right side) */}
          <g transform="translate(220 90)">
            <rect
              x={0}
              y={0}
              width={180}
              height={110}
              rx={8}
              fill="#f0fdf4"
              stroke="#86efac"
              strokeWidth={1.5}
            />
            <text x={90} y={14} fontSize="11" textAnchor="middle" fill="#15803d" fontWeight="700">
              기공 확대도
            </text>

            {/* two guard cells (kidney-shaped) */}
            {open ? (
              <>
                <path
                  d="M 60 55 Q 50 35 70 32 Q 85 38 85 55 Q 80 65 70 65 Q 58 65 60 55 Z"
                  fill="#86efac"
                  stroke="#15803d"
                  strokeWidth={1.5}
                />
                <path
                  d="M 120 55 Q 130 35 110 32 Q 95 38 95 55 Q 100 65 110 65 Q 122 65 120 55 Z"
                  fill="#86efac"
                  stroke="#15803d"
                  strokeWidth={1.5}
                />
                {/* opening */}
                <ellipse cx={90} cy={48} rx={6} ry={10} fill="#1e293b" />
                <text x={90} y={85} fontSize="9" textAnchor="middle" fill="#475569">
                  공변세포가 부풀어
                </text>
                <text x={90} y={97} fontSize="9" textAnchor="middle" fill="#475569">
                  기공이 열림
                </text>

                {/* water vapor escaping */}
                {[0, 1, 2].map((i) => (
                  <g key={i}>
                    <circle cx={90} cy={48} r={3} fill="#bfdbfe" opacity={0}>
                      <animate
                        attributeName="cy"
                        values="48;10"
                        dur="2s"
                        begin={`${i * 0.6}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;0.9;0"
                        dur="2s"
                        begin={`${i * 0.6}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="r"
                        values="3;5;6"
                        dur="2s"
                        begin={`${i * 0.6}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ))}
                <text x={140} y={30} fontSize="10" fill="#0369a1" fontWeight="600">
                  H₂O ↑
                </text>
                <text x={140} y={43} fontSize="9" fill="#0369a1">
                  (수증기)
                </text>
              </>
            ) : (
              <>
                <path
                  d="M 60 55 Q 55 40 75 38 Q 88 42 88 55 Q 85 65 78 65 Q 60 65 60 55 Z"
                  fill="#86efac"
                  stroke="#15803d"
                  strokeWidth={1.5}
                />
                <path
                  d="M 120 55 Q 125 40 105 38 Q 92 42 92 55 Q 95 65 102 65 Q 120 65 120 55 Z"
                  fill="#86efac"
                  stroke="#15803d"
                  strokeWidth={1.5}
                />
                {/* closed slit */}
                <line x1={90} y1={42} x2={90} y2={62} stroke="#1e293b" strokeWidth={1.5} />
                <text x={90} y={85} fontSize="9" textAnchor="middle" fill="#475569">
                  공변세포가 수축해
                </text>
                <text x={90} y={97} fontSize="9" textAnchor="middle" fill="#475569">
                  기공이 닫힘 (증산 감소)
                </text>
              </>
            )}
          </g>

          <defs>
            <marker id="arrSky" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#0ea5e9" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="mt-3 text-sm text-slate-700">
        {open ? (
          <>
            <span className="font-semibold text-amber-700">낮:</span> 빛·온도가 높아지면 공변세포가
            물을 흡수해 부풀고 기공이 열린다 → 수증기가 빠져나가며 뿌리에서 물을 끌어올린다.
          </>
        ) : (
          <>
            <span className="font-semibold text-slate-700">밤:</span> 공변세포가 수축해 기공이
            닫히고 증산이 거의 일어나지 않는다.
          </>
        )}
      </div>
    </div>
  );
}
