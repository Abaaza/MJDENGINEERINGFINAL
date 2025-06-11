"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getPriceItems, searchPriceItems, updatePriceItem, PriceItem } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface PriceItemExt extends PriceItem {
  category?: string
  subCategory?: string
  keywords?: string[]
  phrases?: string[]
  ref?: string
}

export function PriceListModule() {
  const [items, setItems] = useState<PriceItemExt[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Record<string, Partial<PriceItemExt>>>({})
  const { token } = useAuth()

  const load = async (term: string) => {
    setLoading(true)
    try {
      if (!token) return
      const data = term
        ? await searchPriceItems(term, token)
        : await getPriceItems(token)
      const normalized = (data as PriceItemExt[]).map(it => ({
        ...it,
        _id: (it as any)._id ? (it as any)._id.toString() : undefined,
      }))
      setItems(normalized)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(search)
  }, [search, token])

  const handleChange = (id: string, field: keyof PriceItemExt, value: any) => {
    setEditing(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const handleSave = async (id: string) => {
    const upd = editing[id]
    if (!upd) return
    if (!token) return
    const updates: any = { ...upd }
    if (typeof updates.keywords === "string") {
      updates.keywords = updates.keywords
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    }
    if (typeof updates.phrases === "string") {
      updates.phrases = updates.phrases
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    }
    try {
      const updated = await updatePriceItem(id, updates, token)
      setItems(itms => itms.map(it => (it._id === id ? (updated as PriceItemExt) : it)))
      setEditing(prev => {
        const { [id]: _, ...rest } = prev
        return rest
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleSaveAll = async () => {
    const ids = Object.keys(editing)
    for (const id of ids) {
      await handleSave(id)
    }
  }

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Price List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-sm bg-white/5 border-white/10 focus:border-[#00D4FF] focus:ring-[#00D4FF]/20"
          />
          <Button
            size="sm"
            onClick={handleSaveAll}
            disabled={Object.keys(editing).length === 0}
            className="bg-[#00D4FF]/20 hover:bg-[#00D4FF]/30 text-[#00D4FF] border-[#00D4FF]/30 ripple"
          >
            Save All
          </Button>
        </div>
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="overflow-auto max-h-[70vh]">
            <Table className="min-w-full text-xs">
              <TableHeader>
                <TableRow className="text-white">
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Keywords</TableHead>
                  <TableHead>Phrases</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => {
                  const values = editing[item._id ?? ""] || {}
                  return (
                    <TableRow key={item._id} className="border-b border-white/10">
                      <TableCell>
                        <Input
                          className="bg-white/5 border-white/10"
                          value={values.description ?? item.description}
                          onChange={e => handleChange(item._id!, "description", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="bg-white/5 border-white/10"
                          value={values.category ?? item.category ?? ""}
                          onChange={e => handleChange(item._id!, "category", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="bg-white/5 border-white/10"
                          value={values.subCategory ?? item.subCategory ?? ""}
                          onChange={e => handleChange(item._id!, "subCategory", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="bg-white/5 border-white/10"
                          value={values.unit ?? item.unit ?? ""}
                          onChange={e => handleChange(item._id!, "unit", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="bg-white/5 border-white/10"
                          value={values.rate ?? item.rate ?? ""}
                          onChange={e => handleChange(item._id!, "rate", parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="bg-white/5 border-white/10"
                          value={values.keywords ?? (item.keywords || []).join(", ")}
                          onChange={e => handleChange(item._id!, "keywords", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="bg-white/5 border-white/10"
                          value={values.phrases ?? (item.phrases || []).join(", ")}
                          onChange={e => handleChange(item._id!, "phrases", e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleSave(item._id!)} className="bg-[#00D4FF]/20 hover:bg-[#00D4FF]/30 text-[#00D4FF] border-[#00D4FF]/30 ripple">
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
