"use client"

import { useDreamStore } from "@/lib/store"
import { Wifi, WifiOff } from "lucide-react"
import Image from "next/image"

export function Header() {
  const user = useDreamStore((state) => state.user)
  const isConnected = useDreamStore((state) => state.isConnected)

  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass-strong border-b border-border/50 z-50 shadow-2xl">
      <div className="flex items-center justify-between h-full px-8">
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/30 p-2">
            <Image src="/logo.png" alt="Dream Loader" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text tracking-wide">DREAM LOADER</h1>
            <p className="text-[10px] text-muted-foreground tracking-wider">v2.0.0 • POWERED BY LOCKENCE</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-6">
            <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2">
              {isConnected ? (
                <>
                  <div className="relative">
                    <Wifi className="w-4 h-4 text-success" />
                    <div className="absolute inset-0 animate-ping">
                      <Wifi className="w-4 h-4 text-success opacity-30" />
                    </div>
                  </div>
                  <span className="text-xs text-success font-medium">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-error" />
                  <span className="text-xs text-error font-medium">Disconnected</span>
                </>
              )}
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-foreground tracking-wide">{user.licenseType} License</p>
              <p className="text-xs text-muted-foreground">
                {user.maxUses ? `${user.currentUses}/${user.maxUses} uses` : `${user.currentUses || 0} uses`}
              </p>
            </div>

            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/40">
              <span className="text-base font-bold tracking-tight">{user.licenseType.slice(0, 2)}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
