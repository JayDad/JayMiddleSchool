import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnit, SCIENCE_UNITS } from "@/lib/catalog";
import { getConcept, listConcepts } from "@/lib/content";
import KeyPoints from "@/components/KeyPoints";
import TestPoints from "@/components/TestPoints";
import SelfCheck from "@/components/SelfCheck";
import MdxContent from "@/components/MdxContent";

export function generateStaticParams() {
  return SCIENCE_UNITS.flatMap((u) =>
    listConcepts("science", u.slug).map((c) => ({
      unit: u.slug,
      concept: c.slug,
    })),
  );
}

export default function ConceptPage({
  params,
}: {
  params: { unit: string; concept: string };
}) {
  const unit = getUnit("science", params.unit);
  const concept = getConcept("science", params.unit, params.concept);
  if (!unit || !concept) notFound();

  const all = listConcepts("science", params.unit);
  const idx = all.findIndex((c) => c.slug === concept.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <article>
      <nav className="text-sm text-slate-500 mb-4">
        <Link href="/science" className="hover:text-brand-600">
          과학
        </Link>{" "}
        /{" "}
        <Link href={`/science/${unit.slug}`} className="hover:text-brand-600">
          {unit.title}
        </Link>{" "}
        / <span className="text-slate-700">{concept.title}</span>
      </nav>

      <header className="mb-5 sm:mb-6">
        <div className="text-xs text-slate-400 mb-1">
          개념 {String(concept.order).padStart(2, "0")}
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{concept.title}</h1>
        <p className="text-slate-600 mt-2 text-base sm:text-lg">{concept.summary}</p>
      </header>

      <KeyPoints points={concept.keyPoints} />

      <MdxContent source={concept.body} />

      <TestPoints points={concept.testPoints} />

      <SelfCheck quiz={concept.quiz} />

      <nav className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prev ? (
          <Link
            href={`/science/${unit.slug}/${prev.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-500"
          >
            <div className="text-xs text-slate-400">← 이전</div>
            <div className="font-semibold">{prev.title}</div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/science/${unit.slug}/${next.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-500 text-right"
          >
            <div className="text-xs text-slate-400">다음 →</div>
            <div className="font-semibold">{next.title}</div>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
