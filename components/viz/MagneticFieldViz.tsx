"use client";

import { useState } from "react";

type Mode = "bar" | "wire";

/**
 * MagneticFieldViz
 * - (a) 막대자석 주위 자기력선 — N → S
 * - (b) 직선 도선 주위 동심원 자기장 (앙페르 오른손 법칙)
 */
export default function MagneticFieldViz() {
  const [mode, setMode] = useState<Mode>("bar");

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode("bar")}
          className={`text-sm px-3 py-1.5 rounded-full border ${
            mode === "bar"
              ? "bg-brand-600 text-white border-brand-600"
              : "border-slate-300 text-slate-600 hover:border-brand-500"
          }`}
        >
          막대자석
        </button>
        <button
          onClick={() => setMode("wire")}
          className={`text-sm px-3 py-1.5 rounded-full border ${
            mode === "wire"
              ? "bg-brand-600 text-white border-brand-600"
              : "border-slate-300 text-slate-600 hover:border-brand-500"
          }`}
        >
          직선 도선
        </button>
      </div>

      <div className="viz-scroll">
        <svg viewBox="0 0 420 260" className="w-full h-auto">
          <defs>
            <marker id="mArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#0ea5e9" />
            </marker>
          </defs>
          {mode === "bar" ? <BarMagnet /> : <WireField />}
        </svg>
      </div>

      <div className="mt-3 text-sm text-slate-700">
        {mode === "bar" ? (
          <p>
            자기력선은 자석 바깥에서 <strong>N극 → S극</strong>으로 향한다(자석 내부에서는 S→N).
            서로 <strong>교차하지 않으며</strong>, 자기력선이 빽빽한 곳일수록 자기장이 세다.
          </p>
        ) : (
          <p>
            전류가 흐르는 도선 주위에는 도선을 중심으로 한 <strong>동심원 자기장</strong>이 생긴다.
            <strong>오른손 법칙</strong>: 엄지를 전류 방향으로 향하면, 나머지 네 손가락이 감기는 방향이 자기장 방향.
          </p>
        )}
      </div>
    </div>
  );
}

function BarMagnet() {
  // 막대자석 가운데
  const cx = 210;
  const cy = 130;
  const halfW = 60;
  const halfH = 18;

  // 자기력선 곡선 — N(오른쪽 끝) 에서 출발해 S(왼쪽 끝)로 들어가는 곡선들
  // path 는 Bezier로 위쪽/아래쪽 곡선 여러 개
  const xN = cx + halfW;
  const xS = cx - halfW;

  const curves = [
    // 위로 크게 도는 곡선 3개
    `M ${xN} ${cy} C ${xN + 40} ${cy - 30}, ${cx + 40} ${cy - 70}, ${cx} ${cy - 70} S ${xS - 40} ${cy - 30}, ${xS} ${cy}`,
    `M ${xN} ${cy - 5} C ${xN + 60} ${cy - 50}, ${cx + 40} ${cy - 100}, ${cx} ${cy - 100} S ${xS - 60} ${cy - 50}, ${xS} ${cy - 5}`,
    `M ${xN} ${cy + 5} C ${xN + 80} ${cy - 70}, ${cx + 40} ${cy - 130}, ${cx} ${cy - 130} S ${xS - 80} ${cy - 70}, ${xS} ${cy + 5}`,
    // 아래로 도는 곡선 3개
    `M ${xN} ${cy} C ${xN + 40} ${cy + 30}, ${cx + 40} ${cy + 70}, ${cx} ${cy + 70} S ${xS - 40} ${cy + 30}, ${xS} ${cy}`,
    `M ${xN} ${cy + 5} C ${xN + 60} ${cy + 50}, ${cx + 40} ${cy + 100}, ${cx} ${cy + 100} S ${xS - 60} ${cy + 50}, ${xS} ${cy + 5}`,
  ];

  // 화살표 위치 — 각 곡선의 위쪽 중간 지점에 작은 화살표 (오른쪽 위 방향으로 그려 N→곡선 진행 방향 표시)
  // 단순화: 자기력선 위에 작은 삼각형을 박는다
  // 위쪽 곡선: 정점 부근(중앙)에 왼쪽으로 향하는 화살표 (N→S 진행 방향)
  // 아래쪽 곡선: 정점 부근에 오른쪽으로 향하는 화살표 (S에서 다시 위로 돌아오는 게 아니라 N→S 외곽)
  // 자기력선 방향: N(오른쪽) → 위로 → 왼쪽으로 → S(왼쪽). 그래서 위쪽 곡선 정점에서는 왼쪽 방향, 아래쪽 곡선 정점에서는 왼쪽 방향(아래로 내려갔다가 다시 S로 들어옴).
  // 일관성 위해 모두 왼쪽 방향 화살표
  const arrows = [
    { x: cx + 5, y: cy - 70, dir: -1 },
    { x: cx + 5, y: cy - 100, dir: -1 },
    { x: cx + 5, y: cy - 130, dir: -1 },
    { x: cx + 5, y: cy + 70, dir: -1 },
    { x: cx + 5, y: cy + 100, dir: -1 },
  ];

  return (
    <g>
      {/* 자기력선 */}
      {curves.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#0ea5e9" strokeWidth={1.5} opacity={0.8} />
      ))}
      {arrows.map((a, i) => (
        <polygon
          key={i}
          points={`${a.x},${a.y - 4} ${a.x + a.dir * 7},${a.y} ${a.x},${a.y + 4}`}
          fill="#0ea5e9"
        />
      ))}

      {/* 막대자석 본체 */}
      <g>
        {/* S극 (파랑) */}
        <rect x={cx - halfW} y={cy - halfH} width={halfW} height={halfH * 2} fill="#60a5fa" stroke="#1e40af" strokeWidth={1.5} />
        {/* N극 (빨강) */}
        <rect x={cx} y={cy - halfH} width={halfW} height={halfH * 2} fill="#f87171" stroke="#991b1b" strokeWidth={1.5} />
        {/* 라벨 */}
        <text x={cx - halfW / 2} y={cy + 5} textAnchor="middle" fontSize="16" fontWeight={700} fill="white">
          S
        </text>
        <text x={cx + halfW / 2} y={cy + 5} textAnchor="middle" fontSize="16" fontWeight={700} fill="white">
          N
        </text>
      </g>

      <text x={210} y={245} textAnchor="middle" fontSize="11" fill="#475569">
        자기력선: N극 → S극 (바깥쪽), 교차하지 않음
      </text>
    </g>
  );
}

