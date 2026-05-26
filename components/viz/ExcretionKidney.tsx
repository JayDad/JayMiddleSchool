"use client";

import { useState } from "react";

type Step = "filter" | "reabsorb" | "secrete";

const STEPS: { key: Step; label: string; desc: string }[] = [
  {
    key: "filter",
    label: "여과",
    desc: "사구체 → 보먼 주머니. 혈압으로 작은 분자(물·요소·포도당·아미노산·무기염류)가 걸러진다. 혈구·단백질은 못 빠져나감.",
  },
  {
    key: "reabsorb",
    label: "재흡수",
    desc: "세뇨관 → 모세혈관. 몸에 필요한 포도당·아미노산은 전부, 물·무기염류는 일부가 다시 흡수된다.",
  },
  {
    key: "secrete",
    label: "분비",
    desc: "모세혈관 → 세뇨관. 여과로 못 빠진 노폐물을 마저 내보낸다.",
  },
];

export default function ExcretionKidney() {
  const [step, setStep] = useState<Step>("filter");
  const current = STEPS.find((s) => s.key === step)!;

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        {STEPS.map((s) => (
          <button
            key={s.key}
            onClick={() => setStep(s.key)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              s.key === step
                ? "bg-brand-600 text-white border-brand-600"
                : "border-slate-300 text-slate-600 hover:border-brand-500"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="viz-scroll">
        <svg viewBox="0 0 420 280" className="w-full h-auto">
          <defs>
            <marker id="ar-k" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#0ea5e9" />
            </marker>
            <marker id="ar-r" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#22c55e" />
            </marker>
            <marker id="ar-s" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#f97316" />
            </marker>
          </defs>

          {/* LEFT: kidney cross section */}
          <g>
            <text x={80} y={20} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
              콩팥 단면
            </text>
            {/* kidney shape (bean) */}
            <path
              d="M 50 50 Q 20 90 30 160 Q 50 220 100 220 Q 140 220 145 180 Q 110 170 110 130 Q 110 90 145 80 Q 140 40 100 40 Q 70 40 50 50 Z"
              fill="#fda4af"
              stroke="#9f1239"
              strokeWidth={1.5}
            />
            {/* cortex (outer rim) */}
            <path
              d="M 50 50 Q 20 90 30 160 Q 50 220 100 220 Q 140 220 145 180"
              fill="none"
              stroke="#be185d"
              strokeWidth={6}
              opacity={0.4}
            />
            {/* medulla pyramids */}
            {[80, 130, 175].map((y, i) => (
              <path
                key={i}
                d={`M 60 ${y} Q 90 ${y + 8} 120 ${y}`}
                fill="none"
                stroke="#9f1239"
                strokeWidth={2}
                opacity={0.5}
              />
            ))}
            {/* pelvis */}
            <ellipse cx={125} cy={130} rx={14} ry={28} fill="#fef3c7" stroke="#a16207" />
            {/* ureter */}
            <path d="M 130 155 Q 145 200 155 250" fill="none" stroke="#a16207" strokeWidth={4} />
            <text x={50} y={75} fontSize="10" fill="#475569">겉질</text>
            <text x={80} y={150} fontSize="10" fill="#475569">속질</text>
            <text x={150} y={135} fontSize="10" fill="#475569">콩팥 깔때기</text>
            <text x={170} y={245} fontSize="10" fill="#a16207">→ 오줌관</text>
          </g>

          {/* RIGHT: nephron schematic */}
          <g transform="translate(200 20)">
            <text x={100} y={10} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
              네프론 (1개)
            </text>

            {/* Glomerulus (사구체) — tangled red ball */}
            <g transform="translate(50 60)">
              <circle r={22} fill="none" stroke="#ef4444" strokeWidth={1} />
              {[0, 1, 2, 3, 4].map((i) => (
                <path
                  key={i}
                  d={`M -15 ${-10 + i * 5} q 10 -8 20 0 t 20 0`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                />
              ))}
              <text x={0} y={40} textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="600">사구체</text>
            </g>

            {/* Bowman's capsule */}
            <path
              d="M 50 38 Q 88 38 88 60 Q 88 82 50 82"
              fill="none"
              stroke="#475569"
              strokeWidth={2}
            />
            <text x={108} y={48} fontSize="9" fill="#475569">보먼 주머니</text>

            {/* Tubule — winding */}
            <path
              d="M 88 60 Q 120 60 120 90 Q 120 120 90 120 Q 60 120 60 150 Q 60 180 110 180 Q 160 180 160 210"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth={3}
            />
            <text x={170} y={155} fontSize="9" fill="#0ea5e9" fontWeight="600">세뇨관</text>

            {/* Surrounding capillary */}
            <path
              d="M 95 75 Q 130 80 135 110 Q 140 145 100 145 Q 70 145 75 175 Q 80 200 140 200"
              fill="none"
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="2 2"
              opacity={0.7}
            />
            <text x={140} y={75} fontSize="9" fill="#dc2626">모세혈관</text>

            {/* Step-specific arrows */}
            {step === "filter" && (
              <g>
                <line x1={42} y1={60} x2={70} y2={60} stroke="#0ea5e9" strokeWidth={2} markerEnd="url(#ar-k)" />
                <text x={20} y={95} fontSize="9" fill="#0ea5e9" fontWeight="600">
                  사구체 → 보먼: 여과
                </text>
              </g>
            )}
            {step === "reabsorb" && (
              <g>
                <line x1={90} y1={120} x2={110} y2={130} stroke="#22c55e" strokeWidth={2} markerEnd="url(#ar-r)" />
                <line x1={75} y1={155} x2={95} y2={150} stroke="#22c55e" strokeWidth={2} markerEnd="url(#ar-r)" />
                <text x={140} y={130} fontSize="9" fill="#22c55e" fontWeight="600">
                  세뇨관 → 혈관: 재흡수
                </text>
              </g>
            )}
            {step === "secrete" && (
              <g>
                <line x1={130} y1={115} x2={110} y2={110} stroke="#f97316" strokeWidth={2} markerEnd="url(#ar-s)" />
                <text x={130} y={100} fontSize="9" fill="#f97316" fontWeight="600">
                  혈관 → 세뇨관: 분비
                </text>
              </g>
            )}

            {/* Urine outflow */}
            <text x={150} y={232} fontSize="9" fill="#a16207" fontWeight="600">→ 오줌</text>
          </g>
        </svg>
      </div>

      <div className="mt-3 grid sm:grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-sm">
        <span className="text-slate-500 font-semibold">{current.label}</span>
        <span className="text-slate-700">{current.desc}</span>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        오줌의 흐름: 콩팥 → 오줌관 → 방광 → 요도
      </p>
    </div>
  );
}
