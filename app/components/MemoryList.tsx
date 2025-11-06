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
}

export function MemoryList({ memories, onMemoryDeleted }: MemoryListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (memoryId: string) => {
    if (!confirm("Are you sure you want to delete this memory?")) {
      return;
    }

    setDeletingId(memoryId);

    try {
      const response = await fetch(
        `/api/memories/${memoryId}?userId=550e8400-e29b-41d4-a716-446655440000`,
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

  if (memories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No memories yet. Start by storing your first memory above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {memories.map((memory) => (
        <div
          key={memory.id}
          className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-gray-800">{memory.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(memory.created_at).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(memory.id)}
              disabled={deletingId === memory.id}
              className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            >
              {deletingId === memory.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
