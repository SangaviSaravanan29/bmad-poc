import type { TaskSort } from '../../services/tasks'

interface TaskFiltersProps {
  total: number
  completed: number
  pending: number
  sortBy: TaskSort
  onSortChange: (sortBy: TaskSort) => void
}

export function TaskFilters({ total, completed, pending, sortBy, onSortChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-3 text-sm text-slate-300">
        <span className="rounded-full bg-slate-800 px-3 py-1">
          Total <strong className="ml-1 text-slate-100">{total}</strong>
        </span>
        <span className="rounded-full bg-emerald-950/80 px-3 py-1 text-emerald-200">
          Completed <strong className="ml-1">{completed}</strong>
        </span>
        <span className="rounded-full bg-amber-950/80 px-3 py-1 text-amber-200">
          Pending <strong className="ml-1">{pending}</strong>
        </span>
      </div>

      <label className="flex items-center gap-3 text-sm text-slate-300" htmlFor="task-sort">
        <span>Organize by</span>
        <select
          id="task-sort"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as TaskSort)}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="status">Completion status</option>
        </select>
      </label>
    </div>
  )
}
