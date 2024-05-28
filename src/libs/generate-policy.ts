import { AuthContext } from '@/types';
import { APIGatewayAuthorizerResult } from 'aws-lambda';

export const generatePolicy = function (
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
