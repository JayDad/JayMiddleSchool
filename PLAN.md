# JayMiddleSchool — 기획 문서

> 중학교 과목별 핵심 개념을 **시각화**로 이해하고, **시험 출제 포인트**까지 한 페이지에서 정리하는 학습 사이트.

---

## 1. 목적과 타겟

- **누구를**: 중학생(1차 타겟: 중2), 학부모의 학습 보조
- **무엇을**: 교과 핵심 개념·사건을 시각화 + 시험에 잘 나오는 포인트 + 자가 점검
- **왜**: 교과서 텍스트만으로는 추상 개념(밀도, 전기장, 화학반응…)이 직관적으로 잡히지 않음. 시각화로 “감”을 잡고, 출제 포인트로 시험 점수에도 연결.

### 핵심 가치 두 축의 균형
1. **시각화 중심 학습** — 개념을 인터랙티브한 그림/그래프로 즉시 이해
2. **시험 대비 정리** — 출제 유형, 자주 틀리는 함정, 자가 점검 문제

---

## 2. MVP 범위

| 항목 | MVP (Phase 1) | Phase 2 | Phase 3 |
|---|---|---|---|
| 과목 | 과학(중2) | 과학(중1~3) | 사회·역사·수학 확장 |
| 단원 | **물질의 특성** | 전기와 자기, 식물과 에너지, … | — |
| 개념당 구성 | 시각화 + 핵심정리 + 출제포인트 + 자가점검 | 좌동 + 오답노트 | 좌동 + 학습기록(로그인) |
| 검색 | 단원 내 탐색 | 전체 검색 | 태그/난이도 필터 |
| 사용자 | 익명 | 익명 | 로그인(선택) |

**Phase 1 완료 기준**: 중2 “물질의 특성” 단원 전체 개념이 시각화 포함으로 채워지고, 자가 점검 퀴즈가 동작.

---

## 3. 정보 구조

```
홈
└─ 과목(Subject)               ex) 과학
   └─ 학년(Grade)              ex) 중2
      └─ 단원(Unit)            ex) 물질의 특성
         └─ 개념(Concept)      ex) 끓는점 / 밀도 / 용해도
            ├─ 시각화          (인터랙티브 SVG / 그래프)
            ├─ 핵심정리        (3~5줄 bullet)
            ├─ 출제포인트      (유형 + 함정 + 예시)
            └─ 자가점검        (객관식 / OX)
```

### URL 설계
- `/` — 홈 (현재 진행 가능한 과목 카드)
- `/science` — 과학 과목 홈 (학년별 단원 리스트)
- `/science/[unit]` — 단원 상세 (개념 목록 + 진행도)
- `/science/[unit]/[concept]` — 개념 상세 페이지

확장 시 `/social`, `/history` 등을 같은 패턴으로 추가.

---

## 4. 데이터 모델 (MDX frontmatter)

각 개념은 MDX 1개 파일. frontmatter로 메타데이터, 본문에 시각화 컴포넌트 포함.

```mdx
---
title: 끓는점
slug: boiling-point
order: 2
summary: 액체가 끓는 동안 일정하게 유지되는 온도. 물질마다 고유하다.
keyPoints:
  - 끓는점은 물질의 **특성** (양과 무관)
  - 외부 압력이 높을수록 끓는점은 높아진다
  - 끓는 동안 온도가 일정 → 가열곡선의 수평구간
testPoints:
  - type: 그래프해석
    question: 가열곡선에서 수평구간의 의미를 묻는다
    trap: 끓는 동안 가열을 멈추면 온도가 떨어진다고 착각
  - type: 비교
    question: 양이 다른 같은 물질의 끓는점 비교
    trap: 양이 많으면 끓는점이 높아진다고 착각 (X)
quiz:
  - q: 다음 중 물질의 특성이 아닌 것은?
    choices: [밀도, 끓는점, 질량, 용해도]
    answer: 2
    explain: 질량은 양에 따라 변하므로 특성이 아님
---

import HeatingCurve from "@/components/viz/HeatingCurve";

# 끓는점

<HeatingCurve substance="water" />
...
```

---

## 5. 시각화 컴포넌트 전략

**원칙**: 도메인 시각화는 모두 `components/viz/` 아래, 재사용 가능한 props 기반.

