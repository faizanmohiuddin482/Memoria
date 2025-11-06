"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.push("/app");
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.push("/app");
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-2xl mb-4">⟳</div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">Memoria</div>
            <div className="flex items-center gap-6">
              <a
                href="#features"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-400 hover:text-white transition-colors"
              >
                How it Works
              </a>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block px-4 py-2 bg-gray-900 text-gray-300 rounded-full text-sm font-medium mb-8 border border-gray-800">
            Free Forever • No Credit Card Required
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Remember everything
            <br />
            <span className="text-gray-300">you need to know.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Store your memories in natural language. Search instantly. Ask AI
            anything about what you&apos;ve saved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105 text-lg"
            >
              Get Started
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 border-2 border-gray-700 text-white font-semibold rounded-lg hover:border-gray-600 transition-all text-lg"
            >
              Learn More
            </a>
          </div>
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>✓</span>
            <span>Free forever</span>
            <span className="mx-2">•</span>
            <span>✓</span>
            <span>30-second setup</span>
            <span className="mx-2">•</span>
            <span>✓</span>
            <span>Works everywhere</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gray-950">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything works
              <br />
              beautifully together.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Feature 1 */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="text-4xl mb-4">💾</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Natural Language Storage
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Store memories in plain English. Just tell Memoria what you want
                to remember, and it handles the rest. No forms, no tags, no
                complexity.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Chat with your memories
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Ask questions about anything you&apos;ve saved. Our AI searches
                your memories and gives you accurate answers with sources.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Instant Search
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Semantic search that actually works. Find that memory from weeks
                ago by searching for concepts, not just keywords.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Build your second brain
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Every memory is organized and connected. Build your personal
                knowledge base that grows smarter over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 bg-black">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple by design.
              <br />
              Powerful by nature.
            </h2>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold border border-gray-800">
                01
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Store a memory
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Type what you want to remember in natural language. For
                  example: &quot;I kept my credit card in the wooden shelf&quot;
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold border border-gray-800">
                02
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Ask anything
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Search or chat with AI about your saved memories. It&apos;s
                  like having perfect recall of everything you&apos;ve stored.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold border border-gray-800">
                03
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Never forget again
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Your memories are stored securely and searchable forever.
                  Build your personal knowledge base that grows with you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            &quot;Why we built this&quot;
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
            We were tired of forgetting where we put things. Of losing important
            information. Of not being able to find what we need when we need it.
            So we built Memoria - your personal memory assistant powered by AI.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start building your
            <br />
            second brain today
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of users who never forget anything important
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105 text-lg"
          >
            Get Started
          </Link>
          <div className="mt-8 text-sm text-gray-500">
            Free forever • No credit card required • 30-second setup
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6 bg-black">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2025 Memoria. All rights reserved.
            </div>
            <div className="flex gap-6 text-gray-400">
              <a
                href="#features"
                className="hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:text-white transition-colors"
              >
                How it Works
              </a>
              <Link
                href="/auth/signup"
                className="hover:text-white transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
