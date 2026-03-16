import type { Task } from '../../services/supabase'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  loading?: boolean
  busy?: boolean
  onToggleComplete: (taskId: number, nextValue: boolean) => Promise<void>
  onEdit: (taskId: number, input: { title: string; description: string }) => Promise<void>
  onDelete: (taskId: number) => Promise<void>
}

export function TaskList({ tasks, loading = false, busy = false, onToggleComplete, onEdit, onDelete }: TaskListProps) {
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
        <h3 className="text-lg font-semibold text-slate-100">No tasks yet</h3>
        <p className="mt-2 text-sm text-slate-400">Create your first task to start Epic 2 workflow tracking.</p>
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
