import Link from "next/link";
import { SCIENCE_UNITS } from "@/lib/catalog";

export default function SciencePage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-slate-500">과목</p>
        <h1 className="text-3xl font-bold mt-1">과학</h1>
        <p className="text-slate-600 mt-2">
          중학교 과학 단원을 학년·주제별로 모았습니다. 각 단원에는 시각화된 개념과
          시험 출제 포인트가 들어 있습니다.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {SCIENCE_UNITS.map((unit) => (
          <Link
            key={unit.slug}
            href={`/science/${unit.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-500 hover:shadow-sm transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                {unit.grade}
              </span>
            </div>
            <h2 className="text-lg font-semibold">{unit.title}</h2>
            <p className="text-sm text-slate-600 mt-2">{unit.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
