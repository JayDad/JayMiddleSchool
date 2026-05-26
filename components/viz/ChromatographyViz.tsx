"use client";

import { useEffect, useRef, useState } from "react";

const W = 380;
const H = 320;

type Sample = "blackInk" | "greenInk" | "redMarker";

const SAMPLES: Record<
  Sample,
  { label: string; components: { color: string; name: string; speed: number }[] }
> = {
  blackInk: {
    label: "검정 잉크",
    components: [
      { color: "#fde047", name: "노랑", speed: 0.95 },
      { color: "#f97316", name: "주황", speed: 0.75 },
      { color: "#ef4444", name: "빨강", speed: 0.55 },
      { color: "#1e3a8a", name: "파랑", speed: 0.3 },
    ],
  },
  greenInk: {
    label: "초록 잉크",
    components: [
      { color: "#facc15", name: "노랑", speed: 0.85 },
      { color: "#22c55e", name: "초록", speed: 0.55 },
      { color: "#1e3a8a", name: "파랑", speed: 0.3 },
    ],
  },
  redMarker: {
    label: "빨강 마커",
    components: [
      { color: "#f59e0b", name: "노랑-주황", speed: 0.9 },
      { color: "#ef4444", name: "빨강", speed: 0.55 },
      { color: "#be185d", name: "자홍", speed: 0.4 },
    ],
  },
};

export default function ChromatographyViz() {
  const [sample, setSample] = useState<Sample>("blackInk");
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 6000;

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
      return;
    }
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts - t * DURATION;
      const p = Math.min(1, (ts - startRef.current) / DURATION);
      setT(p);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else setPlaying(false);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]); // eslint-disable-line react-hooks/exhaustive-deps

  const s = SAMPLES[sample];

  // beaker geometry
  const beakerLeft = 60;
  const beakerRight = 200;
  const beakerTop = 50;
  const beakerBot = H - 40;
  // paper strip
  const paperLeft = 110;
  const paperRight = 150;
  const paperTop = 60;
  const paperBot = beakerBot - 10;
  // solvent line in beaker — rises slightly
  const solventBotY = beakerBot - 6;
  const solventTopY = paperBot - 14; // base level (just below origin)
  // Solvent front in paper: rises from solventTopY toward paperTop as t advances
  const startY = solventTopY - 4;
  const endY = paperTop + 16;
  const frontY = startY + (endY - startY) * t;
  // origin (sample dot)
  const originY = startY - 4;

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid md:grid-cols-[auto,1fr] gap-5 items-start">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm h-auto mx-auto" role="img" aria-label="크로마토그래피">
          {/* beaker */}
          <path
            d={`M ${beakerLeft} ${beakerTop} L ${beakerLeft} ${beakerBot} L ${beakerRight} ${beakerBot} L ${beakerRight} ${beakerTop}`}
            fill="none"
            stroke="#0f172a"
            strokeWidth={1.8}
          />
          {/* solvent at bottom of beaker */}
          <rect
            x={beakerLeft + 1}
            y={solventTopY}
            width={beakerRight - beakerLeft - 2}
            height={solventBotY - solventTopY}
            fill="#bae6fd"
            opacity={0.6}
          />
          {/* lid bar from which paper hangs */}
          <line x1={beakerLeft - 6} y1={beakerTop} x2={beakerRight + 6} y2={beakerTop} stroke="#0f172a" strokeWidth={2} />

          {/* paper strip */}
          <rect x={paperLeft} y={paperTop} width={paperRight - paperLeft} height={paperBot - paperTop} fill="#fefce8" stroke="#a16207" strokeWidth={1} />

          {/* solvent front in paper (wet area) */}
          <rect
            x={paperLeft + 1}
            y={frontY}
            width={paperRight - paperLeft - 2}
            height={solventTopY - frontY + 4}
            fill="#bae6fd"
            opacity={0.45}
          />
          {/* origin line */}
          <line x1={paperLeft - 4} y1={originY} x2={paperRight + 4} y2={originY} stroke="#475569" strokeDasharray="3 2" strokeWidth={1} />
          <text x={paperRight + 8} y={originY + 4} fontSize="9" fill="#475569">기준선</text>

          {/* sample dots (start as concentrated, then move up by speed) */}
          {s.components.map((c, i) => {
            const travelY = originY - (originY - endY) * c.speed * t;
            const spread = 6 + t * 4;
            return (
              <g key={i}>
                <ellipse
                  cx={(paperLeft + paperRight) / 2}
                  cy={travelY}
                  rx={(paperRight - paperLeft - 6) / 2}
                  ry={Math.max(2, spread / 2.5)}
                  fill={c.color}
                  opacity={0.8}
                />
              </g>
            );
          })}
          {/* initial dot if t very small */}
          {t < 0.05 && (
            <ellipse
              cx={(paperLeft + paperRight) / 2}
              cy={originY}
              rx={6}
              ry={3}
              fill="#1f2937"
            />
          )}

          {/* side labels for separated bands at the end */}
          {t > 0.85 &&
            s.components.map((c, i) => {
              const travelY = originY - (originY - endY) * c.speed;
              return (
                <text key={i} x={paperRight + 8} y={travelY + 4} fontSize="10" fill={c.color}>
                  {c.name}
                </text>
              );
            })}

          {/* labels */}
          <text x={(paperLeft + paperRight) / 2} y={paperTop - 8} textAnchor="middle" fontSize="11" fill="#0f172a">
            거름종이 / 크로마토그래피 종이
          </text>
          <text x={(beakerLeft + beakerRight) / 2} y={beakerBot + 14} textAnchor="middle" fontSize="11" fill="#0f172a">
            전개 용매 (예: 물 / 에탄올)
          </text>
        </svg>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">시료 선택</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SAMPLES) as Sample[]).map((k) => (
              <button
                key={k}
                onClick={() => {
                  setSample(k);
                  setT(0);
                  setPlaying(false);
                }}
                className={`text-sm px-3 py-1.5 rounded-full border ${
                  sample === k
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-slate-300 text-slate-600 hover:border-brand-500"
                }`}
              >
                {SAMPLES[k].label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            용매가 종이를 타고 올라가면서, 종이에 잘 붙는 성분은 천천히, 용매를
            잘 따라가는 성분은 빠르게 이동해요. 결과적으로 성분이 위·아래로
            나뉘어 보입니다.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (t >= 1) setT(0);
                setPlaying((p) => !p);
              }}
              className="text-sm px-3 py-1.5 rounded-full border border-brand-500 bg-brand-600 text-white hover:bg-brand-700"
            >
              {playing ? "■ 정지" : "▶ 재생"}
            </button>
            <input
              type="range"
              min={0}
              max={1000}
              value={Math.round(t * 1000)}
              onChange={(e) => {
                setPlaying(false);
                setT(Number(e.target.value) / 1000);
              }}
              className="flex-1 min-w-[120px]"
              aria-label="진행도"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
