export default {
  handler: 'src/functions/authorizer/handler.main',
  environment: {
    jwtSecret: '${self:custom.jwtSecret}',
  },
};
