export default {
  handler: 'src/functions/login/handler.main',
  events: [
    {
      http: {
        method: 'POST',
        path: 'user/login',
        cors: true,
      },
    },
  ],
  timeout: 15,
};
