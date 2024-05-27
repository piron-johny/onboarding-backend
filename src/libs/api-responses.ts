export const apiResponses = {
  _200: (body: Record<string, any>) => ({
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }),
  _201: (body: Record<string, any>) => ({
    statusCode: 201,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }),
  _400: (body: Record<string, any>) => ({
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }),
  _404: (body: Record<string, any>) => ({
    statusCode: 404,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }),
  _500: (body: Record<string, any>) => ({
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }),
  _401: (body: Record<string, any>) => ({
    statusCode: 401,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }),
  _403: (body: Record<string, any>) => ({
    statusCode: 403,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }),
};
