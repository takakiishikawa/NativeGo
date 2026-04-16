"use client"

import { useRouter } from "next/navigation"
import { BookOpen, MessageSquare, ChevronRight } from "lucide-react"

function PracticeCard({
  onClick,
  icon,
  iconBg,
  iconColor,
  title,
  description,
}: {
  onClick: () => void
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  title: string
  description: string
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex items-center gap-4 rounded-[12px] border border-[var(--border-subtle,rgba(0,0,0,0.08))] bg-card px-5 py-4 hover:border-[var(--border-default,rgba(0,0,0,0.12))] hover:shadow-sm transition-all"
    >
      <div className={`rounded-[8px] p-2.5 shrink-0 ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-medium text-foreground">{title}</p>
        <p className="text-[13px] text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
    </button>
  )
}

export default function PracticePage() {
  const router = useRouter()

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-[22px] font-medium">リピーティング</h1>
        <p className="text-sm text-muted-foreground mt-1">練習するカテゴリを選んでください</p>
      </div>

      <div className="space-y-2">
        <PracticeCard
          onClick={() => router.push("/repeating/grammar")}
          icon={<BookOpen className="h-5 w-5" />}
          iconBg="bg-accent"
          iconColor="text-primary"
          title="文法練習"
          description="文法パターンをリピーティングで練習します"
        />
        <PracticeCard
          onClick={() => router.push("/repeating/expression")}
          icon={<MessageSquare className="h-5 w-5" />}
          iconBg="bg-[#F0FDFA] dark:bg-[#0D9488]/10"
          iconColor="text-[#0D9488] dark:text-[#14B8A6]"
          title="フレーズ練習"
          description="フレーズを会話形式で練習します"
        />
      </div>
    </div>
  )
}
