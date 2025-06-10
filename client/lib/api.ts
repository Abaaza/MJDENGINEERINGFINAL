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