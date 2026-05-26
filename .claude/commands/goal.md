---
description: 중2 전 과목(과학·사회·역사·수학) 단원 계획 + MDX·viz 콘텐츠 일괄 작성
---

# /goal — 중2 전 과목 콘텐츠 자동 작성

당신의 임무는 이 프로젝트(JayMiddleSchool)의 **중학교 2학년 전 과목** 학습 콘텐츠를 **2022 개정 교육과정** 기준으로 단원 계획부터 개념별 MDX·시각화 컴포넌트까지 모두 작성하는 것입니다.

## 기본 동작 (인자 없이 `/goal` 입력 시)

**현재 진행 중인 Phase 1개만 수행하고 멈춥니다.** 끝에 사용자 확인을 받기 전까지 절대 다음 Phase로 진입하지 마세요. (현재 진행 중 Phase는 PLAN.md의 진행 상황으로 판단)

## 인자로 범위 지정

`$ARGUMENTS`가 다음 키워드 중 하나로 주어지면 해당 범위만 실행:
- `phase1` 또는 `과학` — Phase 1만
- `phase2` 또는 `수학` — Phase 2만 (라우트 일반화 포함)
- `phase3` 또는 `사회역사` — Phase 3만
- `route` — §8 라우트 일반화만 실행
- 특정 단원 slug (예: `heat-and-life`) — 그 단원만
- `all` — 모든 Phase 자동 진행 (사용자가 명시적으로 요청한 경우만; **각 Phase 종료 후 사용자 보고는 여전히 필수**)

---

## 0. 시작 전 필수 단계

이 작업은 대규모 콘텐츠 작성이므로 다음 superpowers 스킬을 **반드시** 활용합니다:

1. **`superpowers:writing-plans`** — 전체 단원 계획을 먼저 plan 문서로 작성 (`docs/superpowers/plans/YYYY-MM-DD-grade2-curriculum.md`)
2. **`superpowers:subagent-driven-development`** — 단원별·과목별 독립 작업을 서브에이전트로 병렬 실행
3. **`superpowers:verification-before-completion`** — 단원 완료 선언 전 반드시 빌드·타입체크 통과 확인
4. **`TaskCreate`** — 과목→단원→개념 3단계 위계로 task 등록, 완료마다 즉시 update

위 스킬을 먼저 invoke한 뒤 본 작업을 시작하세요. 스킬을 건너뛰면 안 됩니다.

---

## 1. 현재 상태 파악 (병렬 read)

다음을 한 번에 읽어 현재 상태를 파악하세요:
- `CLAUDE.md`, `PLAN.md` — 프로젝트 원칙·콘텐츠 인벤토리
- `lib/catalog.ts` — 등록된 SUBJECTS·UNITS
- `lib/types.ts` — 타입 스키마
- `content/` 전체 디렉토리 구조 — 이미 작성된 MDX 식별
- `components/viz/` — 재사용 가능한 viz 컴포넌트 목록
- `components/MdxContent.tsx` — viz 컴포넌트 매핑 맵

**원칙**: 이미 작성된 개념은 절대 덮어쓰지 마세요. 누락된 것만 채웁니다.

---

## 2. 단원 계획 수립 (2022 개정 교육과정 기준)

각 과목의 중2 단원을 다음 가이드라인으로 구성하세요. 출판사 무관, 교육부 성취기준 기반:

### 과학 (science)
이미 등록: `properties-of-matter`, `heat-and-life`. 추가로:
- `electricity-and-magnetism` (전기와 자기) — 정전기·전류·옴의 법칙·자기장·전자기 유도 기초
- `solar-system` (태양계) — 지구·달의 운동, 행성, 태양
- `plants-and-energy` (식물과 에너지) — 광합성, 호흡, 증산
- `animals-and-energy` (동물과 에너지) — 소화·순환·호흡·배설

### 사회 (social) — 신규 과목 활성화
- `human-and-environment` (인간 거주에 유리한 지역)
- `natural-disasters` (자연재해와 인간 생활)
- `culture-and-globalization` (문화의 다양성과 세계화)
- `population-and-cities` (인구 변화와 도시)
- `globalization-and-economy` (세계화 시대의 경제)
- `political-life` (정치 과정과 시민 참여)
- `law-in-everyday-life` (일상생활과 법)

### 역사 (history) — 신규 과목 활성화
- `prehistoric-and-ancient` (선사 시대와 고조선·삼국)
- `goryeo-society` (고려의 성립과 변천)
- `joseon-foundation` (조선의 성립과 발전)
- `joseon-reform` (조선 사회의 변동, 임진왜란·병자호란 이후)
- `modern-opening` (근대 국가 수립 운동과 국권 피탈)
- `independence-movement` (일제 강점과 민족 운동)
- `contemporary-korea` (대한민국의 발전)

