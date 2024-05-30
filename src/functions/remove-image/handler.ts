import { apiResponses, extractFileName } from '@/libs';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3';
import { dynamoDbService } from '@/services/dynamoDB';

const bucket = process.env.bucket;

const s3Client = new S3Client({ region: 'us-east-1' });

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('event: ', event);
  const { imageId, url } = JSON.parse(event.body ?? '{}') as {
    imageId: string;
    url: string;
  };
  const { userId } = event.requestContext.authorizer;

  if (!imageId || !userId) {
    return apiResponses._400({ message: 'Image ID is required' });
  }

  try {
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: bucket,
      Key: extractFileName(url),
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
    await dynamoDbService.removeImageItem(imageId, userId);

    return apiResponses._200({ message: 'Upload success' });
  } catch (error) {
    console.log('REMOVE IMAGE ERROR: ', error);
    return apiResponses._500({ message: 'Delete images error' });
  }
};
