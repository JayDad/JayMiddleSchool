"use client";

import { useState } from "react";

type Mode = "both" | "systemic" | "pulmonary";

export default function CirculationLoop() {
  const [mode, setMode] = useState<Mode>("both");
  const showS = mode === "both" || mode === "systemic";
  const showP = mode === "both" || mode === "pulmonary";

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        <Btn active={mode === "both"} onClick={() => setMode("both")}>둘 다</Btn>
        <Btn active={mode === "systemic"} onClick={() => setMode("systemic")}>체순환</Btn>
        <Btn active={mode === "pulmonary"} onClick={() => setMode("pulmonary")}>폐순환</Btn>
      </div>

      <div className="viz-scroll">
        <svg viewBox="0 0 420 280" className="w-full h-auto">
          <defs>
            <marker id="ar-red" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#ef4444" />
            </marker>
            <marker id="ar-blue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#3b82f6" />
            </marker>
          </defs>

          {/* Body organs (top) */}
          <rect x={30} y={20} width={140} height={50} rx={8} fill="#fef3c7" stroke="#a16207" />
          <text x={100} y={50} textAnchor="middle" fontSize="12" fill="#475569">온몸 (조직)</text>

          {/* Lungs (top right) */}
          <ellipse cx={310} cy={45} rx={32} ry={22} fill="#fbcfe8" stroke="#be185d" />
          <ellipse cx={360} cy={45} rx={28} ry={20} fill="#fbcfe8" stroke="#be185d" />
          <text x={335} y={50} textAnchor="middle" fontSize="12" fill="#475569">폐</text>

          {/* Heart — 4 chambers */}
          <g transform="translate(170 130)">
            {/* outline */}
            <rect x={0} y={0} width={120} height={120} rx={10} fill="#fff" stroke="#475569" strokeWidth={1.5} />
            {/* divider */}
            <line x1={60} y1={4} x2={60} y2={116} stroke="#475569" strokeDasharray="3 3" />
            <line x1={4} y1={60} x2={116} y2={60} stroke="#475569" strokeDasharray="3 3" />
            {/* labels: RA (top-left blue), LA (top-right red), RV (bot-left blue), LV (bot-right red) */}
            <rect x={6} y={6} width={50} height={50} fill="#dbeafe" />
            <rect x={64} y={6} width={50} height={50} fill="#fee2e2" />
            <rect x={6} y={64} width={50} height={50} fill="#dbeafe" />
            <rect x={64} y={64} width={50} height={50} fill="#fee2e2" />
            <text x={31} y={28} textAnchor="middle" fontSize="10" fill="#1e3a8a" fontWeight="600">우심방</text>
            <text x={31} y={42} textAnchor="middle" fontSize="9" fill="#1e3a8a">RA</text>
            <text x={89} y={28} textAnchor="middle" fontSize="10" fill="#991b1b" fontWeight="600">좌심방</text>
            <text x={89} y={42} textAnchor="middle" fontSize="9" fill="#991b1b">LA</text>
            <text x={31} y={88} textAnchor="middle" fontSize="10" fill="#1e3a8a" fontWeight="600">우심실</text>
            <text x={31} y={102} textAnchor="middle" fontSize="9" fill="#1e3a8a">RV</text>
            <text x={89} y={88} textAnchor="middle" fontSize="10" fill="#991b1b" fontWeight="600">좌심실</text>
            <text x={89} y={102} textAnchor="middle" fontSize="9" fill="#991b1b">LV</text>
          </g>

          {/* SYSTEMIC LOOP: LV → 온몸 → RA */}
          {showS && (
            <g opacity={mode === "both" ? 0.7 : 1}>
              {/* LV (259, 244) out → down → left → up to body (100, 70) */}
              <path
                d="M 259 250 Q 259 270 230 270 Q 130 270 100 270 Q 60 270 60 130 Q 60 80 100 80"
                fill="none"
                stroke="#ef4444"
                strokeWidth={2.5}
                markerEnd="url(#ar-red)"
              />
              {/* return: body → RA */}
              <path
                d="M 140 70 Q 200 70 200 110 Q 200 145 201 175"
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2.5}
                markerEnd="url(#ar-blue)"
              />
              <text x={70} y={200} fontSize="10" fill="#ef4444" fontWeight="600">대동맥</text>
              <text x={160} y={120} fontSize="10" fill="#3b82f6" fontWeight="600">대정맥</text>

              {/* moving blood particles */}
              {[0, 1, 2].map((i) => (
                <circle key={`s${i}`} r={3.5} fill="#ef4444">
                  <animateMotion
                    dur="6s"
                    repeatCount="indefinite"
                    begin={`${i * 2}s`}
                    path="M 259 250 Q 259 270 230 270 Q 130 270 100 270 Q 60 270 60 130 Q 60 80 100 80"
                  />
                </circle>
              ))}
            </g>
          )}

          {/* PULMONARY LOOP: RV → 폐 → LA */}
          {showP && (
            <g opacity={mode === "both" ? 0.7 : 1}>
              {/* RV (201, 244) → up-right? no, RV is bottom-left; go up-around to lungs. */}
              <path
                d="M 201 250 Q 201 268 240 268 Q 320 268 360 200 Q 380 130 340 80"
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2.5}
                markerEnd="url(#ar-blue)"
              />
              {/* return: 폐 → LA */}
              <path
                d="M 320 60 Q 290 90 270 130 Q 259 160 259 175"
                fill="none"
                stroke="#ef4444"
                strokeWidth={2.5}
                markerEnd="url(#ar-red)"
              />
              <text x={345} y={210} fontSize="10" fill="#3b82f6" fontWeight="600">폐동맥</text>
              <text x={285} y={120} fontSize="10" fill="#ef4444" fontWeight="600">폐정맥</text>

              {[0, 1, 2].map((i) => (
                <circle key={`p${i}`} r={3.5} fill="#3b82f6">
                  <animateMotion
                    dur="6s"
                    repeatCount="indefinite"
                    begin={`${i * 2}s`}
                    path="M 201 250 Q 201 268 240 268 Q 320 268 360 200 Q 380 130 340 80"
                  />
                </circle>
              ))}
            </g>
          )}

          {/* Legend */}
          <g transform="translate(20 260)">
            <rect x={0} y={0} width={14} height={4} fill="#ef4444" />
            <text x={20} y={5} fontSize="10" fill="#475569">동맥혈 / 산소多</text>
            <rect x={130} y={0} width={14} height={4} fill="#3b82f6" />
            <text x={150} y={5} fontSize="10" fill="#475569">정맥혈 / 산소少</text>
          </g>
        </svg>
      </div>

      <div className="mt-3 text-sm text-slate-700 space-y-1">
        <p>
          <span className="font-semibold text-rose-700">체순환:</span> 좌심실 → 대동맥 → 온몸(조직) → 대정맥 → 우심방
        </p>
        <p>
          <span className="font-semibold text-sky-700">폐순환:</span> 우심실 → 폐동맥 → 폐 → 폐정맥 → 좌심방
        </p>
        <p className="text-xs text-slate-500">
          ※ 폐동맥에는 정맥혈(산소가 적은 피)이, 폐정맥에는 동맥혈(산소가 많은 피)이 흐른다는 점이 자주 함정.
        </p>
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
