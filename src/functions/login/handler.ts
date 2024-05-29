import { apiResponses, logExecutionTime } from '@/libs';
import { dynamoDbService } from '@/services/dynamoDB';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secretKey = '1h175dyw54';

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const startExecutionTime = Date.now();
  console.log('event: ', event);
  const body = JSON.parse(event.body);
  const userName = body?.name;
  const userPassword = body?.password;

  if (userName && userPassword) {
    try {
      const [user] = await dynamoDbService.findUserByName(userName);

      if (user) {
        const { password, ...other } = user;
        const comparePass = bcrypt.compareSync(userPassword, password);

        if (!comparePass || user.name !== userName)
          return apiResponses._404({ message: 'Invalid name or password' });

        const payload = {
          userId: user.id,
        };
        const token = jwt.sign(payload, secretKey);
        console.log('response: ', { token, user: other });

        logExecutionTime(startExecutionTime);
        return apiResponses._200({
          user: other,
          token,
        });
      } else {
        logExecutionTime(startExecutionTime);
        return apiResponses._404({ message: 'Invalid name or password' });
      }
    } catch (error) {
      logExecutionTime(startExecutionTime);
      console.log('ERROR HANDLER LOGIN USER: ', error);

      return apiResponses._500({
        message: 'Login user error',
      });
    }
  }

  return apiResponses._404({
    message: 'Name and password is required',
  });
};
