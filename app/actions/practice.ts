"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function incrementGrammarPlayCount(id: string) {
  const supabase = await createClient()

  const { data: grammar } = await supabase
    .from("grammar")
    .select("play_count")
    .eq("id", id)
    .single()

  if (!grammar) return

  await supabase
    .from("grammar")
    .update({
      play_count: grammar.play_count + 1,
      last_played_at: new Date().toISOString().split("T")[0],
    })
    .eq("id", id)

  await upsertPracticeLog()
  revalidatePath("/repeating/grammar")
  revalidatePath("/")
}

export async function incrementExpressionPlayCount(id: string) {
  const supabase = await createClient()

  const { data: expression } = await supabase
    .from("expressions")
    .select("play_count")
    .eq("id", id)
    .single()

  if (!expression) return

  await supabase
    .from("expressions")
    .update({
      play_count: expression.play_count + 1,
      last_played_at: new Date().toISOString().split("T")[0],
    })
    .eq("id", id)

  await upsertPracticeLog()
  revalidatePath("/repeating/expression")
  revalidatePath("/")
}

export async function upsertPracticeLog() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const [grammarResult, expressionResult] = await Promise.all([
    supabase
      .from("grammar")
      .select("id", { count: "exact", head: true })
      .eq("last_played_at", today),
    supabase
      .from("expressions")
      .select("id", { count: "exact", head: true })
      .eq("last_played_at", today),
  ])

  await supabase.from("practice_logs").upsert(
    {
      practiced_at: today,
      grammar_done_count: grammarResult.count ?? 0,
      expression_done_count: expressionResult.count ?? 0,
    },
    { onConflict: "practiced_at" }
  )
}

export async function saveGrammar(
  grammar: {
    name: string
    summary: string
    detail?: string | null
    examples: string[]
    usage_scene: string
    frequency: number
  }[],
  lessonId?: string
) {
  const supabase = await createClient()

  const rows = grammar.map((g) => ({
    name: g.name,
    summary: g.summary,
    detail: g.detail ?? null,
    examples: g.examples.join("\n"),
    usage_scene: g.usage_scene,
    frequency: g.frequency,
    play_count: 0,
    lesson_id: lessonId ?? null,
  }))

  const { error } = await supabase.from("grammar").insert(rows)
  if (error) throw error
  revalidatePath("/grammar")
  revalidatePath("/list")
  revalidatePath("/texts")
}

export async function saveExpressions(
  expressions: {
    category: string
    expression: string
    meaning: string
    conversation: string[]
    usage_scene: string
    frequency: number
  }[],
  lessonId?: string
) {
  const supabase = await createClient()

  const rows = expressions.map((e) => ({
    category: e.category,
    expression: e.expression,
    meaning: e.meaning,
    conversation: e.conversation.join("\n"),
    usage_scene: e.usage_scene,
    frequency: e.frequency,
    play_count: 0,
    lesson_id: lessonId ?? null,
  }))

  const { error } = await supabase.from("expressions").insert(rows)
  if (error) throw error
  revalidatePath("/expressions")
  revalidatePath("/list")
  revalidatePath("/texts")
}

export async function updateLessonStatus(
  id: string,
  status: "未登録" | "練習中" | "習得済み"
) {
  const supabase = await createClient()
  await supabase.from("lessons").update({ status }).eq("id", id)
  revalidatePath("/lessons")
  revalidatePath("/texts")
}
