import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 부모 대시보드 로그인. PARENT_PASSWORD 환경변수와 비교 후 httpOnly 쿠키 발급.
export async function POST(req: NextRequest) {
  const expected = process.env.PARENT_PASSWORD;
  const body = (await req.json().catch(() => ({}))) as { password?: unknown };
  const password = typeof body.password === "string" ? body.password : "";

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "PARENT_PASSWORD 미설정" },
      { status: 500 },
    );
  }
  if (password !== expected) {
    return NextResponse.json(
      { ok: false, error: "비밀번호가 틀렸어요" },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("jms_parent", password, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30일
  });
  return res;
}
