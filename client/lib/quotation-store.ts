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

export function loadQuotations(): Quotation[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) as Quotation[] : []
  } catch {
    return []
  }
}

export function saveQuotation(q: Quotation) {
  if (typeof localStorage === 'undefined') return
  const all = loadQuotations()
  const idx = all.findIndex(i => i.id === q.id)
  if (idx >= 0) all[idx] = q
  else all.push(q)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function getQuotation(id: string): Quotation | undefined {
  return loadQuotations().find(q => q.id === id)
}

