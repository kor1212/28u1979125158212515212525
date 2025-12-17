import { type NextRequest, NextResponse } from "next/server"

const API_KEY = "lk_f5lopancqJbegloiTrfJ6eL9FVfR7auDcXbXsdUvgLSKWBZm"
const API_URL = "https://authorized.lol/api/v1"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { license_key, hwid } = body

    console.log("[v0] API Init called with license_key:", license_key, "hwid:", hwid)

    console.log("[v0] Calling authorized.lol API...")
    const response = await fetch(`${API_URL}/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        api_key: API_KEY,
        license_key,
        hwid,
      }),
    })

    console.log("[v0] Authorized.lol response status:", response.status)
    const data = await response.json()
    console.log("[v0] Authorized.lol response data:", data)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] Init API error:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    )
  }
}
