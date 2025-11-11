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
      <div className="flex justify-center items-center min-h-screen text-white bg-black">
        <div className="text-center">
          <div className="mb-4 text-2xl animate-spin">⟳</div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-sm bg-black/80">
        <div className="container px-6 py-4 mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">Memoria</div>
            <div className="flex gap-6 items-center">
              <a
                href="#features"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-400 transition-colors hover:text-white"
              >
                How it Works
              </a>
              <Link
                href="/pricing"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Pricing
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 font-medium text-black bg-white rounded-lg transition-colors hover:bg-gray-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-32">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block px-4 py-2 mb-8 text-sm font-medium text-gray-300 bg-gray-900 rounded-full border border-gray-800">
            Free Forever • No Credit Card Required
          </div>
          <h1 className="mb-6 text-6xl font-bold leading-tight text-white md:text-7xl">
            Remember everything
            <br />
            <span className="text-gray-300">you need to know.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-400">
            Never lose your keys again. Never forget where you put that
            document. Just type what happened, and ask Memoria anything later.
            It understands context, not just keywords.
          </p>
          <div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
            <Link
              href="/auth/signup"
              className="px-8 py-4 text-lg font-semibold text-black bg-white rounded-lg transition-all transform hover:bg-gray-200 hover:scale-105"
            >
              Get Started
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 text-lg font-semibold text-white rounded-lg border-2 border-gray-700 transition-all hover:border-gray-600"
            >
              Learn More
            </a>
          </div>
          <div className="flex gap-2 justify-center items-center mt-12 text-sm text-gray-500">
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
      <section id="features" className="px-6 py-24 bg-gray-950">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Everything works
              <br />
              beautifully together.
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            {/* Feature 1 */}
            <div className="p-8 bg-gray-900 rounded-2xl border border-gray-800">
              <div className="mb-4 text-4xl">💾</div>
              <h3 className="mb-3 text-2xl font-bold text-white">
                Just type what happened
              </h3>
              <p className="leading-relaxed text-gray-400">
                Forget about categories, folders, or tags. Type &quot;I left my
                keys in the jacket pocket&quot; and Memoria remembers it. No
                structure needed—just write like you&apos;re texting yourself.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gray-900 rounded-2xl border border-gray-800">
              <div className="mb-4 text-4xl">🤖</div>
              <h3 className="mb-3 text-2xl font-bold text-white">
                Ask like you&apos;re talking to a friend
              </h3>
              <p className="leading-relaxed text-gray-400">
                &quot;Where did I put my passport?&quot; or &quot;What did I say
                about that restaurant?&quot; Memoria understands context, not
                just keywords. It finds what you need even if you can&apos;t
                remember the exact words.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gray-900 rounded-2xl border border-gray-800">
              <div className="mb-4 text-4xl">🔍</div>
              <h3 className="mb-3 text-2xl font-bold text-white">
                Find anything, anytime
              </h3>
              <p className="leading-relaxed text-gray-400">
                Search for &quot;blue folder&quot; and it finds &quot;the navy
                blue folder in my desk drawer.&quot; Memoria understands
                meaning, so you don&apos;t need to remember exact phrases from
                months ago.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-gray-900 rounded-2xl border border-gray-800">
              <div className="mb-4 text-4xl">🧠</div>
              <h3 className="mb-3 text-2xl font-bold text-white">
                Your memory, amplified
              </h3>
              <p className="leading-relaxed text-gray-400">
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
      <section id="how-it-works" className="px-6 py-24 bg-black">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Simple by design.
              <br />
              Powerful by nature.
            </h2>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col gap-8 items-start md:flex-row">
              <div className="flex justify-center items-center w-16 h-16 text-2xl font-bold text-white bg-gray-900 rounded-full border border-gray-800 shrink-0">
                01
              </div>
              <div className="flex-1">
                <h3 className="mb-3 text-2xl font-bold text-white">
                  Save it when you think of it
                </h3>
                <p className="text-lg leading-relaxed text-gray-400">
                  That moment when you put something somewhere and think
                  &quot;I&apos;ll remember this&quot;—but you won&apos;t. Just
                  type it into Memoria right then. &quot;Left my charger at
                  Sarah&apos;s place&quot; or &quot;The good coffee shop is on
                  Main Street, second floor.&quot; Takes 5 seconds.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-8 items-start md:flex-row">
              <div className="flex justify-center items-center w-16 h-16 text-2xl font-bold text-white bg-gray-900 rounded-full border border-gray-800 shrink-0">
                02
              </div>
              <div className="flex-1">
                <h3 className="mb-3 text-2xl font-bold text-white">
                  Ask when you need it
                </h3>
                <p className="text-lg leading-relaxed text-gray-400">
                  Later, when you&apos;re standing in your room wondering where
                  your keys are, just ask: &quot;Where are my keys?&quot;
                  Memoria searches through everything you&apos;ve saved and
                  tells you exactly where you left them. No scrolling, no
                  guessing.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-8 items-start md:flex-row">
              <div className="flex justify-center items-center w-16 h-16 text-2xl font-bold text-white bg-gray-900 rounded-full border border-gray-800 shrink-0">
                03
              </div>
              <div className="flex-1">
                <h3 className="mb-3 text-2xl font-bold text-white">
                  It gets smarter as you use it
                </h3>
                <p className="text-lg leading-relaxed text-gray-400">
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
      <section className="px-6 py-24 bg-gray-950">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Why we built this
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-400">
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
      <section className="px-6 py-24 bg-black">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Start building your
            <br />
            second brain today
          </h2>
          <p className="mb-10 text-xl text-gray-400">
            Join thousands of users who never forget anything important
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 text-lg font-semibold text-black bg-white rounded-lg transition-all transform hover:bg-gray-200 hover:scale-105"
          >
            Get Started
          </Link>
          <div className="mt-8 text-sm text-gray-500">
            Free forever • No credit card required • 30-second setup
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col justify-between items-center md:flex-row">
            <div className="mb-4 text-gray-400 md:mb-0">
              © 2025 Memoria. All rights reserved.
            </div>
            <div className="flex gap-6 text-gray-400">
              <a
                href="#features"
                className="transition-colors hover:text-white"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="transition-colors hover:text-white"
              >
                How it Works
              </a>
              <Link
                href="/auth/signup"
                className="transition-colors hover:text-white"
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
