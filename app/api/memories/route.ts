import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/ai/gemini";
import { storeMemory, getUserMemories } from "@/lib/db/memories";

// GET: Fetch all memories for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const memories = await getUserMemories(userId);
    return NextResponse.json({ memories });
  } catch (error) {
    console.error("Error fetching memories:", error);
    return NextResponse.json(
      { error: "Failed to fetch memories" },
      { status: 500 }
    );
  }
}

// POST: Store a new memory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, content } = body;

    if (!userId || !content) {
      return NextResponse.json(
        { error: "userId and content are required" },
        { status: 400 }
      );
    }

    // Generate embedding for the content
    const embedding = await generateEmbedding(content);

    // Store memory with embedding
    const memoryId = await storeMemory({
      user_id: userId,
      content: content.trim(),
      embedding,
    });

    return NextResponse.json({
      success: true,
      id: memoryId,
      message: "Memory stored successfully",
    });
  } catch (error) {
    console.error("Error storing memory:", error);
    return NextResponse.json(
      { error: "Failed to store memory" },
      { status: 500 }
    );
  }
}
