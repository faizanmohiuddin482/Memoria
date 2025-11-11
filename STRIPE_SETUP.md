# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payments for Memoria.

## Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Your Memoria app deployed or running locally

## Step 1: Create Stripe Products and Prices

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Products** → **Add Product**
3. Create a product for "Pro Plan":
   - Name: `Pro Plan`
   - Description: `Unlimited memories and advanced features`
   - Pricing: `Recurring` → `Monthly` → `$9.00 USD`
   - Save the **Price ID** (starts with `price_...`)

4. (Optional) Create an "Enterprise Plan" product if needed

## Step 2: Get Your Stripe API Keys

1. In Stripe Dashboard, go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_...`)
3. Copy your **Secret key** (starts with `sk_...`)

⚠️ **Important**: Use test keys for development, live keys for production.

## Step 3: Set Up Webhook Endpoint

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL:
   - **Development**: `http://localhost:3000/api/stripe/webhook` (use Stripe CLI - see below)
   - **Production**: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_...`)

### Using Stripe CLI for Local Development

For local development, use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Or download from: https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will give you a webhook signing secret (starts with `whsec_...`) to use in your `.env.local`.

## Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # From webhook endpoint or Stripe CLI

# Stripe Price IDs (from Step 1)
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...  # Optional

# Your app URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to production URL when deploying
```

## Step 5: Set Up Database Schema

Run the subscription schema in your Supabase SQL Editor:

1. Go to your Supabase project → **SQL Editor**
2. Run the SQL from `database/subscriptions.sql`
3. This creates the `subscriptions` table and helper functions

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the checkout flow:
   - Go to `/pricing`
   - Click "Start Free Trial" on Pro plan
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date, any CVC
   - Complete the checkout

3. Verify in Stripe Dashboard:
   - Check **Customers** for the new customer
   - Check **Subscriptions** for the active subscription
   - Check **Events** for webhook events

4. Verify in your app:
   - Check `/settings` page for subscription status
   - Try creating memories (should work with Pro plan)

## Step 7: Deploy to Production

1. **Update environment variables** in your hosting platform (Netlify/Vercel):
   - Use **live** Stripe keys (not test keys)
   - Update `NEXT_PUBLIC_APP_URL` to your production URL
   - Add the production webhook secret

2. **Update Stripe webhook endpoint**:
   - Change the webhook URL to your production URL
   - Update the webhook secret in your environment variables

3. **Test in production**:
   - Use a real card (or Stripe test mode)
   - Verify webhooks are received
   - Check subscription management works

## Troubleshooting

### Webhooks not working locally

- Use Stripe CLI to forward webhooks (see Step 3)
- Make sure the webhook secret matches what Stripe CLI provides

### Checkout redirects but subscription not created

- Check Stripe Dashboard → **Events** for webhook errors
- Verify webhook endpoint is accessible
- Check server logs for errors

### Memory limit not enforced

- Verify subscription was created in database
- Check `subscriptions` table in Supabase
- Ensure plan enforcement code is running

### "Price ID not configured" error

- Make sure `STRIPE_PRO_PRICE_ID` is set in environment variables
- Verify the price ID exists in Stripe Dashboard

## Security Notes

- ⚠️ Never commit Stripe keys to git
- Use environment variables for all secrets
- Use test keys for development
- Use live keys only in production
- Keep webhook secrets secure

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

