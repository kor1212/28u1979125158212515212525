"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Grid3x3, LogOut } from "lucide-react"
import { useDreamStore } from "@/lib/store"
import Image from "next/image"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Cheats", href: "/cheats", icon: Grid3x3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useDreamStore()
  const [clickedItem, setClickedItem] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleNavClick = (href: string) => {
    setClickedItem(href)
    setTimeout(() => setClickedItem(null), 200)
    router.push(href)
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[70px] bg-[#0a0a0a] border-r border-[#1a1a1a] z-50 flex flex-col items-center py-6">
      <div className="mb-8 animate-fade-slide-in">
        <div className="w-[48px] h-[48px] rounded-full bg-[#1a1a1a] border border-[#27272a] flex items-center justify-center p-2 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-110 active:scale-95">
          <Image
            src="/logo.png"
            alt="Dream Loader"
            width={32}
            height={32}
            className="object-contain transition-transform duration-300 hover:rotate-12"
          />
        </div>
      </div>

      <nav className="flex-1 flex flex-col items-center gap-3">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const isClicked = clickedItem === item.href

          return (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.href)}
              className={`sidebar-btn w-[48px] h-[48px] rounded-full flex items-center justify-center ripple
                animate-fade-slide-in-left stagger-${index + 1}
                ${isClicked ? "animate-scale-bounce" : ""}
                ${
                  isActive
                    ? "bg-[#1a1a1a] text-cyan-500 border border-cyan-500/40 shadow-lg shadow-cyan-500/25 active"
                    : "text-gray-600 hover:text-gray-300 hover:bg-[#1a1a1a] border border-transparent hover:border-[#27272a]"
                }`}
              title={item.name}
            >
              <Icon
                className={`w-5 h-5 icon-bounce transition-all duration-200 ${isActive ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""}`}
              />
            </button>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="sidebar-btn w-[48px] h-[48px] rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-[#1a1a1a] border border-transparent hover:border-red-500/40 ripple animate-fade-slide-in-left stagger-3 hover:shadow-lg hover:shadow-red-500/20"
      >
        <LogOut className="w-5 h-5 icon-bounce" />
      </button>
    </aside>
  )
}
