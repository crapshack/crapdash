# AGENTS.md

## Project overview

- Crapdash is a customizable dashboard for organizing links and services, intended for self-hosted deployments, built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, and shadcn/ui.
- The app is primarily server components, with client components added only when interactivity is required.
- Each deployment instance stores its editable dashboard config in `data/config.json`, updated via server actions in `lib/actions.ts`.

## Commands

### Install

- `pnpm install`

### Dev server

- `pnpm dev` (runs Next dev server on port 2727)

### Build + start

- `pnpm build` (Next production build)
- `pnpm start` (start production server)

### Lint

- `pnpm lint` (runs ESLint with Next config)
- `pnpm lint -- app/page.tsx` (lint a specific file or glob)

### Tests

- No test runner is configured right now (no Jest/Vitest scripts).

## Repository layout

- `app/` — Next.js App Router routes, layouts, and server components.
- `components/` — UI, admin, dashboard, and providers.
- `components/ui/` — shadcn/ui components (add via `pnpm dlx shadcn@latest add <component>`).
- `lib/` — server actions, data access, utilities, validation, and types.
- `data/` — persisted config and uploaded assets.
- `public/` — static assets.

## Runtime behavior

- `lib/db.ts` reads/writes `data/config.json`.
- `lib/actions.ts` handles mutations and calls `revalidatePath` for `"/"` and `"/admin"`.
- Validation lives in `lib/validations.ts` (Zod).
- Icon files are written under `data/icons/` by `lib/file-utils.ts` and related helpers.

## Code style guidelines

### Imports

- Prefer the `@/*` alias for internal imports (configured in `tsconfig.json`).
- Group imports in this order: external packages, `next/*`, then `@/` aliases, then relative imports.
- Use `import type { Foo }` for type-only imports to keep TS emit clean.

### Client components

- Add `"use client"` only when hooks or event handlers are needed.

### UI components

- shadcn/ui components live in `components/ui/`; add new ones via `pnpm dlx shadcn@latest add <component>`.

### Styling

- Use `cn()` from `@/lib/utils` for className composition.

### Data + validation

- All mutations go through server actions in `lib/actions.ts`.
- Use Zod schemas from `lib/validations.ts` for form data and payload validation.
- When returning errors from actions, use the `ActionResult<T>` shape.

### Error handling

- Server actions return `{ success: false, errors: [...] }` instead of throwing.
- If a Zod validation fails, map `error.issues` to `ValidationError` entries.
- For unexpected errors, log and return a generic message (see patterns in `lib/actions.ts`).


## Notes for agents

- Prioritize best practices and long-term maintainability over quick fixes.
- The dashboard is intended for self-hosted deployments; avoid dependencies that require external services.
- Instance config and uploads live under `data/`.
