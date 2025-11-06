import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding, generateResponse } from "@/lib/ai/gemini";
import { searchMemories } from "@/lib/db/memories";

// POST: Search memories using natural language query
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, query } = body;

    if (!userId || !query) {
      return NextResponse.json(
        { error: "userId and query are required" },
        { status: 400 }
      );
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Search for similar memories
    const relevantMemories = await searchMemories(userId, queryEmbedding, 5);

    if (relevantMemories.length === 0) {
      return NextResponse.json({
        answer: "I couldn't find any relevant memories for that query.",
        memories: [],
      });
    }

    // Generate natural language response
    const answer = await generateResponse(query, relevantMemories);

    return NextResponse.json({
      answer,
      memories: relevantMemories,
    });
  } catch (error) {
    console.error("Error searching memories:", error);
    return NextResponse.json(
      { error: "Failed to search memories" },
      { status: 500 }
    );
  }
}
