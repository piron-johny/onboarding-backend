import { generatePolicy } from '@/libs';
import jwt from 'jsonwebtoken';
import { main } from './handler';

jest.mock('@/libs', () => ({
  generatePolicy: jest.fn().mockReturnValue({
    principalId: 'me',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource:
            'arn:aws:execute-api:region:account-id:api-id/stage/GET/resource',
        },
      ],
    },
    context: {
      userId: 'userId',
    },
  }),
}));

describe('Authorization Handler Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockMethodArn =
    'arn:aws:execute-api:region:account-id:api-id/stage/GET/resource';

  it('should return Allow policy if user is authenticated', async () => {
    const event = {
      headers: {
        Authorization: 'Bearer token',
      },
      methodArn: mockMethodArn,
    } as any;

    const callbackMock = jest.fn();
    const jwtMock = jest.spyOn(jwt, 'verify');
    jwtMock.mockImplementation(() => ({ userId: 'userId' }));

    await main(event, null, callbackMock);

    const allowPolicy = generatePolicy('me', 'Allow', mockMethodArn, {
      userId: 'userId',
    });

    expect(callbackMock).toHaveBeenCalledWith(null, allowPolicy);
  });

  it('should return Unauthorized if user is not authenticated', async () => {
    const event = {
      headers: {
        Authorization: '',
      },
      methodArn: mockMethodArn,
    } as any;

    const callbackMock = jest.fn();

    await main(event, null, callbackMock);

    expect(callbackMock).toHaveBeenCalledWith('Unauthorized');
  });
});
