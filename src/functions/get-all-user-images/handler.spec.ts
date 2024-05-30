import { dynamoDbService } from '@/services/dynamoDB';
import { apiResponses, getSignedUrlsForImages } from '@/libs';
import { main } from './handler';
import { Callback, Context } from 'aws-lambda';

jest.mock('@/services/dynamoDB', () => ({
  dynamoDbService: {
    getImagesByUserId: jest.fn().mockReturnValue([
      {
        id: 'string',
        url: 'string',
        userId: 'string',
        name: 'string',
        description: 'string',
      },
    ]),
  },
}));

jest.mock('@/libs', () => ({
  apiResponses: {
    _200: jest.fn(),
    _500: jest.fn(),
  },
  getSignedUrlsForImages: jest.fn().mockResolvedValue([
    {
      id: 'string',
      url: 'string',
      userId: 'string',
      name: 'string',
      description: 'string',
    },
  ]),
}));

describe('Get all user images Handler Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const context = {} as Context;
  const callback = null as Callback;

  it('should return images array by userId', async () => {
    const event = {
      requestContext: {
        authorizer: {
          userId: 'userId',
        },
      },
    } as any;

    const images = await dynamoDbService.getImagesByUserId('userId');
    const imagesWithSignedUrls = await getSignedUrlsForImages(
      'bucket',
      images,
      10,
    );

    const response = await main(event, context, callback);

    expect(response).toEqual(apiResponses._200(imagesWithSignedUrls));
  });

  it('should return upload error', async () => {
    const event = {
      requestContext: {
        authorizer: {
          userId: 'userId',
        },
      },
    } as any;

    (dynamoDbService.getImagesByUserId as jest.Mock).mockRejectedValueOnce(
      new Error('Get images by user ID error'),
    );

    const response = await main(event, context, callback);

    expect(response).toEqual(
      apiResponses._500({ message: 'Get images by user ID error' }),
    );
  });
});
