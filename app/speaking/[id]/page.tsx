import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PracticeClient } from "./practice-client"

export default async function SpeakingPracticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/speaking")

  const [{ data: grammar }, { count: completedCount }] = await Promise.all([
    supabase.from("grammar").select("id, name, summary, image_url").eq("id", id).single(),
    supabase.from("speaking_logs").select("id", { count: "exact", head: true })
      .eq("grammar_id", id).eq("user_id", user.id),
  ])

  if (!grammar || !grammar.image_url) redirect("/speaking")

  return (
    <PracticeClient
      grammarId={grammar.id}
      grammarName={grammar.name}
      grammarSummary={grammar.summary}
      imageUrl={grammar.image_url}
      completedCount={completedCount ?? 0}
    />
  )
}
