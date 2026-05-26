"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ElectromagneticInduction
 * - 막대자석을 좌우로 움직이면 코일에 유도전류가 흐름
 * - 자석 슬라이더(위치) + 자동 진동 토글
 * - 검류계 바늘 편향: 자석 속도에 비례, 방향에 따라 좌/우
 */
export default function ElectromagneticInduction() {
  const [pos, setPos] = useState(100); // 자석 위치 (px)
  const [auto, setAuto] = useState(false);

  // 이전 위치 추적해서 속도(=유도전류) 계산
  const lastPos = useRef(pos);
  const lastTime = useRef(typeof performance !== "undefined" ? performance.now() : 0);
  const [velocity, setVelocity] = useState(0); // 음수: 왼쪽으로, 양수: 오른쪽으로

  // 자동 진동
  useEffect(() => {
    if (!auto) return;
    let raf = 0;
    const start = performance.now();
    const step = () => {
      const t = (performance.now() - start) / 1000;
      const newPos = 150 + 80 * Math.sin(t * 2.5);
      setPos(newPos);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [auto]);

  // 속도 계산 (위치 변화 추적)
  useEffect(() => {
    const now = typeof performance !== "undefined" ? performance.now() : 0;
    const dt = Math.max(1, now - lastTime.current);
    const v = ((pos - lastPos.current) / dt) * 1000; // px/sec
    lastPos.current = pos;
    lastTime.current = now;
    // 감쇠 적용 — 정지하면 0으로
    setVelocity(v);
  }, [pos]);

  // 속도 감쇠 (정지 시 바늘 0)
  useEffect(() => {
    const t = setInterval(() => {
      setVelocity((v) => (Math.abs(v) < 1 ? 0 : v * 0.7));
    }, 100);
    return () => clearInterval(t);
  }, []);

  // 검류계 바늘 각도 — velocity 의 부호와 크기
  const maxAngle = 60;
  const angle = Math.max(-maxAngle, Math.min(maxAngle, velocity * 0.15));

  const direction = Math.abs(velocity) < 5 ? "정지" : velocity > 0 ? "오른쪽" : "왼쪽";
  const magnitude = Math.min(1, Math.abs(velocity) / 400);

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="viz-scroll">
        <svg viewBox="0 0 420 240" className="w-full h-auto">
          {/* 코일 (가로로 배치된 솔레노이드) */}
          <g>
            {Array.from({ length: 8 }).map((_, i) => (
              <ellipse
                key={i}
                cx={210 + (i - 3.5) * 14}
                cy={120}
                rx={6}
                ry={26}
                fill="none"
                stroke="#92400e"
                strokeWidth={2}
              />
            ))}
            {/* 코일 양 끝 도선 → 검류계 */}
            <line x1={158} y1={146} x2={158} y2={180} stroke="#92400e" strokeWidth={2} />
            <line x1={158} y1={180} x2={310} y2={180} stroke="#92400e" strokeWidth={2} />
            <line x1={262} y1={146} x2={262} y2={170} stroke="#92400e" strokeWidth={2} />
            <line x1={262} y1={170} x2={340} y2={170} stroke="#92400e" strokeWidth={2} />
            <text x={210} y={106} textAnchor="middle" fontSize="11" fill="#475569">
              코일
            </text>
          </g>

          {/* 막대자석 (왼쪽에서 위치 가변) */}
          <g transform={`translate(${pos} 0)`}>
            {/* S(왼쪽 파랑) - N(오른쪽 빨강) */}
            <rect x={0} y={106} width={28} height={28} fill="#60a5fa" stroke="#1e40af" strokeWidth={1.5} />
            <rect x={28} y={106} width={28} height={28} fill="#f87171" stroke="#991b1b" strokeWidth={1.5} />
            <text x={14} y={125} textAnchor="middle" fontSize="13" fontWeight={700} fill="white">
              S
            </text>
            <text x={42} y={125} textAnchor="middle" fontSize="13" fontWeight={700} fill="white">
              N
            </text>

            {/* 운동 방향 화살표 */}
            {Math.abs(velocity) > 5 && (
              <g>
                <line
                  x1={velocity > 0 ? -4 : 60}
                  y1={90}
                  x2={velocity > 0 ? -24 : 80}
                  y2={90}
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  markerEnd="url(#emArr)"
                />
                <text x={28} y={84} textAnchor="middle" fontSize="10" fill="#0ea5e9">
                  운동
                </text>
              </g>
            )}
          </g>

          <defs>
            <marker id="emArr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 4 L 0 8 Z" fill="#0ea5e9" />
            </marker>
          </defs>

          {/* 검류계 */}
          <g transform="translate(325 195)">
            <rect x={-25} y={-25} width={50} height={40} rx={4} fill="white" stroke="#0f172a" strokeWidth={1.5} />
            {/* 눈금 */}
            <path d="M -18 0 A 18 18 0 0 1 18 0" fill="none" stroke="#475569" strokeWidth={0.8} />
            <text x={-22} y={-2} fontSize="8" fill="#475569">
              −
            </text>
            <text x={18} y={-2} fontSize="8" fill="#475569">
              +
            </text>
            <text x={0} y={-10} textAnchor="middle" fontSize="8" fill="#475569">
              0
            </text>
            {/* 바늘 */}
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-15}
              stroke="#ef4444"
              strokeWidth={2}
              transform={`rotate(${angle})`}
              style={{ transition: "transform 0.15s" }}
            />
            <circle cx={0} cy={0} r={2} fill="#0f172a" />
            <text x={0} y={26} textAnchor="middle" fontSize="9" fill="#475569">
              검류계 G
            </text>
          </g>

          {/* 상태 표시 */}
          <text x={20} y={30} fontSize="11" fill="#0f172a" fontWeight={600}>
            자석 운동: {direction}
          </text>
          <text x={20} y={48} fontSize="11" fill="#475569">
            유도전류 세기: {(magnitude * 100).toFixed(0)}%
          </text>

          {/* 코일 안 유도 전류 표시 (방향 표시 — 단순화: 화살표) */}
          {Math.abs(velocity) > 5 && (
            <g>
              <text x={210} y={75} textAnchor="middle" fontSize="11" fill="#0ea5e9" fontWeight={600}>
                유도전류 흐름 {velocity > 0 ? "↻" : "↺"}
              </text>
              {/* 렌츠의 법칙: 자석 가까워지면 코일은 자석 가까이 쪽에 같은 극을 만들어 밀어냄 */}
              <text x={210} y={220} textAnchor="middle" fontSize="10" fill="#64748b">
                렌츠의 법칙: 자석의 운동을 <tspan fontWeight={700}>방해</tspan>하는 방향으로 흐름
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-3 grid sm:grid-cols-[1fr,auto] gap-3 items-center">
        <label className="block">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">자석 위치 (수동)</span>
            <span className="font-semibold tabular-nums">{pos.toFixed(0)}</span>
          </div>
          <input
            type="range"
            min={50}
            max={250}
            value={pos}
            disabled={auto}
            onChange={(e) => setPos(Number(e.target.value))}
            className="w-full accent-brand-600 disabled:opacity-50"
          />
        </label>
        <button
          onClick={() => setAuto((a) => !a)}
          className={`text-sm px-3 py-2 rounded-lg border min-h-[40px] ${
            auto
              ? "bg-rose-600 text-white border-rose-600"
              : "bg-brand-600 text-white border-brand-600"
          }`}
        >
          {auto ? "■ 정지" : "▶ 자동 왕복"}
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
        자석이 코일에 가까워지거나 멀어질 때 코일에 <strong>유도전류</strong>가 흐른다(<strong>전자기 유도</strong>).
        자석이 멈춰 있으면 전류가 흐르지 않는다. 자석을 <strong>빠르게</strong> 움직일수록, <strong>세기가 강한</strong> 자석일수록,
        코일을 <strong>많이 감을수록</strong> 유도전류가 커진다.
      </p>
    </div>
  );
}
