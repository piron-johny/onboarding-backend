import { MiddlewareObj } from '@middy/core';
import { ZodError, ZodSchema } from 'zod';
import { apiResponses } from './api-responses';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const zodValidator = <T>(
  schema: ZodSchema<T>,
): Required<
  Pick<MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult>, 'before'>
> => ({
  before: async (request) => {
    if (!schema) return;

    try {
      const body = JSON.parse(request.event.body ?? '{}');
      await schema.parseAsync(body);
      request.event.body = body;
    } catch (error) {
      if (error instanceof ZodError) {
        return apiResponses._400({
          message: 'Invalid body params',
          errors: error.issues.map((i) => i.message),
        });
      }
      return apiResponses._400({
        message: error.message,
      });
    }
  },
});
