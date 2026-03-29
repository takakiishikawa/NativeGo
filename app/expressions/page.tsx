"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Dialog } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Expression } from "@/lib/types"
import { Star } from "lucide-react"

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
        />
      ))}
    </span>
  )
}

export default function ExpressionsPage() {
  const supabase = createClient()
  const [items, setItems] = useState<Expression[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<"all" | "try" | "done">("all")
  const [freqFilter, setFreqFilter] = useState<"all" | "3" | "4" | "5">("all")
  const [selected, setSelected] = useState<Expression | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("expressions")
        .select("*")
        .order("created_at", { ascending: false })
      setItems(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = items.filter((item) => {
    const isDone = item.play_count >= 10
    if (statusFilter === "try" && isDone) return false
    if (statusFilter === "done" && !isDone) return false
    if (freqFilter !== "all" && item.frequency < parseInt(freqFilter)) return false
    return true
  })

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">読み込み中...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">表現一覧</h1>
        <p className="text-muted-foreground mt-1">全 {items.length} 件</p>
      </div>

      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="try">練習中</SelectItem>
            <SelectItem value="done">習得済み</SelectItem>
          </SelectContent>
        </Select>

        <Select value={freqFilter} onValueChange={(v) => setFreqFilter(v as typeof freqFilter)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="使用頻度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全頻度</SelectItem>
            <SelectItem value="3">★3以上</SelectItem>
            <SelectItem value="4">★4以上</SelectItem>
            <SelectItem value="5">★5のみ</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground self-center">
          {filtered.length} 件表示
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>種別</TableHead>
            <TableHead>表現</TableHead>
            <TableHead>意味</TableHead>
            <TableHead>頻度</TableHead>
            <TableHead>回数</TableHead>
            <TableHead>ステータス</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelected(item)}
            >
              <TableCell>
                <Badge variant="outline">{item.category}</Badge>
              </TableCell>
              <TableCell className="font-medium">{item.expression}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{item.meaning}</TableCell>
              <TableCell>
                <StarRating value={item.frequency} />
              </TableCell>
              <TableCell className="text-sm">{item.play_count} / 10</TableCell>
              <TableCell>
                {item.play_count >= 10 ? (
                  <Badge variant="outline" className="text-green-600 border-green-300">習得済み</Badge>
                ) : (
                  <Badge>練習中</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selected && (
        <Dialog open={!!selected} onClose={() => setSelected(null)} title={selected.expression}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{selected.category}</Badge>
              <span className="text-sm text-muted-foreground whitespace-pre-line">{selected.meaning}</span>
            </div>
            {selected.usage_scene && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">使用場面</p>
                <p className="text-sm text-muted-foreground">{selected.usage_scene}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">会話例</p>
              <div className="space-y-2">
                {selected.conversation.split("\n").filter(Boolean).map((line, i) => {
                  const isA = line.startsWith("A:")
                  return (
                    <div
                      key={i}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        isA ? "bg-blue-50 text-blue-900" : "bg-amber-50 text-amber-900"
                      }`}
                    >
                      {line}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">頻度</span>
                <StarRating value={selected.frequency} />
              </div>
              <span className="text-xs text-muted-foreground">練習回数: {selected.play_count} / 10</span>
              <Badge
                variant={selected.play_count >= 10 ? "outline" : "default"}
                className={selected.play_count >= 10 ? "text-green-600 border-green-300" : ""}
              >
                {selected.play_count >= 10 ? "習得済み" : "練習中"}
              </Badge>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  )
}
