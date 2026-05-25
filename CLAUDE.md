# JayMiddleSchool — 프로젝트 메모리

> 중학교 과목별 핵심 개념을 **시각화**로 이해하고 **시험 출제 포인트**까지 정리하는
> 학습 사이트. 1차 타겟: 중2 과학. 확장: 중1·중3 과학 → 사회/역사/수학.

기획 상세는 `PLAN.md` 참고.

---

## 기술 스택

- **Next.js 14 (App Router)** + TypeScript + Tailwind CSS
- **MDX** 콘텐츠 (next-mdx-remote, gray-matter)
- **SVG + React** 인터랙티브 시각화 (별도 차트 라이브러리 없음)
- 배포 대상: **Vercel** (Next.js 자동 감지)
- Node 22, npm

---

## 디렉토리 구조

```
app/                          # Next.js App Router
  page.tsx                    # 홈
  science/
    page.tsx                  # 과학 단원 리스트
    [unit]/page.tsx           # 단원 상세 (개념 목록)
    [unit]/[concept]/page.tsx # 개념 상세
components/
  KeyPoints.tsx               # 핵심 정리 블록
  TestPoints.tsx              # 시험 출제 포인트 블록
  SelfCheck.tsx               # 자가점검 퀴즈 (client component)
  MdxContent.tsx              # MDX 렌더러 + viz 컴포넌트 매핑
  viz/                        # 도메인 시각화 컴포넌트
    HeatingCurve.tsx          # 가열곡선
    DensityTank.tsx           # 밀도 비교 탱크
    SolubilityCurve.tsx       # 용해도 곡선
content/
  science/<unit-slug>/<concept-slug>.mdx
lib/
  catalog.ts                  # 과목·단원 메타 (상수)
  content.ts                  # MDX 파일 로딩
  types.ts                    # 콘텐츠 스키마 타입
PLAN.md                       # 기획 문서
```

---

## 콘텐츠(MDX) 스키마

새 개념을 추가할 때 `content/science/<unit>/<slug>.mdx` 생성. frontmatter는 다음
모양:

```mdx
---
title: 개념 이름                # 예: 밀도
slug: density                   # URL slug
order: 2                        # 단원 내 순서 (정렬용)
summary: 한 줄 요약 (카드/헤더에 표시)
keyPoints:
  - "**굵게** 강조 가능. 리스트 항목은 반드시 따옴표로 감쌀 것 (YAML alias 충돌 회피)"
testPoints:
  - type: 그래프해석          # 개념|계산|그래프해석|실험해석|비교|분류
    question: "출제되는 형태"
    trap: "자주 틀리는 함정"
    hint: "선택"
quiz:
  - q: "문제"
    choices: ["선지1", "선지2", "선지3", "선지4"]
    answer: 0                   # 0-based index
    explain: "해설"
---

import HeatingCurve from "@/components/viz/HeatingCurve";

본문 마크다운. 시각화는 컴포넌트로 임포트 후 삽입.

<HeatingCurve substance="water" />
```

### YAML 작성 시 주의
- 리스트 항목이나 값이 `*`로 시작하면 **반드시 따옴표** (예: `- "**굵게**"`)
  — `js-yaml`이 `*foo`를 alias로 해석해서 빌드 실패.
- `:` `#` `[` `]` `{` `}` 같은 특수문자 포함 시도 따옴표 권장.

### 단원 메타 추가
새 단원은 `lib/catalog.ts`의 `SCIENCE_UNITS` 배열에 push. 학습목표 3개 정도.

---

## 시각화 컴포넌트 작성 규칙

- 위치: `components/viz/`
- 사용 시점에만 인터랙티브 (`"use client"`), 그 외 정적 SVG 우선
- 외부 차트 라이브러리 도입 금지 (의존성 최소 / 인쇄 친화 / 가벼움)
- props는 substance/dataset 같은 콘텐츠 의존 값만 받고, 기본값으로 단독 렌더 가능
- MDX에서 쓰려면 `components/MdxContent.tsx`의 `components` 맵에 등록

---

## 한국 교과서 용어 정책

- **한국 교과서 용어를 우선** 사용
- 영문 용어는 **첫 도입 시에만 괄호 병기**: 밀도(density), 끓는점(boiling point)
- 화학식은 한글명 + 기호 병기: 질산칼륨 KNO₃
- 단위는 SI 또는 교과서 표기 그대로: g/cm³, ℃, g/물100g

---

## 디자인 톤

- 차분한 학습용 색상 (흰 배경 + brand blue)
- 본문 폰트: Pretendard (CDN)
- 모바일 우선, 인쇄 친화

---

## 개발 / 배포 명령

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 정적 빌드 (콘텐츠 변경 후 검증)
npm run typecheck

# Vercel 배포 (최초 1회 link 후)
vercel --prod
```

콘텐츠 변경 후에는 `npm run build`로 빌드 검증 권장 — YAML 오류는 빌드 시점에 잡힘.

---

## 현재 진행 상태

### 완료 (Sprint 1)
- 프로젝트 셋업, 라우팅, 기본 컴포넌트
- 중2 / 물질의 특성 단원 — 끓는점, 밀도, 용해도 3개 개념 시각화 포함
- 자가점검 퀴즈 동작

### 다음 후보 (우선순위 순)
1. 물질의 특성 단원 나머지 개념 (순물질/혼합물, 녹는점, 혼합물 분리들, 크로마토그래피)
2. 단원 진행도 표시 (localStorage)
3. 다음 단원 (전기와 자기 / 식물과 에너지)
4. 검색

---

## 작업 규칙

- 콘텐츠는 MDX 파일로만 관리 (CMS 도입 전까지)
- 시각화는 자체 SVG 우선 — 교과서 그림 직접 사용 금지 (저작권)
- 새 컴포넌트나 라이브러리 추가는 PLAN.md의 원칙과 일치하는지 확인
- 빌드가 깨질 수 있는 콘텐츠 변경 후에는 `npm run build` 확인
