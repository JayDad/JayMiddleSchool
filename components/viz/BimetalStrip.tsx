"use client";

import { useState } from "react";

export default function BimetalStrip() {
  const [temp, setTemp] = useState(20);

  const T0 = 20;
  const bend = (temp - T0) * 0.6;
  const dir = bend >= 0 ? 1 : -1;
  const mag = Math.abs(bend);

  const cx = 210;
  const baseY = 110;
  const len = 160;
  const thickness = 14;

  const ctrlY = baseY + dir * mag * 0.8;
  const tipY = baseY + dir * mag * 1.6;

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm text-slate-600 shrink-0">온도</label>
        <input
          type="range"
          min={-20}
          max={120}
          step={1}
          value={temp}
          onChange={(e) => setTemp(Number(e.target.value))}
          className="flex-1"
        />
        <div className="text-sm tabular-nums w-16 text-right font-semibold text-slate-700">
          {temp}℃
        </div>
      </div>

      <div className="viz-scroll">
        <svg viewBox="0 0 420 240" className="w-full h-auto">
          {/* fixed mount */}
          <rect x={20} y={baseY - 16} width={40} height={32} fill="#475569" rx={2} />
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="1" />
          </pattern>
          <rect x={10} y={baseY - 30} width={10} height={60} fill="url(#hatch)" stroke="#475569" />

          {/* bimetal strip — two layers as quadratic curves */}
          <path
            d={`M 60 ${baseY - thickness / 2}
                Q ${cx} ${ctrlY - thickness / 2}
                ${60 + len} ${tipY - thickness / 2}
                L ${60 + len} ${tipY + thickness / 2}
                Q ${cx} ${ctrlY + thickness / 2}
                60 ${baseY + thickness / 2} Z`}
            fill="#fbbf24"
            stroke="#92400e"
          />
          {/* top layer (brass — bigger expansion, on outer when heated bends down → top metal is the high-expansion one if bend>=0 means bend DOWN; here we let top=brass) */}
          <path
            d={`M 60 ${baseY - thickness / 2}
                Q ${cx} ${ctrlY - thickness / 2}
                ${60 + len} ${tipY - thickness / 2}
                Q ${cx} ${ctrlY - thickness / 2 + thickness / 2}
                60 ${baseY}`}
            fill="#cbd5e1"
            stroke="#475569"
          />

          {/* labels */}
          <text x={cx} y={ctrlY - thickness / 2 - 6} textAnchor="middle" fontSize="10" fill="#475569" fontWeight="600">
            철 (열팽창 작음)
          </text>
          <text x={cx} y={ctrlY + thickness / 2 + 14} textAnchor="middle" fontSize="10" fill="#78350f" fontWeight="600">
            황동 (열팽창 큼)
          </text>

          {/* temperature flame/ice indicator */}
          {temp > T0 && (
            <g transform={`translate(${60 + len + 20} ${tipY})`}>
              <path d="M -10 0 Q -14 -16 0 -22 Q 14 -16 10 0 Z" fill="#f97316" />
              <path d="M -4 -2 Q -5 -12 0 -16 Q 5 -12 4 -2 Z" fill="#fde047" />
            </g>
          )}
          {temp < T0 && (
            <g transform={`translate(${60 + len + 20} ${tipY})`}>
              <text textAnchor="middle" fontSize="18" y={4}>❄</text>
            </g>
          )}

          {/* contact points for switch-style application */}
          <line x1={60 + len + 5} x2={60 + len + 5} y1={baseY - 60} y2={baseY + 60} stroke="#94a3b8" strokeDasharray="3 3" />
          <circle cx={60 + len + 5} cy={baseY - 50} r={5} fill="#ef4444" />
          <text x={60 + len + 14} y={baseY - 48} fontSize="9" fill="#ef4444">고온 접점</text>
          <circle cx={60 + len + 5} cy={baseY + 50} r={5} fill="#3b82f6" />
          <text x={60 + len + 14} y={baseY + 52} fontSize="9" fill="#3b82f6">저온 접점</text>

          {/* arrow showing bend direction */}
          {Math.abs(bend) > 4 && (
            <g>
              <text
                x={60 + len + 5}
                y={tipY + (dir > 0 ? 16 : -8)}
                textAnchor="middle"
                fontSize="11"
                fill={dir > 0 ? "#ef4444" : "#3b82f6"}
                fontWeight="600"
              >
                {dir > 0 ? "↓ 황동 쪽 더 늘어남" : "↑ 황동 쪽 더 줄어듦"}
              </text>
            </g>
          )}

          {/* axis baseline */}
          <line
            x1={60}
            x2={60 + len + 10}
            y1={baseY}
            y2={baseY}
            stroke="#cbd5e1"
            strokeDasharray="2 4"
          />
        </svg>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        두 금속을 붙인 바이메탈은 온도가 변하면 열팽창률이 큰 쪽(황동)이 더 많이 늘어나/줄어들어 휘어진다. 다리미·화재경보기 자동 차단에 쓰인다.
      </div>
    </div>
  );
}
