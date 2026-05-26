"use client";

import { useEffect, useRef, useState } from "react";

const W = 480;
const H = 300;

export default function DistillationApparatus() {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0); // 0..1
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

  // Phases:
  // 0.0~0.2: heating (bubbles)
  // 0.2~0.7: vapor traveling through condenser
  // 0.3~1.0: droplets dripping into receiver
  const bubblesActive = t > 0.05;
  const vaporProgress = Math.max(0, Math.min(1, (t - 0.2) / 0.5));
  const dripProgress = Math.max(0, Math.min(1, (t - 0.3) / 0.7));
  const receiverFill = Math.max(0, Math.min(1, (t - 0.35) / 0.6));

  // Geometry
  const flaskCx = 95;
  const flaskCy = 175;
  const flaskR = 38;
  const neckTop = flaskCy - flaskR - 28;
  // Side arm leaves flask neck and goes down-right into condenser
  const armStart = { x: flaskCx + 8, y: neckTop + 8 };
  const condenserStart = { x: 175, y: 85 };
  const condenserEnd = { x: 350, y: 165 };
  const receiverCx = 395;
  const receiverCy = 215;
  const receiverR = 26;

  // Vapor path approximation along condenser
  const vx = condenserStart.x + (condenserEnd.x - condenserStart.x) * vaporProgress;
  const vy = condenserStart.y + (condenserEnd.y - condenserStart.y) * vaporProgress;

  const reset = () => {
    setPlaying(false);
    setT(0);
    startRef.current = null;
  };

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="viz-scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label="증류 장치 다이어그램"
        >
          {/* stand base line */}
          <line x1={20} y1={H - 20} x2={W - 20} y2={H - 20} stroke="#94a3b8" strokeWidth={2} />

          {/* Bunsen burner */}
          <g>
            <rect x={flaskCx - 18} y={H - 50} width={36} height={20} fill="#475569" />
            <rect x={flaskCx - 6} y={H - 80} width={12} height={30} fill="#334155" />
            {/* flame */}
            <path
              d={`M ${flaskCx - 10} ${H - 80} Q ${flaskCx} ${H - 110} ${flaskCx + 10} ${H - 80} Z`}
              fill="#f59e0b"
              opacity={0.85}
            >
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d={`M ${flaskCx - 6} ${H - 80} Q ${flaskCx} ${H - 100} ${flaskCx + 6} ${H - 80} Z`}
              fill="#fde047"
            >
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Round-bottom flask */}
          <g>
            <circle cx={flaskCx} cy={flaskCy} r={flaskR} fill="#e0f2fe" stroke="#0f172a" strokeWidth={1.8} />
            {/* liquid level */}
            <path
              d={`M ${flaskCx - flaskR * 0.95} ${flaskCy + 6}
                  A ${flaskR} ${flaskR} 0 0 0 ${flaskCx + flaskR * 0.95} ${flaskCy + 6}
                  L ${flaskCx + flaskR * 0.95} ${flaskCy + flaskR - 4}
                  A ${flaskR} ${flaskR} 0 0 0 ${flaskCx - flaskR * 0.95} ${flaskCy + flaskR - 4}
                  Z`}
              fill="#7dd3fc"
              opacity={0.7}
            />
            {/* neck */}
            <rect x={flaskCx - 8} y={neckTop} width={16} height={flaskCy - flaskR - neckTop} fill="#e0f2fe" stroke="#0f172a" strokeWidth={1.8} />

            {/* bubbles */}
            {bubblesActive &&
              [0, 1, 2, 3].map((i) => (
                <circle
                  key={i}
                  cx={flaskCx + (i - 1.5) * 8}
                  cy={flaskCy + 18}
                  r={2.5}
                  fill="#bae6fd"
                >
                  <animate
                    attributeName="cy"
                    values={`${flaskCy + 18};${flaskCy - 10}`}
                    dur="1.2s"
                    begin={`${i * 0.25}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="1.2s"
                    begin={`${i * 0.25}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}

            {/* thermometer */}
            <line x1={flaskCx} y1={neckTop - 30} x2={flaskCx} y2={neckTop + 6} stroke="#334155" strokeWidth={2} />
            <circle cx={flaskCx} cy={neckTop - 32} r={4} fill="#ef4444" />
            <text x={flaskCx + 8} y={neckTop - 24} fontSize="11" fill="#0f172a">온도계</text>
          </g>

          {/* Side arm / condenser */}
          <g>
            {/* outer jacket */}
            <line
              x1={condenserStart.x}
              y1={condenserStart.y - 12}
              x2={condenserEnd.x}
              y2={condenserEnd.y - 12}
              stroke="#0369a1"
              strokeWidth={3}
            />
            <line
              x1={condenserStart.x}
              y1={condenserStart.y + 12}
              x2={condenserEnd.x}
              y2={condenserEnd.y + 12}
              stroke="#0369a1"
              strokeWidth={3}
            />
            {/* inner tube */}
            <line
              x1={armStart.x}
              y1={armStart.y}
              x2={condenserStart.x}
              y2={condenserStart.y}
              stroke="#0f172a"
              strokeWidth={1.8}
            />
            <line
              x1={condenserStart.x}
              y1={condenserStart.y}
              x2={condenserEnd.x}
              y2={condenserEnd.y}
              stroke="#0f172a"
              strokeWidth={1.8}
            />
            {/* water in/out arrows */}
            <text x={condenserEnd.x - 10} y={condenserEnd.y - 18} fontSize="10" fill="#0369a1">냉각수 in</text>
            <text x={condenserStart.x - 10} y={condenserStart.y + 26} fontSize="10" fill="#0369a1">out</text>

            {/* vapor packet */}
            {vaporProgress > 0 && vaporProgress < 1 && (
              <g>
                <circle cx={vx} cy={vy} r={6} fill="#cbd5e1" opacity={0.7}>
                  <animate attributeName="r" values="5;8;5" dur="0.6s" repeatCount="indefinite" />
                </circle>
                <text x={vx + 10} y={vy - 6} fontSize="10" fill="#475569">증기</text>
              </g>
            )}
          </g>

          {/* Receiving flask */}
          <g>
            <rect x={receiverCx - receiverR} y={receiverCy - receiverR} width={receiverR * 2} height={receiverR * 2} fill="#f8fafc" stroke="#0f172a" strokeWidth={1.8} rx={3} />
            {/* collected liquid */}
            <rect
              x={receiverCx - receiverR + 2}
              y={receiverCy + receiverR - 2 - receiverFill * (receiverR * 2 - 4)}
              width={receiverR * 2 - 4}
              height={receiverFill * (receiverR * 2 - 4)}
              fill="#7dd3fc"
              opacity={0.8}
            />
            <text x={receiverCx} y={receiverCy + receiverR + 14} textAnchor="middle" fontSize="11" fill="#0f172a">
              받는 그릇
            </text>

            {/* drip animation */}
            {dripProgress > 0 && (
              <circle cx={condenserEnd.x + 6} cy={condenserEnd.y + 16} r={3} fill="#38bdf8">
                <animate
                  attributeName="cy"
                  values={`${condenserEnd.y + 16};${receiverCy - receiverR + 4}`}
                  dur="0.9s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>

          {/* labels */}
          <text x={flaskCx} y={flaskCy + flaskR + 22} textAnchor="middle" fontSize="11" fill="#0f172a">
            혼합 액체 (낮은 BP 성분 먼저 끓음)
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
          onClick={reset}
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
      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
        가열 → 끓는점이 낮은 성분이 먼저 기화 → 냉각관에서 응축 → 받는 그릇에 모임.
        성분의 <strong className="text-slate-800">끓는점 차이</strong>를 이용한 분리법이에요.
      </p>
    </div>
  );
}
