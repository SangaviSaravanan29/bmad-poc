# bmad-poc Architecture

## Overview

This document reflects the current application architecture for `bmad-poc` after the frontend stack moved from the original Vite-based concept to a Next.js implementation.

The product remains a lightweight personal task manager with:

- Supabase for authentication, data storage, and realtime updates
- Next.js for routing and application structure
- React + TypeScript for the UI layer
- Tailwind CSS for styling
- React Context for auth and task state

## Starter Decision

### Selected Starter

**Next.js with React and TypeScript**

### Why Next.js

- Built-in routing matches the current application layout
- Native Vercel deployment path aligns with the hosting plan
- Strong TypeScript support with framework-managed configuration
- Clean path for future API routes, middleware, and rendering options
- Removes the need for the manual client-side routing setup required by the old Vite plan

### Initialization Command

```bash
npx create-next-app@latest bmad-poc --ts
```

## Technology Stack

- **Frontend:** Next.js + React 19 + TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Deployment:** Vercel
- **Testing Direction:** Next.js-compatible unit, component, and e2e testing

## Core Architectural Decisions

### Frontend Architecture

- The app uses the **Next.js Pages Router**
- Route entry points live in `src/pages/`
- Shared UI primitives live in `src/components/ui/`
- Task-specific UI lives in `src/components/tasks/`
- Global auth and task state live in `src/context/`

### Backend Architecture

- Supabase Auth handles registration, login, and session management
- PostgreSQL stores user tasks
- Row Level Security isolates each user's data
- Supabase Realtime keeps task changes synced without page refresh

### State Management

- `AuthContext` owns authenticated user and auth actions
- `TaskContext` owns task list state, sorting, loading, and mutations
- Service modules isolate database access from page/components

### Data Access

- `src/services/supabase.ts` provides the Supabase client and shared types
- `src/services/tasks.ts` owns CRUD and realtime subscriptions for tasks
- Components do not talk to Supabase directly

## Current Project Structure

```text
bmad-poc/
├── README.md
├── package.json
├── next.config.mjs
├── next-env.d.ts
├── tsconfig.json
├── eslint.config.js
├── postcss.config.cjs
├── tailwind.config.cjs
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── pages/
    │   ├── _app.tsx
    │   ├── index.tsx
    │   ├── login.tsx
    │   ├── register.tsx
    │   └── dashboard.tsx
    ├── components/
    │   ├── ui/
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── input.tsx
    │   │   └── label.tsx
    │   └── tasks/
    │       ├── TaskComposer.tsx
    │       ├── TaskFilters.tsx
    │       ├── TaskItem.tsx
    │       └── TaskList.tsx
    ├── context/
    │   ├── AuthContext.tsx
    │   └── TaskContext.tsx
    ├── services/
    │   ├── supabase.ts
    │   └── tasks.ts
    ├── styles/
    │   └── globals.css
    └── lib/
        └── utils.ts
```

## Boundaries

### UI Boundary

- Pages compose features and handle route-level redirects
- Reusable UI elements stay generic
- Feature components handle task-specific rendering and interaction

### Service Boundary

- Supabase access stays in `src/services/`
- Business logic for task CRUD stays in `src/services/tasks.ts`
- UI components call context actions, not raw backend APIs

### Data Boundary

- `tasks` table is the main Epic 2 persistence model
- Required fields:
  - `id`
  - `user_id`
  - `title`
  - `description`
  - `is_completed`
  - `created_at`
  - `updated_at`
- RLS policies enforce user ownership on read/write

## Request Flow

### Auth Flow

1. User submits login or registration form
2. `AuthContext` calls Supabase Auth
3. Session state updates in context
4. Protected pages redirect based on auth state

### Task Flow

1. Dashboard loads
2. `TaskContext` fetches tasks for the authenticated user
3. Components render the task list and stats
4. Create/edit/delete/complete actions call `tasks.ts`
5. Supabase persists the change
6. Realtime or refresh updates the UI immediately

## Deployment and Operations

### Hosting

- Vercel is the primary deployment target
- Next.js build output is optimized for Vercel
- Environment variables are provided per environment

### Environment Variables

Required client variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Testing Direction

Recommended coverage for the current stack:

- Auth flow tests
- Task CRUD service tests
- Dashboard interaction tests
- End-to-end verification for login and task workflows

## Migration Note

The original planning artifacts assumed:

- Vite for project setup and builds
- Vite-specific optimization language
- A broader React-only SPA structure

The live codebase now uses Next.js, so all future implementation should treat Next.js as the source of truth.

## Implementation Readiness

The project is ready for continued implementation on the current stack because:

- The app already runs on Next.js
- Authentication is integrated with Supabase
- Epic 2 task management is implemented against the `tasks` table
- Project docs now point to the actual framework choice
