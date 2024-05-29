const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const apiResponses = {
  _200: (body: Record<string, any>) => ({
    statusCode: 200,
    body: JSON.stringify(body),
    headers,
  }),
  _201: (body: Record<string, any>) => ({
    statusCode: 201,
    body: JSON.stringify(body),
    headers,
  }),
  _400: (body: Record<string, any>) => ({
    statusCode: 400,
    body: JSON.stringify(body),
    headers,
  }),
  _401: (body: Record<string, any>) => ({
    statusCode: 401,
    body: JSON.stringify(body),
    headers,
  }),
  _403: (body: Record<string, any>) => ({
    statusCode: 403,
    body: JSON.stringify(body),
    headers,
  }),
  _404: (body: Record<string, any>) => ({
    statusCode: 404,
    body: JSON.stringify(body),
    headers,
  }),
  _500: (body: Record<string, any>) => ({
    statusCode: 500,
    body: JSON.stringify(body),
    headers,
  }),
};
