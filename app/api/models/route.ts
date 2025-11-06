import { NextResponse } from "next/server";
import { listAvailableModels } from "@/lib/ai/gemini";

// GET: List available models (for debugging)
export async function GET() {
  try {
    const models = await listAvailableModels();
    if (!models) {
      return NextResponse.json(
        { error: "Failed to list models" },
        { status: 500 }
      );
    }
    return NextResponse.json({ models });
  } catch (error) {
    console.error("Error listing models:", error);
    return NextResponse.json(
      { error: "Failed to list models" },
      { status: 500 }
    );
  }
}
