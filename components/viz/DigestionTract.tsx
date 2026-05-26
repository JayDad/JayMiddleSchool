"use client";

import { useState } from "react";

type Stage = {
  key: string;
  organ: string; // 기관
  juice: string; // 소화액
  enzyme: string; // 효소
  effect: string; // 작용
  // bolus position along the tract path (0~1)
  pos: number;
};

const STAGES: Stage[] = [
  {
    key: "mouth",
    organ: "입",
    juice: "침 (타액)",
    enzyme: "아밀레이스 (amylase)",
    effect: "녹말 → 엿당",
    pos: 0.06,
  },
  {
    key: "esophagus",
    organ: "식도",
    juice: "-",
    enzyme: "-",
    effect: "음식물을 위로 이동",
    pos: 0.2,
  },
  {
    key: "stomach",
    organ: "위",
    juice: "위액 (염산 HCl 포함)",
    enzyme: "펩신 (pepsin)",
    effect: "단백질 → 작은 단백질 조각",
    pos: 0.36,
  },
  {
    key: "small",
    organ: "소장",
    juice: "이자액·쓸개즙",
    enzyme: "아밀레이스·트립신·라이페이스",
    effect: "탄·단·지 최종 분해 + 영양소 흡수",
    pos: 0.62,
  },
  {
    key: "large",
    organ: "대장",
    juice: "-",
    enzyme: "-",
    effect: "물 흡수, 찌꺼기 형성",
    pos: 0.82,
  },
  {
    key: "anus",
    organ: "항문",
    juice: "-",
    enzyme: "-",
    effect: "대변 배출",
    pos: 0.96,
  },
];

// approximate position of bolus given pos∈[0,1] along the schematic tract
function bolusPoint(p: number): { x: number; y: number } {
  // simple piecewise route: mouth(210,40) → esophagus(210,90) → stomach(150,135) → small(210,180) → large around 270 → anus(270,225)
  if (p < 0.1) return { x: 210, y: 28 + p * 100 };
  if (p < 0.25) return { x: 210, y: 38 + p * 220 };
  if (p < 0.45) return { x: 210 - (p - 0.25) * 250, y: 110 + (p - 0.25) * 130 };
  if (p < 0.7) return { x: 160 + (p - 0.45) * 220, y: 145 + (p - 0.45) * 140 };
  if (p < 0.9) return { x: 215 + (p - 0.7) * 280, y: 195 - (p - 0.7) * 30 };
  return { x: 270, y: 215 + (p - 0.9) * 90 };
}

export default function DigestionTract() {
  const [idx, setIdx] = useState(0);
  const stage = STAGES[idx];
  const bolus = bolusPoint(stage.pos);

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        {STAGES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setIdx(i)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              i === idx
                ? "bg-brand-600 text-white border-brand-600"
                : "border-slate-300 text-slate-600 hover:border-brand-500"
            }`}
          >
            {i + 1}. {s.organ}
          </button>
        ))}
      </div>

      <div className="viz-scroll">
        <svg viewBox="0 0 420 300" className="w-full h-auto">
          {/* body silhouette */}
          <path
            d="M 150 20 Q 210 0 270 20 L 290 70 Q 310 110 300 180 Q 290 250 260 285 L 160 285 Q 130 250 120 180 Q 110 110 130 70 Z"
            fill="#fff7ed"
            stroke="#fbcfe8"
            strokeWidth={2}
          />

          {/* mouth */}
          <ellipse cx={210} cy={28} rx={22} ry={10} fill="#fecaca" stroke="#ef4444" />
          <text x={245} y={30} fontSize="11" fill="#475569">입</text>

          {/* esophagus */}
          <rect x={203} y={38} width={14} height={70} fill="#fed7aa" stroke="#f97316" />
          <text x={225} y={75} fontSize="11" fill="#475569">식도</text>

          {/* stomach */}
          <path
            d="M 217 108 Q 240 110 248 130 Q 250 165 215 170 Q 175 175 165 150 Q 158 125 180 112 Z"
            fill="#fda4af"
            stroke="#e11d48"
          />
          <text x={140} y={145} fontSize="11" fill="#475569" textAnchor="end">위</text>

          {/* small intestine — coiled */}
          <path
            d="M 215 170
               C 170 180 175 200 215 200
               C 255 200 260 220 215 225
               C 175 230 175 245 215 248
               C 250 250 255 260 220 263"
            fill="none"
            stroke="#f59e0b"
            strokeWidth={9}
            strokeLinecap="round"
          />
          <text x={310} y={225} fontSize="11" fill="#475569">소장</text>

          {/* large intestine — frame around small */}
          <path
            d="M 145 170 L 145 260 L 220 270 L 280 260 L 280 175"
            fill="none"
            stroke="#a16207"
            strokeWidth={11}
            strokeLinecap="round"
          />
          <text x={300} y={185} fontSize="11" fill="#475569">대장</text>

          {/* anus */}
          <circle cx={220} cy={282} r={5} fill="#7c2d12" />
          <text x={236} y={286} fontSize="11" fill="#475569">항문</text>

          {/* bolus marker */}
          <circle cx={bolus.x} cy={bolus.y} r={8} fill="#0ea5e9" opacity={0.9}>
            <animate attributeName="r" values="6;10;6" dur="1.2s" repeatCount="indefinite" />
          </circle>

          {/* nutrient breakdown arrows — only at digestion-active stages */}
          {(stage.key === "mouth" || stage.key === "stomach" || stage.key === "small") && (
            <g transform="translate(20 250)">
              <text x={0} y={0} fontSize="10" fill="#475569" fontWeight="600">분해</text>
              <text x={0} y={14} fontSize="10" fill="#0ea5e9">
                {stage.key === "mouth" && "녹말 → 엿당"}
                {stage.key === "stomach" && "단백질 → 펩톤"}
                {stage.key === "small" && "탄·단·지 → 포도당·아미노산·지방산"}
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-3 grid sm:grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-sm">
        <span className="text-slate-500 font-semibold">기관</span>
        <span className="text-slate-700">{stage.organ}</span>
        <span className="text-slate-500 font-semibold">소화액</span>
        <span className="text-slate-700">{stage.juice}</span>
        <span className="text-slate-500 font-semibold">효소</span>
        <span className="text-slate-700">{stage.enzyme}</span>
        <span className="text-slate-500 font-semibold">작용</span>
        <span className="text-slate-700">{stage.effect}</span>
      </div>
    </div>
  );
}
