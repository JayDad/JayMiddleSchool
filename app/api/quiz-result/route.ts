import { NextRequest, NextResponse } from "next/server";
import { saveResult, type QuizResult } from "@/lib/results";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { subject, unit, concept, score, total } = body;

    if (
      typeof subject !== "string" ||
      typeof unit !== "string" ||
      typeof concept !== "string" ||
      typeof score !== "number" ||
      typeof total !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid payload" },
        { status: 400 },
      );
    }

    const result: QuizResult = {
      id: crypto.randomUUID(),
      studentId: typeof body.studentId === "string" ? body.studentId : "unknown",
      subject,
      unit,
      unitTitle: typeof body.unitTitle === "string" ? body.unitTitle : unit,
      concept,
      conceptTitle:
        typeof body.conceptTitle === "string" ? body.conceptTitle : concept,
      score,
      total,
      wrong: Array.isArray(body.wrong)
        ? body.wrong.filter((n): n is number => typeof n === "number")
        : [],
      at: new Date().toISOString(),
    };

    await saveResult(result);

    // TODO(메일): 추후 여기서 부모에게 결과 메일 발송 (Resend/Gmail).
    //   메일 수단 결정되면 sendParentEmail(result) 한 줄 추가.

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "server error" },
      { status: 500 },
    );
  }
}