### Phase 1 (물질의 특성)
| 컴포넌트 | 용도 |
|---|---|
| `HeatingCurve` | 끓는점/녹는점 가열곡선 (시간-온도 그래프) |
| `DensityTank` | 밀도 비교 — 액체 층 / 물체 뜨고 가라앉기 |
| `SolubilityCurve` | 온도별 용해도 곡선 + 인터랙션 |
| `Distillation` | 증류 장치 다이어그램 (애니메이션) |

### 향후 확장 시 추가
- 전기/자기: `Circuit`, `MagneticField`
- 천체: `OrbitSimulator`
- 생물: `CellViewer`, `FoodChain`
- 사회/역사: `Timeline`, `MapHighlight`

**기술**: SVG + React state. 복잡한 물리/3D는 일단 보류. 차트는 단순한 곡선이면 SVG 직접, 복잡해지면 Recharts/Visx.

---

## 6. 기술 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Next.js 14 (App Router) | SSG/SEO, MDX 친화, 무료 호스팅(Vercel) |
| 언어 | TypeScript | 콘텐츠 스키마 타입 안전성 |
| 스타일 | Tailwind CSS | 빠른 프로토타이핑 |
| 콘텐츠 | MDX (next-mdx-remote) | Markdown + React 컴포넌트 자유 |
| 시각화 | SVG + React | 의존성 최소, 인쇄 가능 |
| 배포 | Vercel | 무료, Next.js 최적화 |

---

## 7. 디자인 방향

- **읽기 좋은 한글 타이포** (Pretendard)
- **차분한 학습용 톤**: 흰 배경 + 강조 색 1~2개 (blue/green)
- **모바일 우선** — 침대에서도 보는 학습자 고려
- **인쇄 친화** — 시험 전 페이지 출력 가능

---

## 8. 로드맵

### Sprint 1 (완료, 프로토타입)
- [x] 프로젝트 셋업 (Next.js + Tailwind + MDX)
- [x] 라우팅 + 레이아웃 기본 컴포넌트
- [x] 중2 “물질의 특성” 단원 메타 + 개념 3개 (끓는점/밀도/용해도) 시각화 포함
- [x] 자가 점검 퀴즈 컴포넌트

### Sprint 1.5 (완료, 2026-05) — 배포 & 모바일 & 동적 인포그래픽
- [x] Vercel CLI 설치, 로그인(`kimdooyong-7717`), 프로젝트 link(`dooyongkims-projects/jaymiddleschool`), GitHub repo(`jaydad/jaymiddleschool`) 연결
- [x] 의존성 보안 업그레이드: `next ^14.2.33`, `next-mdx-remote ^6.0.0` (Vercel 보안 게이트 통과 목적)
- [x] **모바일 최적화**
  - `app/layout.tsx`: `viewport` export, 헤더 sticky, 패딩 `px-4 sm:px-5`, 로고/제목 사이즈 반응형
  - `app/globals.css`: `-webkit-text-size-adjust`, MDX prose 폰트 모바일 사이즈, `.viz-scroll` 유틸 (좁은 화면에서 SVG 가로 스크롤, `min-w-[420px]`)
  - 홈/과학/단원/개념 페이지 제목 `text-2xl sm:text-3xl md:text-4xl`, 그리드 `grid-cols-1 sm:grid-cols-2`
  - `SelfCheck.tsx`: 보기 버튼 `min-h-[44px]` (터치 영역 보장)
- [x] **동적 인포그래픽**
  - `DensityTank`: 물체 선택 시 위에서 떨어져 부력 위치에 멈추는 애니메이션 + 잔물결 (SMIL `<animate>`)
  - `HeatingCurve`: ▶ 재생 버튼으로 6초 가열 시뮬레이션 (RAF 기반), 곡선 그려지는 stroke-dashoffset 애니메이션, 진행 슬라이더로 수동 스크럽, 현재 온도 점 추적
  - `SolubilityCurve`: 지시점 맥동(pulse), 진행률 바, 우측 미니 비커에 용액/안 녹은 결정 결정
- [ ] (대기) `vercel --prod --yes` 재실행 후 배포 확정

