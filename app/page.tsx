"use client";

import { useState, useEffect } from "react";
import { MemoryInput } from "./components/MemoryInput";
import { MemorySearch } from "./components/MemorySearch";
import { MemoryList } from "./components/MemoryList";

// For prototype: using a simple user ID
// In production, this would come from authentication
// Using a valid UUID format for the demo user
const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function Home() {
  const [memories, setMemories] = useState<
    Array<{
      id: string;
      content: string;
      created_at: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/memories?userId=${DEMO_USER_ID}`);
      const data = await response.json();
      if (data.memories) {
        setMemories(data.memories);
      }
    } catch (error) {
      console.error("Error fetching memories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleMemoryAdded = () => {
    fetchMemories();
  };

  const handleMemoryDeleted = () => {
    fetchMemories();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Memoria</h1>
          <p className="text-xl text-gray-600">
            Your AI-powered personal memory assistant
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Add Memory Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Store a Memory
            </h2>
            <p className="text-gray-600 mb-4">
              Tell me something to remember. For example: &quot;I kept my credit
              card in the wooden shelf&quot;
            </p>
            <MemoryInput
              userId={DEMO_USER_ID}
              onMemoryAdded={handleMemoryAdded}
            />
          </section>

          {/* Search Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Ask a Question
            </h2>
            <p className="text-gray-600 mb-4">
              Ask me anything about your memories. For example: &quot;Where did
              I put my credit card?&quot;
            </p>
            <MemorySearch userId={DEMO_USER_ID} />
          </section>

          {/* Memories List */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Memories
              </h2>
              <button
                onClick={fetchMemories}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
            <MemoryList
              memories={memories}
              onMemoryDeleted={handleMemoryDeleted}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
