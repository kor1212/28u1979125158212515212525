export interface BrandMapping {
  prefix: string
  brandName: string
}

// Default brand mappings
const defaultMappings: Record<string, string> = {
  DREAM: "Dream Private",
  SSZ: "SSZ Fortnite Private",
  NEUTRON: "Neutron Cheat",
  PRIV: "Private Loader",
  FRE: "Dream Lite",
  LTE: "Lite Edition",
  CS2: "CS2 Pro",
  PRV: "Dream Private",
  SFT: "Softaim Pro",
  FVM: "Dream FiveM", // Added FiveM product mapping
}

// Get all brand mappings from localStorage or defaults
export const getBrandMappings = (): Record<string, string> => {
  if (typeof window === "undefined") return defaultMappings

  try {
    const stored = localStorage.getItem("dream_brand_mappings")
    if (stored) {
      return { ...defaultMappings, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error("[v0] Failed to load brand mappings:", error)
  }

  return defaultMappings
}

// Save brand mappings to localStorage
export const saveBrandMappings = (mappings: Record<string, string>) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("dream_brand_mappings", JSON.stringify(mappings))
  } catch (error) {
    console.error("[v0] Failed to save brand mappings:", error)
  }
}

// Extract brand name from license key
export const getBrandFromLicenseKey = (licenseKey: string): string => {
  if (!licenseKey) return "Unknown Brand"

  const prefix = licenseKey.split("-")[0].toUpperCase()
  const mappings = getBrandMappings()

  return mappings[prefix] || "Unknown Brand"
}

// Add a new brand mapping
export const addBrandMapping = (prefix: string, brandName: string): boolean => {
  if (!prefix || !brandName) return false

  const mappings = getBrandMappings()
  mappings[prefix.toUpperCase()] = brandName.trim()
  saveBrandMappings(mappings)

  return true
}

// Remove a brand mapping
export const removeBrandMapping = (prefix: string): boolean => {
  const mappings = getBrandMappings()
  delete mappings[prefix.toUpperCase()]
  saveBrandMappings(mappings)

  return true
}

// Parse quick add format: "The key prefix is: [PREFIX] and the brand name is: [BRAND NAME]"
export const parseQuickAddFormat = (text: string): BrandMapping | null => {
  const match = text.match(/prefix\s+is:\s*(\w+).*brand\s+name\s+is:\s*(.+)/i)

  if (match) {
    const [, prefix, brandName] = match
    return {
      prefix: prefix.toUpperCase(),
      brandName: brandName.trim(),
    }
  }

  return null
}
