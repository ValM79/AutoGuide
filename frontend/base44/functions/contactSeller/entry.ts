import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { ad_id, message } = body;

    if (!message || !ad_id) {
      return Response.json({ error: 'Missing message or ad_id' }, { status: 400 });
    }

    // Fetch the ad via user-scoped SDK so RLS enforces that only active or
    // caller-owned ads are accessible — prevents leaking draft/private ads.
    let ad;
    try {
      ad = await base44.entities.UserAd.get(ad_id);
    } catch (e) {
      return Response.json({ error: 'Ad not found' }, { status: 404 });
    }
    if (!ad) {
      return Response.json({ error: 'Ad not found' }, { status: 404 });
    }
    const verifiedSellerUserId = ad.created_by_id;
    const verifiedAdTitle = ad.title || '';
    const verifiedSellerName = ad.fullName || '';

    // Strip CRLF and control chars to prevent header/body injection in email content
    const sanitize = (str) => String(str || '').replace(/[\r\n\t<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
    const cleanAdTitle = sanitize(verifiedAdTitle);
    const cleanSellerName = sanitize(verifiedSellerName);
    const cleanMessage = String(message).replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000);
    const cleanSenderName = sanitize(user.full_name);
    const cleanSenderEmail = String(user.email || '').replace(/[\r\n\s<>]/g, '').slice(0, 200);

    // Save the message record with verified seller identity
    const msg = await base44.entities.Message.create({
      ad_id,
      ad_title: verifiedAdTitle,
      seller_email: ad.email || '',
      seller_name: verifiedSellerName,
      seller_user_id: verifiedSellerUserId || '',
      sender_name: user.full_name || '',
      sender_email: user.email || '',
      message,
      status: 'sent'
    });

    // Try to send an email to the seller — non-blocking on failure
    // (SendEmail only works for registered app users)
    let emailSent = false;
    try {
      let recipientEmail = ad.email || '';
      // Look up the seller's actual login email using the verified owner ID
      if (verifiedSellerUserId) {
        try {
          const sellerUser = await base44.asServiceRole.entities.User.get(verifiedSellerUserId);
          if (sellerUser && sellerUser.email) {
            recipientEmail = sellerUser.email;
          }
        } catch (e) {
          console.log('Could not look up seller user:', e.message);
        }
      }
      if (recipientEmail) {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: recipientEmail,
          subject: `AutoMax: New message about "${cleanAdTitle || 'your ad'}"`,
          body: `Hi ${cleanSellerName || 'there'},\n\nYou have received a new message about your ad "${cleanAdTitle || ''}".\n\nFrom: ${cleanSenderName || 'A user'} (${cleanSenderEmail})\n\nMessage:\n${cleanMessage}\n\nReply directly to ${cleanSenderEmail}.`
        });
        emailSent = true;
      }
    } catch (emailErr) {
      console.log('Email sending skipped:', emailErr.message);
    }

    return Response.json({ success: true, message: msg, email_sent: emailSent });
  } catch (error) {
    console.error('contactSeller error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});