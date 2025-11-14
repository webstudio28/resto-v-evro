# Phase 0 – Project Setup & Governance

Structured plan to establish ownership, environments, secrets hygiene, and observability before building new functionality.

## Objectives
- Assign accountable owners for product, engineering, ops, and security decisions.
- Define environment matrix (local/staging/production) with clear deployment + config expectations.
- Catalog every secret/environment variable, with storage and rotation procedures.
- Plan logging, monitoring, and escalation paths for all critical services (Supabase, Stripe, SMS, PWA).

## Ownership & RACI
| Focus Area | Primary Owner | Backup | Responsibilities | Key Artifacts |
| --- | --- | --- | --- | --- |
| Product & Business | Andon (solo founder) | — | Prioritize features, approve scope changes, own ROI targets. | Roadmap, success metrics, rollout plan |
| Technical Lead | Andon | — | Architecture decisions, code quality, CI/CD gates, security posture. | Architecture diagrams, coding standards |
| Reviewer / QA | Andon (self-review) | — | Test strategy, release sign-off, regression tracking. | Test plans, bug tracker |
| Operations & Support | Andon | — | Monitor uptime, manage incidents, customer support responses. | Runbooks, status page updates |
| Security & Compliance | Andon | — | Secrets management, access reviews, audit readiness. | Access control list, compliance checklist |

> Action: maintain this table as the team grows; when new collaborators join, assign backups immediately.

## Environment Matrix
| Environment | Purpose | Branch / Build | Domain / App URL | Supabase Project | Stripe Mode | SMS Provider | Deployment Target | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Local | Dev work, rapid iteration | feature branches | `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA) | `evrolev-local` (service role via `.env.local`) | Stripe Test | SMS sandbox (Twilio/SMS.bg test creds) | Local dev server | Auto-reload + mocked webhooks |
| Staging | Pre-prod validation | `develop` branch | `https://staging.evrolev.app` | `evrolev-staging` | Stripe Test | Twilio test sender or SMS.bg staging | Vercel/Netlify staging | Mirror production config; feature flags allowed |
| Production | Live users | `main` branch | `https://evrolev.app` | `evrolev-prod` | Stripe Live | Twilio/SMS.bg live sender ID | Primary hosting (Vercel/Netlify/Static hosting) | Locked config, audited deploys |

Deliverables:
- DNS + SSL coverage for staging & prod.
- Document deployment commands for each environment (CI job names, manual fallback steps).

## Environment Variables & Secrets Inventory
| Variable | Description | Scope | Storage Location | Rotation Policy |
| --- | --- | --- | --- | --- |
| `VITE_SUPABASE_URL` (or `REACT_APP_SUPABASE_URL`) | Public Supabase URL for REST + auth | Frontend all envs | `.env.*`, CI variables | When Supabase project cloned/renamed |
| `VITE_SUPABASE_ANON_KEY` | Public anon key for client auth | Frontend | `.env.*`, CI secret | Rotate quarterly or after leak |
| `SUPABASE_SERVICE_ROLE_KEY` | High-privilege key for Edge Functions | Edge Functions, tooling | Supabase secrets manager, local `.env.edge` (gitignored) | Rotate every 90 days |
| `STRIPE_SECRET_KEY` | Server-side API key | Edge Functions + CI | Supabase secrets, Stripe dashboard restricted key | Rotate per Stripe best practice |
| `STRIPE_WEBHOOK_SECRET` | Signature verification | Edge Functions | Supabase secrets | Regenerate when endpoint redeployed |
| `ACTIVATION_JWT_SECRET` | Signs activation tokens | Edge Functions | Supabase secrets | Annual rotation |
| `SMS_API_KEY` | SMS provider auth | Edge Functions | Supabase secrets | Per provider policy |
| `SMS_SENDER_ID` | Registered sender short code/name | Edge Functions | Config file or secret | When provider changes |
| `PWA_MANIFEST_URL` / `APP_NAME` | Branding + caching config | Frontend | `.env` or static manifest file | On rebrand |
| `SENTRY_DSN` (optional) | Error tracking | Frontend + Edge Functions | `.env`, secrets | On project reset |

> Action: create per-environment `.env.local`, `.env.staging`, `.env.production` templates (gitignored) that map to the table above.

## Secrets Management Plan
1. **Local Development**
   - Store secrets in `.env.local` (frontend) and `.env.edge.local` (Edge Functions), both already gitignored.
   - Provide encrypted `.env.example.gpg` for onboarding; share decryption key via secure channel.
2. **Supabase Edge Functions**
   - Use Supabase dashboard or CLI `supabase secrets set` for each environment.
   - Enforce least privilege: only required keys per function.
3. **CI/CD**
   - Configure secrets in CI provider (GitHub Actions, Vercel, etc.). Reference by name, never inline.
   - Enable branch protection + required reviews before workflows execute on protected branches.
4. **Access Reviews**
   - Quarterly audit of who can view secrets in Supabase, Stripe, SMS provider, CI.
   - Document approvals in `local_docs/access_log.md` (to be created).
5. **Rotation & Incident Handling**
   - Maintain rotation calendar (e.g., Notion/Jira) referencing table above.
   - If leak suspected, revoke old key, rotate, redeploy, and update incident log.

## Logging, Monitoring & Alerting Blueprint
- **Supabase**
  - Enable Edge Function logs streaming to Supabase dashboard; optionally export to Logflare/Datadog.
  - Track metrics: request count, error rate, latency, activation success/failure ratio.
- **Stripe**
  - Use Stripe Dashboard webhooks tab + email alerts for failures.
  - Configure automatic Slack alert (via webhook) for `payment_intent.payment_failed` and webhook retries > 1.
- **SMS Provider**
  - Poll delivery status API or enable callbacks to a Supabase function endpoint.
  - Alert on delivery failure >5% within 10 minutes.
- **Frontend/PWA**
  - Integrate lightweight error tracker (Sentry/PostHog) for activation errors, offline edge cases.
- **Alert Routing**
  - Create dedicated Slack/MS Teams channel `#evrolev-alerts`.
  - Define severity mapping (see below) and on-call rotation (weekly).

## Escalation Playbook
| Severity | Example Events | Detection | Response Owner | Target Response | Notes |
| --- | --- | --- | --- | --- | --- |
| SEV1 | Stripe webhook down, mass SMS failure, activation endpoint outage | Monitoring alerts, user reports | Ops + Tech Lead | 15 min acknowledgment, 1h mitigation | Pause marketing, update status page |
| SEV2 | Partial SMS delays, single region outage | Monitoring warning | Ops | 1h acknowledgment, 4h mitigation | Communicate via in-app banner |
| SEV3 | Non-blocking bugs, analytics gap | QA or support ticket | Product/Tech Lead | 24h plan | Schedule fix in next sprint |

Document each incident in `local_docs/incidents/` with timestamp, root cause, follow-up actions.

## Deliverables Checklist (Phase 0 Exit Criteria)
- [ ] Owners + backups filled in table and approved.
- [ ] Environment matrix validated (domains reserved, Supabase projects created, Stripe webhook endpoints drafted).
- [ ] `.env.example` templates updated for every environment.
- [ ] Secrets entered into Supabase + CI + SMS provider dashboards; access reviewed.
- [ ] Monitoring channels configured (Slack/Email) with sample alert test.
- [ ] Incident response template added under `local_docs/incidents/README.md`.
- [ ] This document shared with team and added to onboarding materials.

