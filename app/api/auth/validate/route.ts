import { type NextRequest, NextResponse } from "next/server"

const API_KEY = "lk_f5lopancqJbegloiTrfJ6eL9FVfR7auDcXbXsdUvgLSKWBZm"
const API_URL = "https://authorized.lol/api/v1"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_token } = body

    const response = await fetch(`${API_URL}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        api_key: API_KEY,
        session_token,
      }),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] Validate API error:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    )
  }
}
