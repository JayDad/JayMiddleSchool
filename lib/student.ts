// 아들 폰 1대를 식별하기 위한 고정 학습자 id (localStorage).
// 로그인 없이 기기 단위로만 구분 — 부모 대시보드에서 누가 풀었는지 표시용.

const ID_KEY = "jms:studentId";
const NAME_KEY = "jms:studentName";

export function getStudentId(): string {
  if (typeof window === "undefined") return "unknown";
  let id = localStorage.getItem(ID_KEY);
  if (!id) {
    id = "s-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(ID_KEY, id);
  }
  return id;
}

export function getStudentName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(NAME_KEY) ?? "";
}

export function setStudentName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NAME_KEY, name);
}
