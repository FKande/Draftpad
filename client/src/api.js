const BASE = import.meta.env.VITE_API_URL

async function request(path, options = {}) {

  const res = await fetch(`${BASE}${path}`, {
    method: options.method || 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : {},
    credentials: 'include',
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = await res.json()

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

export async function logout() {
  return request('/auth/logout', { method: 'POST' })
}