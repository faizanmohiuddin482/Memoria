"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MemoryList } from "../components/MemoryList";
import { AuthGuard } from "../components/AuthGuard";
import { supabase } from "@/lib/supabase/client";

export default function MemoriesPage() {
  const [memories, setMemories] = useState<
    Array<{
      id: string;
      content: string;
      created_at: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchMemories = useCallback(
    async (uid?: string) => {
      const targetUserId = uid || userId;
      if (!targetUserId) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/memories?userId=${targetUserId}`);
        const data = await response.json();
        if (data.memories) {
          setMemories(data.memories);
        }
      } catch (error) {
        console.error("Error fetching memories:", error);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        fetchMemories(user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchMemories(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchMemories]);

  const handleMemoryDeleted = () => {
    fetchMemories();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          {/* Header with navigation */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="text-2xl font-bold text-white hover:text-gray-300 transition-colors"
              >
                Memoria
              </Link>
              <Link
                href="/app"
                className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
              >
                <span>←</span>
                <span>Back to App</span>
              </Link>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Your Memories
                </h1>
                {!loading && (
                  <p className="text-gray-400">
                    {memories.length}{" "}
                    {memories.length === 1 ? "memory" : "memories"} stored
                  </p>
                )}
              </div>
              <button
                onClick={() => fetchMemories()}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg disabled:opacity-50 transition-colors border border-gray-800"
                aria-label="Refresh memories"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⟳</span>
                    Loading...
                  </span>
                ) : (
                  "Refresh"
                )}
              </button>
            </div>
          </header>

          {/* Memories List */}
          <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            {loading ? (
              <div className="text-center py-12">
                <span className="animate-spin text-2xl text-gray-400">⟳</span>
                <p className="text-gray-400 mt-4">Loading memories...</p>
              </div>
            ) : (
              <MemoryList
                memories={memories}
                onMemoryDeleted={handleMemoryDeleted}
                userId={userId || undefined}
              />
            )}
          </section>
        </div>
      </div>
    </AuthGuard>
  );
}
