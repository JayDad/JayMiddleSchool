# Phase 1 — 중2 과학 완성 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan unit-by-unit. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 중2 과학 단원 5개를 빌드 통과 상태로 완성한다 — heat-and-life 잔여 2개 개념 + 4개 신규 단원(electricity-and-magnetism, solar-system, plants-and-energy, animals-and-energy).

**Architecture:** 기존 패턴 그대로 — `content/science/<unit>/<concept>.mdx` + `components/viz/*.tsx` + `lib/catalog.ts` 등록 + `components/MdxContent.tsx` 매핑. 라우트 변경 없음(과학 단독, 동적 라우트 일반화는 Phase 2 prerequisite).

**Tech Stack:** Next.js 14 / TypeScript / Tailwind / next-mdx-remote@6 / 자체 SVG viz / Vercel preview deploy 빌드 검증.

**검증 환경**: `G:\내 드라이브\...` 가 Google Drive 동기화 → `npm install` `EBADF/EPERM`로 차단. 로컬 빌드 불가. **Vercel preview deploy** 만 사용 (단원 단위로).

---

## 단원 인벤토리 (Phase 1)

| # | 단원 slug | 단원명 | 개념 (slug) | viz 컴포넌트 (신규) |
|---|---|---|---|---|
| 1 | heat-and-life (기존) | 열과 우리 생활 | specific-heat, thermal-expansion | SpecificHeatRace, BimetalStrip |
| 2 | electricity-and-magnetism | 전기와 자기 | static-electricity, electric-current, ohms-law, magnetic-field, electromagnetic-induction | StaticElectricityViz, CircuitDiagram, OhmsLawGraph, MagneticFieldViz, ElectromagneticInduction |
| 3 | solar-system | 태양계 | earth-and-moon-motion, lunar-phases, planets, sun-and-energy | EarthMoonOrbit, LunarPhases, PlanetComparison, SunLayers |
| 4 | plants-and-energy | 식물과 에너지 | photosynthesis, respiration-plant, transpiration | PhotosynthesisDiagram, PlantRespirationCycle, TranspirationViz |
| 5 | animals-and-energy | 동물과 에너지 | digestion, circulation, respiration-animal, excretion | DigestionTract, CirculationLoop, RespirationLungs, ExcretionKidney |

**합계**: 18 개념 (heat 잔여 2 + 신규 16) / 18 viz 컴포넌트.

---

## 작업 순서

### 0. 카탈로그 일괄 등록 (메인이 직렬 처리)

**Files:**
- Modify: `lib/catalog.ts`

- [ ] **Step 0-1**: `SCIENCE_UNITS`에 4개 단원 push (electricity-and-magnetism, solar-system, plants-and-energy, animals-and-energy). 각 단원 `objectives` 3개 작성.

---

### Task 1: heat-and-life 잔여 (Sprint 3 마무리)

**Files:**
- Create: `components/viz/SpecificHeatRace.tsx`
- Create: `components/viz/BimetalStrip.tsx`
- Create: `content/science/heat-and-life/specific-heat.mdx`
- Create: `content/science/heat-and-life/thermal-expansion.mdx`
- Modify: `components/MdxContent.tsx` (import + 매핑 등록)

- [ ] **Step 1-1**: `SpecificHeatRace` viz — 같은 질량의 두 물질(예: 물 vs 식용유)을 동시에 가열했을 때 온도 상승 속도 차이를 막대 또는 온도계 애니메이션으로. 정적 SVG + `"use client"` 슬라이더(시간 t) 가능.
- [ ] **Step 1-2**: `BimetalStrip` viz — 두 금속 띠(예: 철+황동) 가열 시 휘는 방향과 온도-휨 관계. SVG transform 애니메이션.
- [ ] **Step 1-3**: `specific-heat.mdx` (order 3) — keyPoints/testPoints/quiz 모두 작성. 비열 정의 c = Q/(m·ΔT), 단위 J/(g·℃), 물 비열 4.18 J/(g·℃) 강조.
- [ ] **Step 1-4**: `thermal-expansion.mdx` (order 4) — 고체·액체·기체 열팽창, 바이메탈 응용(전기다리미 자동 차단, 화재경보기), 다리 신축 이음 예.
- [ ] **Step 1-5**: `MdxContent.tsx` import + components 맵에 2개 추가.

---

### Task 2: electricity-and-magnetism (전기와 자기)

**Files:**
- Create: `components/viz/StaticElectricityViz.tsx` — 마찰 전기, +/- 전하 이동 SVG
- Create: `components/viz/CircuitDiagram.tsx` — 직렬/병렬 회로 토글, 전류 화살표
- Create: `components/viz/OhmsLawGraph.tsx` — V-I 직선, 기울기 = R
- Create: `components/viz/MagneticFieldViz.tsx` — 자석 주변 자기력선
- Create: `components/viz/ElectromagneticInduction.tsx` — 코일+자석 움직임 → 유도전류
- Create: `content/science/electricity-and-magnetism/static-electricity.mdx` (order 1)
- Create: `content/science/electricity-and-magnetism/electric-current.mdx` (order 2)
- Create: `content/science/electricity-and-magnetism/ohms-law.mdx` (order 3)
- Create: `content/science/electricity-and-magnetism/magnetic-field.mdx` (order 4)
- Create: `content/science/electricity-and-magnetism/electromagnetic-induction.mdx` (order 5)
- Modify: `components/MdxContent.tsx`

