"use client";

import { useEffect, useRef, useState } from "react";

const W = 360;
const H = 320;

type Mix = "sand-water" | "sugar-water";

const MIXES: Record<Mix, { label: string; soluteName: string; soluteColor: string; soluble: boolean; desc: string }> = {
  "sand-water": {
    label: "모래 + 물",
    soluteName: "모래",
    soluteColor: "#a8a29e",
    soluble: false,
    desc: "모래는 물에 안 녹는 입자 → 거름종이 위에 걸린다. 물만 통과.",
  },
  "sugar-water": {
    label: "설탕물",
    soluteName: "설탕",
    soluteColor: "#fde68a",
    soluble: true,
    desc: "설탕은 물에 녹아 분자 수준으로 작아진 상태 → 거름종이를 그대로 통과. 거름으로는 분리 안 됨.",
  },
};

export default function FiltrationFunnel() {
  const [mix, setMix] = useState<Mix>("sand-water");
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 5000;

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

  const m = MIXES[mix];

  // funnel geometry
  const fx = W / 2;
  const fyTop = 60;
  const funnelW = 100;
  const funnelH = 70;
  const stemW = 14;
  const stemH = 36;
  const stemTop = fyTop + funnelH;
  const stemBot = stemTop + stemH;
  const beakerTop = stemBot + 18;
  const beakerBot = beakerTop + 90;
  const beakerLeft = fx - 50;
  const beakerRight = fx + 50;

  // liquid level dropping in funnel as t advances
  const initialLiquidH = 30;
  const liquidH = Math.max(2, initialLiquidH * (1 - t * 0.85));
  const liquidTop = fyTop + (funnelH - 30) - liquidH;

  // beaker fill
  const beakerFill = Math.min(1, t * 0.95);

  // sand pile on filter (only for sand-water)
  const sandPileHeight = m.soluble ? 0 : 18 * Math.min(1, t * 1.3);

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid md:grid-cols-[auto,1fr] gap-5 items-start">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm h-auto mx-auto" role="img" aria-label="거름 장치">
          {/* funnel cone */}
          <path
            d={`M ${fx - funnelW / 2} ${fyTop}
                L ${fx + funnelW / 2} ${fyTop}
                L ${fx + stemW / 2} ${stemTop}
                L ${fx - stemW / 2} ${stemTop} Z`}
            fill="#f8fafc"
            stroke="#0f172a"
            strokeWidth={1.8}
          />
          {/* filter paper */}
          <path
            d={`M ${fx - funnelW / 2 + 6} ${fyTop + 4}
                L ${fx + funnelW / 2 - 6} ${fyTop + 4}
                L ${fx} ${stemTop - 4} Z`}
            fill="#fef3c7"
            opacity={0.85}
            stroke="#d97706"
            strokeDasharray="3 2"
          />

          {/* liquid in funnel */}
          <path
            d={`M ${fx - funnelW / 2 + (funnelW / 2 - stemW / 2) * (1 - liquidH / funnelH)} ${liquidTop}
                L ${fx + funnelW / 2 - (funnelW / 2 - stemW / 2) * (1 - liquidH / funnelH)} ${liquidTop}
                L ${fx + stemW / 2} ${stemTop}
                L ${fx - stemW / 2} ${stemTop} Z`}
            fill="#bae6fd"
            opacity={0.75}
          />

          {/* sand pile on filter */}
          {!m.soluble && sandPileHeight > 0 && (
            <>
              <ellipse
                cx={fx}
                cy={stemTop - 2}
                rx={20}
                ry={sandPileHeight / 2}
                fill={m.soluteColor}
              />
              {/* a few sand grains */}
              {[-8, 0, 8].map((dx, i) => (
                <circle key={i} cx={fx + dx} cy={stemTop - 2 - sandPileHeight / 2 + 2} r={2} fill="#78716c" />
              ))}
            </>
          )}

          {/* stem */}
          <rect x={fx - stemW / 2} y={stemTop} width={stemW} height={stemH} fill="#f8fafc" stroke="#0f172a" strokeWidth={1.8} />

          {/* dripping */}
          {t > 0.05 && t < 0.98 && (
            <circle cx={fx} cy={stemBot + 4} r={3} fill="#38bdf8">
              <animate attributeName="cy" values={`${stemBot + 4};${beakerTop + 6}`} dur="0.7s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;1;0" dur="0.7s" repeatCount="indefinite" />
            </circle>
          )}

          {/* beaker */}
          <path
            d={`M ${beakerLeft} ${beakerTop} L ${beakerLeft} ${beakerBot} L ${beakerRight} ${beakerBot} L ${beakerRight} ${beakerTop}`}
            fill="none"
            stroke="#0f172a"
            strokeWidth={1.8}
          />
          {/* collected liquid (light blue or yellow tinted if sugar passed through) */}
          <rect
            x={beakerLeft + 1}
            y={beakerBot - 1 - beakerFill * (beakerBot - beakerTop - 2)}
            width={beakerRight - beakerLeft - 2}
            height={beakerFill * (beakerBot - beakerTop - 2)}
            fill={m.soluble ? "#fde68a" : "#bae6fd"}
            opacity={0.75}
          />

          {/* labels */}
          <text x={fx} y={fyTop - 10} textAnchor="middle" fontSize="11" fill="#0f172a">
            {m.label}
          </text>
          <text x={fx} y={beakerBot + 16} textAnchor="middle" fontSize="11" fill="#0f172a">
            거른 액체
          </text>
          {!m.soluble && (
            <text x={fx + 26} y={stemTop - 8} fontSize="10" fill="#78716c">
              {m.soluteName} 남음
            </text>
          )}
        </svg>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">혼합물 선택</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MIXES) as Mix[]).map((k) => (
              <button
                key={k}
                onClick={() => {
                  setMix(k);
                  setT(0);
                  setPlaying(false);
                }}
                className={`text-sm px-3 py-1.5 rounded-full border ${
                  mix === k
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-slate-300 text-slate-600 hover:border-brand-500"
                }`}
              >
                {MIXES[k].label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">{m.desc}</p>

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
              className="flex-1 min-w-[100px]"
              aria-label="진행도"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
