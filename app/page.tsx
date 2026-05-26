import Link from "next/link";
import { SUBJECTS } from "@/lib/catalog";

export default function HomePage() {
  return (
    <div>
      <section className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          개념은 시각화로, 시험은 포인트로.
        </h1>
        <p className="mt-3 text-slate-600 text-base sm:text-lg">
          중학교 과목의 핵심 개념을 그림으로 이해하고, 시험에 나오는 포인트까지
          한 페이지에서 정리합니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">과목</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {SUBJECTS.map((s) => {
            const card = (
              <div
                className={`rounded-xl border p-5 transition ${
                  s.available
                    ? "border-slate-200 bg-white hover:border-brand-500 hover:shadow-sm"
                    : "border-slate-200 bg-slate-100 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  {!s.available && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                      준비 중
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-2">{s.description}</p>
              </div>
            );
            return s.available ? (
              <Link key={s.slug} href={`/${s.slug}`}>
                {card}
              </Link>
            ) : (
              <div key={s.slug}>{card}</div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
