"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDreamStore } from "@/lib/store"
import { loadCheat } from "@/lib/ipc"
import { showNotification } from "@/components/notification-toast"
import { LoadingModal } from "@/components/loading-modal"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function CheatsPage() {
  const router = useRouter()
  const { isAuthenticated, user, products } = useDreamStore()
  const [loading, setLoading] = useState(false)
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingText, setLoadingText] = useState("Loading Dependencies...")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const licenseType = user?.licenseKey.split("-")[0].toUpperCase()
  let product = products.find((p) => p.id === "prv-cheat") // Default to Fortnite

  if (licenseType === "FVM") {
    product = products.find((p) => p.id === "fvm-cheat")
  } else if (licenseType === "PRV") {
    product = products.find((p) => p.id === "prv-cheat")
  }

  if (!product) return null

  const brandName = user?.brandName || "Unknown Brand"
  const isDreamPrivate = user?.licenseKey.toUpperCase().startsWith("PRV-")
  const isDreamFiveM = user?.licenseKey.toUpperCase().startsWith("FVM-")
  const isDreamProduct = isDreamPrivate || isDreamFiveM
  const productDisplayName = isDreamProduct ? (isDreamFiveM ? "Dream FiveM" : "Dream Private") : `${brandName}`

  const licensePrefix = user?.licenseKey.split("-")[0].toLowerCase() || ""
  const titleBrandName = isDreamPrivate ? "dream" : isDreamFiveM ? "fivem" : licensePrefix

  const updateHistory =
    product.id === "fvm-cheat"
      ? [
          { version: "Added FiveM Cheat", date: "Last updated at: 12/17/2025", status: "active" },
          { version: "Updated User Interface", date: "Last updated at: 12/15/2025", status: "active" },
        ]
      : [
          { version: "Updated User Interface", date: "Last updated at: 12/15/2025", status: "active" },
          {
            version: "Updated to latest Fortnite Patch (39.10)",
            date: "Last updated at: 12/12/2025",
            status: "active",
          },
        ]

  const handleLoadProduct = async () => {
    setLoading(true)
    setShowLoadingModal(true)
    setLoadingText("Loading Dependencies...")

    setTimeout(() => setLoadingText("Preparing Environment..."), 1300)
    setTimeout(() => setLoadingText("Injecting Product..."), 2600)

    setTimeout(() => {
      loadCheat(product.id, product.downloadPath, product.executable, user?.licenseKey, user?.brandName)
    }, 4000)

    setTimeout(() => {
      setLoading(false)
      setShowLoadingModal(false)
      showNotification(`${product.name} injected successfully`, "success")
    }, 4500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e90ff] via-[#4169e1] to-[#1e3a8a] flex items-stretch relative overflow-hidden">
      <LoadingModal isOpen={showLoadingModal} loadingText={loadingText} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left - lighter cyan/blue wave */}
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-cyan-300/30 rounded-full blur-[100px] animate-pulse" />
        <div
          className="absolute -top-12 -left-12 w-[200px] h-[200px] bg-cyan-200/25 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-0 left-0 w-[120px] h-[120px] bg-cyan-400/20 rounded-full blur-[60px] animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "4s" }}
        />

        {/* Bottom right - darker blue wave */}
        <div
          className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-blue-800/30 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "0.5s", animationDuration: "4s" }}
        />
        <div
          className="absolute -bottom-12 -right-12 w-[200px] h-[200px] bg-blue-700/25 rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "1.5s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[120px] h-[120px] bg-blue-900/20 rounded-full blur-[60px] animate-pulse"
          style={{ animationDelay: "2.5s", animationDuration: "5s" }}
        />
      </div>

      <div className="w-full bg-[#3a3a3a] shadow-2xl overflow-hidden animate-scale-in flex relative z-10">
        {/* Left Panel */}
        <div className="w-[45%] p-8 border-r border-[#4a4a4a] flex flex-col animate-fade-slide-in-left">
          <div className="mb-8">
            <h1 className="text-4xl font-light">
              <span className="text-white font-normal">{titleBrandName}</span>
              <span className="ml-2 font-normal bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                loader
              </span>
            </h1>
          </div>

          {/* Information Section */}
          <div className="mb-8 animate-fade-slide-in-up stagger-1">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-4">Information</h2>

            <div className="flex items-start gap-4 mb-6 hover:scale-[1.02] transition-transform duration-300">
              {isDreamProduct ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300">
                  <Image src="/logo.png" alt="Profile" width={64} height={64} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300">
                  <span className="text-2xl text-cyan-400 font-bold">{brandName.charAt(0).toUpperCase()}</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold mb-1">{user.role}</div>
                <div className="text-sm text-gray-400 truncate mb-1">
                  Username: {user.licenseKey.substring(0, 15)}...
                </div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <span className="status-dot-active" />
                  Remains Active
                </div>
                <div className="text-xs text-gray-500">Last launch: Recently</div>
              </div>
            </div>
          </div>

          {/* Version Section - Single Product */}
          <div className="flex-1 animate-fade-slide-in-up stagger-2">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-4">Version</h2>

            <button
              onClick={handleLoadProduct}
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-br from-[#2d2d2d] via-[#3a3a3a] to-[#2d2d2d] text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 border border-[#4a4a4a] shadow-lg hover:shadow-2xl hover:border-[#5a5a5a] hover:scale-[1.02] active:scale-[0.98] group ripple"
              style={{
                boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              {/* Glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />

              {/* Animated gradient flow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />

              <span className="relative z-10 flex items-center gap-2 font-medium">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load"
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Right Panel - Updates */}
        <div className="w-[55%] p-8 flex flex-col animate-fade-slide-in">
          <h2 className="text-sm text-gray-300 mb-4">Last Updates:</h2>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-3">
              {updateHistory.map((update, index) => (
                <div
                  key={index}
                  className={`bg-[#2a2a2a] rounded-lg p-4 border border-[#4a4a4a] hover:border-[#5a5a5a] hover:bg-[#2d2d2d] transition-all duration-300 group hover:scale-[1.02] cursor-pointer animate-fade-slide-in-up stagger-${index + 1}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="status-dot-active" />
                      <span className="text-sm text-white font-medium">{update.version}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{update.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2a2a2a;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a4a4a;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5a5a5a;
        }
      `}</style>
    </div>
  )
}
