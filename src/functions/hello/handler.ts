import { apiResponses } from '@/libs';
import { dynamoDbService } from '@/servises/dynamoDB';
import { userTable } from '@/tables/user';
import { GetCommandInput, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
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

  console.log('userId: ', userId);

  const params: ScanCommandInput = {
    TableName: userTable.Properties.TableName,
  };

  try {
    // const dd = await dynamoDbService.getAllUsers(params);
    const dd = await dynamoDbService.getImagesByUserId(userId);
    console.log('dd: ', dd);
    return apiResponses._200({ user: dd });
  } catch (error) {
    return apiResponses._400({ message: 'ERROR', error });
  }
};
