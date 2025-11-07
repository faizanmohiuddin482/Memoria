"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for code in URL (from password reset email)
    const code = searchParams.get("code");
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashCode = hashParams.get("code");
    const resetCode = code || hashCode;

    if (resetCode) {
      // Exchange the code for a session
      supabase.auth
        .exchangeCodeForSession(resetCode)
        .then(({ data, error }) => {
          if (error) {
            setError(
              "Invalid or expired reset link. Please request a new one."
            );
            setCheckingAuth(false);
          } else if (data.session) {
            // Session established, user can now reset password
            setCheckingAuth(false);
            // Clean up URL
            window.history.replaceState({}, "", "/auth/reset-password");
          }
        });
    } else {
      // Check if we already have a session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          // No session and no code - redirect to forgot password
          router.push("/auth/forgot-password");
        } else {
          // User has a session, they're ready to reset password
          setCheckingAuth(false);
        }
      });
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setCheckingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to reset password. The link may have expired."
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
          <p className="text-gray-400">Set your new password</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          {success ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Password reset successful!
              </h2>
              <p className="text-gray-400 mb-4">
                Your password has been updated. Redirecting you to sign in...
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-6 text-center">
                Enter your new password below.
              </p>
              <form onSubmit={handleResetPassword} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-900/30 text-red-400 border border-red-800 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500"
                    placeholder="At least 6 characters"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500"
                    placeholder="Confirm your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? "Resetting..." : "Reset Password"}
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
