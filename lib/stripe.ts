import Stripe from "stripe";

// Initialize the Stripe server-side instance
// Ensure STRIPE_API_SECRET is defined in your .env.local
export const stripe = new Stripe(process.env.STRIPE_API_SECRET || "sk_test_12345", {
  apiVersion: "2024-06-20", // Pin to the latest stable API version for reliable subscription handling
  typescript: true,
});
