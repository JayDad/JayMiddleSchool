import type { Metadata, Viewport } from "next";
import { cache } from "react";
import Link from "next/link";
import "./globals.css";
import { SUBJECTS, getUnitsForSubject } from "@/lib/catalog";
import { listConcepts } from "@/lib/content";
import SiteMenu, { type MenuTree } from "@/components/SiteMenu";

export const metadata: Metadata = {
  title: "JayMiddleSchool — 중학교 개념 시각화",
  description: "중학교 과목별 핵심 개념과 시험 출제 포인트를 시각화로 학습",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const buildMenuTree = cache((): MenuTree => {
  return {
    subjects: SUBJECTS.map((s) => ({
      slug: s.slug,
      title: s.title,
      available: s.available,
      units: s.available
        ? getUnitsForSubject(s.slug).map((u) => ({
            slug: u.slug,
            title: u.title,
            grade: u.grade,
            concepts: listConcepts(s.slug, u.slug).map((c) => ({
              slug: c.slug,
              title: c.title,
            })),
          }))
        : [],
    })),
  };
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tree = buildMenuTree();
  return (
    <html lang="ko">
      <body>
        <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
          <div className="mx-auto max-w-5xl px-2 sm:px-3 py-2 sm:py-3 flex items-center gap-2">
            <SiteMenu tree={tree} />
            <Link href="/" className="flex items-center gap-2 min-w-0 ml-1">
              <span className="inline-block w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-600 text-white grid place-items-center font-bold text-sm sm:text-base shrink-0">
                J
              </span>
              <span className="font-bold text-base sm:text-lg truncate">
                JayMiddleSchool
              </span>
            </Link>
            <nav className="ml-auto text-sm text-slate-600 shrink-0">
              <Link href="/science" className="hover:text-brand-600 px-2 py-1">
                과학
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 sm:px-5 py-6 sm:py-8">
          {children}
        </main>
        <footer className="mx-auto max-w-5xl px-4 sm:px-5 py-10 text-xs text-slate-400">
          학습용 비공식 자료. 교과서/공식 자료 교차 확인 권장.
        </footer>
      </body>
    </html>
  );
}
