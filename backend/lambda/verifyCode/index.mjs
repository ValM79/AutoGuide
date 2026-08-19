// Ported 1:1 from base44/functions/verifyCode/entry.ts
import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb, TABLES, json } from '../_lib/common.mjs';

const MAX_ATTEMPTS = 5;

export const handler = async (event) => {
  try {
    const { target, code, type } = JSON.parse(event.body || '{}');
    if (!target || !code || !type) return json(400, { error: 'target, code, and type are required' });
    if (typeof target !== 'string' || typeof code !== 'string' || typeof type !== 'string') {
      return json(400, { error: 'Invalid input types' });
    }

    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.VerificationCode,
        IndexName: 'byTarget',
        KeyConditionExpression: '#t = :t',
        FilterExpression: '#type = :type AND verified = :f',
        ExpressionAttributeNames: { '#t': 'target', '#type': 'type' },
        ExpressionAttributeValues: { ':t': target, ':type': type, ':f': false },
        ScanIndexForward: false,
        Limit: 1,
      })
    );

    if (!res.Items?.length) return json(200, { verified: false, error: 'No active verification code found' });

    const record = res.Items[0];

    if (new Date(record.expires_at).getTime() < Date.now()) {
      return json(200, { verified: false, error: 'Code has expired. Please request a new one.' });
    }

    const attempts = record.attempts || 0;
    if (attempts >= MAX_ATTEMPTS) {
      return json(429, { verified: false, error: 'Too many attempts. Please request a new code.' });
    }

    if (record.code !== code) {
      await ddb.send(
        new UpdateCommand({
          TableName: TABLES.VerificationCode,
          Key: { id: record.id },
          UpdateExpression: 'SET attempts = :a',
          ExpressionAttributeValues: { ':a': attempts + 1 },
        })
      );
      const remaining = MAX_ATTEMPTS - attempts - 1;
      return json(200, { verified: false, error: `Invalid code. ${remaining} attempt(s) remaining.` });
    }

    await ddb.send(
      new UpdateCommand({
        TableName: TABLES.VerificationCode,
        Key: { id: record.id },
        UpdateExpression: 'SET verified = :v',
        ExpressionAttributeValues: { ':v': true },
      })
    );

    return json(200, { verified: true, message: 'Verification successful' });
  } catch (error) {
    console.error('verifyCode error:', error);
    return json(500, { error: error.message });
  }
};
