import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { target, type } = await req.json();

    if (!target || !type || !['sms', 'email'].includes(type)) {
      return Response.json({ error: 'target and type (sms/email) are required' }, { status: 400 });
    }

    // Rate limit: no more than 1 code per target per 60s
    const recent = await base44.asServiceRole.entities.VerificationCode.filter(
      { target, type },
      '-created_date',
      1
    );
    if (recent.length > 0) {
      const ageMs = Date.now() - new Date(recent[0].created_date).getTime();
      if (ageMs < 60000) {
        return Response.json({ error: 'Please wait 60 seconds before requesting another code' }, { status: 429 });
      }
    }

    // IP-based rate limit: max 10 codes per IP per hour to prevent toll fraud
    const clientIp = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim()
      || req.headers.get('x-real-ip') || 'unknown';
    const MAX_IP_HOURLY = 10;
    const ipRecent = await base44.asServiceRole.entities.VerificationCode.filter(
      { client_ip: clientIp },
      '-created_date',
      MAX_IP_HOURLY
    );
    if (ipRecent.length >= MAX_IP_HOURLY) {
      const oldestAgeMs = Date.now() - new Date(ipRecent[MAX_IP_HOURLY - 1].created_date).getTime();
      if (oldestAgeMs < 3600000) {
        return Response.json({ error: 'Too many verification requests. Please try again later.' }, { status: 429 });
      }
    }

    // Generate 6-digit code using cryptographically secure random values
    const randomBytes = new Uint32Array(1);
    crypto.getRandomValues(randomBytes);
    const code = (100000 + (randomBytes[0] % 900000)).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await base44.asServiceRole.entities.VerificationCode.create({
      target,
      code,
      type,
      expires_at: expiresAt,
      verified: false,
      client_ip: clientIp
    });

    if (type === 'sms') {
      const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
      const token = Deno.env.get("TWILIO_AUTH_TOKEN");
      const from = Deno.env.get("TWILIO_PHONE_NUMBER");
      if (!sid || !token || !from) {
        console.error('Twilio secrets missing');
        return Response.json({ error: 'SMS service not configured' }, { status: 500 });
      }

      const twilioRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${sid}:${token}`),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            To: target,
            From: from,
            Body: `Your AutoMax verification code is: ${code}`
          })
        }
      );

      if (!twilioRes.ok) {
        const errText = await twilioRes.text();
        console.error('Twilio error:', errText);
        return Response.json({ error: 'Failed to send SMS' }, { status: 502 });
      }
    } else {
      const apiKey = Deno.env.get("RESEND_API_KEY");
      if (!apiKey) {
        console.error('RESEND_API_KEY missing');
        return Response.json({ error: 'Email service not configured' }, { status: 500 });
      }

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'AutoMax <onboarding@resend.dev>',
          to: target,
          subject: 'Your AutoMax Verification Code',
          html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;"><h2 style="color:#1d4ed8;">AutoMax</h2><p>Your verification code is:</p><p style="font-size:32px;font-weight:bold;letter-spacing:4px;color:#1d4ed8;">${code}</p><p style="color:#666;font-size:13px;">This code expires in 5 minutes. If you didn't request this, you can safely ignore this email.</p></div>`
        })
      });

      if (!resendRes.ok) {
        const errText = await resendRes.text();
        console.error('Resend error:', errText);
        return Response.json({ error: 'Failed to send email' }, { status: 502 });
      }
    }

    return Response.json({ success: true, message: `Verification code sent to ${target}` });
  } catch (error) {
    console.error('sendVerificationCode error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});