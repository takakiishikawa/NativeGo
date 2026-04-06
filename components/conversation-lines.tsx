export function ConversationLines({
  lines,
  currentLine,
}: {
  lines: string[]
  currentLine: number
}) {
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const isA = line.startsWith("A:")
        const isActive = i === currentLine
        const text = line.replace(/^[AB]:\s*/, "")
        const speaker = isA ? "A" : "B"

        return (
          <div key={i} className={`flex items-end gap-2.5 ${isA ? "" : "flex-row-reverse"}`}>
            <div
              className={`
                shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${isA
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"}
              `}
            >
              {speaker}
            </div>
            <div
              className={[
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-base leading-relaxed transition-all duration-200",
                isA ? "rounded-bl-sm" : "rounded-br-sm",
                isActive
                  ? isA
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-emerald-500 text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
              ].join(" ")}
            >
              {text}
            </div>
          </div>
        )
      })}
    </div>
  )
}
