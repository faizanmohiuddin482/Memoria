"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.push("/app");
      } else {
        setCheckingAuth(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.push("/app");
      } else {
        setCheckingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Use environment variable if available, otherwise use current origin
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      // Redirect directly to reset password page - it will handle the code exchange
      const redirectUrl = `${appUrl}/auth/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to send reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold text-white mb-2 inline-block"
          >
            Memoria
          </Link>
          <p className="text-gray-400">Reset your password</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          {success ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Check your email
              </h2>
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-blue-300 text-sm font-medium mb-2">
                  📧 Password reset link sent
                </p>
                <p className="text-blue-400 text-sm">
                  We&apos;ve sent a password reset link to{" "}
                  <strong>{email}</strong>. Please check your inbox and click
                  the link to reset your password.
                </p>
              </div>
              <Link
                href="/auth/login"
                className="inline-block mt-4 text-blue-500 hover:text-blue-400 text-sm transition-colors"
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-6 text-center">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
              <form onSubmit={handleResetPassword} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-900/30 text-red-400 border border-red-800 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ← Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
