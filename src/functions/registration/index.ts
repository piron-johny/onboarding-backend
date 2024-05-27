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
};
