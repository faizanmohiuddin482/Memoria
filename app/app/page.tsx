"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MemoryInput } from "../components/MemoryInput";
import { MemorySearch } from "../components/MemorySearch";
import { AuthGuard } from "../components/AuthGuard";
import { supabase } from "@/lib/supabase/client";

export default function Home() {
  const [memories, setMemories] = useState<
    Array<{
      id: string;
      content: string;
      created_at: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

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
        setUser(user);
        setUserId(user.id);
        fetchMemories(user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setUserId(session.user.id);
        fetchMemories(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchMemories]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleMemoryAdded = () => {
    fetchMemories();
  };

  const hasMemories = memories.length > 0;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white">
        {/* Header with navigation */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800 w-full py-4 mb-8">
          <div className="flex items-center justify-between w-full px-6">
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Memoria
            </Link>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-400">{user.email}</span>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-12 max-w-4xl">
          {/* Main Content - Reordered based on user state */}
          <div className="space-y-6">
            {/* Show search first if user has memories, otherwise show input first */}
            {hasMemories ? (
              <>
                {/* Search Section - Prominent when memories exist */}
                <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-bold text-white">
                      Ask a Question
                    </h2>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded border border-gray-700">
                      Quick access
                    </span>
                  </div>
                  <p className="text-gray-400 mb-6 text-sm">
                    Search through your {memories.length}{" "}
                    {memories.length === 1 ? "memory" : "memories"} using
                    natural language
                  </p>
                  <MemorySearch userId={userId || ""} />
                </section>

                {/* Add Memory Section */}
                <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Store a Memory
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm">
                    Add something new to remember
                  </p>
                  <MemoryInput
                    userId={userId || ""}
                    onMemoryAdded={handleMemoryAdded}
                  />
                </section>
              </>
            ) : (
              <>
                {/* Add Memory Section - Prominent when no memories */}
                <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                  <div className="text-center mb-8">
                    <div className="text-5xl mb-4">🧠</div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                      Store Your First Memory
                    </h2>
                    <p className="text-gray-400 text-base">
                      Start by saving something you want to remember later
                    </p>
                  </div>
                  <MemoryInput
                    userId={userId || ""}
                    onMemoryAdded={handleMemoryAdded}
                  />
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <p className="text-xs text-gray-500 mb-3 font-medium">
                      💡 Examples:
                    </p>
                    <ul className="text-xs text-gray-400 space-y-2">
                      <li>
                        • &quot;I kept my credit card in the wooden shelf&quot;
                      </li>
                      <li>
                        • &quot;My passport is in the blue folder in the
                        drawer&quot;
                      </li>
                      <li>• &quot;Meeting with Sarah on Friday at 3pm&quot;</li>
                    </ul>
                  </div>
                </section>

                {/* Search Section - Disabled state when no memories */}
                <section className="bg-gray-950 rounded-2xl p-8 border border-gray-800 opacity-50">
                  <h2 className="text-2xl font-bold text-gray-500 mb-4">
                    Ask a Question
                  </h2>
                  <p className="text-gray-500 mb-6 text-sm">
                    Search will be available once you store your first memory
                  </p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      disabled
                      placeholder="Where did I put my credit card?"
                      className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-500 cursor-not-allowed"
                    />
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-gray-800 text-gray-600 font-medium rounded-lg cursor-not-allowed"
                    >
                      Ask Memoria
                    </button>
                  </div>
                </section>
              </>
            )}

            {/* View All Memories Link */}
            {hasMemories && (
              <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    View All Memories
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm">
                    Browse and manage all your stored memories
                  </p>
                  <Link
                    href="/memories"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all"
                  >
                    <span>View All</span>
                    <span>→</span>
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
