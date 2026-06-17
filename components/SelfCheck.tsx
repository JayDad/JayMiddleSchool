"use client";

import { useState } from "react";
import type { QuizItem } from "@/lib/types";
import { getStudentId } from "@/lib/student";

interface SelfCheckProps {
  quiz: QuizItem[];
  subject?: string;
  unit?: string;
  unitTitle?: string;
  concept?: string;
  conceptTitle?: string;
}

export default function SelfCheck({
  quiz,
  subject,
  unit,
  unitTitle,
  concept,
  conceptTitle,
}: SelfCheckProps) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [submitState, setSubmitState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  if (!quiz || quiz.length === 0) return null;

  const answeredCount = Object.keys(selected).length;
  const allAnswered = answeredCount === quiz.length;
  // 결과 전송이 가능한지 — 개념 메타가 넘어온 경우에만 노출
  const canReport = Boolean(subject && unit && concept);

  const wrongIndices = quiz
    .map((it, i) => (selected[i] === it.answer ? -1 : i))
    .filter((i) => i >= 0);
  const score = quiz.length - wrongIndices.length;

  async function submitResult() {
    setSubmitState("sending");
    // 제출 시 전체 정답 공개 + 잠금
    setRevealed(Object.fromEntries(quiz.map((_, i) => [i, true])));
    try {
      const res = await fetch("/api/quiz-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: getStudentId(),
          subject,
          unit,
          unitTitle,
          concept,
          conceptTitle,
          score,
          total: quiz.length,
          wrong: wrongIndices,
        }),
      });
      const data = (await res.json()) as { ok: boolean };
      setSubmitState(data.ok ? "sent" : "error");
    } catch {
      setSubmitState("error");
    }
  }

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

      {canReport && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          {submitState === "sent" ? (
            <div className="text-center">
              <p className="font-semibold text-slate-900">
                결과를 보냈어요! {quiz.length}문제 중{" "}
                <span className="text-brand-600">{score}개</span> 정답
              </p>
              <p className="text-sm text-slate-500 mt-1">
                부모님이 결과를 확인할 수 있어요.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm text-slate-600">
                  {allAnswered
                    ? `모두 풀었어요 — 제출하면 ${quiz.length}문제 중 ${score}개 정답으로 기록돼요.`
                    : `아직 ${quiz.length - answeredCount}문제 남았어요. 모두 풀면 제출할 수 있어요.`}
                </p>
                <button
                  onClick={submitResult}
                  disabled={!allAnswered || submitState === "sending"}
                  className="text-sm px-5 py-2.5 rounded-lg bg-brand-600 text-white disabled:bg-slate-300 min-h-[44px]"
                >
                  {submitState === "sending" ? "보내는 중…" : "결과 제출"}
                </button>
              </div>
              {submitState === "error" && (
                <p className="text-sm text-rose-600 mt-2">
                  전송에 실패했어요. 잠시 후 다시 시도해 주세요.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
