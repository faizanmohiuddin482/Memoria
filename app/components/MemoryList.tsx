"use client";

import { useState } from "react";

interface Memory {
  id: string;
  content: string;
  created_at: string;
}

interface MemoryListProps {
  memories: Memory[];
  onMemoryDeleted: () => void;
  userId?: string;
}

export function MemoryList({
  memories,
  onMemoryDeleted,
  userId,
}: MemoryListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleDelete = async (memoryId: string) => {
    if (!confirm("Are you sure you want to delete this memory?")) {
      return;
    }

    setDeletingId(memoryId);

    try {
      const response = await fetch(
        `/api/memories/${memoryId}?userId=${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete memory");
      }

      onMemoryDeleted();
    } catch (error) {
      console.error("Error deleting memory:", error);
      alert("Failed to delete memory");
    } finally {
      setDeletingId(null);
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

  if (memories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3 opacity-50">📝</div>
        <p className="text-gray-400 font-medium">No memories yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Start by storing your first memory above
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {memories.map((memory, index) => (
        <div
          key={memory.id}
          className="p-5 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 hover:border-gray-600 transition-all duration-200 group"
          onMouseEnter={() => setHoveredId(memory.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3">
                <span className="text-gray-500 text-sm font-medium shrink-0 mt-0.5">
                  {index + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 leading-relaxed break-words">
                    {memory.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <span>🕐</span>
                    <span>{formatRelativeTime(memory.created_at)}</span>
                    <span className="mx-1">•</span>
                    <span>
                      {new Date(memory.created_at).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(memory.id)}
              disabled={deletingId === memory.id}
              className={`ml-4 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 shrink-0 ${
                hoveredId === memory.id
                  ? "text-red-400 hover:text-red-300 hover:bg-red-900/20 opacity-100"
                  : "text-gray-500 opacity-0 group-hover:opacity-100"
              } disabled:opacity-50`}
              aria-label={`Delete memory: ${memory.content.substring(0, 30)}`}
            >
              {deletingId === memory.id ? (
                <span className="flex items-center gap-1">
                  <span className="animate-spin text-xs">⟳</span>
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
