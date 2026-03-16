import { createContext, useContext, useEffect, useReducer } from 'react'
import type { ReactNode } from 'react'

import { useAuth } from './AuthContext'
import { createTask, listTasks, removeTask, subscribeToTasks, type TaskInput, type TaskSort, updateTask, updateTaskCompletion } from '../services/tasks'
import { isSupabaseConfigured, type Task } from '../services/supabase'

interface TaskContextValue {
  tasks: Task[]
  loading: boolean
  saving: boolean
  error: string | null
  sortBy: TaskSort
  isConfigured: boolean
  setSortBy: (sortBy: TaskSort) => void
  refreshTasks: () => Promise<void>
  addTask: (input: TaskInput) => Promise<void>
  editTask: (taskId: number, input: TaskInput) => Promise<void>
  toggleTaskCompletion: (taskId: number, isCompleted: boolean) => Promise<void>
  deleteTask: (taskId: number) => Promise<void>
}

interface TaskState {
  tasks: Task[]
  loading: boolean
  saving: boolean
  error: string | null
  sortBy: TaskSort
}

type TaskAction =
  | { type: 'load:start' }
  | { type: 'load:success'; tasks: Task[] }
  | { type: 'save:start' }
  | { type: 'save:end' }
  | { type: 'error'; error: string | null }
  | { type: 'sort:set'; sortBy: TaskSort }
  | { type: 'reset' }

const initialState: TaskState = {
  tasks: [],
  loading: true,
  saving: false,
  error: null,
  sortBy: 'newest',
}

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'load:start':
      return { ...state, loading: true, error: null }
    case 'load:success':
      return { ...state, loading: false, tasks: action.tasks, error: null }
    case 'save:start':
      return { ...state, saving: true, error: null }
    case 'save:end':
      return { ...state, saving: false }
    case 'error':
      return { ...state, loading: false, saving: false, error: action.error }
    case 'sort:set':
      return { ...state, sortBy: action.sortBy }
    case 'reset':
      return initialState
    default:
      return state
  }
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(taskReducer, initialState)

  const refreshTasks = async () => {
    if (!user) {
      dispatch({ type: 'load:success', tasks: [] })
      return
    }

    if (!isSupabaseConfigured) {
      dispatch({ type: 'error', error: 'Task management is unavailable until Supabase environment variables are configured.' })
      return
    }

    dispatch({ type: 'load:start' })

    try {
      const tasks = await listTasks(user.id, state.sortBy)
      dispatch({ type: 'load:success', tasks })
    } catch (error) {
      dispatch({ type: 'error', error: error instanceof Error ? error.message : 'Unable to load tasks.' })
    }
  }

  useEffect(() => {
    if (!user) {
      dispatch({ type: 'reset' })
      return
    }

    void refreshTasks()

    const unsubscribe = subscribeToTasks(user.id, () => {
      void refreshTasks()
    })

    return unsubscribe
  }, [user?.id, state.sortBy])

  const runTaskMutation = async (action: () => Promise<void>) => {
    dispatch({ type: 'save:start' })

    try {
      await action()
      await refreshTasks()
    } catch (error) {
      dispatch({ type: 'error', error: error instanceof Error ? error.message : 'Task action failed.' })
      throw error
    } finally {
      dispatch({ type: 'save:end' })
    }
  }

  const addTask = async (input: TaskInput) => {
    if (!user) {
      return
    }

    await runTaskMutation(async () => {
      await createTask(user.id, input)
    })
  }

  const editTask = async (taskId: number, input: TaskInput) => {
    if (!user) {
      return
    }

    await runTaskMutation(async () => {
      await updateTask(taskId, user.id, input)
    })
  }

  const toggleTaskCompletion = async (taskId: number, isCompleted: boolean) => {
    if (!user) {
      return
    }

    await runTaskMutation(async () => {
      await updateTaskCompletion(taskId, user.id, isCompleted)
    })
  }

  const deleteTask = async (taskId: number) => {
    if (!user) {
      return
    }

    await runTaskMutation(async () => {
      await removeTask(taskId, user.id)
    })
  }

  const value: TaskContextValue = {
    tasks: state.tasks,
    loading: state.loading,
    saving: state.saving,
    error: state.error,
    sortBy: state.sortBy,
    isConfigured: isSupabaseConfigured,
    setSortBy: (sortBy) => dispatch({ type: 'sort:set', sortBy }),
    refreshTasks,
    addTask,
    editTask,
    toggleTaskCompletion,
    deleteTask,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }

  return context
}
