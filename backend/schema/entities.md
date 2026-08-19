# Entity reference

Copied from `base44/entities/*.jsonc` in the source repo, with the AWS
equivalent noted for each. Field names are unchanged so existing frontend code
that reads `ad.vehicleMake`, `ad.status`, etc. keeps working as-is.

## UserAd (`Automax-UserAd` DynamoDB table)

The core listing entity — cars, bikes, boats, and every other vehicle
category the app supports. ~40 fields covering vehicle spec (make, model,
year, fuel, transmission, engine, mileage...), listing metadata (title,
description, price, photos, package/payment info), and seller contact info.

RLS (from `.jsonc`, reimplemented in `entity-api`):
- create: must be logged in, `created_by_id` forced to the caller
- read: `status == "active"` OR caller owns it OR caller is admin
- update/delete: caller owns it OR caller is admin

`status` starts as `pending` on create, flips to `active` only via
`stripeWebhook` after a verified Stripe payment (or `expired` if checkout is
abandoned) — this matches the original app's payment-gated publishing flow.

## Message (`Automax-Message`)

Buyer → seller inquiries sent from `contactSeller`.

RLS: readable/writable by the sender (`created_by_id`), the seller
(`seller_user_id`), or an admin.

## ReportAd (`Automax-ReportAd`)

User-submitted ad reports (misleading listing, spam, fraud, etc).

RLS: readable/writable by the reporter or an admin.

## VerificationCode (`Automax-VerificationCode`)

Short-lived SMS/email OTP codes used during the ad-posting flow to verify a
phone number or email before publishing. Has a DynamoDB TTL attribute so old
codes are automatically purged after 1 hour — Base44 presumably did equivalent
cleanup internally. Only ever written by `sendVerificationCode`/`verifyCode`
using the Lambda's own AWS credentials (the DynamoDB equivalent of Base44's
`asServiceRole`) — the frontend never touches this table directly through
`entity-api`.

## User (`Automax-UserProfile`)

Base44's `User` entity only stored one custom field: `role` (`admin` |
`user`). Everything else about identity — email, password, session — was
Base44's built-in auth, which Cognito now owns. This table is just the
`role` extension, keyed by the Cognito `sub` (user ID).

RLS: a user can read their own profile (or an admin can read anyone's);
nobody can write `role` except an admin (prevents self-promotion to admin).
