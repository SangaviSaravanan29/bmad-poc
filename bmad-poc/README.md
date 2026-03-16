# TaskFlow

TaskFlow is a Next.js task manager backed by Supabase. The project now includes Epic 1 authentication and the initial Epic 2 task workflow.

## Stack

- Next.js Pages Router
- React + TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, and Realtime
- React Context for auth and task state

## Implemented

- User registration and login
- Session-aware protected dashboard
- Task create, edit, delete, complete, and sort flows
- Realtime task refresh when Supabase Realtime is enabled
- Responsive dashboard UI

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. Run the app:

```bash
npm run dev
```

## Supabase tasks table

Epic 2 expects a `tasks` table with at least these columns:

- `id` bigint or integer primary key
- `user_id` uuid referencing `auth.users(id)`
- `title` text not null
- `description` text null
- `is_completed` boolean not null default false
- `created_at` timestamptz not null default now()
- `updated_at` timestamptz not null default now()

Enable Row Level Security so users can only access their own tasks.

## Next steps

- Expand Epic 3 dashboard visualization
- Add automated tests for auth and task flows
- Remove remaining unused legacy SPA migration leftovers
