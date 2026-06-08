# 🦔 고슴도치 하우스 (Hedgehog House)

귀여운 고슴도치를 키우는 방치형 육성 게임 웹사이트

## 기술 스택

- **Frontend**: Next.js 15 (App Router), React, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Supabase (PostgreSQL + RPC Functions)
- **상태관리**: Zustand + TanStack Query
- **UI**: Lucide Icons, Sonner Toast

---

## 📁 프로젝트 구조

```
hedgehog-game/
├── app/
│   ├── globals.css          # 전역 스타일 (폰트, 애니메이션)
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 메인 게임 화면 (/)
│   ├── not-found.tsx        # 404 페이지
│   ├── login/
│   │   └── page.tsx         # 로그인 페이지 (/login)
│   ├── shop/
│   │   └── page.tsx         # 상점 페이지 (/shop)
│   ├── ranking/
│   │   └── page.tsx         # 랭킹 페이지 (/ranking)
│   └── profile/[id]/
│       └── page.tsx         # 프로필 페이지 (/profile/[id])
├── components/
│   ├── game/
│   │   ├── HedgehogAvatar.tsx   # 고슴도치 SVG 아바타
│   │   ├── HedgehogCard.tsx     # 메인 게임 카드
│   │   ├── ActionButtons.tsx    # 행동 버튼 (먹이/터치/청소)
│   │   ├── FeedModal.tsx        # 먹이 선택 모달
│   │   ├── StatusBar.tsx        # 상태 게이지 바
│   │   └── TimerDisplay.tsx     # 카운트다운 타이머
│   ├── shop/
│   │   └── ShopCard.tsx         # 상점 아이템 카드
│   ├── ranking/
│   │   └── RankingTable.tsx     # 랭킹 테이블
│   ├── profile/
│   │   ├── ProfileHeader.tsx    # 프로필 헤더
│   │   ├── AchievementBadge.tsx # 업적 뱃지
│   │   └── Guestbook.tsx        # 방명록
│   ├── ui/
│   │   ├── Navbar.tsx           # 네비게이션 바
│   │   └── Skeleton.tsx         # 로딩 스켈레톤
│   └── QueryProvider.tsx        # TanStack Query 프로바이더
├── hooks/
│   ├── useHedgehog.ts       # 고슴도치 게임 로직 훅
│   └── useCountdown.ts      # 카운트다운 훅
├── lib/
│   ├── supabase.ts          # Supabase 클라이언트
│   └── db.ts                # DB 함수 모음
├── store/
│   └── gameStore.ts         # Zustand 전역 상태
├── types/
│   └── index.ts             # TypeScript 타입 정의
└── utils/
    └── index.ts             # 유틸 함수
```

---

## ⚙️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com) 프로젝트 생성
2. SQL Editor에서 `schema.sql` (첨부된 스키마) 실행
3. 프로젝트의 URL과 anon key를 `.env.local`에 입력

### 4. 개발 서버 실행

```bash
npm run dev
```

→ http://localhost:3000 으로 접속

---

## 🚀 배포 (Vercel)

```bash
npm run build      # 빌드 확인
```

1. [Vercel](https://vercel.com)에 GitHub 레포 연결
2. Environment Variables에 `.env.local` 내용 입력
3. Deploy!

---

## 🎮 게임 규칙

| 행동 | 조건 | 보상 |
|------|------|------|
| 먹이주기 | 배고플 때 (8시간마다) | 100점 + 아이템 보너스 |
| 쓰다듬기 (기분 good) | 3시간마다 3회 | +100점 |
| 쓰다듬기 (기분 sensitive) | - | +50점 |
| 쓰다듬기 (기분 angry) | - | -25점 |
| 똥 청소 | 똥이 있을 때 | 50~80코인 |

### 고슴도치 상태
- **배고픔**: 8시간마다 발생
- **기분**: 1시간마다 랜덤 변경 (happy/sensitive/angry)
- **똥**: 6~10시간마다 생성
- **사망**: 15시간 이상 방치 → 점수 초기화, 새 고슴도치 생성

### 희귀도 확률
- 일반 (Normal): 70%
- 레어 (Rare): 20%
- 에픽 (Epic): 8%
- 전설 (Legendary): 2%
