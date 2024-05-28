import { apiResponses } from '@/libs';
import { dynamoDbService } from '@/services/dynamoDB';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('event: ', event);
  const { userId } = event.requestContext.authorizer;

  try {
    const images = await dynamoDbService.getImagesByUserId(userId);

    return apiResponses._200(images);
  } catch (error) {
    console.log('userId: ', userId);
    console.log('GETTING IMAGES ERROR: ', error);
    return apiResponses._500({ message: 'Getting images error' });
  }
};
