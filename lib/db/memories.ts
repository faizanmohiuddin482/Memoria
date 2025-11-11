import { supabaseAdmin } from "@/lib/supabase/server";
import { MemoryInsert, MemorySearchResult } from "./types";

// Store a new memory with embedding
export async function storeMemory(memory: MemoryInsert): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("memories")
    .insert({
      user_id: memory.user_id,
      content: memory.content,
      embedding: memory.embedding,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to store memory: ${error.message}`);
  }

  return data.id;
}

// Search memories using vector similarity
export async function searchMemories(
  userId: string,
  queryEmbedding: number[],
  limit: number = 5
): Promise<MemorySearchResult[]> {
  const { data, error } = await supabaseAdmin.rpc("match_memories", {
    query_embedding: queryEmbedding,
    match_user_id: userId,
    match_threshold: 0.5,
    match_count: limit,
  });

  if (error) {
    throw new Error(`Failed to search memories: ${error.message}`);
  }

  return data || [];
}

// Get all memories for a user (for display)
export async function getUserMemories(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("memories")
    .select("id, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch memories: ${error.message}`);
  }

  return data || [];
}

// Get memory count for a user
export async function getMemoryCount(userId: string): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("memories")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to get memory count: ${error.message}`);
  }

  return count || 0;
}

// Delete a memory
export async function deleteMemory(memoryId: string, userId: string) {
  const { error } = await supabaseAdmin
    .from("memories")
    .delete()
    .eq("id", memoryId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete memory: ${error.message}`);
  }
}
