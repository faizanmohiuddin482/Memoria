"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface MemoryInputProps {
  userId: string;
  onMemoryAdded: () => void;
}

export function MemoryInput({ userId, onMemoryAdded }: MemoryInputProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charCount = content.length;
  const maxChars = 500;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setMessage({ type: "error", text: "Please enter something to remember" });
      return;
    }

    if (content.length > maxChars) {
      setMessage({
        type: "error",
        text: `Memory is too long (max ${maxChars} characters)`,
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          content: content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle memory limit error specifically
        if (response.status === 403 && data.error === "Memory limit reached") {
          setMessage({
            type: "error",
            text: data.message || "Memory limit reached",
          });
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Failed to store memory");
      }

      setMessage({ type: "success", text: "Memory stored successfully! 🎉" });
      setContent("");
      onMemoryAdded();

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);

      // Refocus textarea for next input
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error("Error storing memory:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to store memory",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="I kept my credit card in the wooden shelf..."
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none transition-all text-white placeholder-gray-500"
          rows={3}
          disabled={loading}
          maxLength={maxChars}
          aria-label="Memory input"
        />
        {charCount > 0 && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">
            {charCount}/{maxChars}
          </div>
        )}
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-900/30 text-green-400 border border-green-800"
              : "bg-red-900/30 text-red-400 border border-red-800"
          }`}
          role="alert"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <span className="text-lg">✓</span>
              ) : (
                <span className="text-lg">⚠</span>
              )}
              <span>{message.text}</span>
            </div>
            {message.type === "error" &&
              message.text.includes("memory limit") && (
                <Link
                  href="/pricing"
                  className="ml-7 text-sm underline hover:text-red-300"
                >
                  Upgrade to Pro for unlimited memories →
                </Link>
              )}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
        aria-label="Store memory"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⟳</span>
            Storing...
          </span>
        ) : (
          "Remember This"
        )}
      </button>
    </form>
  );
}
