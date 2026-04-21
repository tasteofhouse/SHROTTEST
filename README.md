# Shorts Insight — 내 YouTube 취향 분석기

Google Takeout의 YouTube 시청 기록 JSON을 업로드하면, 취향 유형·시청 패턴·지수·공유 카드를 **100% 브라우저에서만** 분석해주는 앱입니다.

파일은 어디에도 업로드되지 않아요. 분석이 끝난 파일은 메모리에서 즉시 제거됩니다.

## 주요 기능

- **15가지 취향 유형 판별** — 🎮 게임 몰입형, 🌙 밤의 지배자, 🔥 도파민 중독형 …
- **12개 카테고리 자동 분류** — 채널명 + 제목 키워드 가중 스코어
- **4가지 지수** — 도파민 · 야행성 · 탐험력 · 취향 집중도 (0–100)
- **시청 패턴 시각화** — 시간 × 요일 히트맵, 30일 추이, Top 채널
- **4가지 스타일 공유 카드** — 클래식 / 영수증 / 티어표 / 신분증 (PNG 저장)

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

정적 파일은 `dist/`에 생성됩니다 — Vercel, Netlify, GitHub Pages 어디든 올리면 됩니다.

## 기술 스택

React 19 · Vite · Tailwind CSS · Recharts · html2canvas · lucide-react

## 프라이버시

모든 처리는 브라우저 안에서만 이루어집니다. 서버로 전송되는 데이터는 없습니다.
