import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@14';

export default async function(req: Request): Promise<Response> {
  try {
    // Create the base44 client BEFORE Stripe signature validation (per Base44
    // guide: "do the base44 auth — after setting the token from request.headers
    // — before any Stripe signature validation"). Webhook requests come from
    // Stripe's servers with no user auth — asServiceRole is used for entity
    // updates since there is no authenticated user.
    const base44 = createClientFromRequest(req);

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    let event;
    try {
      // Must use async constructEventAsync — synchronous constructEvent() throws
      // "SubtleCryptoProvider cannot be used in a synchronous context" in Deno.
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET')
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const adId = session.metadata?.ad_id;

      if (adId) {
        // Write paid properties from verified Stripe metadata only — never trust
        // client-supplied values, since those can be tampered with before payment.
        // paymentAmount and receiptUrl are set ONLY here after a verified Stripe
        // payment, so they serve as proof of genuine payment in PaymentHistory.
        await base44.asServiceRole.entities.UserAd.update(adId, {
          status: 'active',
          packageName: session.metadata?.package_name || '',
          listingDays: parseInt(session.metadata?.listing_days || '0', 10),
          spotlight: parseInt(session.metadata?.spotlight_days || '0', 10) > 0,
          paymentAmount: session.amount_total || 0,
          receiptUrl: session.receipt_url || ''
        });
        console.log(`Ad ${adId} activated after payment ${session.id}, amount: ${session.amount_total}`);
      } else {
        console.error('No ad_id in session metadata for session', session.id);
      }
    } else if (event.type === 'checkout.session.expired') {
      // User abandoned checkout — mark the pending ad as expired so it doesn't
      // linger indefinitely as "pending" in My Ads.
      const session = event.data.object;
      const adId = session.metadata?.ad_id;
      if (adId) {
        await base44.asServiceRole.entities.UserAd.update(adId, {
          status: 'expired'
        });
        console.log(`Ad ${adId} marked expired after checkout session expired`);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}