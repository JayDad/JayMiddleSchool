"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type MenuTree = {
  subjects: {
    slug: string;
    title: string;
    available: boolean;
    units: {
      slug: string;
      title: string;
      grade: string;
      concepts: { slug: string; title: string }[];
    }[];
  }[];
};

export default function SiteMenu({ tree }: { tree: MenuTree }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="메뉴 열기"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-slate-100 text-slate-700"
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {/* backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 z-40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-50 shadow-xl
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!open}
        aria-label="전체 메뉴"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <span className="font-bold">전체 메뉴</span>
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-600 grid place-items-center"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="overflow-y-auto h-[calc(100%-49px)] p-3">
          <Link
            href="/"
            className={`block px-2 py-2 rounded-lg text-sm font-medium ${
              pathname === "/"
                ? "bg-brand-50 text-brand-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            홈
          </Link>

          <ul className="mt-2 space-y-3">
            {tree.subjects.map((subject) => (
              <SubjectNode
                key={subject.slug}
                subject={subject}
                pathname={pathname}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

function SubjectNode({
  subject,
  pathname,
}: {
  subject: MenuTree["subjects"][number];
  pathname: string;
}) {
  const initiallyOpen =
    subject.available && pathname.startsWith(`/${subject.slug}`);
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <li>
      <button
        type="button"
        onClick={() => subject.available && setOpen((v) => !v)}
        disabled={!subject.available}
        className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm font-semibold ${
          subject.available
            ? "text-slate-800 hover:bg-slate-50"
            : "text-slate-400"
        }`}
      >
        <span className="flex items-center gap-2">
          {subject.title}
          {!subject.available && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-normal">
              준비중
            </span>
          )}
        </span>
        {subject.available && (
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={`transition-transform ${open ? "rotate-90" : ""}`}
            aria-hidden="true"
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
        )}
      </button>

      {subject.available && open && (
        <ul className="mt-1 ml-2 border-l border-slate-200 pl-3 space-y-2">
          {subject.units.length === 0 ? (
            <li className="text-xs text-slate-400 py-1">단원 준비 중</li>
          ) : (
            subject.units.map((unit) => (
              <UnitNode
                key={unit.slug}
                subjectSlug={subject.slug}
                unit={unit}
                pathname={pathname}
              />
            ))
          )}
        </ul>
      )}
    </li>
  );
}

function UnitNode({
  subjectSlug,
  unit,
  pathname,
}: {
  subjectSlug: string;
  unit: MenuTree["subjects"][number]["units"][number];
  pathname: string;
}) {
  const base = `/${subjectSlug}/${unit.slug}`;
  const initiallyOpen = pathname.startsWith(base);
  const [open, setOpen] = useState(initiallyOpen);
  const isUnitActive = pathname === base;

  return (
    <li>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "단원 접기" : "단원 펼치기"}
          className="w-6 h-6 grid place-items-center rounded hover:bg-slate-100 text-slate-500 shrink-0"
        >
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={`transition-transform ${open ? "rotate-90" : ""}`}
            aria-hidden="true"
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
        <Link
          href={base}
          className={`flex-1 min-w-0 px-2 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
            isUnitActive
              ? "bg-brand-50 text-brand-700 font-medium"
              : "text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
            {unit.grade}
          </span>
          <span className="truncate">{unit.title}</span>
        </Link>
      </div>

      {open && unit.concepts.length > 0 && (
        <ul className="mt-1 ml-6 border-l border-slate-100 pl-3 space-y-1">
          {unit.concepts.map((c) => {
            const href = `${base}/${c.slug}`;
            const active = pathname === href;
            return (
              <li key={c.slug}>
                <Link
                  href={href}
                  className={`block px-2 py-1.5 rounded-lg text-sm ${
                    active
                      ? "bg-brand-50 text-brand-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {c.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
