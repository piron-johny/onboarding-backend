export default {
  handler: 'src/functions/remove-image/handler.main',
  events: [
    {
      http: {
        method: 'delete',
        path: 'image/remove',
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
  timeout: 15,
  environment: {
    bucket: '${self:custom.bucket}',
  },
};
