"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDreamStore, isAdmin } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { getBrandMappings, addBrandMapping, removeBrandMapping, parseQuickAddFormat } from "@/lib/brand-mappings"
import { showNotification } from "@/components/notification-toast"
import { Plus, Trash2, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useDreamStore()
  const [mappings, setMappings] = useState<Record<string, string>>({})
  const [newPrefix, setNewPrefix] = useState("")
  const [newBrandName, setNewBrandName] = useState("")
  const [quickAddText, setQuickAddText] = useState("")

  useEffect(() => {
    if (!isAuthenticated || !user || !isAdmin(user.licenseType)) {
      router.push("/")
      return
    }

    // Load existing mappings
    setMappings(getBrandMappings())
  }, [isAuthenticated, user, router])

  const handleAddBrand = () => {
    if (!newPrefix.trim() || !newBrandName.trim()) {
      showNotification("Please enter both prefix and brand name", "error")
      return
    }

    const success = addBrandMapping(newPrefix, newBrandName)
    if (success) {
      setMappings(getBrandMappings())
      setNewPrefix("")
      setNewBrandName("")
      showNotification(`Brand "${newBrandName}" added successfully`, "success")
    } else {
      showNotification("Failed to add brand", "error")
    }
  }

  const handleRemoveBrand = (prefix: string) => {
    if (prefix === "PRV") {
      showNotification("Cannot remove default brand", "error")
      return
    }

    const success = removeBrandMapping(prefix)
    if (success) {
      setMappings(getBrandMappings())
      showNotification("Brand removed successfully", "success")
    }
  }

  const handleQuickAdd = () => {
    const parsed = parseQuickAddFormat(quickAddText)
    if (parsed) {
      const success = addBrandMapping(parsed.prefix, parsed.brandName)
      if (success) {
        setMappings(getBrandMappings())
        setQuickAddText("")
        showNotification(`Brand "${parsed.brandName}" added successfully`, "success")
      }
    } else {
      showNotification("Invalid format. Use: The key prefix is: PREFIX and the brand name is: BRAND NAME", "error")
    }
  }

  if (!isAuthenticated || !user || !isAdmin(user.licenseType)) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />

      <main className="ml-[70px] p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="imgui-card p-6">
            <h1 className="text-2xl font-bold text-white mb-2">Brand Management</h1>
            <p className="text-sm text-gray-500">Manage brand mappings for license key prefixes</p>
          </div>

          {/* Quick Add */}
          <div className="imgui-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Add Brand</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-gray-400">Quick Add Format</Label>
                <textarea
                  value={quickAddText}
                  onChange={(e) => setQuickAddText(e.target.value)}
                  placeholder="The key prefix is: VENOM and the brand name is: Venom Hacks"
                  className="w-full mt-2 bg-[#0a0a0a] border border-[#27272a] rounded-md p-3 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 min-h-[80px]"
                />
              </div>
              <Button onClick={handleQuickAdd} className="imgui-button-load">
                <Plus className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            </div>
          </div>

          {/* Manual Add */}
          <div className="imgui-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Add New Brand</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-xs text-gray-400">Key Prefix</Label>
                <Input
                  value={newPrefix}
                  onChange={(e) => setNewPrefix(e.target.value)}
                  placeholder="e.g., VENOM"
                  className="mt-2 bg-[#0a0a0a] border-[#27272a] text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-400">Brand Name</Label>
                <Input
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="e.g., Venom Hacks"
                  className="mt-2 bg-[#0a0a0a] border-[#27272a] text-white"
                />
              </div>
            </div>
            <Button onClick={handleAddBrand} className="imgui-button-load">
              <Save className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </div>

          {/* Current Mappings */}
          <div className="imgui-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Current Brand Mappings</h2>
            <div className="space-y-3">
              {Object.entries(mappings).map(([prefix, brandName]) => (
                <div
                  key={prefix}
                  className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#27272a] rounded-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-500 font-mono text-sm">
                      {prefix}
                    </div>
                    <div className="text-sm text-white">{brandName}</div>
                  </div>
                  {prefix !== "PRV" && (
                    <Button
                      onClick={() => handleRemoveBrand(prefix)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="imgui-card p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-cyan-500 mt-0.5" />
              <div className="space-y-2 text-sm text-gray-400">
                <p>
                  When users log in, the system automatically detects their license key prefix and maps it to the
                  configured brand name.
                </p>
                <p>
                  This brand name is sent to the C# loader, which creates a brand configuration file that the cheat
                  reads on startup.
                </p>
                <p className="text-cyan-500">Example: License key "VENOM-ABC123" → Brand "Venom Hacks"</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
