"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDreamStore } from "@/lib/store"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated } = useDreamStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      router.push("/cheats")
    }
  }, [isAuthenticated, router])

  return null
}
