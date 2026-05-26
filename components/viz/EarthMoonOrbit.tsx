"use client";

import { useEffect, useRef, useState } from "react";

const VW = 420;
const VH = 280;
const SUN_X = 210;
const SUN_Y = 140;
const ORBIT_RX = 150;
const ORBIT_RY = 80;
const TILT = 23.5; // degrees

// Four seasonal positions on Earth's orbit (Northern hemisphere reference)
const SEASONS = [
  { angle: 0, label: "춘분", desc: "3월" },
  { angle: 90, label: "하지", desc: "6월" },
  { angle: 180, label: "추분", desc: "9월" },
  { angle: 270, label: "동지", desc: "12월" },
];

function earthPos(angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return {
    x: SUN_X + ORBIT_RX * Math.cos(a),
    y: SUN_Y + ORBIT_RY * Math.sin(a),
  };
}

export default function EarthMoonOrbit() {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0); // 0~1: one full year
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const step = () => {
      const next = (tRef.current + 0.0025) % 1;
      tRef.current = next;
      setT(next);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const earthAngle = t * 360;
  const earth = earthPos(earthAngle);
  // Moon revolves ~13 times per Earth year
  const moonAngle = t * 360 * 13;
  const moonR = 28;
  const moonX = earth.x + moonR * Math.cos((moonAngle * Math.PI) / 180);
  const moonY = earth.y + moonR * Math.sin((moonAngle * Math.PI) / 180) * 0.4;

  // Earth's rotation about its tilted axis — many spins per year (sped up visually)
  const spin = (t * 360 * 365) % 360;

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          className={`text-sm px-3 py-2 rounded-lg border min-h-[40px] ${
            playing
              ? "bg-rose-600 text-white border-rose-600"
              : "bg-brand-600 text-white border-brand-600"
          }`}
        >
          {playing ? "■ 멈춤" : "▶ 재생"}
        </button>
        <label className="flex items-center gap-2 text-sm text-slate-600 flex-1 min-w-[200px]">
          <span>시간</span>
          <input
            type="range"
            min={0}
            max={1000}
            value={Math.round(t * 1000)}
            onChange={(e) => {
              setPlaying(false);
              setT(Number(e.target.value) / 1000);
            }}
            className="w-full accent-brand-600"
          />
        </label>
        <span className="text-xs text-slate-500 tabular-nums">
          {Math.round(t * 12)}개월
        </span>
      </div>

      <div className="viz-scroll">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-auto">
          {/* starry background */}
          <rect x={0} y={0} width={VW} height={VH} fill="#0f172a" />
          {Array.from({ length: 40 }).map((_, i) => {
            const sx = (i * 53) % VW;
            const sy = (i * 37) % VH;
            return <circle key={i} cx={sx} cy={sy} r={0.6} fill="#cbd5e1" opacity={0.6} />;
          })}

          {/* Earth's orbit ellipse */}
          <ellipse
            cx={SUN_X}
            cy={SUN_Y}
            rx={ORBIT_RX}
            ry={ORBIT_RY}
            fill="none"
            stroke="#475569"
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          {/* Seasonal markers */}
          {SEASONS.map((s) => {
            const p = earthPos(s.angle);
            return (
              <g key={s.label}>
                <circle cx={p.x} cy={p.y} r={2} fill="#94a3b8" />
                <text
                  x={p.x + (s.angle === 0 ? 8 : s.angle === 180 ? -8 : 0)}
                  y={p.y + (s.angle === 90 ? 16 : s.angle === 270 ? -8 : 4)}
                  textAnchor={s.angle === 0 ? "start" : s.angle === 180 ? "end" : "middle"}
                  fontSize="10"
                  fill="#fbbf24"
                  fontWeight="600"
                >
                  {s.label}
                </text>
              </g>
            );
          })}

          {/* Sun */}
          <circle cx={SUN_X} cy={SUN_Y} r={22} fill="#fbbf24" />
          <circle cx={SUN_X} cy={SUN_Y} r={22} fill="none" stroke="#f59e0b" strokeWidth={2}>
            <animate attributeName="r" values="22;26;22" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x={SUN_X} y={SUN_Y + 4} textAnchor="middle" fontSize="10" fill="#78350f" fontWeight="700">
            태양
          </text>

          {/* Earth group */}
          <g transform={`translate(${earth.x} ${earth.y})`}>
            {/* moon's orbit around earth */}
            <ellipse cx={0} cy={0} rx={moonR} ry={moonR * 0.4} fill="none" stroke="#64748b" strokeWidth={0.6} strokeDasharray="2 2" />
            {/* Earth with tilted axis */}
            <g transform={`rotate(${-TILT})`}>
              {/* axis line */}
              <line x1={0} y1={-16} x2={0} y2={16} stroke="#f87171" strokeWidth={1.5} strokeDasharray="2 2" />
              {/* earth body */}
              <g transform={`rotate(${spin})`}>
                <circle cx={0} cy={0} r={10} fill="#3b82f6" />
                {/* continents (rough) */}
                <path d="M -6 -2 q 3 -3 6 0 q 1 3 -2 4 z" fill="#22c55e" />
                <path d="M 2 3 q 2 1 3 -1 q 1 2 -2 3 z" fill="#22c55e" />
              </g>
            </g>
            <text x={0} y={-22} textAnchor="middle" fontSize="9" fill="#e2e8f0" fontWeight="600">
              지구
            </text>
            <text x={14} y={-12} fontSize="8" fill="#f87171">
              23.5°
            </text>
            {/* moon */}
            <circle cx={moonX - earth.x} cy={moonY - earth.y} r={3.5} fill="#e2e8f0" />
          </g>

          {/* Title labels */}
          <text x={10} y={16} fontSize="10" fill="#e2e8f0">
            지구의 공전 (1년) · 자전축 23.5° 기울기
          </text>
          <text x={10} y={VH - 8} fontSize="9" fill="#94a3b8">
            달이 지구 둘레를 함께 돌며 같은 면을 향함
          </text>
        </svg>
      </div>

      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
        지구는 태양 둘레를 약 <strong>1년</strong>에 한 바퀴 공전하며 동시에 자전축이 약 <strong>23.5°</strong> 기울어진 채 자전한다.
        기울기 때문에 같은 위치라도 햇빛을 받는 각도가 달라져 <strong>계절</strong>이 생긴다.
        달은 지구 둘레를 약 <strong>27.3일(항성월)</strong>에 한 바퀴 돈다.
      </p>
    </div>
  );
}