### Sprint 2 (진행 중) — "물질의 특성" 단원 완성 + 네비게이션
- [x] **녹는점 (melting-point)** — `HeatingCurve` 재사용, MDX 추가 (order 2). density/solubility를 한 칸씩 밀어 끓는점→녹는점→밀도→용해도 순으로 정렬
- [x] **`SolubilityCurve` 미니 비커 버그 수정** — 슬라이더(용질 양)에 따라 수위가 변하던 문제. 물 100g은 고정 수위로 유지하고, 슬라이더는 (a) 용액 색의 진하기(농도) (b) 바닥 결정 개수 만 변화시키도록 변경. "물 100 g" 라벨 추가
- [x] **좌상단 햄버거 메뉴 + 사이트 트리 드로어** (`components/SiteMenu.tsx`)
  - `app/layout.tsx`에서 서버 사이드로 `MenuTree` 생성 (SUBJECTS × Units × Concepts)
  - 클라이언트 드로어: 좌측 슬라이드, 배경/ESC/X로 닫힘, 라우트 변경 시 자동 닫힘, body 스크롤 잠금
  - 트리 구조: 홈 / 과목(준비중 비활성) → 단원(학년 배지) → 개념. 현재 경로 자동 펼침 + brand 색 하이라이트
- [x] **순물질 vs 혼합물** — `PureMixtureViz`(분자 모델) + `PureMixtureCurve`(가열곡선 비교). MDX order 0
- [x] **증류** — `DistillationApparatus`(장치 애니메이션, 온도계/냉각관/받는 그릇/방울 떨어짐) + `DistillationCurve`(에탄올-물 두 끓는점 수평구간)
- [x] **재결정** — `RecrystallizationViz`(가열→냉각→결정 석출→거름 3단계) + 기존 `SolubilityCurve` 재사용
- [x] **거름** — `FiltrationFunnel`(모래+물 vs 설탕물 비교, 거름종이 통과 여부)
- [x] **크로마토그래피** — `ChromatographyViz`(잉크 시료 선택, 색소 분리 애니메이션)
- [x] **밀도 보강** — `MassVolumeGraph`(질량-부피 직선, 기울기=밀도 시각화)
- [ ] 단원 진행도(localStorage)
- [ ] 검색
- [ ] MDX 표는 JSX `<table>`로 작성. (또는 `remark-gfm` 도입 시 마크다운 표 사용 가능)

### Sprint 3 (완료, 2026-05-26) — "열과 우리 생활" 단원 (중2)
- [x] 단원 메타 등록 (`heat-and-life`, `lib/catalog.ts`)
- [x] **온도와 열 (temperature-and-heat)** — `ParticleMotion` viz (두 박스 입자 운동, 온도 슬라이더, 맞대기로 열평형 시뮬레이션)
- [x] **열의 이동 (heat-transfer)** — `HeatTransferModes` viz (전도/대류/복사 3종 토글 애니메이션)
- [x] **비열 (specific-heat)** — `SpecificHeatRace` viz (4종 물질 동시 가열, RAF 기반 온도계+그래프 동기화)
- [x] **열팽창 (thermal-expansion)** — `BimetalStrip` viz (온도 슬라이더로 바이메탈 휨 + 이상 팽창 본문)

### Sprint 4 (완료, 2026-05-26) — 중2 과학 신규 4단원
- [x] **전기와 자기 (`electricity-and-magnetism`)** — 5개념: static-electricity / electric-current / ohms-law / magnetic-field / electromagnetic-induction
  - viz: `StaticElectricityViz`, `CircuitDiagram`, `OhmsLawGraph`, `MagneticFieldViz`, `ElectromagneticInduction`
- [x] **태양계 (`solar-system`)** — 4개념: earth-and-moon-motion / lunar-phases / planets / sun-and-energy
  - viz: `EarthMoonOrbit`(RAF 공전·자전), `LunarPhases`(8위상), `PlanetComparison`(크기/거리 토글), `SunLayers`(흑점·홍염)
- [x] **식물과 에너지 (`plants-and-energy`)** — 3개념: photosynthesis / respiration-plant / transpiration
  - viz: `PhotosynthesisDiagram`, `PlantRespirationCycle`(낮/밤 토글), `TranspirationViz`(기공 개폐)
- [x] **동물과 에너지 (`animals-and-energy`)** — 4개념: digestion / circulation / respiration-animal / excretion
  - viz: `DigestionTract`(6단계 토글), `CirculationLoop`(체·폐순환), `RespirationLungs`(들숨·날숨), `ExcretionKidney`(여과·재흡수·분비)
