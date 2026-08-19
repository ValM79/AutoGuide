# AutoGuide

A fully self-hosted, functionally identical clone of **automax.ie** (currently
live on Base44), rebuilt on AWS under a separate hosting name so the real
Base44-hosted site is never touched during development. Once this is verified
side-by-side against the live app, DNS can be cut over — see
[`backend/README.md`](backend/README.md) for that step.

## Why a monorepo

This repo intentionally combines the frontend (originally `ValM79/auto-max`)
and backend (originally `ValM79/automax-aws-migration`) in one place instead
of two. The reason: this is a from-scratch backend rewrite, not a re-host —
the frontend's API calls and the Lambda handlers/entity schema have to match
exactly, and keeping them in one repo means a single commit can change both
sides atomically instead of risking the two drifting out of sync across
separate repos with separate version histories.

- `ValM79/auto-max` and `ValM79/automax-aws-migration` still exist standalone
  and are untouched — this repo is the consolidated, wired-together version
  going forward.

## Layout

```
AutoGuide/
├── frontend/    React + Vite + Tailwind + shadcn/ui app (from auto-max),
│                with the Base44 SDK swapped for the AWS backend below
└── backend/     AWS CDK stack + Lambda functions (from automax-aws-migration)
    ├── cdk/         Cognito, DynamoDB, S3/CloudFront, API Gateway, Secrets Manager
    ├── lambda/      9 ported Base44 functions + entity-api + presignUpload
    └── schema/      Entity/RLS mapping notes
```

## What changed to actually wire them together

The original `automax-aws-migration` package shipped a `frontend-shim/` folder
meant to be dropped into `auto-max` as-is. Doing that for real surfaced three
gaps that a file-by-file copy wouldn't have caught — fixed here:

1. **`src/lib/AuthContext.jsx`** imported `createAxiosClient` straight from
   `@base44/sdk` to call a Base44-platform-only `/api/apps/public/.../public-settings`
   endpoint before checking user auth. That endpoint doesn't exist in the AWS
   backend. Rewritten to check the Cognito token directly — same context shape,
   so no other file needed changes.
2. **`CreateAccount.jsx`'s submit handler was a no-op stub** in the real repo
   (confirmed by reading the code, not assumed) — signup didn't call anything
   at all, on Base44 or otherwise. Wired to Cognito's `SignUp`/`ConfirmSignUp`
   with a confirmation-code step.
3. **`ForgotPassword.jsx`/`ResetPassword.jsx` assumed a clickable reset-link
   token in the URL.** Cognito's built-in `ForgotPassword` flow emails a
   6-digit code, not a link. `ResetPassword.jsx` now collects email + code +
   new password directly instead of reading a token from the query string.

`@base44/sdk` and `@base44/vite-plugin` are fully removed from
`frontend/package.json` and `frontend/vite.config.js` — nothing else in the
app referenced them (checked via repo-wide search before removing).

## Getting started

```bash
# 1. Deploy the backend (see backend/README.md for full details/prereqs)
cd backend/cdk && npm install && npx cdk bootstrap
cd ../lambda && npm install
cd ../cdk && npm run deploy
# → prints ApiUrl, UserPoolId, UserPoolClientId, UserPoolDomain, etc.

# 2. Point the frontend at it
cd ../../frontend
cp .env.example .env.local   # fill in the values from step 1
npm install
npm run dev
```

By default `cdk deploy` provisions an auto-generated CloudFront domain, not
automax.ie — safe to test end-to-end before any DNS change. See
[`backend/README.md`](backend/README.md) for the full deploy/testing
checklist and the DNS cutover steps.

## Status

Not yet deployed to AWS. See [`CLAUDE.md`](CLAUDE.md) for open items.
