import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'

import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface TaskComposerProps {
  disabled?: boolean
  onSubmit: (input: { title: string; description: string }) => Promise<void>
}

const TASK_DRAFT_KEY = 'taskflow-task-draft'

export function TaskComposer({ disabled = false, onSubmit }: TaskComposerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const savedDraft = window.localStorage.getItem(TASK_DRAFT_KEY)

    if (!savedDraft) {
      return
    }

    try {
      const draft = JSON.parse(savedDraft) as { title?: string; description?: string }
      if (draft.title || draft.description) {
        setTitle(draft.title ?? '')
        setDescription(draft.description ?? '')
        setIsOpen(true)
      }
    } catch {
      window.localStorage.removeItem(TASK_DRAFT_KEY)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!title && !description) {
      window.localStorage.removeItem(TASK_DRAFT_KEY)
      return
    }

    window.localStorage.setItem(TASK_DRAFT_KEY, JSON.stringify({ title, description }))
  }, [title, description])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setError(null)
    setIsOpen(false)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TASK_DRAFT_KEY)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError('Title is required.')
      return
    }

    setError(null)

    try {
      await onSubmit({ title: trimmedTitle, description })
      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create task.')
    }
  }

  if (!isOpen) {
    return (
      <Button className="min-h-11 w-full sm:w-auto" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4" />
        Add task
      </Button>
    )
  }

  return (
    <Card className="border-slate-800 bg-slate-900/80 text-slate-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Create a new task</CardTitle>
        <Button variant="ghost" size="icon" className="min-h-11 min-w-11 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={resetForm}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close task form</span>
        </Button>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100" role="alert">
              {error}
            </div>
          ) : null}

          <div className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-400">
            Draft is saved locally until the task is created or canceled.
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-slate-100">
              Title
            </Label>
            <Input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ship Epic 2 task manager"
              className="border-slate-700 bg-slate-950 text-slate-50 placeholder:text-slate-500"
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description" className="text-slate-100">
              Description
            </Label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add a short note or next step."
              rows={4}
              className="flex w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              disabled={disabled}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={disabled} className="min-h-11 sm:min-w-36">
              {disabled ? 'Saving...' : 'Save task'}
            </Button>
            <Button type="button" variant="outline" disabled={disabled} className="min-h-11 border-slate-700 text-slate-200 hover:bg-slate-800" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
