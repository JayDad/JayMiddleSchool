"use client";

import { useState } from "react";

type Mode = "series" | "parallel";

/**
 * CircuitDiagram
 * - 직렬/병렬 토글로 회로 기호와 전류 흐름 비교
 * - 전류 입자가 회로를 따라 흐르는 SMIL 애니메이션
 */
export default function CircuitDiagram() {
  const [mode, setMode] = useState<Mode>("series");

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex gap-2 mb-3">
        {(["series", "parallel"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              m === mode
                ? "bg-brand-600 text-white border-brand-600"
                : "border-slate-300 text-slate-600 hover:border-brand-500"
            }`}
          >
            {m === "series" ? "직렬 연결" : "병렬 연결"}
          </button>
        ))}
      </div>

      <div className="viz-scroll">
        <svg viewBox="0 0 420 260" className="w-full h-auto">
          <defs>
            <marker id="cArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#0ea5e9" />
            </marker>
          </defs>
          {mode === "series" ? <Series /> : <Parallel />}
        </svg>
      </div>

      <div className="mt-3 text-sm text-slate-700">
        {mode === "series" ? (
          <p>
            <strong>직렬 회로</strong>: 전류가 흐를 길이 하나뿐이다. 전류의 세기는 회로 어디에서나{" "}
            <strong>같다</strong>. 한 곳이 끊어지면 전체가 꺼진다.
          </p>
        ) : (
          <p>
            <strong>병렬 회로</strong>: 전류가 흐를 길이 갈라진다. 각 갈래로 전류가 <strong>나뉘어 흐르고</strong>,
            한 갈래가 끊어져도 다른 갈래는 살아 있다.
          </p>
        )}
      </div>
    </div>
  );
}

/* ── 공통 기호 ── */
function Battery({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* 긴선 + / 짧은선 − */}
      <line x1={-2} y1={-12} x2={-2} y2={12} stroke="#0f172a" strokeWidth={3} />
      <line x1={6} y1={-7} x2={6} y2={7} stroke="#0f172a" strokeWidth={3} />
      <text x={-6} y={-18} fontSize="11" fill="#ef4444" fontWeight={700}>
        +
      </text>
      <text x={10} y={-18} fontSize="11" fill="#3b82f6" fontWeight={700}>
        −
      </text>
    </g>
  );
}

function Bulb({ cx, cy, label }: { cx: number; cy: number; label?: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={12} fill="#fef9c3" stroke="#0f172a" strokeWidth={1.5} />
      <line x1={cx - 8.5} y1={cy - 8.5} x2={cx + 8.5} y2={cy + 8.5} stroke="#0f172a" strokeWidth={1.5} />
      <line x1={cx - 8.5} y1={cy + 8.5} x2={cx + 8.5} y2={cy - 8.5} stroke="#0f172a" strokeWidth={1.5} />
      {label && (
        <text x={cx} y={cy + 26} textAnchor="middle" fontSize="10" fill="#475569">
          {label}
        </text>
      )}
    </g>
  );
}

function Ammeter({ cx, cy, label }: { cx: number; cy: number; label?: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={11} fill="white" stroke="#0f172a" strokeWidth={1.5} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight={700} fill="#0f172a">
        A
      </text>
      {label && (
        <text x={cx} y={cy + 26} textAnchor="middle" fontSize="10" fill="#475569">
          {label}
        </text>
      )}
    </g>
  );
}

function CurrentDot({ path, dur = 3, begin = 0 }: { path: string; dur?: number; begin?: number }) {
  return (
    <circle r={3.5} fill="#0ea5e9">
      <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${begin}s`} path={path} />
    </circle>
  );
}