- [x] `lib/catalog.ts`에 4개 단원 메타 일괄 등록 (objectives 3개씩)
- [x] `components/MdxContent.tsx`에 신규 17개 viz import + 매핑 등록
- [ ] (대기) Vercel preview deploy로 빌드 검증

### Sprint 5 (Phase 2 prerequisite + 수학)
- [ ] §8 라우트 일반화 — `app/[subject]/...` 동적 세그먼트, 기존 `/science/...` 회귀 없도록
- [ ] 중2 수학 10단원 — 유리수와 순환소수, 식의 계산, 일차부등식, 연립일차방정식, 일차함수, 삼각형·사각형 성질, 도형의 닮음, 피타고라스, 확률

### Sprint 6+ (Phase 3 / 확장)
- [ ] 사회·역사 — `Timeline`, `MapHighlight` 공통 viz 인프라
- [ ] 중2 사회 7단원, 중2 역사 7단원
- [ ] 중1, 중3 과학 확장

---

## 현재 컨텐츠 인벤토리 (2026-05-26, Phase 1 종료 시점)

**합계 — 6단원 / 29개념 / 30개 viz 컴포넌트**

| 단원 | 개념 | order | 시각화 컴포넌트 |
|---|---|---|---|
| 물질의 특성 | 순물질과 혼합물 | 0 | PureMixtureViz, PureMixtureCurve |
| 물질의 특성 | 끓는점 | 1 | HeatingCurve |
| 물질의 특성 | 녹는점 | 2 | HeatingCurve |
| 물질의 특성 | 밀도 | 3 | DensityTank, MassVolumeGraph |
| 물질의 특성 | 용해도 | 4 | SolubilityCurve |
| 물질의 특성 | 증류 | 5 | DistillationApparatus, DistillationCurve |
| 물질의 특성 | 재결정 | 6 | RecrystallizationViz, SolubilityCurve |
| 물질의 특성 | 거름 | 7 | FiltrationFunnel |
| 물질의 특성 | 크로마토그래피 | 8 | ChromatographyViz |
| 열과 우리 생활 | 온도와 열 | 1 | ParticleMotion |
| 열과 우리 생활 | 열의 이동 | 2 | HeatTransferModes |
| 열과 우리 생활 | 비열 | 3 | SpecificHeatRace |
| 열과 우리 생활 | 열팽창 | 4 | BimetalStrip |
| 전기와 자기 | 마찰 전기와 정전기 | 1 | StaticElectricityViz |
| 전기와 자기 | 전류와 회로 | 2 | CircuitDiagram |
| 전기와 자기 | 옴의 법칙 | 3 | OhmsLawGraph |
| 전기와 자기 | 자기장 | 4 | MagneticFieldViz |
| 전기와 자기 | 전자기 유도 | 5 | ElectromagneticInduction |
| 태양계 | 지구와 달의 운동 | 1 | EarthMoonOrbit |
| 태양계 | 달의 위상 | 2 | LunarPhases |
| 태양계 | 태양계 행성 | 3 | PlanetComparison |
| 태양계 | 태양과 에너지 | 4 | SunLayers |
| 식물과 에너지 | 광합성 | 1 | PhotosynthesisDiagram |
| 식물과 에너지 | 식물의 호흡 | 2 | PlantRespirationCycle |
| 식물과 에너지 | 증산 작용 | 3 | TranspirationViz |
| 동물과 에너지 | 소화 | 1 | DigestionTract |
| 동물과 에너지 | 순환 | 2 | CirculationLoop |
| 동물과 에너지 | 호흡 | 3 | RespirationLungs |
| 동물과 에너지 | 배설 | 4 | ExcretionKidney |

**Phase 1 (이번 작업)에서 추가**: 18 개념 + 17 viz 컴포넌트 (heat 잔여 2 + 신규 4단원 16).

---

## 9. 측정 지표 (나중에)

- 개념 페이지 평균 체류 시간
- 자가점검 정답률 (개념 난이도 신호)
- 시험 전 1주일 트래픽 패턴

---

## 10. 위험/결정 사항

- **콘텐츠 정확성**: 교과서/공식 자료 교차 검증 필수. 출처 표기 필드 추가 검토.
- **시각화 비용**: 개념마다 인터랙티브 컴포넌트는 비쌈 → 정적 SVG로 충분한 경우 정적 우선.
- **저작권**: 교과서 그림 직접 사용 금지. 모든 시각화 자체 제작.

