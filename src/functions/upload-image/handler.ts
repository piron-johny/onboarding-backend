import { apiResponses } from '@/libs';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { randomUUID } from 'node:crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { dynamoDbService } from '@/services/dynamoDB';
import { PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { imageTable } from '@/tables';

const bucket = process.env.bucket;
const MAX_SIZE = 4000000; // 4MB
const PNG_MIME_TYPE = 'image/png';
const JPEG_MIME_TYPE = 'image/jpeg';
const JPG_MIME_TYPE = 'image/jpg';
const MIME_TYPES = [PNG_MIME_TYPE, JPEG_MIME_TYPE, JPG_MIME_TYPE];

interface ImageData {
  imageBase64?: string;
  fileType?: string;
}

interface UploadBody {
  imageData?: ImageData;
  name?: string;
  description?: string;
}

const s3Client = new S3Client({ region: 'us-east-1' });

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('event: ', event);
  const { userId } = event.requestContext.authorizer;

  try {
    const id = randomUUID();
    const { imageData, name, description } = JSON.parse(
      event.body ?? '{}',
    ) as UploadBody;
    const { imageBase64, fileType } = imageData ?? {};

    console.log('name: ', {
      imageData,
      name,
      description,
      imageBase64,
      fileType,
    });

    if (!MIME_TYPES.includes(fileType)) {
      return apiResponses._400({ message: 'Unsupported file type' });
    }

    const imageBuffer = Buffer.from(imageBase64, 'base64');

    if (imageBuffer.byteLength > MAX_SIZE) {
      return apiResponses._400({ message: 'File size exceeds the limit' });
    }

    const fileName = `${id}.${fileType}`;

    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: imageBuffer,
      ContentType: fileType,
    };

    await s3Client.send(new PutObjectCommand(params));

    const url = `https://${bucket}.s3.amazonaws.com/${fileName}`;
    console.log('url: ', url);

    const createImageParams: PutCommandInput = {
      TableName: imageTable.Properties.TableName,
      Item: { id, url, userId, name, description },
    };
    await dynamoDbService.createImage(createImageParams);

    return apiResponses._200({ message: 'Upload success' });
  } catch (error) {
    console.log('UPLOAD IMAGE ERROR: ', error);
    return apiResponses._500({ message: 'Error upload' });
  }
};
