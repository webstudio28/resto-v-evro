# Phase 1 – PWA & Frontend Foundations

Build a resilient installable React experience with offline capability and license-aware gating before backend integration.

## Objectives
- Confirm current React toolchain and prepare it for PWA requirements.
- Provide install prompts, offline caching, and update UX via service worker + manifest.
- Establish device identity + activation UI scaffolding.
- Capture lightweight telemetry for later backend consumption.

## Prerequisites
- Phase 0 checklist completed (owners, secrets, incident template, monitoring plan).
- Local/staging environment URLs + SSL in place so PWA requirements (HTTPS) are satisfied.
- Access to current design system/assets for icons & splash screens.

## Step 1 – Application Audit
1. Identify build tool (CRA, Vite, Next). Record commands for dev/build/test.
2. Map routes/components, especially entry screen and protected areas.
3. Note existing state management solution (Redux, Zustand, Context) for storing activation state.
4. Document current network calls to ensure service worker caching rules don’t break APIs.
5. Create `local_docs/frontend_audit.md` capturing the above for future contributors.

## Step 2 – Manifest & Assets
1. Generate `public/manifest.json` (or `src/manifest.json` depending on bundler) with:
   - `name`, `short_name`, `description`, `display: "standalone"`.
   - Color theme + background color (match branding).
   - Icon set: 192px, 512px PNGs + maskable variant.
2. Produce splash screens / favicons using Figma or PWA icon generator; store source files in `assets/brand/`.
3. Reference manifest + icons in `index.html` (or framework equivalent) and verify Lighthouse PWA checklist locally.

## Step 3 – Service Worker Architecture
1. Decide between Workbox build (recommended) or custom SW:
   - If Workbox: add `workbox-build` or `@vite-pwa/plugin`, configure precache manifest.
   - If CRA: enable service worker via `cra-template-pwa` or manual SW registration.
2. Caching strategy (Workbox recipes):
   - `app-shell` precache (versioned build assets).
   - `NetworkFirst` for API calls to `/activate` (ensures latest status).
   - `StaleWhileRevalidate` for static JSON/config, fonts, images.
   - Provide offline fallback route (e.g., `offline.html`) for navigation requests.
3. Implement SW lifecycle handling:
   - Notify UI when a new version is available; show “Update available” toast with reload button.
   - Gracefully handle registration errors and log to console/telemetry.
4. Write `scripts/sw-audit.md` describing caching rules and update policy.

## Step 4 – Install & Update UX
1. Hook into `beforeinstallprompt` event to display custom “Install App” CTA on desktop/mobile (respecting browsers that block repeated prompts).
2. Add instructions modal for iOS Safari (Add to Home Screen).
3. Persist user preference when they dismiss the prompt; re-offer after X days.
4. Provide update banner when SW detects new assets (interaction with Step 3).

## Step 5 – Device Identity Layer
1. Install `uuid` (or reuse `crypto.randomUUID` when available) to generate `deviceId`.
2. Create utility `src/lib/deviceId.ts` that:
   - Reads existing ID from `localStorage`.
   - Generates + stores new ID if absent.
   - Exposes helper to reset (for debugging) guarded behind feature flag.
3. Document storage format + key names in `local_docs/frontend_state.md`.

## Step 6 – License Activation UI
1. Design `ActivationScreen` component with:
   - License key input, optional diagnostics toggle, submit button.
   - Status indicators (idle/loading/success/error) and offline notice.
2. Stub POST `/activate` call with mock responses until backend ready; place logic in `src/api/activation.ts`.
3. Store activation state (`activationToken`, `deviceId`, timestamps) in a persistent store (localStorage + React context).
4. Add error surfaces: invalid key, already used, network failure, rate-limit.
5. Provide debugging panel (hidden behind `localStorage.DEBUG_ACTIVATION`) to inspect stored tokens.

## Step 7 – Guarded App Entry & Offline Behavior
1. Wrap main router with `ActivationGate`:
   - If activation missing/expired, redirect to `ActivationScreen`.
   - When offline but previously activated, allow access and show “Offline mode” banner.
2. Cache critical license data in IndexedDB/localStorage so offline refresh keeps user unlocked.
3. Implement fallback UI for network-only features (e.g., disable purchase button offline).
4. Add smoke tests ensuring gate logic doesn’t trap legitimate users (e.g., when backend temporarily unreachable).

## Step 8 – Telemetry & Diagnostics
1. Define lightweight event schema (`activation_attempt`, `activation_success`, `sw_update`, `install_prompt_shown`) with anonymized device ID.
2. Queue events locally and POST to a stub endpoint (Supabase Edge placeholder) with retry/backoff.
3. Capture user-agent + app version to help debug field issues.
4. Provide toggle to opt out (respecting privacy preferences).

## Testing & QA
- Automated:
  - Unit tests for `deviceId` util and activation state store.
  - Integration tests (React Testing Library/Cypress) covering ActivationScreen and ActivationGate flows.
  - Service worker tests via Workbox CLI (`workbox wizard --injectManifest`) or Playwright offline scenarios.
- Manual:
  - Install prompt on Chrome desktop, Android Chrome, iOS Safari instructions.
  - Offline load (airplane mode) verifying cached shell + activation persistence.
  - Update flow: deploy new build, confirm “Update available” UX.

## Deliverables Checklist
- [ ] `local_docs/frontend_audit.md` completed.
- [ ] `manifest.json` + icon set checked into repo; Lighthouse PWA score ≥ 90.
- [ ] Service worker registered with documented caching strategies and update UX.
- [ ] Device ID utility + documentation added; activation state persisted locally.
- [ ] Activation screen + guarded routing implemented with mock API.
- [ ] Telemetry hooks emitting stubbed events.
- [ ] Test suite updated (unit + integration) and manual QA notes logged.

