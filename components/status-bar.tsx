"use client"

import { useDreamStore } from "@/lib/store"

export function StatusBar() {
  const isConnected = useDreamStore((state) => state.isConnected)
  const user = useDreamStore((state) => state.user)

  const licensePrefix = user?.licenseKey.split("-")[0].toUpperCase() || "UNKNOWN"

  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-surface border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-success" : "bg-error"} animate-pulse`} />
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-primary">●</span>
            <span>License: {licensePrefix}</span>
          </div>
        )}
      </div>
    </div>
  )
}
