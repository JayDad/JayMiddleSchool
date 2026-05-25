"use client";

import { useState } from "react";

type Item = {
  name: string;
  density: number;
  color: string;
};

const LIQUIDS: Item[] = [
  { name: "기름", density: 0.92, color: "#fde68a" },
  { name: "물", density: 1.0, color: "#bae6fd" },
  { name: "꿀", density: 1.42, color: "#a16207" },
];

const OBJECTS: Item[] = [
  { name: "코르크", density: 0.24, color: "#d97706" },
  { name: "얼음", density: 0.92, color: "#e0f2fe" },
  { name: "플라스틱", density: 0.95, color: "#94a3b8" },
  { name: "고무공", density: 1.1, color: "#475569" },
  { name: "금속볼트", density: 7.8, color: "#1f2937" },
];

const TANK_W = 320;
const TANK_H = 280;
const TANK_PAD = 20;

export default function DensityTank() {
  const [selected, setSelected] = useState<string>("얼음");
  const obj = OBJECTS.find((o) => o.name === selected)!;

  // Stack liquids by density (lighter on top)
  const sorted = [...LIQUIDS].sort((a, b) => a.density - b.density);
  const layerH = (TANK_H - TANK_PAD * 2) / sorted.length;

  // Find where object floats: at boundary between layer with density < obj and layer with density >= obj
  const findRestY = () => {
    // bottom of tank
    let floor = TANK_H - TANK_PAD;
    for (let i = sorted.length - 1; i >= 0; i--) {
      const liq = sorted[i];
      const liqTopY = TANK_PAD + i * layerH;
      const liqBotY = liqTopY + layerH;
      if (liq.density >= obj.density) {
        // object floats on top of this liquid
        floor = liqTopY;
      } else {
        // object sinks through this lighter liquid
        floor = liqBotY;
        return floor;
      }
    }
    return floor;
  };

  const restY = findRestY();
  const ballR = 16;

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid md:grid-cols-[auto,1fr] gap-5 items-start">
        <svg
          viewBox={`0 0 ${TANK_W} ${TANK_H}`}
          className="w-full max-w-sm h-auto mx-auto"
          role="img"
          aria-label="밀도 비교 탱크"
        >
          {/* tank outline */}
          <rect
            x={TANK_PAD}
            y={TANK_PAD}
            width={TANK_W - TANK_PAD * 2}
            height={TANK_H - TANK_PAD * 2}
            fill="none"
            stroke="#94a3b8"
            strokeWidth={2}
          />

          {/* liquid layers */}
          {sorted.map((liq, i) => {
            const yTop = TANK_PAD + i * layerH;
            return (
              <g key={liq.name}>
                <rect
                  x={TANK_PAD + 1}
                  y={yTop}
                  width={TANK_W - TANK_PAD * 2 - 2}
                  height={layerH}
                  fill={liq.color}
                  opacity={0.85}
                />
                <text
                  x={TANK_W - TANK_PAD - 8}
                  y={yTop + layerH / 2 + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#1e293b"
                >
                  {liq.name} ({liq.density})
                </text>
              </g>
            );
          })}

          {/* object */}
          <circle
            cx={TANK_W / 2}
            cy={restY - ballR}
            r={ballR}
            fill={obj.color}
            stroke="#0f172a"
            strokeWidth={1.5}
          />
          <text
            x={TANK_W / 2}
            y={restY - ballR - 22}
            textAnchor="middle"
            fontSize="11"
            fill="#0f172a"
          >
            {obj.name} ({obj.density} g/cm³)
          </text>
        </svg>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">
            물체를 선택하세요
          </p>
          <div className="flex flex-wrap gap-2">
            {OBJECTS.map((o) => (
              <button
                key={o.name}
                onClick={() => setSelected(o.name)}
                className={`text-sm px-3 py-1.5 rounded-full border ${
                  selected === o.name
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-slate-300 text-slate-600 hover:border-brand-500"
                }`}
              >
                {o.name}
                <span className="text-xs opacity-70 ml-1">({o.density})</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            물체는 자기보다 <strong className="text-slate-800">밀도가 큰
            액체 위에는 뜨고</strong>, 작은 액체 속에는 가라앉습니다. 액체끼리도
            밀도 차이로 층이 나뉩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
