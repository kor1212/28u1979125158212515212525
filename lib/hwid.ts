// Browser fingerprinting for HWID generation
export function generateBrowserHWID(): string {
  if (typeof window === "undefined") return ""

  try {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    let canvasData = ""

    if (ctx) {
      ctx.textBaseline = "top"
      ctx.font = "14px Arial"
      ctx.fillText("Browser Fingerprint", 2, 2)
      canvasData = canvas.toDataURL()
    }

    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasData: canvasData.substring(0, 100), // First 100 chars only
      hardwareConcurrency: navigator.hardwareConcurrency,
    }

    // Simple hash function (you could use crypto-js for SHA256)
    const str = JSON.stringify(fingerprint)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(16, "0")
  } catch (error) {
    // Fallback to random ID if fingerprinting fails
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
}

// Get or create HWID from localStorage
export function getOrCreateHWID(): string {
  if (typeof window === "undefined") return ""

  let hwid = localStorage.getItem("dream_hwid")
  if (!hwid) {
    hwid = generateBrowserHWID()
    localStorage.setItem("dream_hwid", hwid)
  }
  return hwid
}
