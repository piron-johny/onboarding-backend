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
    createImage: jest.fn(),
  },
}));

const s3Client = new S3Client({ region: 'us-east-1' });

describe('Upload Handler Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const context = {} as Context;
  const callback = null as Callback;

  it('should return 200 and success message on successful image upload', async () => {
    const event = {
      body: JSON.stringify({
        userId: 'userId',
        imageData: {
          imageBase64: 'base64ImageString',
          fileType: 'image/png',
        },
        name: 'TestImage',
        description: 'Test description',
      }),
      requestContext: {
        authorizer: {
          userId: 'userId',
        },
      },
    } as any;

    (s3Client.send as jest.Mock).mockResolvedValueOnce({});
    (dynamoDbService.createImage as jest.Mock).mockResolvedValueOnce({});

    const response = await main(event, context, callback);

    expect(response).toEqual(apiResponses._200({ message: 'Upload success' }));
  });

  it('should return 400 and error message on unsupported file type', async () => {
    const event = {
      body: JSON.stringify({
        imageData: {
          imageBase64: 'base64ImageString',
          fileType: 'unsupportedType',
        },
      }),
      requestContext: {
        authorizer: {
          userId: 'userId',
        },
      },
    } as any;

    const response = await main(event, context, callback);

    expect(response).toEqual(
      apiResponses._400({
        message: 'Unsupported file type',
      }),
    );
  });

  it('should return 400 and error message on file size exceeding limit', async () => {
    const event = {
      body: JSON.stringify({
        imageData: {
          imageBase64: 'base64ImageString',
          fileType: 'image/png',
        },
      }),
      requestContext: {
        authorizer: {
          userId: 'userId',
        },
      },
    } as any;

    const response = await main(event, context, callback);

    expect(response).toEqual(
      apiResponses._400({ message: 'File size exceeds the limit' }),
    );
  });

  it('should return 500 and error message on failed image upload', async () => {
    const event = {
      body: JSON.stringify({
        imageData: {
          imageBase64: 'base64ImageString',
          fileType: 'image/png',
        },
      }),
      requestContext: {
        authorizer: {
          userId: 'userId',
        },
      },
    } as any;

    (s3Client.send as jest.Mock).mockRejectedValueOnce(
      new Error('Upload failed'),
    );

    const response = await main(event, context, callback);

    expect(response).toEqual(apiResponses._500({ message: 'Error upload' }));
  });
});
