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

const secretKey = process.env.jwtSecret;

export const main: APIGatewayAuthorizerHandler = async (
  event: APIGatewayRequestAuthorizerEvent,
  _context: Context,
  callback: Callback<APIGatewayAuthorizerResult>,
): Promise<APIGatewayAuthorizerResult> => {
  console.log('event: ', event);
  const authToken = event.headers.Authorization ?? '';
  const methodArn = event.methodArn;
  const [bearer, token] = authToken.split(' ');

  if (!authToken || bearer !== 'Bearer' || token.length === 0) {
    callback('Unauthorized');
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey) as AuthContext;

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
