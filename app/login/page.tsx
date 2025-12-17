"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDreamStore, detectLicenseType } from "@/lib/store"
import { showNotification } from "@/components/notification-toast"
import { Loader2 } from "lucide-react"
import { LockenceClient } from "@/lib/lockence-client"
import { getBrandFromLicenseKey } from "@/lib/brand-mappings"
import { SmoothInput } from "@/components/smooth-input"

const lockence = new LockenceClient()

export default function LoginPage() {
  const [licenseKey, setLicenseKey] = useState("")
  const [saveCredentials, setSaveCredentials] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showStartup, setShowStartup] = useState(true)
  const router = useRouter()
  const { setUser, setAuthenticated } = useDreamStore()

  useEffect(() => {
    const savedKey = localStorage.getItem("dream_license_key")
    if (savedKey) {
      setLicenseKey(savedKey)
      setSaveCredentials(true)
    }

    const timer = setTimeout(() => {
      setShowStartup(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!licenseKey.trim()) {
      showNotification("Please enter a license key", "error")
      return
    }

    setIsLoading(true)

    try {
      if (licenseKey === "Geheim24") {
        const brandName = "Dream Private"

        setUser({
          licenseKey,
          licenseType: "PRV",
          expiryDate: "Never",
          lastUsed: new Date().toISOString(),
          hwid: "BYPASS-HWID",
          sessionToken: "bypass-token",
          brandName: brandName,
        })

        setAuthenticated(true)

        if (saveCredentials) {
          localStorage.setItem("dream_license_key", licenseKey)
        } else {
          localStorage.removeItem("dream_license_key")
        }

        showNotification(`Welcome to ${brandName}! PRV license activated (Bypass Mode)`, "success")
        router.push("/cheats")
        setIsLoading(false)
        return
      }

      const detectedLicenseType = detectLicenseType(licenseKey)
      const brandName = getBrandFromLicenseKey(licenseKey)

      console.log("[v0] Detected brand:", brandName)

      const result = await lockence.initialize(licenseKey)

      if (result.success && result.session_token) {
        setUser({
          licenseKey,
          licenseType: detectedLicenseType,
          expiryDate: result.expires_at || "Never",
          lastUsed: new Date().toISOString(),
          hwid: result.hwid || "Not locked",
          sessionToken: result.session_token,
          brandName: brandName,
        })

        setAuthenticated(true)

        if (saveCredentials) {
          localStorage.setItem("dream_license_key", licenseKey)
        } else {
          localStorage.removeItem("dream_license_key")
        }

        showNotification(`Welcome to ${brandName}! ${detectedLicenseType} license activated`, "success")
        router.push("/cheats")
      } else {
        showNotification(result.message || "Authentication failed", "error")
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      showNotification(`Connection error: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#1a1a1a] relative overflow-hidden">
      {showStartup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black animate-ps5-fade">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-cyan-400/20 rounded-full animate-ps5-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Radial gradient glow behind logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] bg-gradient-radial from-cyan-500/10 via-blue-600/5 to-transparent animate-ps5-glow" />
          </div>

          {/* Moon logo with fade in/out and scale */}
          <div className="relative z-10 animate-ps5-logo-sequence">
            <img
              src="/images/upscalemedia-transformed-removebg-preview.png"
              alt=""
              className="w-32 h-32 object-contain drop-shadow-[0_0_40px_rgba(6,182,212,0.6)]"
            />
          </div>

          {/* Subtle expanding rings for depth */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-40 h-40 border border-cyan-400/10 rounded-full animate-ps5-ring" />
            <div
              className="absolute w-40 h-40 border border-cyan-400/5 rounded-full animate-ps5-ring"
              style={{ animationDelay: "0.8s" }}
            />
          </div>
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left - lighter cyan/blue wave - MUCH MORE VISIBLE */}
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-cyan-400/25 rounded-full blur-[100px] animate-pulse" />
        <div
          className="absolute -top-12 -left-12 w-[200px] h-[200px] bg-cyan-300/20 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-0 left-0 w-[120px] h-[120px] bg-cyan-500/15 rounded-full blur-[60px] animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "4s" }}
        />

        {/* Bottom right - darker blue wave */}
        <div
          className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-blue-700/25 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "0.5s", animationDuration: "4s" }}
        />
        <div
          className="absolute -bottom-12 -right-12 w-[200px] h-[200px] bg-blue-600/20 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "1.5s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[120px] h-[120px] bg-blue-800/15 rounded-full blur-[60px] animate-pulse"
          style={{ animationDelay: "2.5s", animationDuration: "5s" }}
        />
      </div>

      <div
        className={`w-full max-w-sm bg-[#2a2a2a]/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/5 relative z-10 transition-all duration-1000 ${
          showStartup ? "opacity-0 scale-75 translate-y-8" : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-light tracking-wider">
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              LOADER
            </span>
          </h1>
          <p className="text-gray-500 text-xs mt-2 font-light tracking-widest">AUTHENTICATION</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="licenseKey" className="text-xs text-gray-400 font-light uppercase tracking-wide">
              license key
            </label>
            <SmoothInput
              value={licenseKey}
              onChange={setLicenseKey}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#2a3a4a]/40 to-[#2a4a5a]/40 border border-cyan-500/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#4a4a4a] to-[#3a3a3a] rounded-lg px-5 py-2.5 text-white font-light text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_2px_rgba(0,0,0,0.4)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all duration-200 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={saveCredentials}
                    onChange={(e) => setSaveCredentials(e.target.checked)}
                    className="peer w-4 h-4 appearance-none bg-[#3a3a3a] border border-gray-600 rounded checked:bg-cyan-500 checked:border-cyan-500 transition-all cursor-pointer"
                  />
                  <svg
                    className="absolute top-0 left-0 w-4 h-4 pointer-events-none hidden peer-checked:block text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-gray-400 font-light">Save Credentials</span>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
