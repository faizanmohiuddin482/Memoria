import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/ai/gemini";
import { storeMemory, getUserMemories, getMemoryCount } from "@/lib/db/memories";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

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

    // Check user's subscription plan and memory limit
    const { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select("plan_type, status")
      .eq("user_id", userId)
      .in("status", ["active", "trialing"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const planType = subscription?.plan_type || "free";
    const memoryLimit = planType === "free" ? 100 : -1; // -1 means unlimited

    // Check memory count if not unlimited
    if (memoryLimit !== -1) {
      const memoryCount = await getMemoryCount(userId);
      if (memoryCount >= memoryLimit) {
        return NextResponse.json(
          {
            error: "Memory limit reached",
            message: `You've reached your ${memoryLimit} memory limit. Upgrade to Pro for unlimited memories.`,
            limit: memoryLimit,
            current: memoryCount,
          },
          { status: 403 }
        );
      }
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
