import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { grammarId, grammarName, speechText } = await request.json()

  const prompt = `あなたは英会話コーチです。学習者の英語スピーチを以下の5観点で採点し、英会話力を伸ばすための励ましコメントを日本語で作成してください。

## 採点観点（各5点満点）
1. 画像の描写度（画像の内容をどれだけ説明できているか）
2. 推奨文法の使用（「${grammarName}」を自然に使えているか）
3. 表現の豊かさ（多彩な語彙・表現を使えているか）
4. 流暢さ・話した量（十分な量を詰まらずに話せたか）
5. 全体の自然さ（ネイティブに伝わる英語か）

## コメントの書き方（重要）
目的は厳しく採点することではなく、学習者の英会話力を向上させることです。以下の構成で100〜150文字の日本語コメントを作成してください。

1. 【グッドポイント】スピーチで使えていた自然な表現や良い点を1つ具体的に挙げて褒める
   例：「"I can see that..." という表現が自然でグッドです！」
2. 【アップグレード提案】より自然・豊かになる代替表現や追加フレーズを1つ具体例で提案する
   例：「"looks like" の代わりに "seems to be" を使うとよりフォーマルで自然になります」
3. 【文法使用について】「${grammarName}」の使い方に対して具体的なポジティブフィードバック

スピーチが空・短い場合は「次回はぜひ声に出してみましょう！」のように励ます。

## 返答形式
以下のJSON形式のみで返してください（他のテキストは不要）：
{"scores":[4,3,4,3,5],"total":4,"comment":"..."}

文法名：${grammarName}
スピーチ：${speechText || "(no speech detected)"}`

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== "text") {
    return NextResponse.json({ error: "Unexpected response" }, { status: 500 })
  }

  const raw = content.text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim()
  let evaluation: { scores: number[]; total: number; comment: string }
  try {
    evaluation = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "Failed to parse evaluation" }, { status: 500 })
  }

  // Save speaking log
  const { data: log, error: logError } = await supabase
    .from("speaking_logs")
    .insert({
      user_id: user.id,
      grammar_id: grammarId,
      speech_text: speechText ?? "",
      scores: evaluation.scores,
      total_score: evaluation.total,
      comment: evaluation.comment,
    })
    .select("id")
    .single()

  if (logError) return NextResponse.json({ error: logError.message }, { status: 500 })

  // Check done: 3+ speaking logs for this grammar → mark 習得済み
  const { count } = await supabase
    .from("speaking_logs")
    .select("id", { count: "exact", head: true })
    .eq("grammar_id", grammarId)
    .eq("user_id", user.id)

  if ((count ?? 0) >= 3) {
    await supabase.from("grammar").update({ play_count: 10 }).eq("id", grammarId)
  }

  // Update practice_logs speaking_count
  const today = new Date().toISOString().split("T")[0]
  const { data: existingLog } = await supabase
    .from("practice_logs")
    .select("grammar_done_count, expression_done_count, speaking_count")
    .eq("practiced_at", today)
    .maybeSingle()

  await supabase.from("practice_logs").upsert(
    {
      practiced_at: today,
      grammar_done_count: existingLog?.grammar_done_count ?? 0,
      expression_done_count: existingLog?.expression_done_count ?? 0,
      speaking_count: (existingLog?.speaking_count ?? 0) + 1,
    },
    { onConflict: "practiced_at" }
  )

  return NextResponse.json({
    logId: log.id,
    scores: evaluation.scores,
    total: evaluation.total,
    comment: evaluation.comment,
  })
}
