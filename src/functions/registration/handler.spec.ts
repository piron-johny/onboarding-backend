import { dynamoDbService } from '@/services/dynamoDB';
import { apiResponses } from '@/libs';
import { main } from './handler';
import { Callback, Context } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('@/services/dynamoDB', () => ({
  dynamoDbService: {
    findUserByName: jest.fn().mockReturnValue([
      {
        id: 'string',
        name: 'user',
        password: 'string',
      },
    ]),
    createUser: jest.fn(),
  },
}));

jest.mock('@/libs', () => ({
  apiResponses: {
    _200: jest.fn(),
    _201: jest.fn(),
    _400: jest.fn(),
    _404: jest.fn(),
    _500: jest.fn(),
  },
}));

describe('Registration Handler Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const context = {} as Context;
  const callback = null as Callback;
  const mockEvent = {
    body: JSON.stringify({ name: 'user', password: 'password' }),
  } as any;

  it('should return 404 and invalid body params error', async () => {
    const event = {} as any;

    const response = await main(event, context, callback);

    expect(response).toEqual(
      apiResponses._404({ message: 'Invalid request body parameters' }),
    );
  });

  it('should return 201 and created user and token', async () => {
    (dynamoDbService.findUserByName as jest.Mock).mockResolvedValueOnce('user');
    jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true);
    jest.spyOn(jwt, 'sign').mockImplementationOnce((_, __, ___, callback) => {
      if (typeof callback === 'function') {
        callback(null, 'token');
      }
    });
    (dynamoDbService.createUser as jest.Mock).mockResolvedValueOnce({});

    const response = await main(mockEvent, context, callback);

    expect(response).toEqual(
      apiResponses._201({
        user: mockEvent.body,
        token: 'token',
      }),
    );
  });

  it('should return 500 and creation user error', async () => {
    (dynamoDbService.findUserByName as jest.Mock).mockResolvedValueOnce('user');
    jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true);
    jest.spyOn(jwt, 'sign').mockImplementationOnce((_, __, ___, callback) => {
      if (typeof callback === 'function') {
        callback(null, 'token');
      }
    });
    (dynamoDbService.createUser as jest.Mock).mockRejectedValueOnce(
      new Error('Create user error'),
    );

    const response = await main(mockEvent, context, callback);

    expect(response).toEqual(
      apiResponses._500({
        message: 'Create user error',
      }),
    );
  });
});
