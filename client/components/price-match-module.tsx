"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { priceMatch } from "@/lib/api"
import { useApiKeys } from "@/contexts/api-keys-context"

interface MatchResult {
  inputDescription: string
  quantity: number
  matches: { description: string; unitRate: number; confidence: number }[]
}

export function PriceMatchModule() {
  const { openaiKey, cohereKey, geminiKey } = useApiKeys()
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<MatchResult[] | null>(null)
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
      setResults(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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
                {results.map((r, idx) => (
                  <tr key={idx} className="text-gray-300 border-t border-white/10">
                    <td className="px-2 py-1">{r.inputDescription}</td>
                    <td className="px-2 py-1">{r.quantity}</td>
                    <td className="px-2 py-1">{r.matches[0]?.description}</td>
                    <td className="px-2 py-1">{r.matches[0]?.unitRate}</td>
                    <td className="px-2 py-1">{r.matches[0]?.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
