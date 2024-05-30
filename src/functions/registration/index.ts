export default {
  handler: 'src/functions/registration/handler.main',
  events: [
    {
      http: {
        method: 'post',
        path: 'user/create',
        cors: true,
      },
    },
  ],
  timeout: 15,
  environment: {
    jwtSecret: '${self:custom.jwtSecret}',
  },
};
