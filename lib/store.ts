import { create } from "zustand"

export type LicenseType =
  | "FRE" // Free Fortnite
  | "LTE" // Fortnite Lite
  | "CS2" // CS2 Counter-Strike
  | "PRIV" // Private premium
  | "PRV" // PRV multi-game
  | "SFT" // Softaim
  | "TMP" // Temporary Spoofer
  | "PER" // Permanent Spoofer
  | "FVM" // FiveM cheat
  | "ADMIN" // DREAMADMIN2024

export type CheatStatus = "available" | "unavailable" | "loading" | "loaded"

export interface Product {
  id: string
  name: string
  game: string
  icon: string
  status: CheatStatus
  requiredLicense: LicenseType[]
  description: string
  lastUpdated?: string
  downloadPath: string // C# will use this path
  executable: string // What to execute
  isSpoofer: boolean
  requirements: string[]
  detectionStatus: string
}

interface User {
  licenseKey: string
  licenseType: LicenseType
  expiryDate: string
  lastUsed?: string
  hwid?: string
  currentUses?: number
  maxUses?: number | null
  sessionToken?: string
  brandName?: string // Brand name detected from license key prefix
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  isConnected: boolean
  products: Product[]
  setUser: (user: User | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setConnected: (connected: boolean) => void
  setProductStatus: (productId: string, status: CheatStatus) => void
  updateUserLicenseInfo: (info: Partial<User>) => void
  logout: () => void
}

export const detectLicenseType = (licenseKey: string): LicenseType => {
  const key = licenseKey.toUpperCase()

  if (key === "DREAMADMIN2024") return "ADMIN"
  if (key.startsWith("FRE-")) return "FRE"
  if (key.startsWith("LTE-")) return "LTE"
  if (key.startsWith("CS2-")) return "CS2"
  if (key.startsWith("PRIV")) return "PRIV"
  if (key.startsWith("PRV-")) return "PRV"
  if (key.startsWith("SFT-")) return "SFT"
  if (key.startsWith("TMP-")) return "TMP"
  if (key.startsWith("PER-")) return "PER"
  if (key.startsWith("FVM-")) return "FVM"

  // Default to free if no prefix matches
  return "FRE"
}

export const isAdmin = (licenseType: LicenseType): boolean => {
  return licenseType === "ADMIN"
}

export const hasSpooferAccess = (licenseType: LicenseType): boolean => {
  return licenseType === "TMP" || licenseType === "PER" || licenseType === "ADMIN"
}

export const hasCheatAccess = (licenseType: LicenseType): boolean => {
  return ["FRE", "LTE", "CS2", "PRIV", "PRV", "SFT", "FVM", "ADMIN"].includes(licenseType)
}

export const useDreamStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  isConnected: true,
  products: [
    {
      id: "prv-cheat",
      name: "Fortnite Private",
      game: "Fortnite",
      icon: "🌟",
      status: "available",
      requiredLicense: ["PRV", "ADMIN"],
      description: "Advanced Fortnite cheat with ESP, aimbot, and undetected features for competitive gameplay.",
      lastUpdated: "12/13/2025",
      downloadPath: "C:\\ProgramData\\DreamPrivateLoader\\",
      executable: "privCheat.exe",
      isSpoofer: false,
      requirements: ["Fully Disable Windows Defender", "Disable CPU Virtualization"],
      detectionStatus: "Undetected",
    },
    {
      id: "fvm-cheat",
      name: "FiveM Private",
      game: "FiveM",
      icon: "🎮",
      status: "available",
      requiredLicense: ["FVM", "ADMIN"],
      description: "Advanced FiveM cheat with ESP, aimbot, and undetected features for roleplay servers.",
      lastUpdated: "12/17/2025",
      downloadPath: "C:\\ProgramData\\DreamFiveMLoader\\",
      executable: "fivemCheat.exe",
      isSpoofer: false,
      requirements: ["Fully Disable Windows Defender", "Disable CPU Virtualization"],
      detectionStatus: "Undetected",
    },
  ],
  setUser: (user) => set({ user }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setConnected: (connected) => set({ isConnected: connected }),
  setProductStatus: (productId, status) =>
    set((state) => ({
      products: state.products.map((product) => (product.id === productId ? { ...product, status } : product)),
    })),
  updateUserLicenseInfo: (info) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...info } : null,
    })),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
