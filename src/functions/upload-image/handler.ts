import { apiResponses, zodValidator } from '@/libs';
import { APIGatewayProxyResult } from 'aws-lambda';
import { randomUUID } from 'node:crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { dynamoDbService } from '@/services/dynamoDB';
import { PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { imageTable } from '@/tables';
import { MIME_TYPES, uploadBodySchema } from './schema';
import middy from '@middy/core';
import { TUploadImageBody, ValidatedAPIGatewayProxyEvent } from '@/types';

const bucket = process.env.bucket;
const MAX_SIZE = 4000000; // 4MB

const s3Client = new S3Client({ region: 'us-east-1' });

const uploadImageHandler = async (
  event: ValidatedAPIGatewayProxyEvent<TUploadImageBody>,
): Promise<APIGatewayProxyResult> => {
  console.log('event: ', event);
  const { userId } = event.requestContext.authorizer;
  const { imageData, name, description } = event.body;
  const { imageBase64, fileType } = imageData;

  try {
    const id = randomUUID();
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    if (imageBuffer.byteLength > MAX_SIZE) {
      return apiResponses._400({ message: 'File size exceeds the limit' });
    }

    const fileName = `${id}.${fileType.split('/')[1]}`;

    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: imageBuffer,
      ContentType: fileType,
    };

    await s3Client.send(new PutObjectCommand(params));

    const createImageParams: PutCommandInput = {
      TableName: imageTable.Properties.TableName,
      Item: { id, url: fileName, userId, name, description },
    };
    await dynamoDbService.createImage(createImageParams);

    return apiResponses._200({ message: 'Upload success' });
  } catch (error) {
    console.log('UPLOAD IMAGE ERROR: ', error);
    return apiResponses._500({ message: 'Error upload' });
  }
};

export const main = middy(uploadImageHandler).use(
  zodValidator(uploadBodySchema),
);
