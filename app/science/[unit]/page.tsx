import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnit, SCIENCE_UNITS } from "@/lib/catalog";
import { listConcepts } from "@/lib/content";

export function generateStaticParams() {
  return SCIENCE_UNITS.map((u) => ({ unit: u.slug }));
}

export default function UnitPage({ params }: { params: { unit: string } }) {
  const unit = getUnit("science", params.unit);
  if (!unit) notFound();

  const concepts = listConcepts("science", params.unit);

  return (
    <div>
      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/science" className="hover:text-brand-600">
          과학
        </Link>{" "}
        / <span className="text-slate-700">{unit.title}</span>
      </nav>

      <div className="mb-6 sm:mb-8">
        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
          {unit.grade}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold mt-2">{unit.title}</h1>
        <p className="text-slate-600 mt-2 text-[15px] sm:text-base">{unit.summary}</p>
      </div>

      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-500 mb-3">학습 목표</h2>
        <ul className="space-y-2">
          {unit.objectives.map((o, i) => (
            <li key={i} className="flex gap-2 text-slate-700">
              <span className="text-brand-600 font-bold">{i + 1}.</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">개념</h2>
        {concepts.length === 0 ? (
          <p className="text-slate-500">아직 개념이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {concepts.map((c) => (
              <Link
                key={c.slug}
                href={`/science/${unit.slug}/${c.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-500 hover:shadow-sm transition"
              >
                <div className="text-xs text-slate-400 mb-1">
                  개념 {String(c.order).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="text-sm text-slate-600 mt-2">{c.summary}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
