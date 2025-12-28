# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**crapdash** is a customizable home lab dashboard that displays services as categorized cards with local, type-safe configuration. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4, using shadcn/ui components (radix-mira style).

### Core Features

**Dashboard View**:
- Services displayed as cards grouped by category sections
- Each card shows service name and description
- Clicking a card opens the service URL in a new tab (with `rel="noopener noreferrer"`)
- Search functionality to filter services across all categories

**Admin Capabilities**:
- Add, edit, and delete categories and services within the app
- Required-field validation with inline error messages
- Changes immediately sync between admin and dashboard views
- All configuration stored locally and type-safe

### Data Model

**Category**:
- Name (required)
- Description (optional)
- Services array

**Service**:
- Name (required)
- Description (required)
- URL (required)
- Category assignment

## Development Commands

- `pnpm dev` - Start development server on port 2727
- `pnpm build` - Build production application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Architecture

### Component System

The project uses shadcn/ui components with the radix-mira style variant. Components are configured via `components.json` and stored in `components/ui/`.

**Path Aliases** (defined in `tsconfig.json` and `components.json`):
- `@/*` - Root directory (e.g., `@/components`, `@/lib`)
- `@/components/ui` - UI component library
- `@/lib/utils` - Utility functions

**Utility Function**:
- `cn()` in `lib/utils.ts` - Combines clsx and tailwind-merge for conditional className handling

### Styling

Tailwind CSS 4 with PostCSS pipeline:
- CSS Variables: Uses OKLCH color space for theme values
- Dark Mode: Implemented via `.dark` class with CSS custom properties
- Global Styles: `app/globals.css` includes:
  - `@import "tailwindcss"`
  - `@import "tw-animate-css"`
  - `@import "shadcn/tailwind.css"`
  - Custom theme variables defined in `@theme inline` block
  - Dark mode variant: `@custom-variant dark (&:is(.dark *))`

**Design Tokens**:
- Border radius system: `--radius-{sm,md,lg,xl,2xl,3xl,4xl}`
- Color system: Uses CSS custom properties (e.g., `--background`, `--foreground`, `--primary`)

### Font System

Three fonts configured in `app/layout.tsx`:
- **Inter** - Primary sans-serif (`--font-sans`)
- **Geist Sans** - Secondary sans (`--font-geist-sans`)
- **Geist Mono** - Monospace (`--font-geist-mono`)

### File Structure

```
app/
  layout.tsx       - Root layout with font and metadata configuration
  page.tsx         - Main dashboard view
  admin/           - Admin routes for managing categories/services
  globals.css      - Global styles and theme variables
components/
  ui/              - shadcn/ui components (Button, Card, Input, etc.)
  *.tsx            - Feature components (ServiceCard, CategorySection, etc.)
lib/
  utils.ts         - Utility functions (cn helper)
  types.ts         - TypeScript type definitions for Category and Service
  store/           - State management for categories and services
```

## Development Guidelines

### Component Development

When creating or modifying components:
- Use the `cn()` utility from `@/lib/utils` for className composition
- Follow the shadcn/ui pattern for UI components
- Import UI components from `@/components/ui`
- TypeScript is strict mode enabled
- React Server Components are used by default (RSC is enabled)
- Use "use client" directive when client-side interactivity is needed

### State Management

- Keep configuration data in local state (React Context or similar)
- Ensure type safety with TypeScript interfaces/types
- Changes in admin views must immediately reflect in dashboard
- Consider using React Context or a lightweight state solution for data sharing

### Form Validation

- Validate required fields (service name, description, URL; category name)
- Display inline validation errors near form fields
- Prevent submission when validation fails

### External Links

- Always use `target="_blank"` for service links
- Include `rel="noopener noreferrer"` for security

## Configuration Files

- `components.json` - shadcn/ui configuration (style: radix-mira, icon library: lucide-react)
- `tsconfig.json` - TypeScript config with strict mode and `@/*` path alias
- `next.config.ts` - Next.js configuration (currently minimal)
- `eslint.config.mjs` - ESLint with Next.js config for TypeScript

## Dependencies

Key libraries:
- UI: `@base-ui/react`, `radix-ui`, `lucide-react`, `shadcn`
- Styling: `tailwindcss`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`
- Framework: Next.js 16 with React 19
