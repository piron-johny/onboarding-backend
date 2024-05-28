export default {
  handler: 'src/functions/hello/handler.main',
  events: [
    {
      http: {
        method: 'get',
        path: 'hello',
        cors: true,
        authorizer: {
          name: 'authorizer',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'request',
        },
      },
    },
  ],
};
