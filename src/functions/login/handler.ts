import { apiResponses, zodValidator } from '@/libs';
import { dynamoDbService } from '@/services/dynamoDB';
import middy from '@middy/core';
import { APIGatewayProxyResult } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginBodySchema } from './schema';
import { TLoginBody, ValidatedAPIGatewayProxyEvent } from '@/types';

const secretKey = process.env.jwtSecret;

const loginHandler = async (
  event: ValidatedAPIGatewayProxyEvent<TLoginBody>,
): Promise<APIGatewayProxyResult> => {
  console.log('event: ', event);

  const body = event.body;

  const userName = body.name;
  const userPassword = body.password;

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
};

export const main = middy(loginHandler).use(zodValidator(loginBodySchema));
