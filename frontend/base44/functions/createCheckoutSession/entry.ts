import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@14';

// Server-side package configuration — the client sends only the package name
// and isBikeCategory flag; ALL paid properties (listingDays, maxPhotos, bumps,
// spotlightDays, etc.) are resolved here so they cannot be tampered with client-side.
const PACKAGE_CONFIG = {
  'Basic':     { priceId: 'price_1Tt1psLCaYSUWHrbcDdYqXfZ', listingDays: 60, maxPhotos: 12, bumps: 0, bumpIntervalWeeks: 0,  spotlightDays: 0 },
  'Standard':  { priceId: 'price_1Tt1psLCaYSUWHrb387Sse6E', listingDays: 72, maxPhotos: 12, bumps: 2, bumpIntervalWeeks: 4,  spotlightDays: 0 },
  'Premium':   { priceId: 'price_1Tt1psLCaYSUWHrbL4OVWgEl', listingDays: 90, maxPhotos: 12, bumps: 3, bumpIntervalWeeks: 3,  spotlightDays: 5 },
};

// Bike categories use lower pricing tiers
const BIKE_PACKAGE_CONFIG = {
  'Basic':     { priceId: 'price_1Tt2C2LCaYSUWHrbr90lNcHP', listingDays: 30, maxPhotos: 12, bumps: 0, bumpIntervalWeeks: 0,  spotlightDays: 0 },
  'Standard':  { priceId: 'price_1Tt1psLCaYSUWHrbnEu57cEf', listingDays: 60, maxPhotos: 12, bumps: 2, bumpIntervalWeeks: 4,  spotlightDays: 0 },
  'Premium':   { priceId: 'price_1Tt1psLCaYSUWHrbZM6RqiAG', listingDays: 90, maxPhotos: 12, bumps: 3, bumpIntervalWeeks: 3,  spotlightDays: 5 },
};

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);

    const { packageName, adId, isBikeCategory } = await req.json();

    const configMap = isBikeCategory ? BIKE_PACKAGE_CONFIG : PACKAGE_CONFIG;
    if (!packageName || !configMap[packageName]) {
      return Response.json({ error: 'Invalid or missing package' }, { status: 400 });
    }
    if (!adId) {
      return Response.json({ error: 'adId is required' }, { status: 400 });
    }

    // Resolve ALL paid properties server-side — client-supplied values are ignored
    const pkg = configMap[packageName];
    const listingDays = pkg.listingDays;
    const maxPhotos = pkg.maxPhotos;
    const bumps = pkg.bumps;
    const bumpIntervalWeeks = pkg.bumpIntervalWeeks;
    const spotlightDays = pkg.spotlightDays;

    // Use user-scoped SDK to enforce RLS ownership checks — only the ad's
    // creator (created_by_id matching the requesting user) can retrieve a
    // pending ad. asServiceRole would bypass RLS and allow any caller to
    // initiate checkout for an arbitrary adId.
    let ad;
    try {
      ad = await base44.entities.UserAd.get(adId);
    } catch {
      return Response.json({ error: 'Ad not found' }, { status: 404 });
    }
    if (ad.status !== 'pending') {
      return Response.json({ error: 'Ad is not in a payable state' }, { status: 400 });
    }

    // Determine the app origin for redirect URLs.
    // The Origin header (sent by the browser when the frontend SDK invokes this
    // function) reliably gives the app's frontend domain. req.url may resolve
    // to an internal API domain, which would break the post-payment redirect.
    // We validate it starts with https:// to prevent open-redirect attacks.
    let rawOrigin;
    const originHeader = req.headers.get('origin');
    if (originHeader && originHeader.startsWith('https://')) {
      rawOrigin = originHeader;
    } else {
      try {
        rawOrigin = new URL(req.url).origin;
      } catch {
        return Response.json({ error: 'Could not determine origin' }, { status: 400 });
      }
    }

    const priceId = pkg.priceId;
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${rawOrigin}/place-ad?payment=success&package=${encodeURIComponent(packageName)}&listingDays=${listingDays || 60}&maxPhotos=${maxPhotos || 12}`,
      cancel_url: `${rawOrigin}/place-ad?payment=cancelled`,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        package_name: packageName,
        listing_days: String(listingDays || 60),
        max_photos: String(maxPhotos || 12),
        bumps: String(bumps || 0),
        bump_interval_weeks: String(bumpIntervalWeeks || 0),
        spotlight_days: String(spotlightDays || 0),
        ad_id: adId,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}