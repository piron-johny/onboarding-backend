import { apiResponses, zodValidator } from '@/libs';
import { dynamoDbService } from '@/services/dynamoDB';
import { userTable } from '@/tables/user';
import { PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyResult } from 'aws-lambda';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registrationBodySchema } from './schema';
import middy from '@middy/core';
import { TRegistrationBody, ValidatedAPIGatewayProxyEvent } from '@/types';

const saltRounds = 10;
const secretKey = process.env.jwtSecret;

const registrationHandler = async (
  event: ValidatedAPIGatewayProxyEvent<TRegistrationBody>,
): Promise<APIGatewayProxyResult> => {
  console.log('event: ', event);
  const body = event.body;
  const userName = body.name;
  const userPassword = body.password;

  const [user] = await dynamoDbService.findUserByName(userName);

  if (user)
    return apiResponses._400({
      message: `User with name:${userName} is already exist`,
    });

  const id = randomUUID();

  const hash = bcrypt.hashSync(userPassword, saltRounds);
  const payload = {
    userId: id,
  };
  const token = jwt.sign(payload, secretKey);

  const params: PutCommandInput = {
    TableName: userTable.Properties.TableName,
    Item: {
      id,
      name: userName,
      password: hash,
    },
  };

  try {
    await dynamoDbService.createUser(params);

    return apiResponses._201({
      user: body,
      token,
    });
  } catch (error) {
    console.log('ERROR HANDLER CREATE USER: ', error);

    return apiResponses._500({
      message: 'Create user error',
    });
  }
};

export const main = middy(registrationHandler).use(
  zodValidator(registrationBodySchema),
);
