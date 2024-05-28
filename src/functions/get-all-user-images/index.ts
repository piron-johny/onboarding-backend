export default {
  handler: 'src/functions/get-all-user-images/handler.main',
  events: [
    {
      http: {
        method: 'get',
        path: 'image',
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
