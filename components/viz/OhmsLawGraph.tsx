"use client";

import { useState } from "react";

/**
 * OhmsLawGraph
 * - V-I 그래프. 저항 R 슬라이더로 직선 기울기 = 1/R 변화
 * - 옴의 법칙 V = IR
 */
export default function OhmsLawGraph() {
  const [R, setR] = useState(5); // Ω
  const [V, setV] = useState(6); // V (포인터 강조용)

  // 그래프 좌표계
  const W = 380;
  const H = 240;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // V 범위 0~12, I 범위 0~3 (A) 로 설정
  const Vmax = 12;
  const Imax = 3;
  const xFor = (v: number) => padL + (v / Vmax) * plotW;
  const yFor = (i: number) => padT + plotH - (i / Imax) * plotH;

  // 직선의 끝점: V=Vmax 에서 I = Vmax/R, 단 Imax 초과 시 잘라낸다
  const endV = Math.min(Vmax, R * Imax);
  const endI = endV / R;

  const I = V / R; // 현재 슬라이더 값 기준 계산된 전류

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="viz-scroll">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* 격자 */}
          {Array.from({ length: 7 }).map((_, i) => {
            const v = i * 2;
            return (
              <line
                key={`gx-${i}`}
                x1={xFor(v)}
                y1={padT}
                x2={xFor(v)}
                y2={padT + plotH}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
            );
          })}
          {Array.from({ length: 7 }).map((_, i) => {
            const a = (i * Imax) / 6;
            return (
              <line
                key={`gy-${i}`}
                x1={padL}
                y1={yFor(a)}
                x2={padL + plotW}
                y2={yFor(a)}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
            );
          })}

          {/* 축 */}
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#0f172a" strokeWidth={1.5} />
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#0f172a" strokeWidth={1.5} />

          {/* 축 라벨 (X = V) */}
          {[0, 2, 4, 6, 8, 10, 12].map((v) => (
            <text key={v} x={xFor(v)} y={padT + plotH + 14} textAnchor="middle" fontSize="10" fill="#475569">
              {v}
            </text>
          ))}
          <text x={padL + plotW / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#0f172a">
            전압 V (V)
          </text>

          {/* Y = I */}
          {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((a) => (
            <text key={a} x={padL - 6} y={yFor(a) + 4} textAnchor="end" fontSize="10" fill="#475569">
              {a}
            </text>
          ))}
          <text
            x={14}
            y={padT + plotH / 2}
            textAnchor="middle"
            fontSize="12"
            fill="#0f172a"
            transform={`rotate(-90 14 ${padT + plotH / 2})`}
          >
            전류 I (A)
          </text>

          {/* 직선: I = V/R */}
          <line
            x1={xFor(0)}
            y1={yFor(0)}
            x2={xFor(endV)}
            y2={yFor(endI)}
            stroke="#0ea5e9"
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* 현재 점 */}
          <circle cx={xFor(V)} cy={yFor(I)} r={5} fill="#ef4444" />
          <line
            x1={xFor(V)}
            y1={yFor(I)}
            x2={xFor(V)}
            y2={yFor(0)}
            stroke="#ef4444"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <line
            x1={xFor(V)}
            y1={yFor(I)}
            x2={xFor(0)}
            y2={yFor(I)}
            stroke="#ef4444"
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          {/* 기울기 표시 */}
          <text x={padL + plotW - 80} y={padT + 16} fontSize="11" fill="#0ea5e9" fontWeight={600}>
            기울기 = 1/R = {(1 / R).toFixed(3)}
          </text>
        </svg>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-3">
        <label className="block">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">저항 R</span>
            <span className="font-semibold tabular-nums">{R} Ω</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={R}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
        </label>
        <label className="block">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">전압 V</span>
            <span className="font-semibold tabular-nums">{V} V</span>
          </div>
          <input
            type="range"
            min={0}
            max={12}
            step={0.5}
            value={V}
            onChange={(e) => setV(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
        </label>
      </div>

      <div className="mt-3 grid sm:grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-slate-50 py-2">
          <div className="text-xs text-slate-500">전압</div>
          <div className="font-bold text-slate-800">{V.toFixed(1)} V</div>
        </div>
        <div className="rounded-lg bg-slate-50 py-2">
          <div className="text-xs text-slate-500">저항</div>
          <div className="font-bold text-slate-800">{R} Ω</div>
        </div>
        <div className="rounded-lg bg-sky-50 py-2">
          <div className="text-xs text-sky-700">전류 I = V/R</div>
          <div className="font-bold text-sky-700">{I.toFixed(2)} A</div>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
        <strong>옴의 법칙</strong>: V = I × R. V-I 그래프는 원점을 지나는 직선이며,
        직선의 <strong>기울기 = 1/R</strong>이다. 저항이 클수록 직선이 완만해진다
        (같은 전압에서 흐르는 전류가 적다).
      </p>
    </div>
  );
}