function WireField() {
  // 화면 중앙에 위에서 아래로 흐르는 도선 — 전류 방향 ↑ (위)
  const cx = 210;
  const cyTop = 30;
  const cyBot = 230;

  // 도선 주위 동심원 (자기장)
  const radii = [25, 45, 65, 85];

  return (
    <g>
      {/* 동심원 자기장 */}
      {radii.map((r, i) => (
        <g key={i}>
          <circle cx={cx} cy={(cyTop + cyBot) / 2} r={r} fill="none" stroke="#0ea5e9" strokeWidth={1.5} opacity={0.7} />
          {/* 원 위에 작은 화살표 (반시계? 시계? — 전류가 ↑이면 위에서 봤을 때 반시계 = 오른손 법칙)
              여기서는 단순히 원에 작은 화살촉을 4방향에 표시 */}
          <polygon
            points={`${cx + r - 4},${(cyTop + cyBot) / 2 - 4} ${cx + r + 4},${(cyTop + cyBot) / 2} ${cx + r - 4},${(cyTop + cyBot) / 2 + 4}`}
            fill="#0ea5e9"
            transform={`rotate(-90 ${cx + r} ${(cyTop + cyBot) / 2})`}
          />
          <polygon
            points={`${cx - r - 4},${(cyTop + cyBot) / 2 - 4} ${cx - r + 4},${(cyTop + cyBot) / 2} ${cx - r - 4},${(cyTop + cyBot) / 2 + 4}`}
            fill="#0ea5e9"
            transform={`rotate(90 ${cx - r} ${(cyTop + cyBot) / 2})`}
          />
        </g>
      ))}

      {/* 도선 */}
      <line x1={cx} y1={cyTop} x2={cx} y2={cyBot} stroke="#0f172a" strokeWidth={4} />
      {/* 전류 화살표 (위쪽 방향) */}
      <polygon points={`${cx - 8},${cyTop + 12} ${cx + 8},${cyTop + 12} ${cx},${cyTop}`} fill="#ef4444" />
      <text x={cx + 16} y={cyTop + 14} fontSize="12" fill="#ef4444" fontWeight={700}>
        I (전류)
      </text>

      {/* 나침반 표시(작은 N/S 바늘 두 개) */}
      <g transform="translate(330 130)">
        <circle r={16} fill="white" stroke="#475569" strokeWidth={1} />
        <line x1={0} y1={-12} x2={0} y2={12} stroke="#475569" strokeWidth={0.5} />
        <line x1={-12} y1={0} x2={12} y2={0} stroke="#475569" strokeWidth={0.5} />
        {/* 바늘 — 자기장 접선 방향(전류 위 방향이면 도선 오른쪽에선 바늘 N이 안쪽-위 방향이 아니라
             동심원 접선 방향, 단순화 위해 수평으로 그림) */}
        <polygon points="0,-10 -3,0 0,10 3,0" fill="#f87171" stroke="#991b1b" />
        <text x={0} y={26} textAnchor="middle" fontSize="9" fill="#475569">
          나침반
        </text>
      </g>

      <text x={210} y={250} textAnchor="middle" fontSize="11" fill="#475569">
        도선 주위 자기장은 동심원 모양 — 오른손 법칙으로 방향 결정
      </text>
    </g>
  );
}
