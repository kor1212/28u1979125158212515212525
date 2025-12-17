// Types for IPC communication
export interface IPCMessage {
  action: string
  [key: string]: unknown
}

export interface LoadCheatMessage extends IPCMessage {
  action: "loadCheat"
  cheatId: string // Changed from cheatType to cheatId for clarity
  downloadPath: string // Added download path
  executable: string // Added executable name
  licenseKey?: string
  brandName?: string // Brand name for C# loader
  timestamp?: string
}

export interface AuthenticateMessage extends IPCMessage {
  action: "authenticate"
  licenseKey: string
  rememberMe?: boolean
}

export interface SpoofMessage extends IPCMessage {
  action: "spoof"
  spoofType: "motherboard" | "disk"
  option: string
}

// Window interface for C# communication
declare global {
  interface Window {
    dreamLoader?: {
      loadCheat: (product: string, licenseKey: string, brandName: string) => void
    }
    chrome?: {
      webview?: {
        postMessage: (message: any) => void
      }
    }
  }
}

// Check if running in WebView2
export const isWebView2 = () => {
  return typeof window !== "undefined" && !!(window as any).chrome?.webview
}

// Initialize dreamLoader bridge
export const initializeDreamLoader = () => {
  if (typeof window === "undefined") return

  window.dreamLoader = window.dreamLoader || {
    loadCheat: (product: string, licenseKey: string, brandName: string) => {
      console.log("[v0] Dream Loader: Sending message", {
        product,
        licenseKey: "***" + licenseKey.slice(-4),
        brandName,
      })

      if (window.chrome && window.chrome.webview) {
        const message = {
          action: "loadCheat",
          product: product,
          licenseKey: licenseKey || "",
          brandName: brandName || "",
        }

        console.log("[v0] 🚀 Sending to C#:", message)
        window.chrome.webview.postMessage(message)
        console.log("[v0] ✅ Message sent to C# loader")
      } else {
        console.error("[v0] ❌ WebView2 bridge not available")
        alert("C# loader bridge not available")
      }
    },
  }

  // Debug WebView2 availability
  if (window.chrome && window.chrome.webview) {
    console.log("[v0] ✅ WebView2 bridge is available")
  } else {
    console.log("[v0] ❌ WebView2 bridge NOT available - running in browser")
  }
}

// Load cheat function - sends EXACT format to C# loader
export const loadCheat = (
  cheatId: string,
  downloadPath?: string,
  executable?: string,
  licenseKey?: string,
  brandName?: string,
) => {
  console.log("[v0] ==================== LOAD CHEAT ====================")
  console.log("[v0] Cheat ID:", cheatId)
  console.log("[v0] License Key:", licenseKey ? "***" + licenseKey.slice(-4) : "none")
  console.log("[v0] Brand Name:", brandName || "Unknown Brand")
  console.log("[v0] WebView2 Available:", isWebView2())

  let productName = "private_cheat" // Default to private_cheat

  if (cheatId === "private-cheat" || cheatId === "prv-cheat" || cheatId.includes("fortnite")) {
    productName = "private_cheat"
  } else if (cheatId === "fvm-cheat" || cheatId.includes("fivem")) {
    productName = "fivem_cheat"
  }

  console.log("[v0] Product name for C# loader:", productName)

  // Use dreamLoader bridge to send message
  if (window.dreamLoader) {
    window.dreamLoader.loadCheat(productName, licenseKey || "", brandName || "Unknown Brand")
  } else {
    console.error("[v0] ❌ dreamLoader bridge not initialized")
  }

  console.log("[v0] ======================================================")
}

export const authenticateUser = (licenseKey: string, rememberMe = false) => {
  console.log("[v0] Authenticate user:", licenseKey ? "***" + licenseKey.slice(-4) : "none")
}

export const performSpoof = (spoofType: "motherboard" | "disk", option: string) => {
  console.log("[v0] Perform spoof:", spoofType, option)
}

export const logoutUser = () => {
  console.log("[v0] Logout user")
}
