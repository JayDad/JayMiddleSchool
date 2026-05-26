"use client";

import { useState } from "react";
import type { QuizItem } from "@/lib/types";

export default function SelfCheck({ quiz }: { quiz: QuizItem[] }) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  if (!quiz || quiz.length === 0) return null;

  return (
    <section className="my-10">
      <h2 className="text-2xl font-bold mb-4">자가 점검</h2>
      <div className="space-y-4">
        {quiz.map((item, qi) => {
          const isRevealed = revealed[qi];
          const userChoice = selected[qi];
          return (
            <div
              key={qi}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="font-medium text-slate-900 mb-3">
                Q{qi + 1}. {item.q}
              </p>
              <div className="space-y-2">
                {item.choices.map((c, ci) => {
                  const isUserChoice = userChoice === ci;
                  const isCorrect = item.answer === ci;
                  let cls =
                    "w-full text-left px-3 py-3 sm:py-2 rounded-lg border transition text-[15px] sm:text-base min-h-[44px]";
                  if (isRevealed) {
                    if (isCorrect) {
                      cls += " border-emerald-500 bg-emerald-50 text-emerald-900";
                    } else if (isUserChoice) {
                      cls += " border-rose-400 bg-rose-50 text-rose-900";
                    } else {
                      cls += " border-slate-200 text-slate-500";
                    }
                  } else {
                    cls += isUserChoice
                      ? " border-brand-500 bg-brand-50"
                      : " border-slate-200 hover:border-brand-500";
                  }
                  return (
                    <button
                      key={ci}
                      onClick={() =>
                        setSelected((s) => ({ ...s, [qi]: ci }))
                      }
                      disabled={isRevealed}
                      className={cls}
                    >
                      <span className="mr-2 text-slate-400">
                        {String.fromCharCode(0x2460 + ci)}
                      </span>
                      {c}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-3">
                {!isRevealed ? (
                  <button
                    onClick={() =>
                      setRevealed((r) => ({ ...r, [qi]: true }))
                    }
                    disabled={userChoice === undefined}
                    className="text-sm px-4 py-2 rounded-lg bg-brand-600 text-white disabled:bg-slate-300 min-h-[40px]"
                  >
                    정답 확인
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setRevealed((r) => ({ ...r, [qi]: false }));
                      setSelected((s) => {
                        const n = { ...s };
                        delete n[qi];
                        return n;
                      });
                    }}
                    className="text-sm px-4 py-2 rounded-lg border border-slate-300 text-slate-600 min-h-[40px]"
                  >
                    다시 풀기
                  </button>
                )}
              </div>
              {isRevealed && (
                <div className="mt-3 p-3 rounded-lg bg-slate-50 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">해설. </span>
                  {item.explain}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
