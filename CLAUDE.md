# AutoGuide — automax.ie clone on AWS

## What this project is

A fully self-hosted, functionally identical rebuild of automax.ie (a
Base44-built Irish car/vehicle marketplace, live app name "AutoMarket"),
deployed to AWS under a separate hosting name so the live Base44 site is
never touched. Base44's export only gives you the frontend — DB, auth, and
backend functions stay on Base44's managed platform — so this is a full
backend rebuild, not a re-host.

- Live Base44 app: `https://app--auto-market-fa44f23a.base44.app/`
- This repo consolidates two previously separate repos:
  - `github.com/ValM79/auto-max` — the original Base44 frontend export
  - `github.com/ValM79/automax-aws-migration` — the AWS backend package
    (CDK + Lambda), reverse-engineered directly from
    `base44/entities/*.jsonc` and `base44/functions/*/entry.ts` in the
    frontend export
- Both source repos still exist standalone and are untouched by this work.

## Architecture decision: monorepo

Chosen over keeping frontend/backend as two repos because this is a rewrite
where the two sides have to match exactly (API shape, entity fields, RLS
rules) — one repo means atomic commits across both instead of version drift.
See `README.md` for the full rationale and layout.

## What's built and wired (this repo)

- `backend/cdk/` — Cognito, 5 DynamoDB tables, S3 + CloudFront, API Gateway,
  Secrets Manager.
- `backend/lambda/` — all 9 original Base44 functions ported to Node 20
  Lambda, plus `entity-api` (generic CRUD + RLS) and `presignUpload`.
- `frontend/` — the real `auto-max` app with the Base44 SDK actually wired to
  the AWS backend (not just shim files sitting next to the old code):
  - `src/api/base44Client.js` replaced, talking to API Gateway + Cognito.
  - `src/lib/AuthContext.jsx` rewritten to drop the direct `@base44/sdk`
    import it had for a platform-only "app public settings" check.
  - `src/pages/AuthCallback.jsx` added + routed for Google/Apple OAuth.
  - `src/pages/CreateAccount.jsx` wired to Cognito sign-up + email
    confirmation (previously a dead no-op stub in the real repo — verified
    by reading the code, not assumed).
  - `src/pages/ForgotPassword.jsx` / `ResetPassword.jsx` fixed to use
    Cognito's actual code-based reset flow instead of a link-token flow that
    the shim never implemented.
  - `@base44/sdk` and `@base44/vite-plugin` fully removed from
    `package.json`/`vite.config.js`.

## Open items — verify before treating this as done

1. **Nothing deployed to AWS yet.** `backend/cdk` has never been `cdk deploy`'d.
   This is a package ready to deploy, not a live environment.
2. **Production data hasn't been migrated.** This repo has code, not the live
   listings/users/messages. Need Base44 Builder/API access to export that
   data, or a decision to launch fresh and let users re-register. See
   `backend/README.md` § "Migrating your existing data".
3. **Stripe/Twilio/Resend/Irish NCR API keys** are still placeholders — need
   real values in Secrets Manager (`automax/app-secrets`) per
   `backend/README.md`.
4. **Google/Apple social login** needs your own OAuth app credentials
   registered in Cognito before "Continue with Google/Apple" will work —
   email/password works without it.
5. **Signup flow is now wired but untested end-to-end** against a real
   deployed Cognito pool (no backend has been deployed yet to test against).

## Recommended sequence

1. `cd backend/cdk && npm install && npx cdk bootstrap && cd ../lambda && npm install && cd ../cdk && npm run deploy`
   — deploys to an auto-generated CloudFront domain by default (not
   automax.ie), safe to test before cutover.
2. Fill in real secrets, `cp frontend/.env.example frontend/.env.local` with
   the `cdk deploy` output values, `npm run dev` and walk the testing
   checklist in `backend/README.md`.
3. Migrate production data (or decide to launch fresh).
4. Test everything against the staging CloudFront domain, side-by-side with
   the live Base44 app.
5. Once verified identical, redeploy with `AUTOMAX_DOMAIN_NAME`/
   `AUTOMAX_CERT_ARN` set and cut over DNS for the real hosting name.

## A reusable skill exists for this class of task

`.claude/skills/base44-to-aws-migration/` (if present) captures the general
Base44→AWS migration process as a skill, generalized beyond this one project.
