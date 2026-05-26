"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const BOX_W = 240;
const BOX_H = 200;
const N = 18;
const R = 6;

function makeParticles(): Particle[] {
  return Array.from({ length: N }, () => ({
    x: R + Math.random() * (BOX_W - 2 * R),
    y: R + Math.random() * (BOX_H - 2 * R),
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
  }));
}

export default function ParticleMotion() {
  const [tempA, setTempA] = useState(20);
  const [tempB, setTempB] = useState(80);
  const [contact, setContact] = useState(false);
  const aRef = useRef<Particle[]>(makeParticles());
  const bRef = useRef<Particle[]>(makeParticles());
  const [, force] = useState(0);
  const tickRef = useRef(0);

  // refs mirror state so the RAF loop reads live values without re-subscribing
  const tempARef = useRef(tempA);
  const tempBRef = useRef(tempB);
  const contactRef = useRef(contact);
  useEffect(() => {
    tempARef.current = tempA;
  }, [tempA]);
  useEffect(() => {
    tempBRef.current = tempB;
  }, [tempB]);
  useEffect(() => {
    contactRef.current = contact;
  }, [contact]);

  // single RAF loop for the lifetime of the component
  useEffect(() => {
    let raf = 0;
    const step = () => {
      // when in contact, move both temps toward average (thermal equilibrium)
      if (contactRef.current) {
        const a = tempARef.current;
        const b = tempBRef.current;
        const avg = (a + b) / 2;
        if (Math.abs(a - b) > 0.2) {
          const nextA = a + (avg - a) * 0.02;
          const nextB = b + (avg - b) * 0.02;
          tempARef.current = nextA;
          tempBRef.current = nextB;
          setTempA(nextA);
          setTempB(nextB);
        }
      }
      const sA = 0.2 + (tempARef.current / 100) * 2.2;
      const sB = 0.2 + (tempBRef.current / 100) * 2.2;
      const advance = (ps: Particle[], speed: number) => {
        for (const p of ps) {
          p.x += p.vx * speed;
          p.y += p.vy * speed;
          if (p.x < R) {
            p.x = R;
            p.vx *= -1;
          } else if (p.x > BOX_W - R) {
            p.x = BOX_W - R;
            p.vx *= -1;
          }
          if (p.y < R) {
            p.y = R;
            p.vy *= -1;
          } else if (p.y > BOX_H - R) {
            p.y = BOX_H - R;
            p.vy *= -1;
          }
        }
      };
      advance(aRef.current, sA);
      advance(bRef.current, sB);
      tickRef.current++;
      // 30fps re-render for particle positions (loop runs at 60)
      if (tickRef.current % 2 === 0) force((n) => (n + 1) % 1_000_000);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const colorFor = (t: number) => {
    // cool blue → hot red
    const r = Math.round(60 + (t / 100) * 195);
    const g = Math.round(120 - Math.abs(t - 50) * 1.4);
    const b = Math.round(255 - (t / 100) * 220);
    return `rgb(${r},${g},${b})`;
  };

  const aColor = colorFor(tempA);
  const bColor = colorFor(tempB);
  const diff = Math.abs(tempA - tempB);
  const equilibrium = contact && diff < 1;

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Box A */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600">물체 A</span>
            <span className="font-bold tabular-nums" style={{ color: aColor }}>
              {tempA.toFixed(0)}℃
            </span>
          </div>
          <svg
            viewBox={`0 0 ${BOX_W} ${BOX_H}`}
            className="w-full h-auto rounded-lg"
            style={{ background: `${aColor}15` }}
          >
            <rect
              x={1}
              y={1}
              width={BOX_W - 2}
              height={BOX_H - 2}
              fill="none"
              stroke="#94a3b8"
              strokeWidth={1.5}
            />
            {aRef.current.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={R} fill={aColor} />
            ))}
          </svg>
        </div>

        {/* Box B */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600">물체 B</span>
            <span className="font-bold tabular-nums" style={{ color: bColor }}>
              {tempB.toFixed(0)}℃
            </span>
          </div>
          <svg
            viewBox={`0 0 ${BOX_W} ${BOX_H}`}
            className="w-full h-auto rounded-lg"
            style={{ background: `${bColor}15` }}
          >
            <rect
              x={1}
              y={1}
              width={BOX_W - 2}
              height={BOX_H - 2}
              fill="none"
              stroke="#94a3b8"
              strokeWidth={1.5}
            />
            {bRef.current.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={R} fill={bColor} />
            ))}
          </svg>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <label className="block">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">A의 온도</span>
            <span className="font-semibold">{tempA.toFixed(0)}℃</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={tempA}
            disabled={contact}
            onChange={(e) => setTempA(Number(e.target.value))}
            className="w-full accent-brand-600 disabled:opacity-50"
          />
        </label>
        <label className="block">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">B의 온도</span>
            <span className="font-semibold">{tempB.toFixed(0)}℃</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={tempB}
            disabled={contact}
            onChange={(e) => setTempB(Number(e.target.value))}
            className="w-full accent-brand-600 disabled:opacity-50"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setContact((c) => !c)}
          className={`text-sm px-3 py-2 rounded-lg border min-h-[40px] ${
            contact
              ? "bg-rose-600 text-white border-rose-600"
              : "bg-brand-600 text-white border-brand-600"
          }`}
        >
          {contact ? "■ 분리" : "▶ 두 물체 맞대기"}
        </button>
        {contact && (
          <span
            className={`text-sm px-2 py-1 rounded ${
              equilibrium
                ? "bg-emerald-50 text-emerald-700 font-semibold"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {equilibrium
              ? "열평형 도달 — 열 이동 멈춤"
              : `열 이동 중: 고온 → 저온 (차이 ${diff.toFixed(0)}℃)`}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
        <strong>온도</strong>는 입자 운동이 활발한 정도. 슬라이더를 올리면 점이 빨라지고 색이 뜨거워집니다.
        두 물체를 맞대면 <strong>고온 → 저온</strong>으로 열이 이동해서 결국 두 온도가 같아집니다(<strong>열평형</strong>).
      </p>
    </div>
  );
}
