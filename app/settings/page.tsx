"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { AuthGuard } from "@/app/components/AuthGuard";

interface Subscription {
  planType: string;
  status: string;
  memoryLimit: number;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    user_metadata?: { first_name?: string; last_name?: string };
  } | null>(null);

  useEffect(() => {
    fetchSubscription();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    setUser(currentUser);
  };

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/stripe/subscription");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You'll continue to have access until the end of your billing period."
      )
    ) {
      return;
    }

    setCanceling(true);

    try {
      const response = await fetch("/api/stripe/subscription", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      // Refresh subscription data
      await fetchSubscription();
      alert("Subscription canceled. You'll have access until the end of your billing period.");
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800 w-full py-4 mb-8">
          <div className="flex items-center justify-between w-full px-6">
            <Link
              href="/app"
              className="text-2xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Memoria
            </Link>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-400">
                  {user.user_metadata?.first_name || user.email || "User"}
                </span>
              )}
              <Link
                href="/app"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Back to App
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

          {/* Subscription Section */}
          <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Subscription
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin text-2xl text-gray-400 mb-4">
                  ⟳
                </div>
                <p className="text-gray-400">Loading subscription...</p>
              </div>
            ) : subscription ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Current Plan</span>
                    <span className="text-xl font-bold text-white capitalize">
                      {subscription.planType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Status</span>
                    <span
                      className={`font-semibold capitalize ${
                        subscription.status === "active"
                          ? "text-green-400"
                          : subscription.status === "trialing"
                          ? "text-blue-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {subscription.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Memory Limit</span>
                    <span className="text-white">
                      {subscription.memoryLimit === -1
                        ? "Unlimited"
                        : subscription.memoryLimit}
                    </span>
                  </div>
                  {subscription.currentPeriodEnd && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">
                        {subscription.cancelAtPeriodEnd
                          ? "Access Until"
                          : "Next Billing Date"}
                      </span>
                      <span className="text-white">
                        {formatDate(subscription.currentPeriodEnd)}
                      </span>
                    </div>
                  )}
                </div>

                {subscription.planType !== "free" && (
                  <div className="pt-6 border-t border-gray-800">
                    {subscription.cancelAtPeriodEnd ? (
                      <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-4">
                        <p className="text-yellow-300 text-sm">
                          Your subscription will be canceled on{" "}
                          {formatDate(subscription.currentPeriodEnd)}. You'll
                          continue to have access until then.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href="/pricing"
                          className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all text-center"
                        >
                          Change Plan
                        </Link>
                        <button
                          onClick={handleCancelSubscription}
                          disabled={canceling}
                          className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all border border-gray-700 disabled:opacity-50"
                        >
                          {canceling ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="animate-spin">⟳</span>
                              Canceling...
                            </span>
                          ) : (
                            "Cancel Subscription"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {subscription.planType === "free" && (
                  <div className="pt-6 border-t border-gray-800">
                    <Link
                      href="/pricing"
                      className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all"
                    >
                      Upgrade to Pro
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">
                  Unable to load subscription information.
                </p>
                <button
                  onClick={fetchSubscription}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
          </section>

          {/* Account Section */}
          <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6">Account</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Email</span>
                <span className="text-white">{user?.email || "N/A"}</span>
              </div>
              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/");
                  }}
                  className="px-6 py-3 bg-red-900/20 text-red-400 font-semibold rounded-lg hover:bg-red-900/30 transition-all border border-red-800"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AuthGuard>
  );
}

