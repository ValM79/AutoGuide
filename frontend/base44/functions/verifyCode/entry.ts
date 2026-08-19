import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { target, code, type } = await req.json();

    if (!target || !code || !type) {
      return Response.json({ error: 'target, code, and type are required' }, { status: 400 });
    }
    if (typeof target !== 'string' || typeof code !== 'string' || typeof type !== 'string') {
      return Response.json({ error: 'Invalid input types' }, { status: 400 });
    }

    // Find the most recent unexpired code for this target
    const records = await base44.asServiceRole.entities.VerificationCode.filter(
      { target, type, verified: false },
      '-created_date',
      1
    );

    if (records.length === 0) {
      return Response.json({ verified: false, error: 'No active verification code found' }, { status: 200 });
    }

    const record = records[0];

    // Check expiry
    if (new Date(record.expires_at).getTime() < Date.now()) {
      return Response.json({ verified: false, error: 'Code has expired. Please request a new one.' }, { status: 200 });
    }

    // Enforce maximum failed attempts to prevent brute-force attacks
    const MAX_ATTEMPTS = 5;
    const attempts = record.attempts || 0;
    if (attempts >= MAX_ATTEMPTS) {
      return Response.json({ verified: false, error: 'Too many attempts. Please request a new code.' }, { status: 429 });
    }

    // Check code matches
    if (record.code !== code) {
      await base44.asServiceRole.entities.VerificationCode.update(record.id, {
        attempts: attempts + 1
      });
      const remaining = MAX_ATTEMPTS - attempts - 1;
      return Response.json({ verified: false, error: `Invalid code. ${remaining} attempt(s) remaining.` }, { status: 200 });
    }

    // Mark as verified
    await base44.asServiceRole.entities.VerificationCode.update(record.id, { verified: true });

    return Response.json({ verified: true, message: 'Verification successful' });
  } catch (error) {
    console.error('verifyCode error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});