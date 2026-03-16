import { useState } from 'react'
import { CheckCircle2, Circle, Pencil, Save, Trash2, X } from 'lucide-react'

import type { Task } from '../../services/supabase'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface TaskItemProps {
  task: Task
  busy?: boolean
  onToggleComplete: (taskId: number, nextValue: boolean) => Promise<void>
  onEdit: (taskId: number, input: { title: string; description: string }) => Promise<void>
  onDelete: (taskId: number) => Promise<void>
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function TaskItem({ task, busy = false, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [error, setError] = useState<string | null>(null)

  const cancelEdit = () => {
    setIsEditing(false)
    setTitle(task.title)
    setDescription(task.description ?? '')
    setError(null)
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      setError('Title is required.')
      return
    }

    try {
      await onEdit(task.id, { title, description })
      setIsEditing(false)
      setError(null)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to update task.')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      return
    }

    await onDelete(task.id)
  }

  return (
    <Card className={`border-slate-800 bg-slate-900/70 ${task.is_completed ? 'opacity-80' : ''}`}>
      <CardContent className="p-5">
        {isEditing ? (
          <form className="space-y-4" onSubmit={handleSave}>
            {error ? (
              <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100" role="alert">
                {error}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor={`task-title-${task.id}`} className="text-slate-100">
                Title
              </Label>
              <Input
                id={`task-title-${task.id}`}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="border-slate-700 bg-slate-950 text-slate-50"
                disabled={busy}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`task-description-${task.id}`} className="text-slate-100">
                Description
              </Label>
              <textarea
                id={`task-description-${task.id}`}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                disabled={busy}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={busy}>
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button type="button" variant="outline" disabled={busy} className="border-slate-700 text-slate-200 hover:bg-slate-800" onClick={cancelEdit}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => void onToggleComplete(task.id, !task.is_completed)}
                  className="mt-1 text-slate-300 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  aria-label={task.is_completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
                  disabled={busy}
                >
                  {task.is_completed ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <Circle className="h-5 w-5" />}
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-lg font-semibold ${task.is_completed ? 'text-slate-400 line-through' : 'text-slate-50'}`}>{task.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        task.is_completed ? 'bg-emerald-950 text-emerald-200' : 'bg-amber-950 text-amber-200'
                      }`}
                    >
                      {task.is_completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    {task.description?.trim() ? task.description : 'No description added yet.'}
                  </p>

                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Created {formatDate(task.created_at)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-200 hover:bg-slate-800" onClick={() => setIsEditing(true)} disabled={busy}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="border-red-500/40 text-red-200 hover:bg-red-500/10" onClick={() => void handleDelete()} disabled={busy}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
