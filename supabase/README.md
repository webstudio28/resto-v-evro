# Supabase Backend Setup

This directory contains the Supabase database migrations and Edge Functions for the Evrolev PWA.

## Structure

- `migrations/` - SQL migration files for database schema
- `functions/` - Deno Edge Functions
  - `activate-license/` - License activation endpoint
  - `stripe-webhook/` - Stripe payment webhook handler
  - `_shared/` - Shared utility modules

## Setup Instructions

### 1. Install Supabase CLI

**Windows Installation Options:**

**Option A: Using Scoop (Recommended)**
```powershell
# Install Scoop if you don't have it
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Install Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Option B: Using Chocolatey**
```powershell
choco install supabase
```

**Option C: Download Binary**
1. Download the latest Windows binary from [Supabase CLI Releases](https://github.com/supabase/cli/releases)
2. Extract and add to your PATH

**Option D: Use npx (for one-off commands)**
```bash
npx supabase@latest <command>
```

**Verify Installation:**
```bash
supabase --version
```

### 2. Initialize Supabase (if not already done)

```bash
supabase init
```

### 3. Link to your Supabase project

```bash
supabase link --project-ref your-project-ref
```

### 4. Run migrations

```bash
supabase db push
```

### 5. Deploy Edge Functions

```bash
supabase functions deploy activate-license
supabase functions deploy stripe-webhook
```

### 6. Set Environment Variables

Set these secrets in Supabase Dashboard → Project Settings → Edge Functions:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (bypasses RLS)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `ACTIVATION_JWT_SECRET` - Secret for signing activation tokens
- `SMS_API_KEY` - SMS provider API key (Phase 4)
- `SMS_SENDER_ID` - SMS sender ID (Phase 4)

Or use CLI:

```bash
supabase secrets set SUPABASE_URL=your-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key
# ... etc
```

## Testing Locally

```bash
# Start local Supabase
supabase start

# Test Edge Functions locally
supabase functions serve activate-license
supabase functions serve stripe-webhook
```

## Frontend Configuration

Add these environment variables to your `.env.local` file:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

The frontend will automatically use these to call the Edge Functions.

## API Endpoints

### POST /activate-license

Activate a license key for a device.

**Request:**
```json
{
  "licenseKey": "EVRO-XXXX-XXXX-XXXX-XXXX",
  "deviceId": "uuid-here"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "message": "License activated successfully"
}
```

### POST /stripe-webhook

Stripe webhook endpoint (configured in Stripe Dashboard).

## Database Schema

See `migrations/001_create_licenses_table.sql` for the licenses table schema.

