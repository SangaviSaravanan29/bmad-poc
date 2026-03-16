import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Activity, ListTodo, LogOut, Zap } from 'lucide-react'

import { TaskComposer } from '../components/tasks/TaskComposer'
import { TaskFilters } from '../components/tasks/TaskFilters'
import { TaskList } from '../components/tasks/TaskList'
import { Button } from '../components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TaskContext'

function DashboardContent() {
  const { user, signOut } = useAuth()
  const { tasks, loading, saving, error, isConfigured, sortBy, setSortBy, addTask, editTask, deleteTask, toggleTaskCompletion } = useTasks()
  const router = useRouter()

  const completed = tasks.filter((task) => task.is_completed).length
  const pending = tasks.length - completed

  const handleSignOut = async () => {
    await signOut()
    await router.replace('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-8">
        <header className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
              <Zap className="h-3.5 w-3.5" />
              Epic 2
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Core task management</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Create, edit, complete, delete, and organize tasks from one Next.js dashboard.
              </p>
            </div>
            <p className="text-sm text-slate-500">Signed in as {user?.email}</p>
          </div>

          <Button variant="outline" className="border-slate-700 text-slate-100 hover:bg-slate-800" onClick={() => void handleSignOut()}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900/70 text-slate-50">
            <CardHeader>
              <CardDescription className="text-slate-400">All tasks</CardDescription>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <ListTodo className="h-6 w-6 text-cyan-300" />
                {tasks.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-slate-800 bg-slate-900/70 text-slate-50">
            <CardHeader>
              <CardDescription className="text-slate-400">Completed</CardDescription>
              <CardTitle className="text-3xl text-emerald-300">{completed}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-slate-800 bg-slate-900/70 text-slate-50">
            <CardHeader>
              <CardDescription className="text-slate-400">In progress</CardDescription>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Activity className="h-6 w-6 text-amber-300" />
                {pending}
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        <main className="mt-8 space-y-6">
          {!isConfigured ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable Epic 2 task storage.
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100" role="alert">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Tasks</h2>
              <p className="mt-1 text-sm text-slate-400">Everything for Stories 2.1 through 2.5 is handled here.</p>
            </div>
            <TaskComposer disabled={saving || !isConfigured} onSubmit={addTask} />
          </div>

          <TaskFilters total={tasks.length} completed={completed} pending={pending} sortBy={sortBy} onSortChange={setSortBy} />

          <TaskList
            tasks={tasks}
            loading={loading}
            busy={saving}
            onToggleComplete={toggleTaskCompletion}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      void router.replace('/login')
    }
  }, [loading, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-300" />
      </div>
    )
  }

  return <DashboardContent />
}
