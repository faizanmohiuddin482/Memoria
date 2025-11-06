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
            Never lose your keys again. Never forget where you put that
            document. Just type what happened, and ask Memoria anything later.
            It understands context, not just keywords.
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
                Just type what happened
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Forget about categories, folders, or tags. Type &quot;I left my
                keys in the jacket pocket&quot; and Memoria remembers it. No
                structure needed—just write like you&apos;re texting yourself.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Ask like you&apos;re talking to a friend
              </h3>
              <p className="text-gray-400 leading-relaxed">
                &quot;Where did I put my passport?&quot; or &quot;What did I say
                about that restaurant?&quot; Memoria understands context, not
                just keywords. It finds what you need even if you can&apos;t
                remember the exact words.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Find anything, anytime
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Search for &quot;blue folder&quot; and it finds &quot;the navy
                blue folder in my desk drawer.&quot; Memoria understands
                meaning, so you don&apos;t need to remember exact phrases from
                months ago.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Your memory, amplified
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Every random thought, location, or detail you save becomes part
                of your searchable memory. The more you use it, the more useful
                it becomes. It&apos;s like having perfect recall for everything
                you choose to remember.
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
                  Save it when you think of it
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  That moment when you put something somewhere and think
                  &quot;I&apos;ll remember this&quot;—but you won&apos;t. Just
                  type it into Memoria right then. &quot;Left my charger at
                  Sarah&apos;s place&quot; or &quot;The good coffee shop is on
                  Main Street, second floor.&quot; Takes 5 seconds.
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
                  Ask when you need it
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Later, when you&apos;re standing in your room wondering where
                  your keys are, just ask: &quot;Where are my keys?&quot;
                  Memoria searches through everything you&apos;ve saved and
                  tells you exactly where you left them. No scrolling, no
                  guessing.
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
                  It gets smarter as you use it
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Every memory you save makes Memoria more useful. After a few
                  weeks, you&apos;ll have a searchable record of where things
                  are, what you thought, and what you need to remember.
                  It&apos;s your external brain that never forgets.
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
            Why we built this
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
            We kept losing things. Forgetting where we put our keys, our
            passport, that important document. We tried notes apps, but they
            required too much structure. We tried search, but it only worked if
            we remembered the exact words. So we built Memoria—an AI that
            understands what you mean, not just what you type. Now you can
            forget about forgetting.
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
