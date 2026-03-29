"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Repeat2,
  FileText,
  BookMarked,
  LogOut,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/practice", label: "リピーティング", icon: Repeat2 },
  { href: "/texts", label: "テキスト", icon: FileText },
  { href: "/list", label: "文法・フレーズ", icon: BookMarked },
]

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/"
  if (href === "/practice") {
    return pathname === "/practice" || pathname.startsWith("/repeating")
  }
  if (href === "/list") {
    return (
      pathname === "/list" ||
      pathname === "/grammar" ||
      pathname === "/expressions"
    )
  }
  if (href === "/texts") {
    return pathname === "/texts" || pathname === "/lessons" || pathname === "/add"
  }
  return pathname.startsWith(href)
}

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <nav className="flex h-screen w-56 flex-col border-r bg-card px-3 py-5">
      <div className="mb-7 px-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-1.5">
            <Repeat2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">NativeGo</h1>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(href, pathname)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="mt-auto flex items-center gap-2 justify-start text-muted-foreground"
      >
        <LogOut className="h-4 w-4" />
        ログアウト
      </Button>
    </nav>
  )
}
