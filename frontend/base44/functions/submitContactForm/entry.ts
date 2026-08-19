import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { email, name, mobile, reason, subject, description, attachments } = body;

    if (!email || !name || !mobile || !reason || !description) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const reasonToEmail = {
      'General Inquiry': 'info@automax.ie',
      'Support / Help': 'support@automax.ie',
      'Privacy / GDPR': 'privacy@automax.ie',
      'Dealer Inquiry': 'dealers@automax.ie',
      'Advertising': 'advertise@automax.ie',
      'Report a Problem': 'support@automax.ie',
      'Other': 'info@automax.ie'
    };

    const recipient = reasonToEmail[reason] || 'info@automax.ie';

    const sanitize = (str) => String(str || '')
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
      attachments && attachments.length > 0 ? `\nAttachments:\n${attachments.filter(a => isSafeUrl(a)).join('\n')}` : ''
    ].join('\n');

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not set');
      return Response.json({ success: false, error: 'Email service not configured' }, { status: 500 });
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'AutoMax Contact <noreply@automax.ie>',
        to: recipient,
        reply_to: email,
        subject: subject || `AutoMax Contact: ${reason}`,
        text: plainText
      })
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend API error:', resendRes.status, errText);
      return Response.json({ success: false, error: 'Failed to send email. Please try again later.' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('submitContactForm error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});