---

## 11. 현재 빌드/배포 검증 상태 (2026-05-26 기준)

### 로컬 검증 — **여전히 차단**
- Google Drive 동기화 폴더(`G:\내 드라이브\...`) 위에서 `npm install`이 `EBADF` / `EPERM` 으로 실패.
- 원인: Google Drive 파일 잠금이 node_modules 대량 쓰기와 충돌.
- 향후 권장: Google Drive 외부 폴더(`C:\dev\` 등)에 클론해 로컬 dev 환경 마련.

### 원격 검증 — **통과 (사용자 확인)**
- 2026-05-26: 사용자가 `vercel --prod --yes`를 직접 실행 → **배포 성공 ("잘되네" 확인)**.
- 이 시점까지의 모든 변경물이 Vercel 원격 빌드를 통과:
  - 의존성 업그레이드 (`next ^14.2.33`, `next-mdx-remote ^6.0.0`) 보안 게이트 통과
  - 신규 컴포넌트: `SiteMenu`, `ParticleMotion`, `HeatTransferModes`
  - 변경 컴포넌트: `DensityTank`/`HeatingCurve`/`SolubilityCurve` 애니메이션
  - 신규 MDX: `melting-point`, `temperature-and-heat`, `heat-transfer`
  - 카탈로그: `heat-and-life` 단원 추가
  - 모바일 최적화 (`viewport`, prose, `.viz-scroll`)

### 남은 미검증 항목 (정적 분석 / 사용자 수동 확인 필요)
- [ ] 브라우저에서 실제 렌더 동작 확인 — (a) 햄버거 메뉴 (b) ParticleMotion 입자 운동·열평형 (c) HeatTransferModes 3종 토글 (d) SMIL `<animate>` 크로스 브라우저
- [ ] RAF 루프 strict-mode 더블 마운트 / cleanup / stale closure
- [ ] MDX 내 JSX `<table className=...>` 렌더 결과 (next-mdx-remote@6 RSC)
- [ ] 모바일 디바이스 실기기 확인

### 다음 권장 액션 (Phase 1 종료 후 — 2026-05-26 갱신)
1. **사용자 직접 실행 필요**: 프로젝트 폴더에서 `vercel`(preview) — Phase 1에서 추가된 18개념·17 viz·카탈로그 4단원이 한 번에 빌드되는지 확인. 로그에서 `✓ Compiled successfully` + 정적 페이지 생성 실패 0 확인.
2. preview URL에서 새 4단원 각각 1개 개념씩 직접 열어 viz 렌더·인터랙션 회귀 없는지 확인 — 우선 점검 viz: `EarthMoonOrbit`(RAF 루프), `CircuitDiagram`(SMIL offset 애니), `PhotosynthesisDiagram`(빛 슬라이더), `CirculationLoop`(animateMotion)
3. Phase 2 진입 결정 — `/goal phase2` 또는 `/goal route` 로 Sprint 5 시작 (수학 + 라우트 일반화)
4. Phase 1 viz는 빠르게 만든 만큼 후속 폴리시 여지 — 코드 리뷰 1회 권장 (`superpowers:requesting-code-review`)

### 정직 선언 업데이트
> 빌드·배포는 사용자 확인으로 통과. 단 **실제 인터랙션 동작**(RAF 루프·SMIL·드로어 등)은 브라우저 수동 확인 또는 e2e 테스트 전까지는 "동작 확인됨"이라 단정하지 않음.

---

## 12. 코드 리뷰 결과 (2026-05-26, superpowers `requesting-code-review`)

빌드는 통과했지만 런타임/사용성 측면에서 잡힌 항목들. **다음 코드 추가 전에 (b) 3건은 먼저 처리하는 것이 좋음.**

### 🔴 즉시 수정 권장 (Must-fix before more code) — **모두 완료 2026-05-26**

1. ✅ **`components/viz/ParticleMotion.tsx` — RAF 루프 재구독 / stale closure** 수정 완료
   - tempA/tempB/contact를 `useRef`로 mirror, effect deps `[]`로 단일 RAF 루프 유지
   - 열평형 종료 조건은 두 값 차이가 0.2℃ 이하일 때 setState 중단

2. ✅ **`components/viz/DensityTank.tsx` — 가벼운 물체 위치 버그** 수정 완료
   - `HEADROOM = 44` 도입 → 액체 위에 공기 공간 확보, 코르크가 탱크 안에 표시됨
   - `findRestY` 로직: 단순 top-down 순회, 처음 만나는 더 무거운 액체 위에서 정지
   - 부력 판정 `>=` → `>` 로 수정 (얼음 0.92가 같은 밀도 기름 위가 아니라 물 위에 뜨도록)

3. ✅ **`app/layout.tsx` — `buildMenuTree`를 React `cache()`로 래핑** 완료
   - `import { cache } from "react"` 추가, 함수를 `cache(() => ...)` 형태로 감쌈

### 🟡 차후 처리 OK (Defer-OK)

- `SiteMenu` — 키보드 포커스 트랩/복귀 없음, iOS Safari 바디 스크롤 잠금 불완전
- `HeatTransferModes` — `<defs>`(화살표) 위치 정리
- `HeatingCurve` — `eslint-disable` 제거하고 deps 정리
- `SolubilityCurve` — `<text>` x/y CSS 트랜지션은 Safari 무시 (장식)
- `niceTicks` — 수은(녹는점 -39℃) 그래프에서 음수 영역 눈금이 빠짐

### 🟢 안전 확인된 항목

- MDX 표 `<table className="...">` — next-mdx-remote@6 호환 OK
- YAML frontmatter — 신규 3개 파일 모두 깨끗 (특수문자 따옴표 처리 OK)
- 자가점검 보기 버튼 터치 영역(44px) — iOS 가이드라인 충족
- TypeScript — `as any` 없음, `eslint-disable`은 위 1건만

### 전체 평가
> "학생 사용자 입장에서 보면 잘 돌아가 보이는 빌드. 단 viz 레이어가 약점이고, RAF + 상태 상호작용(`ParticleMotion`)과 `DensityTank.findRestY`의 경계 조건이 가장 위험. `SiteMenu`의 a11y/iOS 갭은 실제 문제지만 치명적이지는 않음." — reviewer subagent

### 후속 조치 상태
- 🔴 must-fix 3건 — **완료 (2026-05-26)**. 단 코드 변경 후 빌드 재검증은 아직 수행하지 않음. **Phase 1 종료 시점의 `vercel` preview에서 함께 검증 예정.**
- 🟡 defer-OK 항목 (SiteMenu 포커스 트랩·iOS scroll lock, HeatTransferModes defs 정리, HeatingCurve eslint-disable, SolubilityCurve `<text>` transition, niceTicks 음수 범위) — 미처리. 추후 별도 그루밍 권장.

---

## 13. Phase 1 종료 보고 (2026-05-26)

### 작업 요약
`/goal` (인자 없음) — goal.md §5 Phase 1 (과학 완성) 범위 실행. 6번째 단원까지 메타·콘텐츠·viz 모두 완성.

### 추가된 항목
- 단원 4개 신규 등록 (`lib/catalog.ts`): electricity-and-magnetism, solar-system, plants-and-energy, animals-and-energy — 각 objectives 3개
- MDX 18개 (heat-and-life 잔여 2 + 신규 4단원 16)
- viz 컴포넌트 17개 (heat-and-life 2 + 신규 4단원 15; CircuitDiagram 등 일부는 단원 내 공유 가능)
- `components/MdxContent.tsx` 매핑 등록 일괄 갱신

### 작성 방식
메인이 카탈로그·MdxContent 일괄 처리 → Sprint 3 잔여(비열·열팽창)는 메인 직접 작성 → 4개 신규 단원은 `general-purpose` 서브에이전트 4개 병렬 dispatch → 완료 후 LaTeX `$$` 표기를 일반 텍스트로 정리(remark-math 미도입).

### 검증 상태
- 로컬 `npm install` — Google Drive 환경 차단 (변경 없음)
- Vercel preview deploy — **사용자 실행 대기 (next action)**
- 코드 리뷰 — 후속 권장

### 다음 Phase 진입 승인 요청
사용자가 Vercel preview 결과를 확인하고 회귀 없음을 확인하면 → `/goal phase2` 호출로 Sprint 5 시작 (라우트 일반화 + 수학 10단원). 본 Phase 작업물 회귀가 발견되면 같은 Phase 내에서 디버깅 후 다시 보고.
