import { cookies } from "next/headers";
import { listResults, kvEnabled, type QuizResult } from "@/lib/results";
import ParentLogin from "./ParentLogin";

export const dynamic = "force-dynamic";

function authed(): { ok: boolean; configured: boolean } {
  const expected = process.env.PARENT_PASSWORD;
  if (!expected) return { ok: false, configured: false };
  const cookie = cookies().get("jms_parent")?.value;
  return { ok: cookie === expected, configured: true };
}

function pct(score: number, total: number): number {
  return total > 0 ? Math.round((score / total) * 100) : 0;
}

function fmt(at: string): string {
  const d = new Date(at);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}`;
}

export default async function ParentPage() {
  const auth = authed();
  if (!auth.ok) {
    return (
      <ParentLogin
        notice={
          auth.configured
            ? undefined
            : "PARENT_PASSWORD 환경변수가 아직 설정되지 않았어요. Vercel 환경변수에 비밀번호를 등록한 뒤 다시 시도하세요."
        }
      />
    );
  }

  const results = await listResults();
  results.sort((a, b) => (a.at < b.at ? 1 : -1)); // 최신순

  // 개념별 그룹 (최신 시도 기준 통계)
  const byConcept = new Map<
    string,
    { latest: QuizResult; attempts: number; best: number }
  >();
  for (const r of results) {
    const key = `${r.unit}/${r.concept}`;
    const cur = byConcept.get(key);
    const ratio = pct(r.score, r.total);
    if (!cur) {
      byConcept.set(key, { latest: r, attempts: 1, best: ratio });
    } else {
      cur.attempts += 1;
      cur.best = Math.max(cur.best, ratio);
      // results는 최신순이므로 latest는 첫 등장 값 유지
    }
  }
  const concepts = Array.from(byConcept.values());

  const totalAttempts = results.length;
  const conceptsDone = concepts.length;
  const avgLatest =
    conceptsDone > 0
      ? Math.round(
          concepts.reduce(
            (s, c) => s + pct(c.latest.score, c.latest.total),
            0,
          ) / conceptsDone,
        )
      : 0;

  const weak = concepts
    .filter((c) => pct(c.latest.score, c.latest.total) < 60)
    .sort(
      (a, b) =>
        pct(a.latest.score, a.latest.total) -
        pct(b.latest.score, b.latest.total),
    );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">부모 대시보드</h1>
      <p className="text-slate-600 mb-6 text-sm">
        아들의 자가점검 결과 (각 개념은 가장 최근 시도 기준)
      </p>

      {!kvEnabled() && (
        <p className="mb-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3">
          ⚠️ 저장소(KV)가 연결되지 않아 결과가 영구 저장되지 않습니다. Vercel에서
          KV를 생성하고 환경변수를 등록하면 기록이 누적됩니다.
        </p>
      )}

      {/* 요약 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <Stat label="총 시도" value={`${totalAttempts}회`} />
        <Stat label="푼 개념" value={`${conceptsDone}개`} />
        <Stat label="평균 정답률" value={`${avgLatest}%`} />
      </div>

      {totalAttempts === 0 ? (
        <p className="text-slate-500 text-sm">
          아직 제출된 결과가 없습니다. 아들이 자가점검을 풀고 “결과 제출”을 누르면
          여기에 표시돼요.
        </p>
      ) : (
        <>
          {/* 취약 개념 */}
          {weak.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-3">취약 개념 (정답률 60% 미만)</h2>
              <div className="space-y-2">
                {weak.map((c) => (
                  <Row key={`${c.latest.unit}/${c.latest.concept}`} c={c} />
                ))}
              </div>
            </section>
          )}

          {/* 전체 개념 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-3">개념별 결과</h2>
            <div className="space-y-2">
              {concepts
                .sort((a, b) =>
                  a.latest.at < b.latest.at ? 1 : -1,
                )
                .map((c) => (
                  <Row key={`${c.latest.unit}/${c.latest.concept}`} c={c} />
                ))}
            </div>
          </section>

          {/* 최근 기록 */}
          <section>
            <h2 className="text-lg font-bold mb-3">최근 기록</h2>
            <div className="space-y-1">
              {results.slice(0, 20).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between text-sm border-b border-slate-100 py-2"
                >
                  <span className="text-slate-700">
                    {r.unitTitle} · {r.conceptTitle}
                  </span>
                  <span className="flex items-center gap-3">
                    <span
                      className={
                        pct(r.score, r.total) >= 60
                          ? "text-emerald-600 font-medium"
                          : "text-rose-600 font-medium"
                      }
                    >
                      {r.score}/{r.total}
                    </span>
                    <span className="text-slate-400 tabular-nums">
                      {fmt(r.at)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function Row({
  c,
}: {
  c: { latest: QuizResult; attempts: number; best: number };
}) {
  const ratio = pct(c.latest.score, c.latest.total);
  const good = ratio >= 60;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-slate-900">
            {c.latest.conceptTitle}
          </div>
          <div className="text-xs text-slate-500">{c.latest.unitTitle}</div>
        </div>
        <div className="text-right">
          <div
            className={
              good
                ? "text-emerald-600 font-bold"
                : "text-rose-600 font-bold"
            }
          >
            {c.latest.score}/{c.latest.total}{" "}
            <span className="text-xs font-normal">({ratio}%)</span>
          </div>
          <div className="text-xs text-slate-400">
            시도 {c.attempts}회 · 최고 {c.best}%
          </div>
        </div>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={good ? "h-full bg-emerald-500" : "h-full bg-rose-400"}
          style={{ width: `${ratio}%` }}
        />
      </div>
    </div>
  );
}
