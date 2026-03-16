import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Activity, ArrowDownRight, CheckCircle2, Clock3, ListTodo, LogOut, Target } from 'lucide-react'

import { TaskComposer } from '../components/tasks/TaskComposer'
import { TaskFilters } from '../components/tasks/TaskFilters'
import { TaskList } from '../components/tasks/TaskList'
import { Button } from '../components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TaskContext'

function DashboardContent() {
  const { user, signOut } = useAuth()
  const { tasks, loading, saving, error, successMessage, isConfigured, sortBy, setSortBy, addTask, editTask, deleteTask, toggleTaskCompletion } = useTasks()
  const router = useRouter()
  const [isOnline, setIsOnline] = useState(true)

  const completed = tasks.filter((task) => task.is_completed).length
  const pending = tasks.length - completed
  const completionRate = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100)
  const pendingTasks = tasks.filter((task) => !task.is_completed)
  const completedTasks = tasks.filter((task) => task.is_completed)
  const recentTasks = [...tasks].slice(0, 3)

  const handleSignOut = async () => {
    await signOut()
    await router.replace('/login')
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const syncStatus = () => setIsOnline(window.navigator.onLine)

    syncStatus()
    window.addEventListener('online', syncStatus)
    window.addEventListener('offline', syncStatus)

    return () => {
      window.removeEventListener('online', syncStatus)
      window.removeEventListener('offline', syncStatus)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-8">
        <header className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Task dashboard and visualization</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Track progress at a glance, focus on unfinished work, and manage tasks from one Next.js dashboard.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-slate-500">Signed in as {user?.email}</p>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  isOnline ? 'bg-emerald-500/15 text-emerald-200' : 'bg-red-500/15 text-red-200'
                }`}
              >
                <span
                  className={`mr-2 h-2 w-2 rounded-full ${
                    isOnline ? 'bg-emerald-400' : 'bg-red-400'
                  }`}
                  aria-hidden="true"
                />
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
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

        <section id="overview" className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <Card className="border-slate-800 bg-slate-900/70 text-slate-50">
            <CardHeader>
              <CardDescription className="text-slate-400">Progress overview</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-5 w-5 text-cyan-300" />
                {completionRate}% complete
              </CardTitle>
            </CardHeader>
            <div className="px-6 pb-6">
              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                  aria-label={`Task completion rate ${completionRate}%`}
                />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Focus now</div>
                  <div className="mt-2 flex items-center gap-2 text-2xl font-semibold text-amber-300">
                    <Clock3 className="h-5 w-5" />
                    {pending}
                  </div>
                  <p className="mt-2 text-sm text-slate-400">Pending tasks stay visually dominant so you can see what still needs attention.</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Completed</div>
                  <div className="mt-2 flex items-center gap-2 text-2xl font-semibold text-emerald-300">
                    <CheckCircle2 className="h-5 w-5" />
                    {completed}
                  </div>
                  <p className="mt-2 text-sm text-slate-400">Completion updates immediately as tasks move across the finish line.</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Momentum</div>
                  <div className="mt-2 flex items-center gap-2 text-2xl font-semibold text-cyan-300">
                    <Activity className="h-5 w-5" />
                    {tasks.length === 0 ? 0 : Math.max(completionRate, pending > 0 ? 1 : 0)}
                  </div>
                  <p className="mt-2 text-sm text-slate-400">A quick signal of current workload and completion trend without leaving the dashboard.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-slate-800 bg-slate-900/70 text-slate-50">
            <CardHeader>
              <CardDescription className="text-slate-400">Navigation</CardDescription>
              <CardTitle className="text-2xl">Jump between views</CardTitle>
            </CardHeader>
            <div className="space-y-3 px-6 pb-6">
              <a href="#overview" className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:text-white">
                Overview
                <ArrowDownRight className="h-4 w-4 text-cyan-300" />
              </a>
              <a href="#manage" className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:text-white">
                Task management
                <ArrowDownRight className="h-4 w-4 text-cyan-300" />
              </a>
              <p className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">
                Create tasks directly from the dashboard, then jump back to your progress view with one click.
              </p>
            </div>
          </Card>
        </section>

        <main className="mt-8 space-y-6">
          {!isOnline ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100" role="status">
              You are offline. Existing dashboard state remains visible, and task drafts stay on this device until the connection returns.
            </div>
          ) : null}

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

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100" role="status">
              {successMessage}
            </div>
          ) : null}

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-800 bg-slate-900/70 text-slate-50">
              <CardHeader>
                <CardDescription className="text-slate-400">Pending spotlight</CardDescription>
                <CardTitle className="text-2xl">Tasks that still need action</CardTitle>
              </CardHeader>
              <div className="space-y-3 px-6 pb-6">
                {pendingTasks.length === 0 ? (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-5 text-sm text-emerald-100">
                    Everything is complete. Add a new task when you are ready for the next step.
                  </div>
                ) : (
                  pendingTasks.slice(0, 4).map((task) => (
                    <div key={task.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-medium text-slate-100">{task.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">{task.description?.trim() || 'No description added yet.'}</p>
                        </div>
                        <span className="rounded-full bg-amber-950 px-2.5 py-1 text-xs font-medium text-amber-200">Pending</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="border-slate-800 bg-slate-900/70 text-slate-50">
              <CardHeader>
                <CardDescription className="text-slate-400">Completed tasks</CardDescription>
                <CardTitle className="text-2xl">Done and de-emphasized</CardTitle>
              </CardHeader>
              <div className="space-y-3 px-6 pb-6">
                {completedTasks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 px-4 py-5 text-sm text-slate-400">
                    Complete a task to see finished work summarized here.
                  </div>
                ) : (
                  completedTasks.slice(0, 4).map((task) => (
                    <div key={task.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 opacity-75">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-medium text-slate-300 line-through">{task.title}</h3>
                          <p className="mt-1 text-sm text-slate-500">{task.description?.trim() || 'No description added yet.'}</p>
                        </div>
                        <span className="rounded-full bg-emerald-950 px-2.5 py-1 text-xs font-medium text-emerald-200">Completed</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-slate-800 bg-slate-900/70 text-slate-50">
              <CardHeader>
                <CardDescription className="text-slate-400">Recent activity</CardDescription>
                <CardTitle className="text-2xl">Latest tasks in your flow</CardTitle>
              </CardHeader>
              <div className="space-y-3 px-6 pb-6">
                {recentTasks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 px-4 py-5 text-sm text-slate-400">
                    No tasks yet. Create your first task to activate the dashboard.
                  </div>
                ) : (
                  recentTasks.map((task) => (
                    <div key={task.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-medium text-slate-100">{task.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">{task.description?.trim() || 'No description added yet.'}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${task.is_completed ? 'bg-emerald-950 text-emerald-200' : 'bg-amber-950 text-amber-200'}`}>
                          {task.is_completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <div className="flex flex-col gap-6">
              <Card className="border-slate-800 bg-slate-900/70 text-slate-50">
                <CardHeader>
                  <CardDescription className="text-slate-400">Quick create</CardDescription>
                  <CardTitle className="text-2xl">Add work without leaving the dashboard</CardTitle>
                </CardHeader>
                <div className="px-6 pb-6">
                  <TaskComposer disabled={saving || !isConfigured} onSubmit={addTask} />
                </div>
              </Card>
            </div>
          </section>

          <section id="manage" className="flex scroll-mt-6 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Task management</h2>
              <p className="mt-1 text-sm text-slate-400">The full editable task list stays here, while the dashboard above keeps progress visible at a glance.</p>
            </div>
            <a href="#overview" className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">
              Back to overview
            </a>
          </section>

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
