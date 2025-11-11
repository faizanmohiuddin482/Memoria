import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// Plan configurations
export const PLANS = {
  free: {
    name: "Free",
    priceId: null, // No Stripe price ID for free plan
    memoryLimit: 100,
    price: 0,
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID || "", // Set this in your Stripe dashboard
    memoryLimit: -1, // -1 means unlimited
    price: 9,
  },
  enterprise: {
    name: "Enterprise",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "", // Set this in your Stripe dashboard
    memoryLimit: -1,
    price: 0, // Custom pricing
  },
} as const;

export type PlanType = keyof typeof PLANS;

