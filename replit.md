# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a CodeLearn AI mobile app (Expo) and a shared API server.

## Products

### CodeLearn AI (Mobile App)
A comprehensive programming education app with AI assistant powered by Groq.
- **Path**: `artifacts/codelearn/`
- **Type**: Expo (React Native) mobile app
- **Preview**: `/` (root path)

**Features:**
- 6 learning topics: HTML, CSS, JavaScript, Web Design, Free Web Deploy, AI Tools
- 16 structured lessons with code examples
- AI chatbot powered by Groq (llama-3.3-70b-versatile)
- Progress tracking with AsyncStorage
- 3 learning paths (Beginner, Design, AI)
- Dark mode support

### API Server
Shared Express API server that proxies Groq AI chat requests.
- **Path**: `artifacts/api-server/`
- **Routes**: `/api/chat` (Groq proxy), `/api/healthz`
- **Secret required**: `GROQ_API_KEY`

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Mobile**: Expo SDK 54, React Native 0.81, expo-router
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: Groq API (llama-3.3-70b-versatile), proxied through API server

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Secrets Required

- `GROQ_API_KEY` — Groq API key for AI chat (get free at console.groq.com)
- `SESSION_SECRET` — Session secret for Express

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
