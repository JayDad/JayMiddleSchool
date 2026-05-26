"use client";

import { useEffect, useRef, useState } from "react";

const W = 420;
const H = 280;

// Steps:
// 0.0-0.25: heat — both dissolved (clear)
// 0.25-0.55: cooling — KNO3 crystals form
// 0.55-1.0: filter — pure crystals collected, NaCl in filtrate

export default function RecrystallizationViz() {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 7000;

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

  // Temperature: 25 → 80 → 80 → cool to 10
  const temperature =
    t < 0.15
      ? 25 + (80 - 25) * (t / 0.15)
      : t < 0.25
      ? 80
      : t < 0.55
      ? 80 - (80 - 10) * ((t - 0.25) / 0.3)
      : 10;

  const beakerCx = W / 2 - 60;
  const beakerTop = 80;
  const beakerBot = 220;
  const beakerLeft = beakerCx - 50;
  const beakerRight = beakerCx + 50;
  const liquidTop = 110;

  // KNO3 crystal opacity / count
  const crystalProgress = Math.max(0, Math.min(1, (t - 0.25) / 0.3));
  const crystalCount = Math.round(crystalProgress * 18);

  // Generate deterministic crystal positions in lower part of beaker
  const crystals: { x: number; y: number; rot: number }[] = [];
  let s = 17;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < 18; i++) {
    crystals.push({
      x: beakerLeft + 8 + rand() * (beakerRight - beakerLeft - 16),
      y: beakerBot - 8 - rand() * 50,
      rot: rand() * 90,
    });
  }

  // Step label
  const stepLabel =
    t < 0.25
      ? "1단계 — 뜨거운 물에 모두 녹임"
      : t < 0.55
      ? "2단계 — 식히는 중 (KNO₃ 결정 석출)"
      : "3단계 — 거름으로 분리 — 순수한 KNO₃ 결정과 NaCl 용액";

  // Liquid color: clearer at hot (all dissolved), slightly bluish always; at end after filter — clear
  const liquidColor = t < 0.55 ? "#bae6fd" : "#bae6fd";
  const liquidOpacity = t < 0.25 ? 0.7 : 0.5;

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="viz-scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label="재결정 분리 단계"
        >
          {/* Beaker */}
          <path
            d={`M ${beakerLeft} ${beakerTop}
                L ${beakerLeft} ${beakerBot}
                L ${beakerRight} ${beakerBot}
                L ${beakerRight} ${beakerTop}`}
            fill="none"
            stroke="#0f172a"
            strokeWidth={2}
          />

          {/* Liquid */}
          <rect
            x={beakerLeft + 1}
            y={liquidTop}
            width={beakerRight - beakerLeft - 2}
            height={beakerBot - liquidTop - 1}
            fill={liquidColor}
            opacity={liquidOpacity}
          />

          {/* Crystals at bottom */}
          {crystals.slice(0, crystalCount).map((c, i) => (
            <rect
              key={i}
              x={c.x - 4}
              y={c.y - 4}
              width={8}
              height={8}
              fill="#fef9c3"
              stroke="#a16207"
              strokeWidth={1}
              transform={`rotate(${c.rot} ${c.x} ${c.y})`}
            />
          ))}

          {/* Heating flame (only during heat phase) */}
          {t < 0.25 && (
            <g>
              <rect x={beakerCx - 12} y={beakerBot + 4} width={24} height={8} fill="#475569" />
              <path
                d={`M ${beakerCx - 8} ${beakerBot + 4} Q ${beakerCx} ${beakerBot - 14} ${beakerCx + 8} ${beakerBot + 4} Z`}
                fill="#f59e0b"
              >
                <animate attributeName="opacity" values="0.6;1;0.6" dur="0.6s" repeatCount="indefinite" />
              </path>
            </g>
          )}
          {/* Cooling icon — snowflake (during cool phase) */}
          {t >= 0.25 && t < 0.55 && (
            <g transform={`translate(${beakerCx + 70} ${beakerTop + 30})`}>
              <text textAnchor="middle" fontSize="24" fill="#0ea5e9">❄</text>
              <text y={18} textAnchor="middle" fontSize="10" fill="#0369a1">냉각</text>
            </g>
          )}

          {/* Thermometer */}
          <g transform={`translate(${beakerRight + 14} ${beakerTop - 4})`}>
            <rect x={-3} y={0} width={6} height={130} fill="#fff" stroke="#334155" />
            <rect
              x={-2}
              y={130 - ((temperature / 100) * 124)}
              width={4}
              height={(temperature / 100) * 124}
              fill="#ef4444"
            />
            <circle cx={0} cy={134} r={6} fill="#ef4444" stroke="#7f1d1d" />
            <text x={10} y={20} fontSize="11" fill="#0f172a">{temperature.toFixed(0)}℃</text>
          </g>

          {/* Filter step illustration (right side) */}
          {t >= 0.55 && (
            <g transform="translate(280 80)">
              {/* funnel */}
              <path d="M 0 0 L 60 0 L 36 40 L 24 40 Z" fill="#f1f5f9" stroke="#0f172a" strokeWidth={1.5} />
              <rect x={24} y={40} width={12} height={30} fill="#f1f5f9" stroke="#0f172a" strokeWidth={1.5} />
              {/* filter paper */}
              <path d="M 4 2 L 56 2 L 32 36 Z" fill="#fef3c7" opacity={0.7} stroke="#d97706" strokeDasharray="3 2" />
              {/* crystals on paper */}
              <rect x={20} y={18} width={6} height={6} fill="#fef9c3" stroke="#a16207" />
              <rect x={30} y={22} width={6} height={6} fill="#fef9c3" stroke="#a16207" transform="rotate(20 33 25)" />
              <rect x={38} y={16} width={6} height={6} fill="#fef9c3" stroke="#a16207" />
              {/* receiver beaker */}
              <path d="M 14 90 L 14 140 L 46 140 L 46 90" fill="none" stroke="#0f172a" strokeWidth={1.5} />
              <rect x={15} y={108} width={30} height={31} fill="#bae6fd" opacity={0.6} />
              {/* drip */}
              <circle cx={30} cy={80} r={2.5} fill="#38bdf8">
                <animate attributeName="cy" values="78;106" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;0" dur="0.9s" repeatCount="indefinite" />
              </circle>
              <text x={30} y={158} textAnchor="middle" fontSize="10" fill="#0f172a">NaCl 용액</text>
              <text x={30} y={-6} textAnchor="middle" fontSize="10" fill="#0f172a">KNO₃ 결정</text>
            </g>
          )}

          <text x={beakerCx} y={beakerTop - 8} textAnchor="middle" fontSize="11" fill="#0f172a">
            KNO₃ + NaCl 혼합
          </text>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => {
            if (t >= 1) setT(0);
            setPlaying((p) => !p);
          }}
          className="text-sm px-3 py-1.5 rounded-full border border-brand-500 bg-brand-600 text-white hover:bg-brand-700"
        >
          {playing ? "■ 정지" : "▶ 재생"}
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setT(0);
          }}
          className="text-sm px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:border-brand-500"
        >
          처음으로
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
          className="flex-1 min-w-[140px]"
          aria-label="진행도"
        />
        <span className="text-xs text-slate-500 tabular-nums">{Math.round(t * 100)}%</span>
      </div>
      <p className="text-sm text-slate-700 mt-3 leading-relaxed font-semibold">{stepLabel}</p>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
        온도에 따라 <strong className="text-slate-800">용해도가 크게 변하는 성분(KNO₃)</strong>
        은 식히면 결정으로 빠져나오고, 용해도가 별로 안 변하는 성분(NaCl)은
        용액 속에 그대로 녹아있어요.
      </p>
    </div>
  );
}
