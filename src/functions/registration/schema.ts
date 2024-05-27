export default {
  type: 'object',
  properties: {
    userName: { type: 'string' },
    userPassword: { type: 'string' },
  },
  required: ['userName', 'userPassword'],
} as const;
