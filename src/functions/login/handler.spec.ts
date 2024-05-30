import { main } from './handler';
import { apiResponses } from '@/libs';
import { dynamoDbService } from '@/services/dynamoDB';
import { Callback, Context } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('@/libs', () => ({
  apiResponses: {
    _200: jest.fn(),
    _404: jest.fn(),
    _500: jest.fn(),
  },
}));

jest.mock('@/services/dynamoDB', () => ({
  dynamoDbService: {
    findUserByName: jest.fn(),
  },
}));

describe('Login Handler Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const context = {} as Context;
  const callback = null as Callback;

  it('should return 404 if name and password are not provided', async () => {
    const event = {
      body: JSON.stringify({}),
    } as any;

    const response = await main(event, context, callback);

    expect(response).toEqual(
      apiResponses._404({
        message: 'Name and password is required',
      }),
    );
  });

  it('should return 404 if user not found', async () => {
    const event = {
      body: JSON.stringify({ name: 'user', password: 'password' }),
    } as any;

    (dynamoDbService.findUserByName as jest.Mock).mockResolvedValueOnce([]);

    const response = await main(event, context, callback);

    expect(response).toEqual(
      apiResponses._404({
        message: 'Invalid name or password',
      }),
    );
  });

  it('should return 404 if password is incorrect', async () => {
    const event = {
      body: JSON.stringify({ name: 'user', password: 'wrong_password' }),
    } as any;

    (dynamoDbService.findUserByName as jest.Mock).mockResolvedValueOnce([
      { id: '1', name: 'user', password: 'correct_password' },
    ]);

    const response = await main(event, context, callback);

    expect(response).toEqual(
      apiResponses._404({
        message: 'Invalid name or password',
      }),
    );
  });

  it('should return 200 with token if authentication is successful', async () => {
    const event = {
      body: JSON.stringify({ name: 'user', password: 'correct_password' }),
    } as any;

    const user = { id: '1', name: 'user', password: 'correct_password' };

    (dynamoDbService.findUserByName as jest.Mock).mockResolvedValueOnce([user]);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true);
    jest.spyOn(jwt, 'sign').mockImplementationOnce((_, __, ___, callback) => {
      if (typeof callback === 'function') {
        callback(null, 'token');
      }
    });

    const response = await main(event, context, callback);

    expect(response).toEqual(
      apiResponses._200({
        user: { id: '1', name: 'user' },
        token: 'token',
      }),
    );
  });

  it('should return 500 if an error occurs', async () => {
    const event = {
      body: JSON.stringify({ name: 'user', password: 'correct_password' }),
    } as any;

    (dynamoDbService.findUserByName as jest.Mock).mockRejectedValueOnce(
      new Error('Database error'),
    );

    const response = await main(event, context, callback);

    expect(response).toEqual(
      apiResponses._500({
        message: 'Login user error',
      }),
    );
  });
});
