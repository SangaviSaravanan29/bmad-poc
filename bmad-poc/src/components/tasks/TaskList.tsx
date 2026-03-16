import { Sparkles } from 'lucide-react'

import type { Task } from '../../services/supabase'
import { Button } from '../ui/button'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  loading?: boolean
  busy?: boolean
  onCreateFirstTask?: () => void
  onToggleComplete: (taskId: number, nextValue: boolean) => Promise<void>
  onEdit: (taskId: number, input: { title: string; description: string }) => Promise<void>
  onDelete: (taskId: number) => Promise<void>
}

export function TaskList({ tasks, loading = false, busy = false, onCreateFirstTask, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-sm text-slate-400">
        Loading tasks...
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
          <Sparkles className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-100">No tasks yet</h3>
        <p className="mt-2 text-sm text-slate-400">Create one clear task to see immediate value from the dashboard.</p>
        {onCreateFirstTask ? (
          <div className="mt-5">
            <Button className="min-h-11" onClick={onCreateFirstTask}>
              Create your first task
            </Button>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          busy={busy}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
