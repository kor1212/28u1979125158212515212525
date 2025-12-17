"use client"

interface LoadingModalProps {
  isOpen: boolean
  loadingText: string
}

export function LoadingModal({ isOpen, loadingText }: LoadingModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="imgui-card p-10 flex flex-col items-center gap-8 min-w-[350px] animate-scale-in shadow-2xl shadow-cyan-500/10">
        {/* Enhanced circular spinner with double ring */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-[#1a1a1a] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 border-r-cyan-500/30 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-b-blue-500 border-l-blue-500/30 rounded-full animate-spin-reverse"></div>
          {/* Center glow */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/10 animate-pulse"></div>
        </div>

        {/* Loading text with fade transition */}
        <div className="text-center space-y-2">
          <p className="text-white font-semibold text-lg tracking-wide animate-pulse">{loadingText}</p>
          <div className="flex items-center justify-center gap-1">
            <span
              className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></span>
            <span
              className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.15s" }}
            ></span>
            <span
              className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.3s" }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  )
}
