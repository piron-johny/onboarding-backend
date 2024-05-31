import * as z from 'zod';

export const removeImageBodySchema = z.object({
  imageId: z
    .string({
      message: 'The imageId must not be an empty string.',
    })
    .min(1, 'The imageId must contain at least 1 character'),
  url: z.string().url(),
});
