-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);

-- Create index for stripe_customer_id
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);

-- Create index for stripe_subscription_id
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);

-- Create updated_at trigger
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own subscriptions (for free plan)
CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Note: Updates and deletes are handled server-side via Stripe webhooks
-- We don't allow direct user updates/deletes for security

-- Function to get user's current plan
CREATE OR REPLACE FUNCTION get_user_plan(user_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_plan TEXT;
BEGIN
  SELECT plan_type INTO user_plan
  FROM subscriptions
  WHERE user_id = user_uuid
    AND status IN ('active', 'trialing')
    AND (cancel_at_period_end = false OR current_period_end > NOW())
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(user_plan, 'free');
END;
$$;

-- Function to check if user can create more memories
CREATE OR REPLACE FUNCTION can_create_memory(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_plan TEXT;
  memory_count INTEGER;
  memory_limit INTEGER;
BEGIN
  -- Get user's plan
  user_plan := get_user_plan(user_uuid);
  
  -- Get current memory count
  SELECT COUNT(*) INTO memory_count
  FROM memories
  WHERE user_id = user_uuid;
  
  -- Determine memory limit based on plan
  CASE user_plan
    WHEN 'free' THEN memory_limit := 100;
    WHEN 'pro' THEN memory_limit := -1; -- -1 means unlimited
    WHEN 'enterprise' THEN memory_limit := -1;
    ELSE memory_limit := 100; -- Default to free plan limit
  END CASE;
  
  -- Return true if unlimited (-1) or under limit
  RETURN (memory_limit = -1) OR (memory_count < memory_limit);
END;
$$;

