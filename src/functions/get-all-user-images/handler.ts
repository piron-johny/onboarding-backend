import { apiResponses, getSignedUrlsForImages } from '@/libs';
import { dynamoDbService } from '@/services/dynamoDB';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
const bucket = process.env.bucket;
const expiresIn = 3600; // 1h

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('event: ', event);
  const { userId } = event.requestContext.authorizer;

  try {
    const images = await dynamoDbService.getImagesByUserId(userId);

    const imagesWithSignedUrls = await getSignedUrlsForImages(
      bucket,
      images,
      expiresIn,
    );

    return apiResponses._200(imagesWithSignedUrls);
  } catch (error) {
    console.log('userId: ', userId);
    console.log('GETTING IMAGES ERROR: ', error);
    return apiResponses._500({ message: 'Getting images error' });
  }
};
