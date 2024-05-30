import { apiResponses } from '@/libs';
import { dynamoDbService } from '@/services/dynamoDB';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secretKey = process.env.jwtSecret;

export const main: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log('event: ', event);
  const body = JSON.parse(event.body ?? '{}');
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

        return apiResponses._200({
          user: other,
          token,
        });
      } else {
        return apiResponses._404({ message: 'Invalid name or password' });
      }
    } catch (error) {
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
