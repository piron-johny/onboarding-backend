import {
  APIGatewayAuthorizerHandler,
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  Callback,
  Context,
} from 'aws-lambda';
import jwt from 'jsonwebtoken';

export interface AuthContext {
  userId: string;
}

const secretKey = '1h175dyw54';

export const main: APIGatewayAuthorizerHandler = async (
  event: APIGatewayTokenAuthorizerEvent,
  _context: Context,
  callback: Callback<APIGatewayAuthorizerResult>,
): Promise<APIGatewayAuthorizerResult> => {
  console.log('event: ', event);
  const authToken = event.authorizationToken ?? '';
  const methodArn = event.methodArn;

  console.log('authToken: ', authToken);
  console.log('methodArn: ', methodArn);

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

const generatePolicy = function (
  principalId: string,
  effect: string,
  resource: string,
  context: AuthContext,
): APIGatewayAuthorizerResult {
  // Required output:
  const authResponse: any = {
    principalId,
    context,
  };

  authResponse.principalId = principalId;

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    };

    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};
