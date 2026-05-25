import type { TestPoint } from "@/lib/types";

const TYPE_COLORS: Record<string, string> = {
  개념: "bg-blue-50 text-blue-700",
  계산: "bg-purple-50 text-purple-700",
  그래프해석: "bg-emerald-50 text-emerald-700",
  실험해석: "bg-amber-50 text-amber-700",
  비교: "bg-pink-50 text-pink-700",
  분류: "bg-indigo-50 text-indigo-700",
};

export default function TestPoints({ points }: { points: TestPoint[] }) {
  if (!points || points.length === 0) return null;
  return (
    <section className="my-10">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>시험 출제 포인트</span>
      </h2>
      <div className="space-y-3">
        {points.map((p, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  TYPE_COLORS[p.type] ?? "bg-slate-100 text-slate-700"
                }`}
              >
                {p.type}
              </span>
            </div>
            <p className="text-slate-800 font-medium">{p.question}</p>
            {p.hint && (
              <p className="text-sm text-slate-600 mt-2">
                <span className="font-semibold text-slate-500">힌트: </span>
                {p.hint}
              </p>
            )}
            {p.trap && (
              <p className="text-sm text-rose-700 mt-2 bg-rose-50 rounded p-2">
                <span className="font-semibold">자주 틀리는 함정: </span>
                {p.trap}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
