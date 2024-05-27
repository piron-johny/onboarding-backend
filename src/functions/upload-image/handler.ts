import { apiResponses } from '@/libs';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { formParser } from './parser';
import { randomUUID } from 'node:crypto';
import {
  S3Client,
  PutObjectCommandInput,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { dynamoDbService } from '@/servises/dynamoDB';
import { PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { imageTable } from '@/tables';

// const bucket = 'images-react-test';
const bucket = process.env.bucket;
const MAX_SIZE = 4000000; // 4MB
const PNG_MIME_TYPE = 'image/png';
const JPEG_MIME_TYPE = 'image/jpeg';
const JPG_MIME_TYPE = 'image/jpg';
const MIME_TYPES = [PNG_MIME_TYPE, JPEG_MIME_TYPE, JPG_MIME_TYPE];

const client = new S3Client({ region: 'us-east-1' });

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('event: ', event);

  console.log('bucket: ', bucket);
  try {
    const id = randomUUID();
    // const formData = await formParser(event, MAX_SIZE);
    // const file = formData.files[0];

    // const originalKey = `${id}_${file.filename}`;

    // console.log('originalKey: ', originalKey);
    // console.log('file.contentType: ', file.contentType);
    // console.log('file: ', file);

    // const uploadParams: PutObjectCommandInput = {
    //   Bucket: bucket,
    //   Key: originalKey,
    //   Body: file.content,
    //   ACL: 'public-read',
    // };

    // const uploadCommand = new PutObjectCommand(uploadParams);
    // const uploadResult = await client.send(uploadCommand);
    // console.log('uploadResult: ', uploadResult);
    // const url = `https://${bucket}.s3.amazonaws.com/${originalKey}`;
    const url = `1111111111111111111111111111111111111111111111`;
    console.log('url: ', url);
    const createImageParams: PutCommandInput = {
      TableName: imageTable.Properties.TableName,
      Item: {
        id,
        url,
        // userId: 'd8563bd8-01ad-4971-ada4-9ff5323211f1', // 444
        userId: 'fb7a91db-6f96-4828-af22-a71fc1282a26', // 222
      },
    };
    await dynamoDbService.createImage(createImageParams);

    return apiResponses._200({ message: 'success' });
  } catch (error) {
    console.log('ERROR: ', error);
    return apiResponses._500({ message: 'Error upload' });
  }
};
