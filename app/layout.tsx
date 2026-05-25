import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "JayMiddleSchool — 중학교 개념 시각화",
  description: "중학교 과목별 핵심 개념과 시험 출제 포인트를 시각화로 학습",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-block w-8 h-8 rounded-lg bg-brand-600 text-white grid place-items-center font-bold">
                J
              </span>
              <span className="font-bold text-lg">JayMiddleSchool</span>
            </Link>
            <nav className="text-sm text-slate-600">
              <Link href="/science" className="hover:text-brand-600">
                과학
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-5 py-10 text-xs text-slate-400">
          학습용 비공식 자료. 교과서/공식 자료 교차 확인 권장.
        </footer>
      </body>
    </html>
  );
}
