// Ported 1:1 from base44/functions/deleteAccount/entry.ts
// Base44 deleted the app-facing `User` entity record; here we also delete the
// actual Cognito identity so re-registration with the same email works cleanly.
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { CognitoIdentityProviderClient, AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { ddb, TABLES, json, getUserFromEvent } from '../_lib/common.mjs';

const cognito = new CognitoIdentityProviderClient({});

export const handler = async (event) => {
  try {
    const user = await getUserFromEvent(event);
    if (!user) return json(401, { error: 'Unauthorized' });

    await ddb.send(new DeleteCommand({ TableName: TABLES.User, Key: { id: user.id } }));

    try {
      await cognito.send(
        new AdminDeleteUserCommand({ UserPoolId: process.env.USER_POOL_ID, Username: user.email })
      );
    } catch (e) {
      console.warn('Cognito user deletion failed (profile row was still removed):', e.message);
    }

    return json(200, { success: true });
  } catch (error) {
    console.error('Delete account error:', error.message || error);
    return json(500, { error: error.message || 'Failed to delete account' });
  }
};
