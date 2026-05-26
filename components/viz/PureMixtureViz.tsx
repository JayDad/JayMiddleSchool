"use client";

import { useMemo, useState } from "react";

type Kind = "element" | "compound" | "homogeneous" | "heterogeneous";

const KINDS: { id: Kind; label: string; group: "순물질" | "혼합물"; example: string; desc: string }[] = [
  {
    id: "element",
    label: "단체 (원소)",
    group: "순물질",
    example: "산소 O₂",
    desc: "한 가지 원소의 같은 분자만 모여 있다. 더 작은 물질로 분해되지 않음.",
  },
  {
    id: "compound",
    label: "화합물",
    group: "순물질",
    example: "물 H₂O",
    desc: "서로 다른 원소가 일정한 비율로 결합한 같은 분자만 모여 있다.",
  },
  {
    id: "homogeneous",
    label: "균일 혼합물",
    group: "혼합물",
    example: "소금물",
    desc: "두 종류 이상의 입자가 고르게 섞여 어디를 봐도 성분 비율이 같다.",
  },
  {
    id: "heterogeneous",
    label: "불균일 혼합물",
    group: "혼합물",
    example: "흙탕물",
    desc: "성분 입자가 뭉치거나 한쪽에 치우쳐 위치마다 성분 비율이 다르다.",
  },
];

const BOX_W = 320;
const BOX_H = 220;
const PAD = 18;

type Particle = { x: number; y: number; type: 0 | 1; r: number };

// Deterministic pseudo-random so the layout is stable per kind
function seeded(kind: Kind): () => number {
  let s = kind.split("").reduce((a, c) => a + c.charCodeAt(0), 7);
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildParticles(kind: Kind): Particle[] {
  const rand = seeded(kind);
  const out: Particle[] = [];
  const tries = 600;
  const target = 26;
  const minDist = 22;
  while (out.length < target) {
    if (out.length > tries) break;
    const x = PAD + 12 + rand() * (BOX_W - PAD * 2 - 24);
    const y = PAD + 12 + rand() * (BOX_H - PAD * 2 - 24);
    if (out.every((p) => Math.hypot(p.x - x, p.y - y) > minDist)) {
      let type: 0 | 1 = 0;
      if (kind === "homogeneous") {
        type = rand() < 0.35 ? 1 : 0;
      } else if (kind === "heterogeneous") {
        // bias type 1 toward bottom-right cluster
        const inCluster = x > BOX_W * 0.55 && y > BOX_H * 0.5;
        type = inCluster ? (rand() < 0.7 ? 1 : 0) : rand() < 0.1 ? 1 : 0;
      }
      out.push({ x, y, type, r: 8 });
      if (out.length > tries) break;
    }
  }
  return out;
}

function Molecule({ x, y, kind, type }: { x: number; y: number; kind: Kind; type: 0 | 1 }) {
  // element: O=O 모양 (두 개의 동일 원자)
  if (kind === "element") {
    return (
      <g>
        <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke="#1e293b" strokeWidth={1.5} />
        <circle cx={x - 6} cy={y} r={7} fill="#ef4444" stroke="#7f1d1d" strokeWidth={1} />
        <circle cx={x + 6} cy={y} r={7} fill="#ef4444" stroke="#7f1d1d" strokeWidth={1} />
      </g>
    );
  }
  // compound: H-O-H 모양 (가운데 큰 원자 + 양쪽 작은 원자)
  if (kind === "compound") {
    return (
      <g>
        <line x1={x - 7} y1={y + 4} x2={x} y2={y - 2} stroke="#1e293b" strokeWidth={1.2} />
        <line x1={x + 7} y1={y + 4} x2={x} y2={y - 2} stroke="#1e293b" strokeWidth={1.2} />
        <circle cx={x} cy={y - 2} r={7} fill="#ef4444" stroke="#7f1d1d" strokeWidth={1} />
        <circle cx={x - 7} cy={y + 4} r={4.5} fill="#e2e8f0" stroke="#475569" strokeWidth={1} />
        <circle cx={x + 7} cy={y + 4} r={4.5} fill="#e2e8f0" stroke="#475569" strokeWidth={1} />
      </g>
    );
  }
  // mixtures: two molecule kinds in same view
  if (type === 0) {
    // water-like (compound) 분자
    return (
      <g>
        <line x1={x - 7} y1={y + 4} x2={x} y2={y - 2} stroke="#1e293b" strokeWidth={1.2} />
        <line x1={x + 7} y1={y + 4} x2={x} y2={y - 2} stroke="#1e293b" strokeWidth={1.2} />
        <circle cx={x} cy={y - 2} r={7} fill="#ef4444" stroke="#7f1d1d" strokeWidth={1} />
        <circle cx={x - 7} cy={y + 4} r={4.5} fill="#e2e8f0" stroke="#475569" strokeWidth={1} />
        <circle cx={x + 7} cy={y + 4} r={4.5} fill="#e2e8f0" stroke="#475569" strokeWidth={1} />
      </g>
    );
  }
  // 소금/흙 입자 등 — 단일 사각형 결정 느낌
  return (
    <g>
      <rect x={x - 6} y={y - 6} width={12} height={12} fill="#0ea5e9" stroke="#0c4a6e" strokeWidth={1} />
    </g>
  );
}

export default function PureMixtureViz() {
  const [kind, setKind] = useState<Kind>("element");
  const particles = useMemo(() => buildParticles(kind), [kind]);
  const current = KINDS.find((k) => k.id === kind)!;

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid md:grid-cols-[auto,1fr] gap-5 items-start">
        <svg
          viewBox={`0 0 ${BOX_W} ${BOX_H}`}
          className="w-full max-w-sm h-auto mx-auto"
          role="img"
          aria-label={`${current.label} 분자 모델`}
        >
          {/* container */}
          <rect
            x={PAD}
            y={PAD}
            width={BOX_W - PAD * 2}
            height={BOX_H - PAD * 2}
            rx={8}
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth={2}
          />
          {particles.map((p, i) => (
            <Molecule key={i} x={p.x} y={p.y} kind={kind} type={p.type} />
          ))}
          {/* group badge */}
          <g>
            <rect
              x={PAD + 6}
              y={PAD + 6}
              width={60}
              height={18}
              rx={9}
              fill={current.group === "순물질" ? "#dcfce7" : "#fef3c7"}
              stroke={current.group === "순물질" ? "#16a34a" : "#d97706"}
            />
            <text
              x={PAD + 36}
              y={PAD + 19}
              textAnchor="middle"
              fontSize="11"
              fill="#0f172a"
            >
              {current.group}
            </text>
          </g>
        </svg>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">
            물질의 종류를 선택하세요
          </p>
          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button
                key={k.id}
                onClick={() => setKind(k.id)}
                className={`text-sm px-3 py-1.5 rounded-full border ${
                  kind === k.id
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-slate-300 text-slate-600 hover:border-brand-500"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm text-slate-700">
            <div>
              <span className="font-semibold">예시:</span> {current.example}
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {current.desc}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 border border-red-900" />
              산소 원자(O)
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-500" />
              수소 원자(H)
            </span>
            {(kind === "homogeneous" || kind === "heterogeneous") && (
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-sky-500 border border-sky-900" />
                다른 입자
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
