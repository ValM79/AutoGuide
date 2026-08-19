// Ported 1:1 from base44/functions/submitContactForm/entry.ts
import { json, getSecrets } from '../_lib/common.mjs';

const REASON_TO_EMAIL = {
  'General Inquiry': 'info@automax.ie',
  'Support / Help': 'support@automax.ie',
  'Privacy / GDPR': 'privacy@automax.ie',
  'Dealer Inquiry': 'dealers@automax.ie',
  Advertising: 'advertise@automax.ie',
  'Report a Problem': 'support@automax.ie',
  Other: 'info@automax.ie',
};

const sanitize = (str) =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/[\r\n\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isSafeUrl = (str) => {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { email, name, mobile, reason, subject, description, attachments } = body;

    if (!email || !name || !mobile || !reason || !description) {
      return json(400, { success: false, error: 'Missing required fields' });
    }

    const recipient = REASON_TO_EMAIL[reason] || 'info@automax.ie';

    const plainText = [
      'New contact request from AutoMax',
      '',
      `Name: ${sanitize(name)}`,
      `Email: ${sanitize(email)}`,
      `Mobile: ${sanitize(mobile)}`,
      `Reason: ${sanitize(reason)}`,
      `Subject: ${sanitize(subject || 'N/A')}`,
      '',
      'Description:',
      sanitize(description),
      attachments?.length ? `\nAttachments:\n${attachments.filter(isSafeUrl).join('\n')}` : '',
    ].join('\n');

    const { RESEND_API_KEY } = await getSecrets();
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set');
      return json(500, { success: false, error: 'Email service not configured' });
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'AutoMax Contact <noreply@automax.ie>',
        to: recipient,
        reply_to: email,
        subject: subject || `AutoMax Contact: ${reason}`,
        text: plainText,
      }),
    });

    if (!resendRes.ok) {
      console.error('Resend API error:', resendRes.status, await resendRes.text());
      return json(500, { success: false, error: 'Failed to send email. Please try again later.' });
    }

    return json(200, { success: true });
  } catch (error) {
    console.error('submitContactForm error:', error);
    return json(500, { success: false, error: error.message });
  }
};