/* ── 직렬 ── */
function Series() {
  // 사각 회로: (50,60) → (370,60) → (370,200) → (50,200) → 닫힘
  // 전구 두 개 위쪽 변, 전지 아래 변, 전류계 좌측 변
  const loop = "M 50 60 L 370 60 L 370 200 L 50 200 Z";
  return (
    <g>
      {/* 전선 */}
      <path d={loop} fill="none" stroke="#0f172a" strokeWidth={2} />
      {/* 전지 (아래) */}
      <Battery x={210} y={200} />
      <text x={210} y={232} textAnchor="middle" fontSize="11" fill="#475569">
        전지
      </text>
      {/* 전구 1, 2 (위) */}
      <Bulb cx={150} cy={60} label="전구1" />
      <Bulb cx={290} cy={60} label="전구2" />
      {/* 전류계 (왼쪽 변) */}
      <Ammeter cx={50} cy={130} label="전류계" />
      {/* 스위치 (오른쪽 변) - 닫힌 상태 */}
      <g>
        <circle cx={370} cy={120} r={2} fill="#0f172a" />
        <circle cx={370} cy={140} r={2} fill="#0f172a" />
        <line x1={370} y1={120} x2={370} y2={140} stroke="#0f172a" strokeWidth={2} />
        <text x={382} y={134} fontSize="10" fill="#475569">
          스위치
        </text>
      </g>
      {/* 전류 입자 — 회로 한 바퀴 */}
      {[0, 1, 2, 3].map((i) => (
        <CurrentDot key={i} path={loop} dur={5} begin={i * 1.25} />
      ))}
      {/* 화살표 표시 */}
      <text x={210} y={50} textAnchor="middle" fontSize="11" fill="#0ea5e9" fontWeight={600}>
        ← 전류 방향 (한 길)
      </text>
      <text x={210} y={250} textAnchor="middle" fontSize="11" fill="#475569">
        전류의 세기: 모든 곳에서 <tspan fontWeight={700} fill="#0f172a">같다</tspan> (I₁ = I₂ = I)
      </text>
    </g>
  );
}

/* ── 병렬 ── */
function Parallel() {
  // 위 갈래 (전구1 통과): 본선 사각형을 그대로 한 바퀴
  //   60,200 → 60,60 → 140,60 → [전구1: 210,60] → 280,60 → 360,60 → 360,200 → 60,200
  const topLoop = "M 60 200 L 60 60 L 360 60 L 360 200 Z";

  // 아래 갈래 (전구2 통과): (140,60)에서 아래로 빠져 (280,60)에서 다시 합류
  //   60,200 → 60,60 → 140,60 → 140,130 → [전구2: 210,130] → 280,130 → 280,60 → 360,60 → 360,200 → 60,200
  const bottomLoop =
    "M 60 200 L 60 60 L 140 60 L 140 130 L 280 130 L 280 60 L 360 60 L 360 200 Z";

  return (
    <g>
      {/* 본선 사각형 */}
      <path d={topLoop} fill="none" stroke="#0f172a" strokeWidth={2} />
      {/* 아래 갈래 (분기/합류 + 가로 연결) */}
      <line x1={140} y1={60} x2={140} y2={130} stroke="#0f172a" strokeWidth={2} />
      <line x1={140} y1={130} x2={280} y2={130} stroke="#0f172a" strokeWidth={2} />
      <line x1={280} y1={60} x2={280} y2={130} stroke="#0f172a" strokeWidth={2} />

      {/* 분기/합류 노드 점 */}
      <circle cx={140} cy={60} r={3} fill="#0f172a" />
      <circle cx={280} cy={60} r={3} fill="#0f172a" />

      {/* 전구1(위 갈래), 전구2(아래 갈래) */}
      <Bulb cx={210} cy={60} label="전구1" />
      <Bulb cx={210} cy={130} label="전구2" />

      {/* 전지 (아래 변) */}
      <Battery x={210} y={200} />
      <text x={210} y={232} textAnchor="middle" fontSize="11" fill="#475569">
        전지
      </text>

      {/* 전류계 (왼쪽 변 - 본선, 전체 전류 측정) */}
      <Ammeter cx={60} cy={130} label="전류계(전체)" />

      {/* 스위치 (오른쪽 변) */}
      <g>
        <circle cx={360} cy={120} r={2} fill="#0f172a" />
        <circle cx={360} cy={140} r={2} fill="#0f172a" />
        <line x1={360} y1={120} x2={360} y2={140} stroke="#0f172a" strokeWidth={2} />
      </g>

      {/* 전류 입자 — 위 갈래(전구1) 2개 + 아래 갈래(전구2) 2개 동시에 */}
      {[0, 1].map((i) => (
        <CurrentDot key={`top-${i}`} path={topLoop} dur={5} begin={i * 2.5} />
      ))}
      {[0, 1].map((i) => (
        <CurrentDot key={`bot-${i}`} path={bottomLoop} dur={5} begin={i * 2.5 + 1.25} />
      ))}

      <text x={210} y={50} textAnchor="middle" fontSize="11" fill="#0ea5e9" fontWeight={600}>
        ← 전류가 두 갈래로 나뉨
      </text>
      <text x={210} y={250} textAnchor="middle" fontSize="11" fill="#475569">
        전체 전류 I = I₁ + I₂ (갈래별로 나뉘어 흐름)
      </text>
    </g>
  );
}
