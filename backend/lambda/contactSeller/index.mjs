// Ported 1:1 from base44/functions/contactSeller/entry.ts
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, TABLES, newId, nowIso, json, getUserFromEvent, getSecrets, sanitize } from '../_lib/common.mjs';

export const handler = async (event) => {
  try {
    const user = await getUserFromEvent(event);
    if (!user) return json(401, { error: 'Unauthorized' });

    const body = JSON.parse(event.body || '{}');
    const { ad_id, message } = body;
    if (!message || !ad_id) return json(400, { error: 'Missing message or ad_id' });

    const adRes = await ddb.send(new GetCommand({ TableName: TABLES.UserAd, Key: { id: ad_id } }));
    const ad = adRes.Item;
    if (!ad) return json(404, { error: 'Ad not found' });

    const verifiedSellerUserId = ad.created_by_id;
    const verifiedAdTitle = ad.title || '';
    const verifiedSellerName = ad.fullName || '';

    const cleanAdTitle = sanitize(verifiedAdTitle);
    const cleanSellerName = sanitize(verifiedSellerName);
    const cleanMessage = String(message).replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000);
    const cleanSenderName = sanitize(user.full_name);
    const cleanSenderEmail = String(user.email || '').replace(/[\r\n\s<>]/g, '').slice(0, 200);

    const msg = {
      id: newId(),
      ad_id,
      ad_title: verifiedAdTitle,
      seller_email: ad.email || '',
      seller_name: verifiedSellerName,
      seller_user_id: verifiedSellerUserId || '',
      sender_name: user.full_name || '',
      sender_email: user.email || '',
      message,
      status: 'sent',
      created_by_id: user.id,
      created_date: nowIso(),
    };
    await ddb.send(new PutCommand({ TableName: TABLES.Message, Item: msg }));

    let emailSent = false;
    try {
      let recipientEmail = ad.email || '';
      if (verifiedSellerUserId) {
        try {
          const sellerRes = await ddb.send(new GetCommand({ TableName: TABLES.User, Key: { id: verifiedSellerUserId } }));
          if (sellerRes.Item?.email) recipientEmail = sellerRes.Item.email;
        } catch (e) {
          console.log('Could not look up seller user:', e.message);
        }
      }
      if (recipientEmail) {
        const { RESEND_API_KEY } = await getSecrets();
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'AutoMax <noreply@automax.ie>',
            to: recipientEmail,
            subject: `AutoMax: New message about "${cleanAdTitle || 'your ad'}"`,
            text: `Hi ${cleanSellerName || 'there'},\n\nYou have received a new message about your ad "${cleanAdTitle || ''}".\n\nFrom: ${cleanSenderName || 'A user'} (${cleanSenderEmail})\n\nMessage:\n${cleanMessage}\n\nReply directly to ${cleanSenderEmail}.`,
          }),
        });
        emailSent = resendRes.ok;
      }
    } catch (emailErr) {
      console.log('Email sending skipped:', emailErr.message);
    }

    return json(200, { success: true, message: msg, email_sent: emailSent });
  } catch (error) {
    console.error('contactSeller error:', error);
    return json(500, { error: error.message });
  }
};
