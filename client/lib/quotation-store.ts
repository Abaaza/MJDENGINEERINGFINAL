export interface QuotationItem {
  id: number
  description: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
}

export interface Quotation {
  id: string
  client: string
  project: string
  value: number
  status: string
  date: string
  items: QuotationItem[]
}

const KEY = 'quotations'
const base = process.env.NEXT_PUBLIC_API_URL ?? ''

export async function loadQuotations(): Promise<Quotation[]> {
  try {
    const res = await fetch(`${base}/api/quotations`, { cache: 'no-store' })
    if (res.ok) return (await res.json()) as Quotation[]
  } catch {
    // ignore network errors
  }
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Quotation[]) : []
  } catch {
    return []
  }
}

export async function saveQuotation(q: Quotation) {
  try {
    await fetch(`${base}/api/quotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(q),
    })
  } catch {
    // ignore network errors
  }
  if (typeof localStorage === 'undefined') return
  const all = await loadQuotations()
  const idx = all.findIndex(i => i.id === q.id)
  if (idx >= 0) all[idx] = q
  else all.push(q)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export async function getQuotation(id: string): Promise<Quotation | undefined> {
  try {
    const res = await fetch(`${base}/api/quotations/${id}`, { cache: 'no-store' })
    if (res.ok) return (await res.json()) as Quotation
  } catch {
    // ignore
  }
  const all = await loadQuotations()
  return all.find(q => q.id === id)
}

