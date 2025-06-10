"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { priceMatch, searchPriceItems, PriceItem } from "@/lib/api"
import { saveQuotation } from "@/lib/quotation-store"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useApiKeys } from "@/contexts/api-keys-context"
import { useAuth } from "@/contexts/auth-context"
import { SearchInput } from "@/components/ui/search-input"

interface MatchResult {
  inputDescription: string
  quantity: number
  matches: { description: string; unitRate: number; confidence: number; engine?: string; code?: string; unit?: string }[]
}

interface Row extends MatchResult {
  selected: number | 'manual'
  searchResults: PriceItem[]
  rateOverride?: number
}

export function PriceMatchModule() {
  const { openaiKey, cohereKey, geminiKey } = useApiKeys()
  const { token } = useAuth()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<Row[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const logSrc = useRef<EventSource | null>(null)
  const [discountInput, setDiscountInput] = useState(0)
  const [discount, setDiscount] = useState(0)
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const runMatch = async () => {
    if (!file) return
    if (!token) return
    setLoading(true)
    setLogs([])
    const base = process.env.NEXT_PUBLIC_API_URL ?? ''
    const src = new EventSource(`${base}/api/match/logs`)
    logSrc.current = src
    src.onmessage = (e) => {
      if (e.data === 'DONE') {
        src.close()
        logSrc.current = null
      } else {
        setLogs((prev) => [...prev, e.data])
      }
    }
    try {
      const data = await priceMatch(file, { openaiKey, cohereKey, geminiKey }, token)
      const rows: Row[] = data.map((r: MatchResult) => ({
        ...r,
        selected: r.matches.length ? 0 : 'manual',
        searchResults: []
      }))
      setResults(rows)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      if (logSrc.current) {
        logSrc.current.close()
        logSrc.current = null
      }
    }
  }

  const updateRow = (index: number, updater: (r: Row) => Row) => {
    if (!results) return
    setResults(results.map((r, i) => (i === index ? updater({ ...r }) : r)))
  }

  const handleSelect = (index: number, value: string) => {
    updateRow(index, r => ({ ...r, selected: value === 'manual' ? 'manual' : parseInt(value, 10) }))
  }

  const handleSearch = async (index: number, q: string) => {
    if (!q) {
      updateRow(index, r => ({ ...r, searchResults: [] }))
      return
    }
    try {
      if (!token) return
      const items = await searchPriceItems(q, token)
      updateRow(index, r => ({ ...r, searchResults: items }))
    } catch (err) {
      console.error(err)
    }
  }

  const chooseManual = (rowIndex: number, item: PriceItem) => {
    updateRow(rowIndex, r => {
      const match = {
        engine: 'manual',
        code: item.code,
        description: item.description,
        unit: item.unit,
        unitRate: item.rate ?? 0,
        confidence: 1
      }
      return {
        ...r,
        matches: [...r.matches, match],
        selected: r.matches.length,
        searchResults: []
      }
    })
  }

  const handleSave = () => {
    if (!results) return
    const items = results.map((r, idx) => {
      const sel = typeof r.selected === 'number' ? r.matches[r.selected] : null
      const rate = r.rateOverride ?? sel?.unitRate ?? 0
      return {
        id: idx + 1,
        description: r.inputDescription,
        quantity: r.quantity,
        unit: sel?.unit || '',
        unitPrice: rate,
        total: rate * r.quantity * (1 - discount / 100)
      }
    })
    const value = items.reduce((s, i) => s + i.total, 0)
    const quotation = {
      id: `QT-${Date.now()}`,
      client: 'Unknown Client',
      project: 'Matched Quote',
      value,
      status: 'pending',
      date: new Date().toISOString(),
      items
    }
    saveQuotation(quotation)
    const blob = new Blob([JSON.stringify({ discount, items }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quotation.json'
    a.click()
    URL.revokeObjectURL(url)
    alert(`Quotation saved. Total: ${formatCurrency(value)}`)
    router.push(`/quotations/${quotation.id}`)
  }

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Price Match</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          className="bg-gray-800/20 border-white/10 file:bg-gray-700 file:text-white"
        />
        <Button onClick={runMatch} disabled={!file || loading} className="bg-gradient-to-r from-[#00D4FF] to-[#00FF88] text-black font-semibold">
          {loading ? "Matching..." : "Start Matching"}
        </Button>
        {(loading || logs.length > 0) && (
          <pre className="bg-black/30 text-green-400 p-2 rounded max-h-40 overflow-auto text-xs whitespace-pre-wrap">
            {logs.join("\n")}
          </pre>
        )}
        {results && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-white">Discount %</span>
              <Input
                type="number"
                value={discountInput}
                onChange={e => setDiscountInput(Number(e.target.value))}
                className="w-20 bg-white/5 border-white/20"
              />
              <Button
                size="sm"
                onClick={() => setDiscount(discountInput)}
                className="bg-[#00D4FF]/20 hover:bg-[#00D4FF]/30 text-[#00D4FF] border-[#00D4FF]/30 ripple"
              >
                Apply Discount
              </Button>
            </div>
            <Button onClick={handleSave} size="sm" className="bg-[#00FF88]/20 hover:bg-[#00FF88]/30 text-[#00FF88] border-[#00FF88]/30 ripple">
              Save Quote
            </Button>
          </div>
        )}
        {results && (
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm text-left mt-4">
              <thead>
                <tr className="text-white">
                  <th className="px-2 py-1">Description</th>
                  <th className="px-2 py-1">Match</th>
                  <th className="px-2 py-1">Qty</th>
                  <th className="px-2 py-1">Unit</th>
                  <th className="px-2 py-1">Rate</th>
                  <th className="px-2 py-1">Conf.</th>
                  <th className="px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => {
                  const sel = typeof r.selected === 'number' ? r.matches[r.selected] : null
                  const rate = r.rateOverride ?? sel?.unitRate ?? 0
                  const total = rate * r.quantity * (1 - discount / 100)
                  return (
                    <tr key={idx} className="text-gray-300 border-t border-white/10 align-top">
                      <td className="px-2 py-1 w-48">{r.inputDescription}</td>
                      <td className="px-2 py-1">
                        <RadioGroup
                          className="space-y-1"
                          value={typeof r.selected === 'number' ? String(r.selected) : 'manual'}
                          onValueChange={val => handleSelect(idx, val)}
                        >
                          {r.matches.map((m, i) => (
                            <div key={i} className="flex items-center space-x-1">
                              <RadioGroupItem value={String(i)} id={`sel-${idx}-${i}`} />
                              <label htmlFor={`sel-${idx}-${i}`} className="text-xs">{m.description}</label>
                            </div>
                          ))}
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="manual" id={`sel-${idx}-manual`} />
                            <label htmlFor={`sel-${idx}-manual`} className="text-xs">Manual search...</label>
                          </div>
                        </RadioGroup>
                        {r.selected === 'manual' && (
                          <div className="mt-1 relative">
                            <SearchInput placeholder="Search prices" onChange={q => handleSearch(idx, q)} />
                            {r.searchResults.length > 0 && (
                              <ul className="absolute z-10 bg-black border border-white/20 max-h-40 overflow-auto w-64">
                                {r.searchResults.map(item => (
                                  <li
                                    key={item._id || item.code}
                                    className="px-2 py-1 hover:bg-white/10 cursor-pointer"
                                    onClick={() => chooseManual(idx, item)}
                                  >
                                    {item.description}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          type="number"
                          value={r.quantity}
                          onChange={e =>
                            updateRow(idx, row => ({ ...row, quantity: Number(e.target.value) }))
                          }
                          className="bg-white/5 border-white/10 w-20"
                        />
                      </td>
                      <td className="px-2 py-1">{sel?.unit || ''}</td>
                      <td className="px-2 py-1">
                        <Input
                          type="number"
                          value={rate}
                          onChange={e =>
                            updateRow(idx, row => ({ ...row, rateOverride: Number(e.target.value) }))
                          }
                          className="bg-white/5 border-white/10 w-24"
                        />
                      </td>
                      <td className="px-2 py-1">{sel?.confidence ?? ''}</td>
                      <td className="px-2 py-1">{rate ? total.toLocaleString() : ''}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/10 text-white">
                  <td colSpan={6} className="text-right px-2 py-1 font-semibold">Total</td>
                  <td className="px-2 py-1 font-semibold">
                    {results.reduce((sum, r) => {
                      const sel = typeof r.selected === 'number' ? r.matches[r.selected] : null
                      const rate = r.rateOverride ?? sel?.unitRate ?? 0
                      return sum + rate * r.quantity * (1 - discount / 100)
                    }, 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