### 수학 (math) — 신규 과목 활성화
- `rational-numbers-and-cycles` (유리수와 순환소수)
- `monomials-polynomials` (식의 계산)
- `linear-inequalities` (일차부등식)
- `simultaneous-equations` (연립일차방정식)
- `linear-functions` (일차함수와 그래프)
- `properties-of-triangles` (삼각형의 성질)
- `properties-of-quadrilaterals` (사각형의 성질)
- `similarity` (도형의 닮음)
- `pythagorean-theorem` (피타고라스 정리)
- `probability` (확률)

각 단원은 `lib/catalog.ts`에 `objectives` 3개와 함께 등록하세요.

---

## 3. 작성 절차 (단원 단위 반복)

다음을 단원마다 반복합니다. **단원별로 빌드 검증**을 통과해야 다음 단원으로 넘어갑니다.

### 3-1. 단원 메타 등록
- `lib/catalog.ts`의 해당 과목 UNITS 배열에 push
- 새 과목 활성화 시에는 [§8 라우트 일반화 선행 작업](#8-라우트-일반화-prerequisite-새-과목-활성화-전-1회)이 **반드시 먼저** 완료돼야 함
- `lib/content.ts`가 과목별 디렉토리(`content/<subject>/`)를 읽도록 일반화 필요 시 같이 수정

### 3-2. 개념 도출
한 단원당 4~8개 개념. 각 개념은 시험 출제 빈도·시각화 가치가 높은 것 우선.

### 3-3. 개념별 작성 (개념 1개 = 1 task)
각 개념마다:

**(a) viz 컴포넌트** — `components/viz/` 아래 `.tsx`
- 기존 11개 viz와 동일한 패턴: 정적 SVG 우선, 인터랙티브는 `"use client"`
- props는 기본값 포함, MDX에서 인자 없이 렌더 가능해야 함
- 외부 차트 라이브러리 금지
- 사용한 viz는 반드시 `components/MdxContent.tsx`의 components 맵에 등록

**(b) MDX 파일** — `content/<subject>/<unit-slug>/<concept-slug>.mdx`
- frontmatter 필드: `title`, `slug`, `order`, `summary`, `keyPoints[]`, `testPoints[]`, `quiz[]` (CLAUDE.md 스키마 그대로)
- **선택 필드 `source`** — 교육부 성취기준 코드 또는 참고 교과서. 추후 검수·교차확인용. 예: `source: "[9과04-01] 입자의 운동으로 온도를 설명한다"`
- **YAML 주의**: 리스트 값이 `*`로 시작하면 반드시 `"..."` 인용 (js-yaml alias 충돌)
- 한국 교과서 용어 우선, 영문 용어는 첫 도입 시 괄호 병기
- 표는 JSX `<table>` 사용 (remark-gfm 미도입)
- viz 컴포넌트는 본문 상단에 import 후 본문에 배치

### 3-4. 단원 빌드 검증 (필수 게이트)
단원의 모든 개념 작성 후 다음 중 **하나는 반드시 통과**해야 다음 단원으로 진행:

**(A) 로컬 빌드** — 가능한 환경에서 우선
```bash
npm run typecheck
npm run build
```

**(B) Vercel preview deploy** — 로컬이 막힌 환경 대안
```bash
vercel              # preview 배포 (prod 아님)
```
배포 로그에서 `✓ Compiled successfully` + 정적 페이지 생성 0 실패 확인.

> 현재 환경(`G:\내 드라이브\...` = Google Drive 동기화)에서는 `npm install`이 `EBADF`/`EPERM`으로 막혀 (A)가 불가하다. 이 경우 **반드시 (B)** 를 사용. 향후 프로젝트를 Google Drive 외부(예: `C:\dev\`)로 옮기면 (A) 복구.

**실패 시 절대 그냥 넘어가지 마세요** — YAML 오류·import 누락·타입 오류를 즉시 수정. `superpowers:systematic-debugging` 활용.

---

## 4. 병렬화 전략

`superpowers:dispatching-parallel-agents`를 활용해 다음을 병렬로 실행:
- 과목 간(과학·사회·역사·수학) 단원 작성은 서로 독립 → 서브에이전트로 병렬
- 같은 과목 내 서로 다른 단원도 독립 → 병렬
- 단, `lib/catalog.ts` 같은 공유 파일 수정은 충돌하므로 **메타 등록은 메인이 일괄 처리**한 뒤 콘텐츠 작성만 병렬화

서브에이전트에게 위임할 때 다음을 명확히 전달:
- 해당 단원의 정확한 개념 리스트
- frontmatter 스키마 (CLAUDE.md 50~85줄)
- viz 작성 규칙 (CLAUDE.md 91~98줄)
- 한국어 용어 정책 (CLAUDE.md 101~106줄)
- 빌드 검증은 메인이 단원 완료 후 일괄 실행

---

## 5. 우선순위 — Phase 분리

전체 스코프(≈100~200개 MDX+viz)가 매우 크므로 **Phase별로 끊어서 진행**합니다. 각 Phase가 빌드 검증을 통과한 뒤에야 다음 Phase 진입.

### Phase 1 — 과학 완성 (라우트 변경 없음)
1. `heat-and-life` 잔여: **비열·열팽창** (Sprint 3 대기)
2. 신규 4단원: `electricity-and-magnetism`, `solar-system`, `plants-and-energy`, `animals-and-energy`
3. 빌드 검증 → PLAN.md 인벤토리 갱신
4. Phase 1 종료 후 사용자 확인

### Phase 2 — 라우트 일반화 + 수학
1. **§8 라우트 일반화 선행 작업** 1회 실행 (필수 prerequisite)
2. `math` 단원 10개 작성 (시각화 가치 큰 일차함수·도형부터)
3. 빌드 검증 → PLAN.md 갱신

### Phase 3 — 사회·역사
1. 공통 viz 인프라 설계: `Timeline`(역사용), `MapHighlight`(사회 지리용) — `docs/superpowers/plans/`에 별도 spec 문서 1개 작성 후 구현
2. `social` 7단원
3. `history` 7단원
4. 빌드 검증 → PLAN.md 갱신

각 Phase 끝에 사용자에게 보고하고 다음 Phase 진입 승인을 받습니다. **Phase 중도에 빌드 깨지면 같은 Phase 내에서 디버깅·수정으로 마무리하고, 다음 Phase로 넘어가지 마세요.**

### 🛑 Phase 종료 시 필수 액션 (절대 건너뛰지 말 것)
1. PLAN.md 인벤토리/Sprint 진행 표 갱신
2. 추가된 단원·개념·viz 개수 요약 출력
3. 빌드 검증 결과(로컬 또는 Vercel preview URL) 인용
4. **사용자에게 "다음 Phase로 진행할까요?"라고 묻고 응답 대기**
5. 사용자 승인 전까지 다음 Phase 작업을 시작하지 않음

`$ARGUMENTS`로 `all`이 명시된 경우에만 사용자 응답 대기 없이 다음 Phase 자동 진입. 그 외에는 항상 멈춥니다.

---

## 6. 완료 보고

전부 끝나면:
1. PLAN.md의 "현재 컨텐츠 인벤토리" 표를 새로 추가된 항목까지 갱신
2. 새로 만든 단원·개념·viz 컴포넌트 개수 요약
3. `npm run build` 최종 통과 로그 인용
4. 미완 또는 향후 보강 권장 항목 명시

---

## 7. 절대 규칙

- 교과서 그림·이미지 직접 사용 금지 (저작권). 모든 시각화는 자체 SVG.
- 외부 차트·UI 라이브러리 추가 금지 (recharts·d3 등). SVG + React state.
- 콘텐츠 사실 정확성 — 화학식·단위·역사 연도·수학 정리는 검증 후 작성. 불확실하면 보수적으로 (해당 개념 건너뛰고 보고).
- 한 번에 모든 파일을 쓰지 말고, 단원 단위로 끊어 빌드 검증 사이클을 돌리세요.
- 이미 작성된 MDX·viz는 보존. 추가만 합니다.

---

## 8. 라우트 일반화 (Prerequisite, 새 과목 활성화 전 1회)

현재 라우트는 `app/science/`에 하드코딩되어 있어, 사회·역사·수학을 켜기 전에 일반화가 필요합니다.

### 8-1. 현재 구조
```
app/
  science/
    page.tsx              # 과학 과목 홈
    [unit]/
      page.tsx            # 단원 상세
      [concept]/page.tsx  # 개념 상세
```

### 8-2. 목표 구조 (옵션 A — 권장: 동적 [subject] 세그먼트)
```
app/
  [subject]/
    page.tsx              # 과목 홈 (catalog에서 available한 과목만 허용)
    [unit]/
      page.tsx
      [concept]/page.tsx
```
- `app/science/*`는 **삭제하지 않고** 위 동적 라우트로 이전. Next.js가 동적 [subject]만 잡고, 기존 `/science/*` URL은 그대로 유지됨.
- 각 페이지에서 `params.subject`로 `getSubject()` 호출, 존재·available 확인 후 `notFound()`.
- `generateStaticParams`는 catalog의 `available: true` 과목 × 단원 × 개념을 곱집합으로 생성.

### 8-3. 작업 순서
1. `app/[subject]/page.tsx` 작성 (현 `app/science/page.tsx`를 일반화)
2. `app/[subject]/[unit]/page.tsx` 작성
3. `app/[subject]/[unit]/[concept]/page.tsx` 작성
4. 기존 `app/science/*` 삭제 (동적 라우트가 덮음)
5. `lib/content.ts`는 이미 subject 인자를 받으므로 그대로 OK
6. 헤더 nav 링크 `/science` → 동적으로 catalog 기반 렌더로 변경 검토 (선택)
7. **빌드 검증 + 기존 `/science/...` URL 직접 클릭해 회귀 없음 확인**

### 8-4. 검증 체크리스트
- [ ] `/science` 정상 렌더 (회귀 없음)
- [ ] `/science/properties-of-matter/density` 정상 렌더
- [ ] `/math` (Phase 2 시작 시점) 정상 렌더
- [ ] 햄버거 메뉴 트리에 새 과목 표시
- [ ] 빌드 통과, 콘솔 에러 없음
