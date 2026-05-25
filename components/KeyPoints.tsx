export default function KeyPoints({ points }: { points: string[] }) {
  if (!points || points.length === 0) return null;
  return (
    <section className="my-8 rounded-xl border border-brand-100 bg-brand-50/60 p-5">
      <h2 className="text-sm font-semibold text-brand-700 mb-3 tracking-wide">
        핵심 정리
      </h2>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2 text-slate-800">
            <span className="text-brand-600 font-bold">·</span>
            <span dangerouslySetInnerHTML={{ __html: bold(p) }} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function bold(s: string) {
  return s.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="text-slate-900 font-semibold">$1</strong>',
  );
}
