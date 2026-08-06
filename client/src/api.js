const BASE = import.meta.env.VITE_API_URL

async function request(path, options = {}) {

  const res = await fetch(`${BASE}${path}`, {
    method: options.method || 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : {},
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = res.status === 204 ? null : await res.json()

  if (!res.ok) {
    const err = new Error(data.error)
    err.status = res.status
    throw err
  }

  return data
}

export async function getMe() {
  return request('/auth/me')
}

export async function login(email, password) {
  return request('/auth/login', { method: 'POST', body: { email, password } })
}

export async function signup(email, password) {
  return request('/auth/signup', { method: 'POST', body: {email, password} })
}

export async function logout() {
  return request('/auth/logout', { method: 'POST' })
}

export async function getNotes() {
  return request('/notes')
}

export async function createNote() {
  return request('/notes', { method: 'POST', body: {} })
}

export async function updateNote(id, fields) {
  return request(`/notes/${id}`, { method: 'PATCH', body: fields })
}

export async function deleteNote(id) {
  return request(`/notes/${id}`, { method: 'DELETE' })
}
