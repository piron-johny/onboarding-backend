import { apiResponses, extractFileName, zodValidator } from '@/libs';
import { APIGatewayProxyResult } from 'aws-lambda';
import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3';
import { dynamoDbService } from '@/services/dynamoDB';
import { removeImageBodySchema } from './schema';
import middy from '@middy/core';
import { TRemoveImageBody, ValidatedAPIGatewayProxyEvent } from '@/types';

const bucket = process.env.bucket;

const s3Client = new S3Client({ region: 'us-east-1' });

const removeImageHandler = async (
  event: ValidatedAPIGatewayProxyEvent<TRemoveImageBody>,
): Promise<APIGatewayProxyResult> => {
  console.log('event: ', event);
  const { imageId, url } = event.body;
  const { userId } = event.requestContext.authorizer;

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

export const main = middy(removeImageHandler).use(
  zodValidator(removeImageBodySchema),
);
