"use client";

import { useState, useRef, useEffect } from "react";

interface MemorySearchProps {
  userId: string;
}

export function MemorySearch({ userId }: MemorySearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [memories, setMemories] = useState<
    Array<{
      id: string;
      content: string;
      created_at: string;
      similarity: number;
    }>
  >([]);
  const [showDetails, setShowDetails] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setAnswer(null);
    setMemories([]);
    setShowDetails(false);

    try {
      const response = await fetch("/api/memories/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          query: query.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search memories");
      }

      setAnswer(data.answer);
      setMemories(data.memories || []);
    } catch (error) {
      console.error("Error searching memories:", error);
      setAnswer(
        error instanceof Error
          ? `Error: ${error.message}`
          : "Failed to search memories"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where did I put my credit card?"
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all pr-10 text-white placeholder-gray-500"
            disabled={loading}
            aria-label="Search memories"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            🔍
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
          aria-label="Search memories"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⟳</span>
              Searching...
            </span>
          ) : (
            "Ask Memoria"
          )}
        </button>
      </form>

      {answer && (
        <div className="mt-6 p-5 bg-gray-800 border border-gray-700 rounded-lg">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wide">
              Answer
            </h3>
            {memories.length > 0 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-gray-400 hover:text-white font-medium transition-colors"
              >
                {showDetails ? "Hide" : "Show"} sources ({memories.length})
              </button>
            )}
          </div>
          <p className="text-gray-300 leading-relaxed">{answer}</p>
        </div>
      )}

      {memories.length > 0 && showDetails && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-400 mb-3 text-sm">
            Source Memories ({memories.length})
          </h3>
          <div className="space-y-2">
            {memories.map((memory, index) => (
              <div
                key={memory.id}
                className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">{memory.content}</p>
                    <p className="text-xs text-gray-500 mt-1.5">
                      {formatRelativeTime(memory.created_at)}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!answer && !loading && query && (
        <div className="text-center py-4 text-sm text-gray-500">
          Press Enter or click &quot;Ask Memoria&quot; to search
        </div>
      )}
    </div>
  );
}
