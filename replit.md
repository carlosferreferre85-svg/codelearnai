# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains CodeLearn AI — a complete programming education platform with a mobile app (Expo), a web app (React+Vite), and a shared API server.

## Products

### CodeLearn AI Web App
Full-featured programming education website with AI chatbot, code generation, and SVG diagram generation.
- **Path**: `artifacts/codelearn-web/`
- **Type**: React + Vite web app
- **Preview**: `/` (root path)

**Pages:**
- `/` — Landing page with hero, features grid, how-it-works
- `/learn` — 6 topic modules with search & filter, progress tracking
- `/learn/:topicId` — Lesson reader with syntax highlighting, mark-complete, Ask AI button
- `/chat` — Full AI chat with streaming (Groq), code mode, SVG diagram generation
- `/recursos` — Resources page (GitHub Pages, Netlify, Vercel, MDN, etc.)

**Features:**
- Streaming AI chat powered by Groq (llama-3.3-70b-versatile) via `/api/chat`
- Code generation mode (optimized system prompt for copy-paste code)
- SVG diagram generation for code concepts via `/api/chat/generate-image`
- Syntax highlighting with react-syntax-highlighter (atomOneDark theme)
- Copy-to-clipboard on all code blocks
- Progress tracking with localStorage
- Dark/light mode toggle (dark by default)
- Mobile-responsive layout

### CodeLearn AI (Mobile App)
A comprehensive programming education app with AI assistant powered by Groq.
- **Path**: `artifacts/codelearn/`
- **Type**: Expo (React Native) mobile app
- **Preview**: `/mobile/` path

**Features:**
- 6 learning topics: HTML, CSS, JavaScript, Web Design, Free Web Deploy, AI Tools
- 16 structured lessons with code examples
- AI chatbot powered by Groq (llama-3.3-70b-versatile)
- Progress tracking with AsyncStorage
- Dark mode support

### API Server
Shared Express API server that proxies Groq AI chat requests.
- **Path**: `artifacts/api-server/`
- **Routes**: 
  - `POST /api/chat` — Groq proxy with streaming SSE (supports `codeMode: boolean` param)
  - `POST /api/chat/generate-image` — Generates SVG concept diagrams using Groq
  - `GET /api/healthz`
- **Secret required**: `GROQ_API_KEY`

## Design Tokens

- Background: `220 17% 7%` (dark navy)
- Primary (accent): `168 100% 41%` (#00d4aa green)
- Card: `220 14% 11%`
- Border: `220 13% 20%`
- Font: Inter (Google Fonts)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Web**: React 19 + Vite 7 + Tailwind CSS v4 + wouter routing + shadcn/ui
- **Mobile**: Expo SDK 54, React Native 0.81, expo-router
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: Groq API (llama-3.3-70b-versatile), proxied through API server
- **Code highlighting**: react-syntax-highlighter (atomOneDark)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
