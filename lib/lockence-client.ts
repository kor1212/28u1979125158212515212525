import { getOrCreateHWID } from "./hwid"

export interface AuthResponse {
  success: boolean
  message: string
  session_token?: string
  expires_at?: string
  license_key?: string
  username?: string
  email?: string
  hwid?: string
  is_active?: boolean
  metadata?: any
}

export class LockenceClient {
  private sessionToken: string | null = null
  private heartbeatInterval: NodeJS.Timeout | null = null

  constructor() {
    // Restore session from localStorage if exists
    if (typeof window !== "undefined") {
      this.sessionToken = localStorage.getItem("dream_session_token")
      if (this.sessionToken) {
        this.startHeartbeat()
      }
    }
  }

  // Initialize session with license key
  async initialize(licenseKey: string): Promise<AuthResponse> {
    console.log("[v0] LockenceClient.initialize called with key:", licenseKey)
    const hwid = getOrCreateHWID()
    console.log("[v0] Generated HWID:", hwid)

    try {
      console.log("[v0] Sending POST request to /api/auth/init")
      const response = await fetch("/api/auth/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          license_key: licenseKey,
          hwid,
        }),
      })

      console.log("[v0] Response status:", response.status)
      const data: AuthResponse = await response.json()
      console.log("[v0] Response data:", data)

      if (data.success && data.session_token) {
        this.sessionToken = data.session_token
        localStorage.setItem("dream_session_token", data.session_token)
        this.startHeartbeat()
        console.log("[v0] Session initialized successfully")
      } else {
        console.log("[v0] Session initialization failed:", data.message)
      }

      return data
    } catch (error) {
      console.error("[v0] Initialize error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Connection error",
      }
    }
  }

  // Validate current session
  async validate(): Promise<AuthResponse> {
    const sessionToken = this.sessionToken || localStorage.getItem("dream_session_token")

    if (!sessionToken) {
      return { success: false, message: "No session token" }
    }

    try {
      const response = await fetch("/api/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_token: sessionToken,
        }),
      })

      const data: AuthResponse = await response.json()

      if (!data.success) {
        this.logout()
      }

      return data
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Validation error",
      }
    }
  }

  // Logout and end session
  async logout(): Promise<AuthResponse> {
    const sessionToken = this.sessionToken || localStorage.getItem("dream_session_token")

    this.stopHeartbeat()

    if (!sessionToken) {
      return { success: false, message: "No session token" }
    }

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_token: sessionToken,
        }),
      })

      const data: AuthResponse = await response.json()

      this.sessionToken = null
      localStorage.removeItem("dream_session_token")

      return data
    } catch (error) {
      // Clear local session even if API call fails
      this.sessionToken = null
      localStorage.removeItem("dream_session_token")

      return {
        success: false,
        message: error instanceof Error ? error.message : "Logout error",
      }
    }
  }

  // Send heartbeat to keep session alive
  private async sendHeartbeat(): Promise<void> {
    const sessionToken = this.sessionToken || localStorage.getItem("dream_session_token")

    if (!sessionToken) {
      this.stopHeartbeat()
      return
    }

    try {
      const response = await fetch("/api/auth/heartbeat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_token: sessionToken,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        console.error("[v0] Heartbeat failed:", data.message)
        this.stopHeartbeat()
      }
    } catch (error) {
      console.error("[v0] Heartbeat error:", error)
    }
  }

  // Start automatic heartbeat (every 5 minutes)
  private startHeartbeat(): void {
    this.stopHeartbeat() // Clear any existing interval

    this.heartbeatInterval = setInterval(
      () => {
        this.sendHeartbeat()
      },
      5 * 60 * 1000,
    ) // 5 minutes
  }

  // Stop heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // Get current session token
  getSessionToken(): string | null {
    return this.sessionToken || localStorage.getItem("dream_session_token")
  }
}
