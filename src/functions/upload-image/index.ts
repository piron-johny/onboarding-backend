export default {
  handler: 'src/functions/upload-image/handler.main',
  events: [
    {
      http: {
        method: 'post',
        path: 'image/upload',
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
  environment: {
    bucket: '${self:custom.bucket}',
  },
};
