import { APIGatewayProxyEvent } from 'aws-lambda';

export type ValidatedAPIGatewayProxyEvent<TBody> = APIGatewayProxyEvent & {
  body: TBody;
};
