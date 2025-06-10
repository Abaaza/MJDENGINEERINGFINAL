"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { priceMatch, searchPriceItems, PriceItem } from "@/lib/api"
import { useApiKeys } from "@/contexts/api-keys-context"
import { SearchInput } from "@/components/ui/search-input"

interface MatchResult {
  inputDescription: string
  quantity: number
  matches: { description: string; unitRate: number; confidence: number; engine?: string; code?: string; unit?: string }[]
}

interface Row extends MatchResult {
  selected: number | 'manual'
  searchResults: PriceItem[]
}

export function PriceMatchModule() {
  const { openaiKey, cohereKey, geminiKey } = useApiKeys()
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<Row[] | null>(null)
  const [loading, setLoading] = useState(false)
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const runMatch = async () => {
    if (!file) return
    setLoading(true)
    try {
      const data = await priceMatch(file, { openaiKey, cohereKey, geminiKey })
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
      const items = await searchPriceItems(q)
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

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Price Match</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" accept=".xlsx,.xls" onChange={handleFile} />
        <Button onClick={runMatch} disabled={!file || loading} className="bg-gradient-to-r from-[#00D4FF] to-[#00FF88] text-black font-semibold">
          {loading ? "Matching..." : "Start Matching"}
        </Button>
        {results && (
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm text-left mt-4">
              <thead>
                <tr className="text-white">
                  <th className="px-2 py-1">Description</th>
                  <th className="px-2 py-1">Qty</th>
                  <th className="px-2 py-1">Match</th>
                  <th className="px-2 py-1">Rate</th>
                  <th className="px-2 py-1">Conf.</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => {
                  const sel = typeof r.selected === 'number' ? r.matches[r.selected] : null
                  return (
                    <tr key={idx} className="text-gray-300 border-t border-white/10 align-top">
                      <td className="px-2 py-1 w-48">{r.inputDescription}</td>
                      <td className="px-2 py-1">{r.quantity}</td>
                      <td className="px-2 py-1">
                        <select
                          className="bg-white/5 border-white/20 text-white text-xs"
                          value={typeof r.selected === 'number' ? String(r.selected) : 'manual'}
                          onChange={e => handleSelect(idx, e.target.value)}
                        >
                          {r.matches.map((m, i) => (
                            <option key={i} value={i}>
                              {m.description}
                            </option>
                          ))}
                          <option value="manual">Manual search...</option>
                        </select>
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
                      <td className="px-2 py-1">{sel?.unitRate ?? ''}</td>
                      <td className="px-2 py-1">{sel?.confidence ?? ''}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
