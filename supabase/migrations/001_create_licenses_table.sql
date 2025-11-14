-- Create licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  activated BOOLEAN DEFAULT FALSE NOT NULL,
  device_id TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  activated_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  stripe_event_id TEXT UNIQUE, -- For idempotency in webhook retries
  CONSTRAINT key_format CHECK (char_length(key) >= 20)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(key);
CREATE INDEX IF NOT EXISTS idx_licenses_device_id ON licenses(device_id) WHERE device_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_licenses_activated ON licenses(activated);
CREATE INDEX IF NOT EXISTS idx_licenses_stripe_event_id ON licenses(stripe_event_id) WHERE stripe_event_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Deny all access by default (only service role can access)
CREATE POLICY "Deny all public access" ON licenses
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Allow service role full access (Edge Functions use service role)
-- This policy is implicit when using service role key, but explicit for clarity
COMMENT ON TABLE licenses IS 'License keys for Evrolev app activation. Only accessible via Supabase Edge Functions using service role key.';

