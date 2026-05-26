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
  {
    slug: "heat-and-life",
    title: "열과 우리 생활",
    subject: "science",
    grade: "중2",
    summary:
      "온도와 열의 차이, 열이 이동하는 세 가지 방법, 물질마다 다른 비열과 열팽창.",
    objectives: [
      "온도와 열을 입자의 운동 관점에서 구분하고 열평형을 설명할 수 있다",
      "전도·대류·복사의 차이와 실생활 예를 들 수 있다",
      "비열·열팽창의 의미를 알고 그래프와 실험으로 비교할 수 있다",
    ],
  },
  {
    slug: "electricity-and-magnetism",
    title: "전기와 자기",
    subject: "science",
    grade: "중2",
    summary:
      "마찰 전기와 전류, 옴의 법칙, 자석 주변 자기장, 그리고 전류와 자기의 상호작용으로 만들어지는 전자기 유도까지.",
    objectives: [
      "마찰 전기 발생을 전자의 이동으로 설명하고 전류·전압·저항의 관계(V=IR)를 적용할 수 있다",
      "자석과 전류가 만드는 자기장을 자기력선으로 표현하고 방향을 정할 수 있다",
      "전자기 유도 원리로 발전기·변압기의 작동을 설명할 수 있다",
    ],
  },
  {
    slug: "solar-system",
    title: "태양계",
    subject: "science",
    grade: "중2",
    summary:
      "지구와 달의 운동, 달의 위상 변화, 태양계 행성들, 그리고 모든 에너지의 근원인 태양.",
    objectives: [
      "지구의 자전과 공전, 달의 공전으로 낮과 밤·계절·달의 위상을 설명할 수 있다",
      "태양계 행성들의 특징을 크기·궤도·표면 환경으로 비교할 수 있다",
      "태양의 표면 활동과 지구에 미치는 영향을 설명할 수 있다",
    ],
  },
  {
    slug: "plants-and-energy",
    title: "식물과 에너지",
    subject: "science",
    grade: "중2",
    summary:
      "광합성으로 양분을 만들고 호흡으로 에너지를 쓰는 식물. 증산으로 물을 끌어올리는 원리까지.",
    objectives: [
      "광합성의 재료·산물·조건을 실험과 화학식으로 설명할 수 있다",
      "식물의 호흡과 광합성의 차이·관계를 시간(낮/밤)에 따라 비교할 수 있다",
      "증산 작용의 원리와 의의를 기공 구조와 함께 설명할 수 있다",
    ],
  },
  {
    slug: "animals-and-energy",
    title: "동물과 에너지",
    subject: "science",
    grade: "중2",
    summary:
      "음식이 에너지가 되기까지 — 소화·순환·호흡·배설 네 가지 기관계가 어떻게 협력하는지.",
    objectives: [
      "소화 기관과 소화 효소의 작용으로 영양소가 흡수되는 과정을 설명할 수 있다",
      "심장과 혈관, 혈액 성분으로 체순환·폐순환의 흐름을 추적할 수 있다",
      "호흡과 배설이 노폐물을 어떻게 처리하는지 폐포·콩팥 구조로 설명할 수 있다",
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
