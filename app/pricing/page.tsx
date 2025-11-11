"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getStripe } from "@/lib/stripe/client";

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCheckout = async (planType: string) => {
    if (!user) {
      router.push(`/auth/signup?plan=${planType}`);
      return;
    }

    setCheckoutLoading(planType);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      const stripe = await getStripe();
      if (stripe && data.url) {
        await stripe.redirectToCheckout({ url: data.url });
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Failed to start checkout");
    } finally {
      setCheckoutLoading(null);
    }
  };

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

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Up to 100 memories",
        "Unlimited searches",
        "AI-powered semantic search",
        "Natural language queries",
        "Basic support",
      ],
      cta: "Get Started",
      ctaLink: "/auth/signup",
      planType: "free",
      popular: false,
      highlight: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "For power users who need more",
      features: [
        "Unlimited memories",
        "Unlimited searches",
        "AI-powered semantic search",
        "Natural language queries",
        "Priority support",
        "Export memories",
        "Advanced search filters",
        "Memory organization",
      ],
      cta: "Start Free Trial",
      ctaLink: "/auth/signup?plan=pro",
      planType: "pro",
      popular: true,
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Shared memory spaces",
        "Advanced analytics",
        "Dedicated support",
        "Custom integrations",
        "SSO & security",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      ctaLink: "mailto:sales@memoria.ai",
      planType: "enterprise",
      popular: false,
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-sm bg-black/80">
        <div className="container px-6 py-4 mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-white transition-colors hover:text-gray-300"
            >
              Memoria
            </Link>
            <div className="flex gap-6 items-center">
              <Link
                href="/#features"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Features
              </Link>
              <Link href="/pricing" className="font-medium text-white">
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

      {/* Pricing Header */}
      <section className="px-6 pt-20 pb-16">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-400">
            Choose the plan that fits your needs. Start free, upgrade anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-gray-900 rounded-2xl p-8 border ${
                  plan.highlight
                    ? "border-white shadow-2xl shadow-white/10 scale-105"
                    : "border-gray-800"
                } transition-all duration-300 hover:border-gray-700`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 text-sm font-semibold text-black bg-white rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {plan.name}
                  </h3>
                  <p className="mb-4 text-sm text-gray-400">
                    {plan.description}
                  </p>
                  <div className="flex gap-2 items-baseline">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-gray-400">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {plan.planType === "pro" && user ? (
                  <button
                    onClick={() => handleCheckout(plan.planType)}
                    disabled={checkoutLoading === plan.planType}
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all mb-8 ${
                      plan.highlight
                        ? "bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                        : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 disabled:opacity-50"
                    }`}
                  >
                    {checkoutLoading === plan.planType ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⟳</span>
                        Loading...
                      </span>
                    ) : (
                      plan.cta
                    )}
                  </button>
                ) : (
                  <Link
                    href={plan.ctaLink}
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all mb-8 ${
                      plan.highlight
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}

                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex gap-3 items-start text-gray-300"
                    >
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-24 bg-gray-950">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-12 text-3xl font-bold text-center text-white">
            Frequently asked questions
          </h2>
          <div className="space-y-8">
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="mb-2 text-xl font-semibold text-white">
                Can I change plans later?
              </h3>
              <p className="text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately, and we&apos;ll prorate any charges.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="mb-2 text-xl font-semibold text-white">
                What happens to my memories if I cancel?
              </h3>
              <p className="text-gray-400">
                Your memories are yours. You can export all your data before
                canceling, and we&apos;ll keep your account active for 30 days
                after cancellation.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="mb-2 text-xl font-semibold text-white">
                Do you offer refunds?
              </h3>
              <p className="text-gray-400">
                Yes, we offer a 30-day money-back guarantee on all paid plans.
                No questions asked.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="mb-2 text-xl font-semibold text-white">
                Is my data secure?
              </h3>
              <p className="text-gray-400">
                Absolutely. All your memories are encrypted at rest and in
                transit. We use industry-standard security practices and never
                share your data with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Ready to get started?
          </h2>
          <p className="mb-8 text-xl text-gray-400">
            Join thousands of users who never forget anything important.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 text-lg font-semibold text-black bg-white rounded-lg transition-all transform hover:bg-gray-200 hover:scale-105"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
