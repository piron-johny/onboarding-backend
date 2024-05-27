export default {
  handler: 'src/functions/upload-image/handler.main',
  events: [
    {
      http: {
        method: 'post',
        path: 'image/upload',
        cors: true,
      },
    },
  ],
  environment: {
    bucket: '${self:custom.bucket}',
  },
};
