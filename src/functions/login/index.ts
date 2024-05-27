export default {
  handler: 'src/functions/login/handler.main',
  events: [
    {
      http: {
        method: 'post',
        path: 'user/login',
        cors: true,
      },
    },
  ],
};
