// 자가점검 결과 저장 계층.
// 외부 차트/DB 라이브러리 도입 없이, Vercel KV(Upstash) REST API를 fetch로 직접 호출.
// 환경변수(KV_REST_API_URL / KV_REST_API_TOKEN)가 없으면 in-memory 폴백으로
// 빌드/개발이 깨지지 않게 한다. (프로덕션 영속 저장에는 KV 설정 필요)

export interface QuizResult {
  id: string;
  studentId: string;
  subject: string;
  unit: string; // slug
  unitTitle: string;
  concept: string; // slug
  conceptTitle: string;
  score: number;
  total: number;
  wrong: number[]; // 틀린 문항 인덱스 (0-based)
  at: string; // ISO timestamp
}

const KEY = "quiz:results";
const MAX = 500;

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

// in-memory 폴백 (서버 인스턴스 1개 수명 동안만 유지 — 개발/데모용)
const mem: QuizResult[] = [];

export function kvEnabled(): boolean {
  return Boolean(url && token);
}

async function redis(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(url as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV error ${res.status}`);
  const data = (await res.json()) as { result: unknown };
  return data.result;
}

export async function saveResult(r: QuizResult): Promise<void> {
  if (kvEnabled()) {
    await redis(["LPUSH", KEY, JSON.stringify(r)]);
    await redis(["LTRIM", KEY, 0, MAX - 1]); // 최신 MAX개만 유지
    return;
  }
  mem.unshift(r);
  if (mem.length > MAX) mem.length = MAX;
}

export async function listResults(): Promise<QuizResult[]> {
  if (kvEnabled()) {
    const raw = ((await redis(["LRANGE", KEY, 0, -1])) as string[]) ?? [];
    return raw
      .map((s) => {
        try {
          return JSON.parse(s) as QuizResult;
        } catch {
          return null;
        }
      })
      .filter((r): r is QuizResult => r !== null);
  }
  return [...mem];
}
