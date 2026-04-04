"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  HomeIcon,
  ArrowPathRoundedSquareIcon,
  DocumentTextIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
  LightBulbIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"

const navItems = [
  { href: "/", label: "ホーム", icon: HomeIcon },
  { href: "/practice", label: "リピーティング", icon: ArrowPathRoundedSquareIcon },
  { href: "/texts", label: "テキスト", icon: DocumentTextIcon },
  { href: "/list", label: "文法・フレーズ", icon: BookOpenIcon },
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

function Avatar({ url, name, size = 8 }: { url?: string; name: string; size?: number }) {
  const initials = name.charAt(0).toUpperCase()
  const cls = `h-${size} w-${size} rounded-full shrink-0`
  if (url) {
    return <img src={url} alt={name} className={`${cls} object-cover`} />
  }
  return (
    <div className={`${cls} bg-primary flex items-center justify-center text-white text-xs font-semibold`}>
      {initials}
    </div>
  )
}

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const [displayName, setDisplayName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const [editName, setEditName] = useState("")
  const [editAvatar, setEditAvatar] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      const name = user.user_metadata?.display_name || user.email?.split("@")[0] || "User"
      const avatar = user.user_metadata?.avatar_url || ""
      setDisplayName(name)
      setAvatarUrl(avatar)
    })
  }, [])

  function openProfile() {
    setEditName(displayName)
    setEditAvatar(avatarUrl)
    setProfileOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase.auth.updateUser({
      data: { display_name: editName.trim(), avatar_url: editAvatar.trim() },
    })
    if (!error) {
      setDisplayName(editName.trim() || displayName)
      setAvatarUrl(editAvatar.trim())
      setProfileOpen(false)
    }
    setSaving(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <>
      <nav className="flex h-screen w-[220px] flex-col border-r bg-neutral-100 dark:bg-[#1E293B] px-3 py-5 shrink-0">
        <div className="mb-7 px-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1.5">
              <ArrowPathRoundedSquareIcon className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">NativeGo</h1>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md pr-3 py-2 text-sm font-medium transition-colors border-l-[3px]",
                isActive(href, pathname)
                  ? "bg-blue-50 text-blue-700 border-l-blue-600 pl-[9px] dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-400"
                  : "text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-800 border-l-transparent pl-3 dark:text-neutral-400 dark:hover:bg-neutral-700/50 dark:hover:text-neutral-200"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          ))}
        </div>

        {/* ── Bottom section ── */}
        <div className="mt-auto flex flex-col gap-0.5 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          {/* User profile */}
          <button
            onClick={openProfile}
            className="flex items-center gap-2.5 rounded-md px-2 py-2 w-full text-left hover:bg-neutral-200/60 dark:hover:bg-neutral-700/50 transition-colors group"
          >
            <Avatar url={avatarUrl} name={displayName || "U"} size={7} />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate flex-1 min-w-0">
              {displayName || "—"}
            </span>
            <PencilSquareIcon className="h-3.5 w-3.5 text-neutral-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Concept link */}
          <Link
            href="/concept"
            className={cn(
              "flex items-center gap-3 rounded-md pr-3 py-2 text-sm font-medium transition-colors border-l-[3px]",
              pathname === "/concept"
                ? "bg-blue-50 text-blue-700 border-l-blue-600 pl-[9px] dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-400"
                : "text-neutral-500 hover:bg-neutral-200/60 hover:text-neutral-700 border-l-transparent pl-3 dark:text-neutral-400 dark:hover:bg-neutral-700/50 dark:hover:text-neutral-200"
            )}
          >
            <LightBulbIcon className="h-5 w-5 shrink-0" />
            コンセプト
          </Link>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-2 justify-start text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 px-3"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            ログアウト
          </Button>
        </div>
      </nav>

      {/* Profile edit dialog */}
      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} title="プロフィール編集">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Avatar url={editAvatar} name={editName || "U"} size={10} />
            <div>
              <p className="text-sm font-medium">{editName || "—"}</p>
              <p className="text-xs text-muted-foreground">プレビュー</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">表示名</label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="表示名を入力"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">アイコン画像URL</label>
            <Input
              value={editAvatar}
              onChange={(e) => setEditAvatar(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "保存中..." : "保存"}
          </Button>
        </div>
      </Dialog>
    </>
  )
}
