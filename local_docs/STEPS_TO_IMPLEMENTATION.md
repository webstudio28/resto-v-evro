# Steps to Implementation

This plan converts the existing React app into a secure, reliable, and commercial-ready product with PWA, license activation, Supabase backend, Stripe payments, and SMS fulfillment.

## Phase 0 – Project Setup & Governance
- Confirm ownership: assign technical lead, reviewer, and operations contact.
- Create environment matrix (local, staging, production) and document env vars for Supabase, Stripe, SMS, and PWA settings.
- Configure secrets management (e.g., Supabase project secrets, Stripe dashboard, `.env.local` with gitignore). Never hardcode keys.
- Establish logging/monitoring destinations (Supabase logs, Stripe dashboard, SMS provider logs) and escalation playbook.

## Phase 1 – PWA & Frontend Foundations
- Audit existing React app for build tooling (CRA/Vite/Next). Document entry points and routing.
- Add `manifest.json` with app metadata, icons, display `standalone`, theme colors, and short name.
- Implement service worker via Workbox (preferred) or framework template:
  - Precache shell assets, cache API responses with stale-while-revalidate, handle SW updates.
  - Provide offline fallback UI for network failures.
- Implement install prompts and update notifications.
- Introduce device identifier management using `uuid` stored in `localStorage`.
- Add License Activation view:
  - Inputs: license key, optional diagnostics.
  - POST `/activate` call, handle responses, show status, persist activation token/device ID.
- Add guarded app entry: block main features until activation succeeds; cache activation state for offline use.
- Implement telemetry hooks (non-PII) to log activation attempts and errors (Supabase Edge endpoint).

## Phase 2 – Supabase Backend
- Create `licenses` table:
  - `id` (uuid default gen_random_uuid())
  - `key` (text unique not null)
  - `activated` (boolean default false)
  - `device_id` (text)
  - `phone` (text)
  - `created_at`, `activated_at` timestamps
  - Optional `metadata` JSONB for audit.
- Write SQL policies (RLS) so only Edge Functions access the table (service role key) while anon key has no access.
- Implement Edge Function `stripe-webhook`:
  - Validate Stripe signature header.
  - On successful checkout session, generate unique license key, insert into `licenses`, enqueue SMS send, log results.
  - Handle retries idempotently (use Stripe event id).
- Implement Edge Function `activate-license`:
  - Accept license key + device id.
  - Validate: key exists, not activated (or matches same device for reactivation), optionally rate-limit by IP/device.
  - Mark license activated, persist device id + timestamp, return short-lived activation token/JWT for client caching.
- Add structured logging, correlation IDs, and error responses (no sensitive data).
- Write unit tests (Deno) for helper modules (key generation, payload validation).

## Phase 3 – Stripe Integration
- Set up Stripe products/price for license, enable phone number collection in Checkout settings.
- Build Checkout session creation (if needed) or use hosted link; ensure redirect to “Thanks” page with instructions.
- Configure webhook endpoint URL to Supabase Edge function; store webhook secret in Supabase config.
- Test purchase flow in Stripe test mode end-to-end (payment → webhook → DB insert → SMS send).
- Define refund/cancellation policy and how licenses are revoked (manual script or Edge function).

## Phase 4 – SMS Provider Integration
- Choose provider (Twilio or Bulgarian alternative) based on pricing/compliance.
- Obtain credentials, store as Supabase secrets.
- Build reusable SMS module in Edge Function:
  - Compose localized message with license key and brief instructions.
  - Implement retry/backoff and error logging.
- Verify sender ID requirements for Bulgaria and register if needed.
- Send test messages to confirm delivery latency and character set.

## Phase 5 – Security & Reliability Enhancements
- Enforce HTTPS everywhere; ensure PWA served over secure origin.
- Add rate limiting/abuse protection on activation endpoint (per IP + per device).
- Implement license key entropy check (e.g., 20+ chars, mixed charset) and secure RNG.
- Add audit trail: log every activation attempt with timestamp/IP/device hash.
- Monitor Supabase Edge function metrics; configure alerts for failures.
- Document incident response checklist (lost keys, SMS outage, Stripe webhook failure).

## Phase 6 – QA & Testing
- Frontend tests: unit (Jest/Vitest) for device-id + activation storage, integration tests for offline flows.
- Manual QA scenarios:
  - Purchase → SMS receipt
  - License activation success/failure/offline
  - Reinstall app with existing activation token
  - Device change (should prompt new activation)
- Load tests on activation endpoint (simulate high volume).
- Penetration checklist: inspect SW caches, ensure no secrets shipped, verify CORS and headers.

## Phase 7 – Deployment & Launch
- Automate builds (CI) for frontend + Edge Functions; run tests + lint.
- Configure hosting (e.g., Vercel/Netlify/Static site) with service worker support and cache headers.
- Deploy Supabase migrations via CLI and lock schema.
- Perform end-to-end staging test with real Stripe + SMS sandbox before production cutover.
- Prepare customer support materials: FAQ, troubleshooting steps, contact info.
- Launch communication plan and monitoring dashboard for first 72 hours.

## Phase 8 – Post-Launch Operations
- Schedule periodic key rotations and sanity checks (unused licenses, suspicious activity).
- Review metrics weekly (activations, failed SMS, Stripe disputes).
- Collect customer feedback, iterate on UX and reliability improvements.
- Keep dependencies updated (Workbox, Supabase client, Stripe SDK) and re-run regression suite after upgrades.

