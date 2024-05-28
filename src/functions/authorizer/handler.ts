import { generatePolicy } from '@/libs';
import { AuthContext } from '@/types';
import {
  APIGatewayAuthorizerHandler,
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEvent,
  Callback,
  Context,
} from 'aws-lambda';
import jwt from 'jsonwebtoken';

const secretKey = '1h175dyw54';
export const main: APIGatewayAuthorizerHandler = async (
  event: APIGatewayRequestAuthorizerEvent,
  _context: Context,
  callback: Callback<APIGatewayAuthorizerResult>,
): Promise<APIGatewayAuthorizerResult> => {
  console.log('event: ', event);
  const authToken = event.headers.Authorization ?? '';
  const methodArn = event.methodArn;

  if (!authToken) {
    callback('Unauthorized');
    return;
  }

  try {
    const decoded = jwt.verify(authToken, secretKey) as AuthContext;

    callback(
      null,
      generatePolicy('me', 'Allow', methodArn, {
        userId: decoded.userId,
      }),
    );
  } catch (e) {
    callback('Unauthorized');
  }
};
