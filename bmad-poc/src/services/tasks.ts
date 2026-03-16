import type { RealtimeChannel } from '@supabase/supabase-js'

import { isSupabaseConfigured, supabase, type Task } from './supabase'

export type TaskSort = 'newest' | 'oldest' | 'status'

export interface TaskInput {
  title: string
  description: string
}

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  return supabase
}

function applySort(query: any, sortBy: TaskSort) {
  switch (sortBy) {
    case 'oldest':
      return query.order('created_at', { ascending: true })
    case 'status':
      return query.order('is_completed', { ascending: true }).order('created_at', { ascending: false })
    case 'newest':
    default:
      return query.order('created_at', { ascending: false })
  }
}

function sanitizeTaskInput(input: TaskInput) {
  const title = input.title.trim()
  const description = input.description.trim()

  if (!title) {
    throw new Error('Task title is required.')
  }

  return {
    title,
    description: description || null,
  }
}

export async function listTasks(userId: string, sortBy: TaskSort = 'newest') {
  const client = requireSupabase()
  const query = client.from('tasks').select('*').eq('user_id', userId)
  const { data, error } = await applySort(query, sortBy)

  if (error) {
    throw new Error(error.message)
  }

  return data ?? []
}

export async function createTask(userId: string, input: TaskInput) {
  const client = requireSupabase()
  const payload = sanitizeTaskInput(input)
  const { data, error } = await client
    .from('tasks')
    .insert({
      user_id: userId,
      title: payload.title,
      description: payload.description,
      is_completed: false,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateTask(taskId: number, userId: string, input: TaskInput) {
  const client = requireSupabase()
  const payload = sanitizeTaskInput(input)
  const { data, error } = await client
    .from('tasks')
    .update(payload)
    .eq('id', taskId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateTaskCompletion(taskId: number, userId: string, isCompleted: boolean) {
  const client = requireSupabase()
  const { data, error } = await client
    .from('tasks')
    .update({ is_completed: isCompleted })
    .eq('id', taskId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function removeTask(taskId: number, userId: string) {
  const client = requireSupabase()
  const { error } = await client.from('tasks').delete().eq('id', taskId).eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }
}

export function subscribeToTasks(userId: string, onChange: () => void) {
  const client = supabase

  if (!isSupabaseConfigured || !client) {
    return () => undefined
  }

  const channel: RealtimeChannel = client
    .channel(`tasks:${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${userId}` }, onChange)
    .subscribe()

  return () => {
    void client.removeChannel(channel)
  }
}
