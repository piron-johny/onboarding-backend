import { apiResponses } from '@/libs';
import { dynamoDbService } from '@/servises/dynamoDB';
import { userTable } from '@/tables';
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

  const params: ScanCommandInput = {
    TableName: userTable.Properties.TableName,
  };

  try {
    const dd = await dynamoDbService.getAllUsers(params);
    console.log('dd: ', dd.Items);
    return apiResponses._200({ user: dd.Items });
  } catch (error) {
    return apiResponses._200({ message: 'ERROR' });
  }
  return apiResponses._404({ message: 'Bad request' });
};
