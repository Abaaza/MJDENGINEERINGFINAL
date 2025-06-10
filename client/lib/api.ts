export interface Project {
  id: string
  client: string
  type: string
  due: string
  status: string
  value?: number
}

const base = process.env.NEXT_PUBLIC_API_URL ?? ''

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${base}/api/projects`)
  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status}`)
  }
  return res.json()
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) {
    throw new Error('Login failed')
  }
  return res.json()
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${base}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  if (!res.ok) {
    throw new Error('Registration failed')
  }
  return res.json()
}

export async function priceMatch(file: File, keys: {openaiKey?:string; cohereKey?:string; geminiKey?:string}) {
  const form = new FormData()
  form.append('file', file)
  if (keys.openaiKey) form.append('openaiKey', keys.openaiKey)
  if (keys.cohereKey) form.append('cohereKey', keys.cohereKey)
  if (keys.geminiKey) form.append('geminiKey', keys.geminiKey)
  const res = await fetch(`${base}/api/match`, { method: 'POST', body: form })
  if (!res.ok) {
    throw new Error('Price match failed')
  }
  return res.json()
}

export async function updateProfile(name: string, token: string) {
  const res = await fetch(`${base}/api/auth/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error('Update failed')
  return res.json()
}

export async function changePassword(currentPassword: string, newPassword: string, token: string) {
  const res = await fetch(`${base}/api/auth/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  if (!res.ok) throw new Error('Password update failed')
  return res.json()
}