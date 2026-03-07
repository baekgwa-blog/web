# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # 개발 서버 실행 (Turbopack 사용)
npm run build      # 프로덕션 빌드
npm run lint       # ESLint 검사
npm run lint:fix   # ESLint 자동 수정
npm run format     # Prettier 포맷팅
```

## Environment Variables

- `NEXT_PUBLIC_API_SERVER_URL`: 백엔드 API 서버 URL (기본값: `https://blog.api.baekgwa.site`)
- `NEXT_PUBLIC_SITE_URL`: 사이트 URL (기본값: `https://blog.baekgwa.site`)

## Architecture Overview

**백과's 블로그** - Next.js 16 App Router 기반 개인 블로그 프론트엔드. 백엔드 API와 쿠키 기반 인증으로 통신한다.

### 핵심 레이어

**API 클라이언트** (`lib/api-client.ts`)

- 모든 API 호출의 단일 진입점인 `fetchApi<T>` 함수
- SSR 환경(`typeof window === 'undefined'`)에서는 Next.js `cookies()`와 `headers()`를 통해 쿠키 및 클라이언트 IP를 자동으로 전달 (reverse proxy 환경 지원)
- 응답 타입: `ApiResponse<T> { isSuccess, code, message, data }`
- 에러 시 `ApiError` throw

**API 함수** (`lib/api/`)

- 도메인별 파일: `auth.ts`, `post.ts`, `category.ts`, `tag.ts`, `stack.ts`, `upload.ts`, `chatbot.ts`
- 각 함수는 `fetchApi`를 래핑하여 타입 안전한 요청/응답 제공

**Server Actions** (`lib/actions/`)

- `auth.ts`: `loginAction`, `logoutAction` - Zod 검증 포함
- `post.ts`, `stack.ts`: 폼 제출 처리용 Server Actions

**상태 관리**

- Zustand: `lib/store/auth.ts`의 `useAuthStore` - 로그인 상태를 `localStorage`에 persist
- TanStack Query: 서버 데이터 페칭 및 캐싱 (staleTime: 60초)
- React Context: `components/features/chatbot/chat-provider.tsx`의 `ChatProvider` - 챗봇 메시지 스트리밍 상태

**챗봇 (SSE 스트리밍)** (`lib/sse-client.ts`)

- `@microsoft/fetch-event-source`를 사용해 `/ai/stream/search` 엔드포인트에서 스트리밍 응답 수신
- `ChatProvider`에서 `flushSync`로 토큰 단위 실시간 렌더링

**에디터** (`components/editor/`)

- Tiptap 기반 리치 텍스트 에디터
- `extensions.ts`의 `getTiptapExtensions({ isView })`: 편집 모드에는 `tiptap-markdown` 확장 추가, 뷰 모드에는 제외
- 헤딩에 자동 id 생성 (TOC 연동용 slugify)
- `TiptapEditor.tsx`: 작성용, `TiptapViewer.tsx`: 읽기용

### 디렉토리 구조

```
app/                    # Next.js App Router 페이지
  api/post/route.ts     # 이미지 업로드용 Next.js API Route
  blog/[slug]/          # 블로그 상세 페이지 (cheerio로 TOC 생성)
  blog/write/           # 글 작성 페이지
  stack/                # 시리즈(Stack) 관련 페이지
  about/                # 소개 페이지
components/
  features/             # 도메인별 기능 컴포넌트
    blog/detail/        # 블로그 상세: TOC, 포스트 헤더/컨텐츠
    blog/main/          # 블로그 목록: 포스트 카드, 검색, 정렬
    blog/write/         # 글 작성: 카테고리/태그 선택
    chatbot/            # 챗봇 UI 및 Provider
    stack/              # 시리즈 관련 컴포넌트
    user/               # 로그인/로그아웃 폼
  editor/               # Tiptap 에디터 관련
  layouts/              # Header, Footer
  ui/                   # shadcn/ui 기반 공용 컴포넌트
  theme/                # 다크모드 ThemeProvider, ThemeToggle
lib/
  api-client.ts         # 기반 HTTP 클라이언트
  api/                  # 도메인별 API 함수
  actions/              # Next.js Server Actions
  store/                # Zustand 스토어
  hooks/                # 커스텀 훅 (use-debounce 등)
  sse-client.ts         # SSE 스트리밍 클라이언트
types/                  # 공용 TypeScript 타입 정의
```

### Path Alias

`@/*` → 프로젝트 루트 (`./`)

### 주요 기술 스택

- **UI**: shadcn/ui + Tailwind CSS v4 + Radix UI
- **에디터**: Tiptap v3 (Markdown 지원, 코드 하이라이팅: lowlight + highlight.js)
- **폼**: react-hook-form + Zod
- **TOC**: 블로그 상세 페이지에서 cheerio로 HTML 파싱하여 서버에서 생성
- **이미지**: AWS S3 (`baekgwa-blog-s3-bucket.s3.ap-northeast-2.amazonaws.com`)
