import type { SubjectMeta, UnitMeta } from "./types";

export const SUBJECTS: SubjectMeta[] = [
  {
    slug: "science",
    title: "과학",
    description: "물질·생명·지구·에너지를 시각화로 이해하기",
    available: true,
  },
  {
    slug: "social",
    title: "사회",
    description: "지리·일반사회 (준비 중)",
    available: false,
  },
  {
    slug: "history",
    title: "역사",
    description: "사건과 흐름을 타임라인으로 (준비 중)",
    available: false,
  },
  {
    slug: "math",
    title: "수학",
    description: "개념을 그림으로 (준비 중)",
    available: false,
  },
];

export const SCIENCE_UNITS: UnitMeta[] = [
  {
    slug: "properties-of-matter",
    title: "물질의 특성",
    subject: "science",
    grade: "중2",
    summary:
      "끓는점·녹는점·밀도·용해도 같은 물질 고유의 성질과 이를 이용한 혼합물 분리.",
    objectives: [
      "순물질과 혼합물을 구분하고, 물질의 특성이 무엇인지 설명할 수 있다",
      "끓는점·녹는점·밀도·용해도가 양에 무관한 특성임을 그래프로 해석할 수 있다",
      "특성 차이를 이용해 혼합물을 분리하는 원리를 설명할 수 있다",
    ],
  },
];

export function getSubject(slug: string): SubjectMeta | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}

export function getUnitsForSubject(subject: string): UnitMeta[] {
  if (subject === "science") return SCIENCE_UNITS;
  return [];
}

export function getUnit(subject: string, unitSlug: string): UnitMeta | undefined {
  return getUnitsForSubject(subject).find((u) => u.slug === unitSlug);
}