- [ ] **Step 2-1~5**: 각 viz + MDX 5쌍 작성
- [ ] **Step 2-6**: MdxContent.tsx 등록

---

### Task 3: solar-system (태양계)

**Files:**
- Create: `components/viz/EarthMoonOrbit.tsx` — 지구 자전+공전, 달 공전
- Create: `components/viz/LunarPhases.tsx` — 달의 위상 8단계
- Create: `components/viz/PlanetComparison.tsx` — 행성 8개 상대 크기/거리
- Create: `components/viz/SunLayers.tsx` — 광구·채층·코로나 단면도
- Create: `content/science/solar-system/earth-and-moon-motion.mdx` (order 1)
- Create: `content/science/solar-system/lunar-phases.mdx` (order 2)
- Create: `content/science/solar-system/planets.mdx` (order 3)
- Create: `content/science/solar-system/sun-and-energy.mdx` (order 4)
- Modify: `components/MdxContent.tsx`

---

### Task 4: plants-and-energy (식물과 에너지)

**Files:**
- Create: `components/viz/PhotosynthesisDiagram.tsx` — 잎 단면, CO₂+H₂O+빛 → 포도당+O₂
- Create: `components/viz/PlantRespirationCycle.tsx` — 광합성·호흡 비교 (낮/밤 토글)
- Create: `components/viz/TranspirationViz.tsx` — 잎 기공 열림/닫힘, 물 상승
- Create: `content/science/plants-and-energy/photosynthesis.mdx` (order 1)
- Create: `content/science/plants-and-energy/respiration-plant.mdx` (order 2)
- Create: `content/science/plants-and-energy/transpiration.mdx` (order 3)
- Modify: `components/MdxContent.tsx`

---

### Task 5: animals-and-energy (동물과 에너지)

**Files:**
- Create: `components/viz/DigestionTract.tsx` — 입→식도→위→소장→대장 흐름
- Create: `components/viz/CirculationLoop.tsx` — 체순환·폐순환 2 loop
- Create: `components/viz/RespirationLungs.tsx` — 폐포 가스 교환
- Create: `components/viz/ExcretionKidney.tsx` — 콩팥 단위(네프론) 단순화
- Create: `content/science/animals-and-energy/digestion.mdx` (order 1)
- Create: `content/science/animals-and-energy/circulation.mdx` (order 2)
- Create: `content/science/animals-and-energy/respiration-animal.mdx` (order 3)
- Create: `content/science/animals-and-energy/excretion.mdx` (order 4)
- Modify: `components/MdxContent.tsx`

---

### Task 6: 빌드 검증 & PLAN.md 갱신

- [ ] **Step 6-1**: 사용자에게 Vercel preview deploy 요청 (`vercel` — prod 아님). 환경 제약상 Claude는 vercel deploy 트리거 불가, 사용자가 직접 실행.
- [ ] **Step 6-2**: 사용자가 배포 로그에서 `✓ Compiled successfully` 확인 후 보고.
- [ ] **Step 6-3**: PLAN.md "현재 컨텐츠 인벤토리" 표에 18개 행 추가. Sprint 4 완료 항목 체크.
- [ ] **Step 6-4**: Phase 1 종료 보고 — 추가된 단원·개념·viz 개수 요약 + 다음 Phase 진입 승인 요청.

---

## MDX frontmatter 스키마 (모든 개념 공통)

```yaml
---
title: <한글 개념명>
slug: <kebab-case>
order: <단원 내 순서>
summary: <한 줄 요약>
keyPoints:
  - "**굵게** 강조. * 로 시작하면 반드시 따옴표"
testPoints:
  - type: 개념|계산|그래프해석|실험해석|비교|분류
    question: "출제 형태"
    trap: "함정"
    hint: "선택"
quiz:
  - q: "문제"
    choices: ["1", "2", "3", "4"]
    answer: 0
    explain: "해설"
source: "[성취기준코드] 설명"
---
```

**개념당 권장 분량**: keyPoints 4~6 / testPoints 2~3 / quiz 3~4.

---

## 절대 규칙 재확인 (goal.md §7)

- 교과서 그림 직접 사용 금지 → 자체 SVG
- 외부 차트 라이브러리 금지
- 화학식·단위·연도 사실 정확성 검증
- 한 번에 모든 파일을 쓰지 말고 단원 단위로 끊기 (단, 빌드 검증은 Phase 끝에 1회 — 환경 제약)
- 이미 작성된 MDX·viz 보존, 추가만

---

## 병렬화 메모

- Task 2~5는 서로 독립 → subagent로 병렬 가능
- 단 `components/MdxContent.tsx`는 공유 → 마지막에 메인이 일괄 머지
- 메인이 Task 1 먼저 완료 후 Task 2~5 병렬 dispatch

---

## Self-Review 체크

- [x] 모든 단원이 goal.md §2 단원 리스트와 일치
- [x] 각 개념마다 file path 명시
- [x] viz 컴포넌트 신규/재사용 구분 명확
- [x] MdxContent.tsx 매핑 등록 step 모든 Task에 포함
- [x] Phase 종료 시 사용자 보고 절차 포함 (Step 6-4)
- [x] 빌드 검증 환경 제약(Google Drive) 명시
