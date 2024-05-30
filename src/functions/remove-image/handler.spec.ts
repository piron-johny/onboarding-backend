import { main } from './handler';
import { apiResponses } from '@/libs';
import { S3Client } from '@aws-sdk/client-s3';
import { dynamoDbService } from '@/services/dynamoDB';
import { Callback, Context } from 'aws-lambda';

jest.mock('@/libs', () => ({
  apiResponses: {
    _200: jest.fn(),
    _400: jest.fn(),
    _500: jest.fn(),
  },
}));

jest.mock('@aws-sdk/client-s3', () => ({
  __esModule: true,
  S3Client: jest.fn(() => ({
    send: jest.fn(),
  })),
}));

jest.mock('@/services/dynamoDB', () => ({
  dynamoDbService: {
    removeImageItem: jest.fn(),
  },
}));

const s3Client = new S3Client({ region: 'us-east-1' });

describe('Remove image Handler Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const context = {} as Context;
  const callback = null as Callback;

  it('should return 400 and Image ID is required error message', async () => {
    const event = {
      requestContext: {
        authorizer: {
          userId: 'userId',
        },
      },
    } as any;

    const response = await main(event, context, callback);

    expect(response).toEqual(
      apiResponses._400({ message: 'Image ID is required' }),
    );
  });

  it('should return 200 and Upload success message', async () => {
    const event = {
      body: JSON.stringify({
        imageId: 'string',
        url: 'string',
      }),
      requestContext: {
        authorizer: {
          userId: 'userId',
        },
      },
    } as any;

    (s3Client.send as jest.Mock).mockResolvedValueOnce({});
    (dynamoDbService.removeImageItem as jest.Mock).mockResolvedValueOnce({});

    const response = await main(event, context, callback);

    expect(response).toEqual(
      apiResponses._400({ message: 'Image ID is required' }),
    );
  });

  it('should return 500 and Delete images error message', async () => {
    const event = {
      body: JSON.stringify({
        imageId: 'string',
        url: 'string',
      }),
      requestContext: {
        authorizer: {
          userId: 'userId',
        },
      },
    } as any;

    (s3Client.send as jest.Mock).mockResolvedValueOnce({});
    (dynamoDbService.removeImageItem as jest.Mock).mockRejectedValueOnce(
      new Error('Delete images error'),
    );

    const response = await main(event, context, callback);

    expect(response).toEqual(
      apiResponses._400({ message: 'Delete images error' }),
    );
  });
});
