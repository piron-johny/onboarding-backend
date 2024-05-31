import * as z from 'zod';

export const loginBodySchema = z.object({
  name: z
    .string({
      message: 'The name must not be an empty string.',
    })
    .min(1, 'Name must contain at least 1 character'),
  password: z
    .string({ message: 'The password must not be an empty string.' })
    .min(1, 'Password must contain at least 1 character'),
});
