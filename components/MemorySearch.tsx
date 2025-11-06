"use client";

import { useState } from "react";

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setAnswer(null);
    setMemories([]);

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

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where did I put my credit card?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Searching..." : "Ask Memoria"}
        </button>
      </form>

      {answer && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Answer:</h3>
          <p className="text-blue-800">{answer}</p>
        </div>
      )}

      {memories.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">
            Relevant Memories ({memories.length}):
          </h3>
          <div className="space-y-2">
            {memories.map((memory) => (
              <div
                key={memory.id}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <p className="text-gray-800">{memory.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(memory.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
