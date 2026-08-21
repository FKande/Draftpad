const BASE = import.meta.env.VITE_API_URL

export interface User {
  id: string
  email: string
  createdAt: string
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string | null
  createdAt: string
  updatedAt: string
}

export interface NoteFields {
  title?: string
  content?: string
}

export type ApiError = Error & { status?: number }

// status is optional, so any Error qualifies structurally; instanceof is the
// whole check.
export function isApiError(err: unknown): err is ApiError {
  return err instanceof Error
}

interface RequestOptions {
  method?: string
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {

  const res = await fetch(`${BASE}${path}`, {
    method: options.method || 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : {},
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = res.status === 204 ? null : await res.json()

  if (!res.ok) {
    const err = new Error(data.error) as ApiError
    err.status = res.status
    throw err
  }

  return data as T
}

export async function getMe(): Promise<User> {
  return request<User>('/auth/me')
}

export async function login(email: string, password: string): Promise<User> {
  return request<User>('/auth/login', { method: 'POST', body: { email, password } })
}

export async function signup(email: string, password: string): Promise<User> {
  return request<User>('/auth/signup', { method: 'POST', body: {email, password} })
}

export async function logout(): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/auth/logout', { method: 'POST' })
}

export async function getNotes(): Promise<Note[]> {
  return request<Note[]>('/notes')
}

export async function createNote(): Promise<Note> {
  return request<Note>('/notes', { method: 'POST', body: {} })
}

export async function updateNote(id: string, fields: NoteFields): Promise<Note> {
  return request<Note>(`/notes/${id}`, { method: 'PATCH', body: fields })
}

export async function deleteNote(id: string): Promise<null> {
  return request<null>(`/notes/${id}`, { method: 'DELETE' })
}

export async function getNoteById(id: string): Promise<Note> {
  return request<Note>(`/notes/${id}`)
}
