"use client";

import { useState } from "react";

/**
 * StaticElectricityViz
 * - 마찰 횟수 슬라이더로 두 물체(유리막대·털가죽)의 전하 분리 정도를 시각화
 * - "방전" 버튼: 두 물체 사이 번개로 전하가 중화되는 모습
 */
export default function StaticElectricityViz() {
  const [rubs, setRubs] = useState(0);
  const [discharged, setDischarged] = useState(false);

  // 전하 개수: 마찰할수록 분리가 커진다. 방전되면 0.
  const charge = discharged ? 0 : Math.min(8, Math.round(rubs / 2));

  // 전하 점 배치 (왼쪽: 털가죽 - 음전하가 유리막대로 이동했으므로 + 가 남음)
  // 물리: 유리막대를 털가죽으로 문지르면 → 유리(+), 털가죽(−)
  // 여기서 왼쪽=유리막대(+), 오른쪽=털가죽(−) 으로 표시
  const positions = (n: number, baseX: number, baseY: number) =>
    Array.from({ length: n }, (_, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      return { x: baseX + col * 18, y: baseY + row * 18 };
    });

  const posCharges = positions(charge, 70, 130);
  const negCharges = positions(charge, 280, 130);

  const handleRub = () => {
    if (discharged) setDischarged(false);
    setRubs((r) => Math.min(16, r + 2));
  };
  const reset = () => {
    setRubs(0);
    setDischarged(false);
  };

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="viz-scroll">
        <svg viewBox="0 0 420 240" className="w-full h-auto">
          {/* 유리막대 (왼쪽) */}
          <g>
            <rect
              x={50}
              y={70}
              width={90}
              height={50}
              rx={6}
              fill="#dbeafe"
              stroke="#0ea5e9"
              strokeWidth={2}
            />
            <text x={95} y={60} textAnchor="middle" fontSize="12" fill="#0369a1" fontWeight={600}>
              유리막대
            </text>
            {/* + 전하 */}
            {posCharges.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={7} fill="#ef4444" />
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fill="white"
                  fontWeight={700}
                >
                  +
                </text>
              </g>
            ))}
          </g>

          {/* 털가죽 (오른쪽) */}
          <g>
            <path
              d="M 270 70 L 360 70 Q 380 95 360 120 L 270 120 Z"
              fill="#fde68a"
              stroke="#b45309"
              strokeWidth={2}
            />
            <text x={315} y={60} textAnchor="middle" fontSize="12" fill="#92400e" fontWeight={600}>
              털가죽
            </text>
            {/* − 전하 */}
            {negCharges.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={7} fill="#3b82f6" />
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fill="white"
                  fontWeight={700}
                >
                  −
                </text>
              </g>
            ))}
          </g>

          {/* 마찰 표시 (rubs > 0 && !discharged) */}
          {rubs > 0 && !discharged && (
            <text x={210} y={50} textAnchor="middle" fontSize="11" fill="#475569">
              ← 마찰 →
            </text>
          )}

          {/* 방전(번개) */}
          {discharged && (
            <g>
              <path
                d="M 145 95 L 175 80 L 165 100 L 200 90 L 185 110 L 220 100 L 210 120 L 245 110 L 235 130 L 270 95"
                fill="none"
                stroke="#facc15"
                strokeWidth={3}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <text x={210} y={205} textAnchor="middle" fontSize="12" fill="#b45309" fontWeight={600}>
                ⚡ 방전: 전하가 이동해 중화됨
              </text>
            </g>
          )}

          {/* 안내 텍스트 */}
          {rubs === 0 && !discharged && (
            <text x={210} y={170} textAnchor="middle" fontSize="12" fill="#64748b">
              두 물체가 전기적으로 중성 상태
            </text>
          )}
          {rubs > 0 && !discharged && (
            <text x={210} y={195} textAnchor="middle" fontSize="12" fill="#475569">
              유리막대(+) ↔ 털가죽(−) 으로 전하 분리
            </text>
          )}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={handleRub}
          disabled={rubs >= 16 && !discharged}
          className="text-sm px-3 py-2 rounded-lg bg-brand-600 text-white border border-brand-600 disabled:opacity-50 min-h-[40px]"
        >
          마찰하기 (현재 {rubs}회)
        </button>
        <button
          onClick={() => setDischarged(true)}
          disabled={charge === 0}
          className="text-sm px-3 py-2 rounded-lg border border-amber-500 text-amber-700 hover:bg-amber-50 disabled:opacity-40 min-h-[40px]"
        >
          ⚡ 방전시키기
        </button>
        <button
          onClick={reset}
          className="text-sm px-3 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 min-h-[40px]"
        >
          초기화
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
        서로 다른 두 물체를 마찰하면 한쪽 물체의 <strong>전자(−)</strong>가 다른 물체로 이동해
        한쪽은 <strong>(+)</strong>, 다른 쪽은 <strong>(−)</strong> 전하를 띤다.
        전기는 새로 생기지 않고 <strong>이동</strong>할 뿐이며(전하량 보존), 두 물체의 전하량은 항상 같은 크기다.
      </p>
    </div>
  );
}
